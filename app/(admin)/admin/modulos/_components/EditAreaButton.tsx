'use client'

import { useState, useTransition } from 'react'
import { updateArea, deleteArea } from '@/app/actions/areas'

type Props = {
  area: {
    id: number
    title: string
    description: string | null
    order: number | null
  }
}

export default function EditAreaButton({ area }: Props) {
  const [open, setOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <>
      <button
        title="Editar"
        onClick={() => setOpen(true)}
        className="text-blue-600 hover:text-blue-900"
      >
        ✎
      </button>
      <button
        title="Excluir"
        onClick={() => setConfirmOpen(true)}
        className="ml-2 text-red-600 hover:text-red-900"
      >
        🗑
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Editar área</h3>
            </div>
            <form
              className="p-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setError(null)
                const form = e.currentTarget as HTMLFormElement
                const formData = new FormData(form)
                startTransition(async () => {
                  const res = await updateArea(area.id, formData)
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
                <input
                  name="title"
                  required
                  defaultValue={area.title}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Descrição</label>
                <input
                  name="description"
                  defaultValue={area.description || ''}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Ordenação</label>
                <input
                  name="order"
                  type="number"
                  defaultValue={area.order || 0}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancelar
                </button>
                <button
                  disabled={isPending}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white disabled:opacity-60"
                >
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
                Tem certeza que deseja excluir a área "{area.title}"? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setConfirmOpen(false)} className="px-4 py-2 rounded-md border">Cancelar</button>
                <button
                  onClick={() =>
                    startTransition(async () => {
                      await deleteArea(area.id)
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


