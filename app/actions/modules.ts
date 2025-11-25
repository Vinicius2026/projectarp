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
  
  // Buscar o próximo número de ordem para esta área
  const { data: maxOrderData } = await supabase
    .from('modules')
    .select('order')
    .eq('area_id', area_id)
    .order('order', { ascending: false })
    .limit(1)
    .single()
  
  const nextOrder = maxOrderData?.order ? maxOrderData.order + 1 : 1
  
  const { error } = await supabase
    .from('modules')
    .insert({ 
      title, 
      description, 
      area_id, 
      plan_access,
      thumbnail_url,
      order: nextOrder
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
  const orderStr = formData.get('order') as string
  const newOrder = orderStr ? parseInt(orderStr) : null
  
  // Buscar módulo atual
  const { data: currentModule } = await supabase
    .from('modules')
    .select('area_id, order')
    .eq('id', id)
    .single()
  
  if (!currentModule) {
    return { error: 'Módulo não encontrado' }
  }
  
  const oldAreaId = currentModule.area_id
  const oldOrder = currentModule.order || 0
  
  // Atualizar os dados básicos do módulo primeiro
  const updateData: any = { 
    title, 
    description, 
    area_id, 
    plan_access,
    thumbnail_url 
  }
  
  const { error: updateError } = await supabase
    .from('modules')
    .update(updateData)
    .eq('id', id)
  
  if (updateError) {
    return { error: updateError.message }
  }
  
  // Se a ordem foi fornecida e é válida, atualizar usando a função de reordenação
  if (newOrder !== null && newOrder >= 1 && newOrder <= 10) {
    // Se a área mudou, primeiro ajustar a ordem na nova área
    if (oldAreaId !== area_id) {
      // Usar a função de reordenação na nova área
      const orderResult = await updateModuleOrder(id, newOrder, area_id)
      if (orderResult.error) {
        return orderResult
      }
    } else if (oldOrder !== newOrder) {
      // Mesma área, mas ordem mudou
      const orderResult = await updateModuleOrder(id, newOrder, area_id)
      if (orderResult.error) {
        return orderResult
      }
    }
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

export async function updateModuleOrder(moduleId: number, newOrder: number, areaId: number) {
  const supabase = await createClient()
  
  // Validar que a ordem está entre 1 e 10
  if (newOrder < 1 || newOrder > 10) {
    return { error: 'A ordem deve estar entre 1 e 10' }
  }
  
  // Buscar módulo atual
  const { data: currentModule } = await supabase
    .from('modules')
    .select('order, area_id')
    .eq('id', moduleId)
    .single()
  
  if (!currentModule) {
    return { error: 'Módulo não encontrado' }
  }
  
  // Verificar se o módulo pertence à área correta
  if (currentModule.area_id !== areaId) {
    return { error: 'O módulo não pertence a esta área' }
  }
  
  const oldOrder = currentModule.order || 0
  
  // Se a ordem não mudou, não fazer nada
  if (oldOrder === newOrder) {
    return { success: true }
  }
  
  // Buscar todos os módulos da mesma área
  const { data: areaModules } = await supabase
    .from('modules')
    .select('id, order')
    .eq('area_id', areaId)
    .order('order', { ascending: true })
  
  if (!areaModules) {
    return { error: 'Erro ao buscar módulos da área' }
  }
  
  // Criar novo array de ordens
  const updatedModules = areaModules
    .filter(m => m.id !== moduleId)
    .map(m => ({ id: m.id, order: m.order || 0 }))
  
  // Inserir o módulo na nova posição
  updatedModules.splice(newOrder - 1, 0, { id: moduleId, order: newOrder })
  
  // Reordenar todos os módulos
  updatedModules.forEach((module, index) => {
    module.order = index + 1
  })
  
  // Atualizar todos os módulos
  for (const module of updatedModules) {
    const { error } = await supabase
      .from('modules')
      .update({ order: module.order })
      .eq('id', module.id)
    
    if (error) {
      return { error: `Erro ao atualizar módulo ${module.id}: ${error.message}` }
    }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/home')
  return { success: true }
}
