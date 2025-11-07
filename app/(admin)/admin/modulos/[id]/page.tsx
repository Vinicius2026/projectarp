import { createClient } from '@/lib/supabase/server'
import CreateLessonButton from '../_components/CreateLessonButton'
import EditLessonButtons from '../_components/EditLessonButtons'

import Link from 'next/link'

export default async function ModuloDetalhesPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createClient()

  // Buscar módulo
  const { data: module } = await supabase
    .from('modules')
    .select('*, areas(title)')
    .eq('id', params.id)
    .single()

  // Buscar aulas do módulo
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', params.id)
    .order('id', { ascending: true })

  if (!module) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900">Módulo não encontrado</h1>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/admin/modulos" className="hover:text-gray-900">
          Modulos
        </Link>
        <span>›</span>
        <span>{module.id}</span>
        <span>›</span>
        <span>Classes</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {module.title}
        </h1>
        <p className="text-gray-600">{module.description}</p>
      </div>

      {/* Create Lesson Button */}
      <div className="mb-6">
        <CreateLessonButton moduleId={Number(module.id)} />
      </div>

      {/* Lessons */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Aulas do Módulo</h2>
          <p className="text-sm text-gray-600 mt-1">
            {lessons?.length || 0} aulas encontradas
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lessons && lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <div key={lesson.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                  {/* Video Thumbnail */}
                  <div className="aspect-video bg-gray-900 relative">
                    {lesson.video_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={(function () {
                          const m = (lesson.video_url as string).match(/embed\/([A-Za-z0-9_-]{6,})/)
                          const id = m?.[1]
                          return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
                        })()}
                        alt={lesson.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xl">
                        Sem vídeo
                      </div>
                    )}
                    {(lesson as any).duration_seconds ? (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {Math.round(((lesson as any).duration_seconds as number) / 60)}min
                      </div>
                    ) : null}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {lesson.description_content || 'Sem descrição'}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <EditLessonButtons lesson={lesson} />
                    </div>

                    {/* Lesson number */}
                    <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                      <span>Aula {index + 1}</span>
                      <div className="flex gap-1">
                        <button className="w-6 h-6 flex items-center justify-center">←</button>
                        <span>{index + 1} de {lessons.length}</span>
                        <button className="w-6 h-6 flex items-center justify-center">→</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center text-gray-500">
                Nenhuma aula encontrada. Crie a primeira aula para este módulo!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

