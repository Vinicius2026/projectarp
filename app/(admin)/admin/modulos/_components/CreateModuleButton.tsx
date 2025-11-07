'use client'

import { useState, useTransition } from 'react'
import { createModule, uploadModuleThumbnail, updateModule, deleteModule } from '@/app/actions/modules'

type Area = { id: number; title: string }

type Props = {
  areas: Area[]
}

export default function CreateModuleButton({ areas }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [plans, setPlans] = useState<{ gratuito: boolean; premium: boolean }>({
    gratuito: true,
    premium: true,
  })

  async function handleUpload(file: File | null) {
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    const res = await uploadModuleThumbnail(form)
    if ((res as any)?.url) {
      setThumbnailUrl((res as any).url)
    } else if ((res as any)?.error) {
      setError((res as any).error)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
      >
        + Criar Módulo
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Criar novo módulo</h3>
            </div>
            <form
              className="p-4 space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                setError(null)
                const form = e.currentTarget as HTMLFormElement
                const formData = new FormData(form)
                const selectedPlans = [
                  plans.gratuito ? 'Gratuito' : null,
                  plans.premium ? 'Premium' : null,
                ].filter(Boolean).join(',')
                formData.set('plan_access', selectedPlans || 'Gratuito')
                if (thumbnailUrl) {
                  formData.set('thumbnail_url', thumbnailUrl)
                }
                startTransition(async () => {
                  const res = await createModule(formData)
                  if ((res as any)?.error) {
                    setError((res as any).error)
                    return
                  }
                  setOpen(false)
                })
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Área</label>
                  <select name="area_id" required className="w-full border rounded-md px-3 py-2">
                    <option value="">Selecione uma área</option>
                    {areas.map((a) => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Planos</label>
                  <div className="flex items-center gap-4 border rounded-md px-3 py-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={plans.gratuito}
                        onChange={(e) => setPlans((p) => ({ ...p, gratuito: e.target.checked }))}
                      />
                      Gratuito
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={plans.premium}
                        onChange={(e) => setPlans((p) => ({ ...p, premium: e.target.checked }))}
                      />
                      Premium
                    </label>
                  </div>
                  <input type="hidden" name="plan_access" value="" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Título</label>
                <input name="title" required className="w-full border rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Descrição</label>
                <input name="description" className="w-full border rounded-md px-3 py-2" />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">Banner (PNG ou JPEG)</label>
                <div className="border border-dashed rounded-md p-4 text-center">
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => handleUpload(e.target.files?.[0] || null)}
                  />
                  {thumbnailUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbnailUrl} alt="Banner" className="mt-3 inline-block max-h-32 rounded" />
                  )}
                </div>
                <input type="hidden" name="thumbnail_url" value={thumbnailUrl ?? ''} />
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
                  {isPending ? 'Salvando...' : 'Criar Módulo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}


