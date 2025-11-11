import { createClient } from '@/lib/supabase/server'
import { Bell, Moon, Share2 } from 'lucide-react'
import EnablePush from '../components/EnablePush'
import UserMenu from '../components/UserMenu'
import ModulesCarousel from './_components/ModulesCarousel'

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
          {/* Perfil com menu */}
          <UserMenu name={profile?.full_name || 'Usuário'} planType={profile?.plan_type || 'Plano Premium'} />

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
              <ModulesCarousel modules={areaModules} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

