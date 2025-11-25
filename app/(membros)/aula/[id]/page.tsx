import { createClient } from '@/lib/supabase/server'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function AulaPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = await createClient()

  // Buscar aula
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*, modules(*)')
    .eq('id', params.id)
    .single()

  // Buscar links da aula
  const { data: lessonLinks } = await supabase
    .from('lesson_links')
    .select('*')
    .eq('lesson_id', params.id)
    .order('id', { ascending: true })

  // Buscar todas as aulas do módulo para navegação
  const { data: allLessons } = await supabase
    .from('lessons')
    .select('id, title')
    .eq('module_id', lesson?.module_id)
    .order('id', { ascending: true })

  if (!lesson) {
    return (
      <div className="p-4 bg-white dark:bg-dark min-h-screen transition-colors">
        <h1 className="text-xl font-bold font-roboto-bold text-gray-900 dark:text-white transition-colors">Aula não encontrada</h1>
      </div>
    )
  }

  const currentIndex = allLessons?.findIndex((l) => l.id === lesson.id) || 0
  const prevLesson = allLessons?.[currentIndex - 1]
  const nextLesson = allLessons?.[currentIndex + 1]

  return (
    <div className="min-h-screen bg-white dark:bg-dark transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-3">
          <Link 
            href={`/modulo/${lesson.module_id}`} 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white transition-colors" />
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">Você está acessando</p>
            <h1 className="text-base font-bold font-roboto-bold text-gray-900 dark:text-white truncate transition-colors">
              {lesson.modules?.title}
            </h1>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="p-4">
        {/* Título da Aula */}
        <h2 className="text-xl font-bold font-roboto-bold text-gray-900 dark:text-white mb-4 transition-colors">
          {lesson.title}
        </h2>

        {/* Player de Vídeo */}
        {lesson.video_url && (
          <div className="aspect-video w-full bg-gray-900 rounded-xl overflow-hidden mb-6">
            <iframe
              src={lesson.video_url.replace('watch?v=', 'embed/')}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        )}

        {/* Bloco de Descrição e Links */}
        <div className="bg-gray-900 text-white rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold font-roboto-bold mb-3">
            Hora de faturar com sua marca viral!
          </h3>
          
          {lesson.description_content && (
            <p className="text-sm text-gray-300 mb-4 whitespace-pre-wrap">
              {lesson.description_content}
            </p>
          )}

          {/* Links de Afiliação */}
          {lessonLinks && lessonLinks.length > 0 && (
            <div className="space-y-3 mt-6">
              {lessonLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:text-blue-300 underline text-sm transition"
                >
                  {link.text}
                </a>
              ))}
            </div>
          )}

          <button className="text-blue-400 text-sm hover:underline mt-4">
            Mostrar menos...
          </button>
        </div>

        {/* Lista de próximas aulas */}
        {allLessons && allLessons.length > 1 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold font-roboto-bold text-gray-900 dark:text-white mb-4 transition-colors">
              Hora de faturar com sua marca viral!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 transition-colors">
              {allLessons.length} vídeos
            </p>

            <div className="space-y-3">
              {allLessons.map((otherLesson, index) => (
                <Link
                  key={otherLesson.id}
                  href={`/aula/${otherLesson.id}`}
                  className={`flex items-start gap-3 p-4 rounded-xl transition-colors ${
                    otherLesson.id === lesson.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md'
                  }`}
                >
                  {/* Thumbnail pequeno */}
                  <div className="flex-shrink-0 w-24 h-16 bg-gray-900 rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    {/* Duration */}
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                      1min
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-semibold mb-1 line-clamp-2 transition-colors ${
                      otherLesson.id === lesson.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {otherLesson.title}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400 transition-colors">
                        Aula {index + 1}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 transition-colors">
                        13min
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Navegação entre aulas */}
        <div className="flex gap-3 mt-6 pb-20">
          {prevLesson ? (
            <Link
              href={`/aula/${prevLesson.id}`}
              className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-center font-medium"
            >
              <ChevronLeft className="w-5 h-5 inline mr-1" />
              Aula Anterior
            </Link>
          ) : (
            <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-lg text-center font-medium opacity-50 cursor-not-allowed transition-colors">
              <ChevronLeft className="w-5 h-5 inline mr-1" />
              Aula Anterior
            </div>
          )}

          {nextLesson ? (
            <Link
              href={`/aula/${nextLesson.id}`}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
            >
              Próxima Aula
              <ChevronRight className="w-5 h-5 inline ml-1" />
            </Link>
          ) : (
            <div className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-lg text-center font-medium opacity-50 cursor-not-allowed transition-colors">
              Próxima Aula
              <ChevronRight className="w-5 h-5 inline ml-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

