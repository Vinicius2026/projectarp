'use client'

import { useState, useTransition } from 'react'
import { createLesson, updateLesson, deleteLesson } from '@/app/actions/lessons'

export default function CreateLessonButton({ moduleId }: { moduleId: number }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        + Criar Aula
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Criar nova aula</h3>
            </div>
            <form
              className="p-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setError(null)
                const form = e.currentTarget as HTMLFormElement
                const formData = new FormData(form)
                formData.set('module_id', String(moduleId))
                startTransition(async () => {
                  const res = await createLesson(formData)
                  if ((res as any)?.error) {
                    setError((res as any).error)
                    return
                  }
                  setOpen(false)
                })
              }}
            >
              <div>
                <label className="block text-sm text-gray-700 mb-1">Título</label>
                <input name="title" required className="w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Descrição</label>
                <textarea name="description_content" rows={4} className="w-full border rounded-md px-3 py-2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">URL do vídeo (YouTube)</label>
                  <input name="video_url" placeholder="https://..." className="w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Ordem</label>
                  <input name="order" type="number" defaultValue={0} className="w-full border rounded-md px-3 py-2" />
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-md border">
                  Cancelar
                </button>
                <button disabled={isPending} className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60">
                  {isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}


