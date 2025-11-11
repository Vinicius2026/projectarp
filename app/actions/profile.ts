'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Usuário não autenticado' }
  }

  const fullName = formData.get('full_name') as string
  const bio = formData.get('bio') as string | null

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      bio: bio || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/home')
  revalidatePath('/perfil')
  return { success: true }
}

export async function uploadProfileImage(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Usuário não autenticado' }
  }

  const file = formData.get('file') as File
  if (!file) {
    return { error: 'Nenhum arquivo selecionado' }
  }

  // Validar tipo de arquivo
  if (!file.type.startsWith('image/')) {
    return { error: 'Apenas imagens são permitidas' }
  }

  // Validar tamanho (máximo 25MB)
  if (file.size > 25 * 1024 * 1024) {
    return { error: 'A imagem deve ter no máximo 25MB' }
  }

  // Gerar nome único para o arquivo
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}-${Date.now()}.${fileExt}`
  const filePath = fileName

  // Deletar imagem antiga se existir
  const { data: currentProfile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single()

  if (currentProfile?.avatar_url) {
    // Extrair o nome do arquivo da URL
    const urlParts = currentProfile.avatar_url.split('/')
    const oldFileName = urlParts[urlParts.length - 1]
    if (oldFileName && oldFileName.startsWith(user.id)) {
      await supabase.storage
        .from('profile-avatars')
        .remove([oldFileName])
    }
  }

  // Upload para o Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('profile-avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    })

  if (uploadError) {
    return { error: uploadError.message }
  }

  // Obter URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('profile-avatars')
    .getPublicUrl(filePath)

  console.log('URL pública gerada:', publicUrl)
  console.log('Caminho do arquivo:', filePath)

  // Atualizar perfil com a URL da imagem
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      avatar_url: publicUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)

  if (updateError) {
    console.error('Erro ao atualizar perfil:', updateError)
    return { error: updateError.message }
  }

  // Verificar se foi salvo corretamente
  const { data: updatedProfile } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single()

  console.log('Perfil atualizado:', updatedProfile)

  revalidatePath('/home')
  revalidatePath('/perfil')
  return { success: true, url: publicUrl }
}

