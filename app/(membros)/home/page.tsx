import { createClient } from '@/lib/supabase/server'
import { Bell, Moon, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import EnablePush from '../components/EnablePush'

export default async function HomePage() {
  const supabase = await createClient()

  // Buscar usuário atual
  const { data: { user } } = await supabase.auth.getUser()

  // Buscar perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  // Buscar áreas
  const { data: areas } = await supabase
    .from('areas')
    .select('*')
    .order('order', { ascending: true })

  // Buscar módulos
  const { data: modules } = await supabase
    .from('modules')
    .select('*')
    .order('id', { ascending: true })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        {/* Brand centralizado com efeito de piscar suave */}
        <div className="mb-1 flex justify-center">
          <span className="text-xs sm:text-sm font-semibold tracking-wide text-gray-900 animate-soft-blink">ARD APP</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap mb-3">
          {/* Perfil */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm sm:text-base">A</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                Olá, {profile?.full_name || 'Usuário'}
              </h1>
              <p className="text-[11px] sm:text-xs text-blue-600">{profile?.plan_type || 'Plano Premium'}</p>
            </div>
          </div>

          {/* Espaço para empurrar ações para a direita */}
          <div className="flex-1" />

          {/* Botão Ativar Notificações (antes dos ícones) */}
          <EnablePush />

          {/* Ícones */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg text-gray-600">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg text-gray-600">
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-2 sm:p-2.5 hover:bg-gray-100 rounded-lg text-gray-600">
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Banner */}
      <div className="p-4">
        <div className="bg-gradient-to-br from-pink-300 via-pink-200 to-pink-100 rounded-2xl p-8 mb-6 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="bg-pink-400 rounded-2xl p-6 shadow-lg">
                <div className="text-white text-2xl font-bold">FlashSal</div>
                <div className="text-white text-sm">+MindSet</div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Sua Rotina</h2>
                <h2 className="text-2xl font-bold text-gray-900">Lucrativa</h2>
              </div>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200 rounded-full opacity-50 -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-pink-300 rounded-full opacity-30 -mb-12"></div>
        </div>

        {/* Áreas */}
        {areas && areas.map((area) => {
          const areaModules = modules?.filter((m) => m.area_id === area.id) || []
          
          return (
            <div key={area.id} className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">{area.title}</h2>
                <p className="text-sm text-gray-600">{area.description}</p>
              </div>

              {/* Modules Carousel */}
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                  {areaModules.length > 0 ? (
                    areaModules.map((module, index: number) => (
                      <Link
                        key={module.id}
                        href={`/modulo/${module.id}`}
                        className="flex-shrink-0 w-48 md:w-56 lg:w-64 snap-start"
                      >
                        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl aspect-[9/16] p-4 md:p-6 relative overflow-hidden">
                          {module.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img 
                              src={module.thumbnail_url} 
                              alt={module.title}
                              className="w-full h-full object-cover absolute inset-0"
                              draggable={false}
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                              <h3 className="text-2xl font-bold text-center mb-2">
                                {module.title}
                              </h3>
                              <p className="text-sm text-center opacity-90">
                                {module.description}
                              </p>
                            </div>
                          )}
                          {/* Module number badge */}
                          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                            <span className="text-white text-sm font-medium">
                              #{index + 1}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="w-full text-center py-8 text-gray-500">
                      Nenhum módulo nesta área ainda
                    </div>
                  )}
                </div>

                {/* Navigation Arrows */}
                {areaModules.length > 1 && (
                  <>
                    <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
                      <ChevronLeft className="w-6 h-6 text-gray-900" />
                    </button>
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
                      <ChevronRight className="w-6 h-6 text-gray-900" />
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

