'use client'

import { useState, useTransition } from 'react'
import { createNotification } from '@/app/actions/notifications'

export default function CreateNotificationButton() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'now' | 'schedule' | 'save'>('now')

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Criar Notificação
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg mx-4 rounded-lg bg-white shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Criar Nova Notificação</h3>
            </div>
            <form
              className="p-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setError(null)
                const form = e.currentTarget as HTMLFormElement
                const fd = new FormData(form)
                startTransition(async () => {
                  const res = await createNotification(fd)
                  if ((res as any)?.error) { setError((res as any).error); return }
                  setOpen(false)
                })
              }}
            >
              <div>
                <label className="block text-sm text-gray-700 mb-1">Título</label>
                <input name="title" required className="w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Mensagem</label>
                <textarea name="message" rows={4} required className="w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">URL (opcional)</label>
                <input name="url" placeholder="https://..." className="w-full border rounded-md px-3 py-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Tipo</label>
                  <select name="target_type" className="w-full border rounded-md px-3 py-2">
                    <option value="all">Todos</option>
                    <option value="user">Usuário</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Usuário (UUID, se "Usuário")</label>
                  <input name="target_user_id" className="w-full border rounded-md px-3 py-2" />
                </div>
              </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Modo</label>
                  <select
                    name="mode"
                    className="w-full border rounded-md px-3 py-2"
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
                  >
                    <option value="now">Enviar agora</option>
                    <option value="schedule">Agendar</option>
                    <option value="save">Salvar rascunho</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Data</label>
                  <input
                    type="date"
                    name="schedule_date"
                    className="w-full border rounded-md px-3 py-2"
                    disabled={mode !== 'schedule'}
                    required={mode === 'schedule'}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Hora</label>
                  <input
                    type="time"
                    name="schedule_time"
                    className="w-full border rounded-md px-3 py-2"
                    disabled={mode !== 'schedule'}
                    required={mode === 'schedule'}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md border">Cancelar</button>
                <button disabled={isPending} className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60">
                  {isPending ? 'Salvando...' : 'Salvar Notificação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}


