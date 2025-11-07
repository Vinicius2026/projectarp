'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function urlBase64ToUint8Array(b64: string) {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4)
  const base64 = (b64 + pad).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  const out = new Uint8Array(raw.length)
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i)
  return out
}

export default function EnablePush() {
  const [loading, setLoading] = useState(false)
  const [ok, setOk] = useState(false)
  const supabase = createClient()

  const enable = async () => {
    try {
      setLoading(true)
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        alert('Seu navegador não suporta notificações push.')
        return
      }

      const registration = await navigator.serviceWorker.register('/sw.js')

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        alert('Permissão negada para notificações.')
        return
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      const appKey = urlBase64ToUint8Array(vapidPublicKey)
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appKey
      })

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        alert('Faça login para ativar notificações.')
        return
      }

      const { error } = await supabase
        .from('push_subscriptions')
        .insert({
          user_id: user.id,
          endpoint: subscription.endpoint,
          subscription_details: subscription
        })

      if (error && !String(error.message).includes('duplicate')) {
        throw error
      }

      setOk(true)
    } catch (e) {
      console.error(e)
      alert('Erro ao ativar notificações.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={enable}
      disabled={loading}
      className="px-2.5 py-1.5 md:px-3 md:py-2 rounded-md bg-blue-600 text-white text-xs md:text-sm disabled:opacity-60 whitespace-nowrap"
    >
      {ok ? 'Notificações Ativadas' : (loading ? 'Ativando...' : 'Ativar Notificações')}
    </button>
  )
}


