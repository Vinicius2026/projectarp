'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createModule(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const area_id = parseInt(formData.get('area_id') as string)
  const plan_access = formData.get('plan_access') as string
  const thumbnail_url = formData.get('thumbnail_url') as string || null
  
  const { error } = await supabase
    .from('modules')
    .insert({ 
      title, 
      description, 
      area_id, 
      plan_access,
      thumbnail_url 
    })
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/home')
  return { success: true }
}

export async function updateModule(id: number, formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const area_id = parseInt(formData.get('area_id') as string)
  const plan_access = formData.get('plan_access') as string
  const thumbnail_url = formData.get('thumbnail_url') as string || null
  
  const { error } = await supabase
    .from('modules')
    .update({ 
      title, 
      description, 
      area_id, 
      plan_access,
      thumbnail_url 
    })
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/home')
  return { success: true }
}

export async function deleteModule(id: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('modules')
    .delete()
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/home')
  return { success: true }
}

export async function uploadModuleThumbnail(formData: FormData) {
  const supabase = await createClient()
  
  const file = formData.get('file') as File
  if (!file) {
    return { error: 'Nenhum arquivo selecionado' }
  }
  
  // Gerar nome único para o arquivo
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `${fileName}`
  
  // Upload para o Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('module-thumbnails')
    .upload(filePath, file)
  
  if (uploadError) {
    return { error: uploadError.message }
  }
  
  // Obter URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('module-thumbnails')
    .getPublicUrl(filePath)
  
  return { success: true, url: publicUrl }
}

