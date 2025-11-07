'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createArea(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const order = parseInt(formData.get('order') as string) || 0
  
  const { error } = await supabase
    .from('areas')
    .insert({ title, description, order })
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/home')
  return { success: true }
}

export async function updateArea(id: number, formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const order = parseInt(formData.get('order') as string) || 0
  
  const { error } = await supabase
    .from('areas')
    .update({ title, description, order })
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/home')
  return { success: true }
}

export async function deleteArea(id: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('areas')
    .delete()
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/home')
  return { success: true }
}

