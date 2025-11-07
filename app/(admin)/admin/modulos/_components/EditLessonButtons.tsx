'use client'

import { useState, useTransition } from 'react'
import { updateLesson, deleteLesson } from '@/app/actions/lessons'

type Lesson = {
  id: number
  title: string
  description_content: string | null
  video_url: string | null
  order?: number | null
}

export default function EditLessonButtons({ lesson }: { lesson: Lesson }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
      >
        Editar
      </button>
      <button
        onClick={() => setConfirmOpen(true)}
        className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
      >
        Excluir
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Editar aula</h3>
            </div>
            <form
              className="p-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setError(null)
                const form = e.currentTarget as HTMLFormElement
                const formData = new FormData(form)
                startTransition(async () => {
                  const res = await updateLesson(lesson.id, formData)
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
                <input name="title" defaultValue={lesson.title} className="w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Descrição</label>
                <textarea
                  name="description_content"
                  rows={4}
                  defaultValue={lesson.description_content || ''}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">URL do vídeo (YouTube)</label>
                  <input name="video_url" defaultValue={lesson.video_url || ''} className="w-full border rounded-md px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Ordem</label>
                  <input name="order" type="number" defaultValue={lesson.order || 0} className="w-full border rounded-md px-3 py-2" />
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

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg mx-4 rounded-lg bg-white shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Confirmar exclusão</h3>
            </div>
            <div className="p-4 space-y-3">
              <p className="text-sm text-gray-700 leading-relaxed break-words whitespace-pre-wrap max-w-full">
                Tem certeza que deseja excluir a aula "{lesson.title}"?
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 rounded-md border">Cancelar</button>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      await deleteLesson(lesson.id)
                      setConfirmOpen(false)
                    })
                  }
                  className="px-4 py-2 rounded-md bg-red-600 text-white"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


