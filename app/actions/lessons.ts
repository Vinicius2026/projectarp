'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function extractYoutubeId(url: string | null): string | null {
  if (!url) return null
  const ytShort = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/)
  const ytWatch = url.match(/[?&]v=([A-Za-z0-9_-]{6,})/)
  const ytEmbed = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/)
  const ytShorts = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{6,})/)
  return ytShort?.[1] || ytWatch?.[1] || ytEmbed?.[1] || ytShorts?.[1] || null
}

function parseISODurationToSeconds(iso: string): number {
  // Examples: PT13M, PT1H2M10S
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  const h = parseInt(match?.[1] || '0', 10)
  const m = parseInt(match?.[2] || '0', 10)
  const s = parseInt(match?.[3] || '0', 10)
  return h * 3600 + m * 60 + s
}

export async function createLesson(formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description_content = formData.get('description_content') as string
  let video_url = formData.get('video_url') as string
  const module_id = parseInt(formData.get('module_id') as string)
  const order = parseInt(formData.get('order') as string) || 0

  // normalizar para URL embed do YouTube
  if (video_url) {
    const id = extractYoutubeId(video_url)
    if (id) video_url = `https://www.youtube.com/embed/${id}`
  }

  // Buscar duração na API (se chave existir)
  let duration_seconds: number | null = null
  try {
    const id = extractYoutubeId(video_url)
    const apiKey = process.env.YOUTUBE_API_KEY
    if (apiKey && id) {
      const resp = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${id}&key=${apiKey}`, { cache: 'no-store' })
      const json = await resp.json()
      const iso = json?.items?.[0]?.contentDetails?.duration as string | undefined
      if (iso) duration_seconds = parseISODurationToSeconds(iso)
    }
  } catch {
    // silencioso: duração permanece null
  }
  
  const { data, error } = await supabase
    .from('lessons')
    .insert({ 
      title, 
      description_content, 
      video_url,
      module_id,
      order,
      duration_seconds
    })
    .select()
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/home')
  revalidatePath('/modulo')
  revalidatePath('/aula')
  
  return { success: true, lesson: data }
}

export async function updateLesson(id: number, formData: FormData) {
  const supabase = await createClient()
  
  const title = formData.get('title') as string
  const description_content = formData.get('description_content') as string
  let video_url = formData.get('video_url') as string
  const order = parseInt(formData.get('order') as string) || 0

  // normalizar e tentar obter duração novamente se API disponível
  if (video_url) {
    const idVideo = extractYoutubeId(video_url)
    if (idVideo) video_url = `https://www.youtube.com/embed/${idVideo}`
  }
  let duration_seconds: number | undefined = undefined
  try {
    const idVideo = extractYoutubeId(video_url)
    const apiKey = process.env.YOUTUBE_API_KEY
    if (apiKey && idVideo) {
      const resp = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${idVideo}&key=${apiKey}`, { cache: 'no-store' })
      const json = await resp.json()
      const iso = json?.items?.[0]?.contentDetails?.duration as string | undefined
      if (iso) duration_seconds = parseISODurationToSeconds(iso)
    }
  } catch {}
  
  const { error } = await supabase
    .from('lessons')
    .update({ 
      title, 
      description_content, 
      video_url,
      ...(duration_seconds !== undefined ? { duration_seconds } : {}),
      order
    })
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/home')
  revalidatePath('/modulo')
  revalidatePath('/aula')
  
  return { success: true }
}

export async function deleteLesson(id: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('lessons')
    .delete()
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/home')
  revalidatePath('/modulo')
  revalidatePath('/aula')
  
  return { success: true }
}

// ===== LESSON LINKS =====

export async function createLessonLink(lessonId: number, text: string, url: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('lesson_links')
    .insert({ 
      lesson_id: lessonId,
      text,
      url
    })
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/aula')
  
  return { success: true }
}

export async function deleteLessonLink(id: number) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('lesson_links')
    .delete()
    .eq('id', id)
  
  if (error) {
    return { error: error.message }
  }
  
  revalidatePath('/admin/modulos')
  revalidatePath('/aula')
  
  return { success: true }
}

