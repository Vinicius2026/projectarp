'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createNotification(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const message = formData.get('message') as string
  const url = (formData.get('url') as string) || null
  const target_type = (formData.get('target_type') as string) || 'all'
  const target_user_id = (formData.get('target_user_id') as string) || null
  const mode = (formData.get('mode') as string) || 'now' // now | schedule | save
  const schedule_date = formData.get('schedule_date') as string | null
  const schedule_time = formData.get('schedule_time') as string | null

  let scheduled_for: string | null = null
  if (mode === 'schedule' && schedule_date && schedule_time) {
    scheduled_for = new Date(`${schedule_date}T${schedule_time}:00`).toISOString()
  }

  const status = mode === 'schedule' ? 'scheduled' : 'draft'

  const { data, error } = await supabase
    .from('notifications')
    .insert({ title, message, url, target_type, target_user_id, status, scheduled_for })
    .select()
    .single()

  if (error) return { error: error.message }

  // envio imediato
  if (mode === 'now' && data?.id) {
    await supabase.functions.invoke('send-notification', {
      body: { notification_id: data.id },
    })
  }

  revalidatePath('/admin/notificacoes')
  return { success: true }
}


