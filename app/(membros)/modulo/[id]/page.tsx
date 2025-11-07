import { createClient } from '@/lib/supabase/server'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function ModuloPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createClient()

  // Buscar módulo
  const { data: module } = await supabase
    .from('modules')
    .select('*')
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
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900">Módulo não encontrado</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header com voltar */}
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/home" className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </Link>
          <div>
            <p className="text-xs text-gray-500">Você está acessando</p>
            <h1 className="text-lg font-bold text-gray-900">{module.title}</h1>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Video Principal (primeira aula ou video de introdução) */}
        {lessons && lessons.length > 0 && lessons[0].video_url && (
          <div className="mb-6">
            <div className="aspect-video w-full bg-gray-900 rounded-xl overflow-hidden mb-4">
              <iframe
                src={lessons[0].video_url.replace('watch?v=', 'embed/')}
                title={lessons[0].title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}

        {/* Descrição do módulo */}
        <div className="bg-gray-900 text-white rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-2">Hora de faturar com sua marca viral!</h2>
          <p className="text-sm text-gray-300 mb-4">
            {module.description}
          </p>
          <button className="text-blue-400 text-sm hover:underline">
            Mostrar menos...
          </button>
        </div>

        {/* Lista de aulas */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Hora de faturar com sua marca viral!
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            {lessons?.length || 0} vídeos
          </p>

          <div className="space-y-4">
            {lessons && lessons.length > 0 ? (
              lessons.map((lesson, index) => (
                <Link
                  key={lesson.id}
                  href={`/aula/${lesson.id}`}
                  className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition"
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-32 h-20 bg-gray-900 rounded-lg relative overflow-hidden">
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
                      <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                        Sem vídeo
                      </div>
                    )}
                    {/* Duration badge */}
                    {typeof (lesson as any).duration_seconds === 'number' && (lesson as any).duration_seconds > 0 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {Math.round(((lesson as any).duration_seconds as number) / 60)}min
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                      {lesson.description_content || 'Sem descrição'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Aula {index + 1}</span>
                      {typeof (lesson as any).duration_seconds === 'number' && (lesson as any).duration_seconds > 0 && (
                        <span className="text-xs text-blue-600">
                          {Math.round(((lesson as any).duration_seconds as number) / 60)}min
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                Nenhuma aula disponível ainda
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

