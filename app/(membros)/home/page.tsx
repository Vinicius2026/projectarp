import { createClient } from '@/lib/supabase/server'
import EnablePush from '../components/EnablePush'
import ModulesCarousel from './_components/ModulesCarousel'
import BannerSection from './_components/BannerSection'
import QuickActions from './_components/QuickActions'
import AchievementIcons from './_components/AchievementIcons'
import AnimatedText from './_components/AnimatedText'
import SideMenu from '../components/SideMenu'
import ThemeToggle from '../components/ThemeToggle'
import Image from 'next/image'
import { logout } from '@/app/actions/auth'

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
  
  // Ordenar módulos por área e depois por order (fazer no código pois Supabase não suporta múltiplos order)
  const sortedModules = modules?.sort((a, b) => {
    if (a.area_id !== b.area_id) {
      return (a.area_id || 0) - (b.area_id || 0)
    }
    const orderA = a.order || 999
    const orderB = b.order || 999
    return orderA - orderB
  })

  // Dados mockados (valores fixos como solicitado)
  const totalRevenue = 1402294.39
  const totalUnitsSold = 54908
  const userBio = profile?.bio ?? '❤️‍🔥 Jesus @pedrobertotto'
  const userName = profile?.full_name || 'Usuário'
  const initial = (userName?.[0] || 'U').toUpperCase()

  // Função para abreviar números
  const abbreviateNumber = (num: number, isCurrency: boolean = false): string => {
    if (num >= 1000000) {
      const abbreviated = (num / 1000000).toFixed(1).replace('.', ',')
      return isCurrency ? `R$${abbreviated} mi` : `${abbreviated} mi`
    } else if (num >= 1000) {
      const abbreviated = (num / 1000).toFixed(1).replace('.', ',')
      return isCurrency ? `R$${abbreviated} mil` : `${abbreviated} mil`
    }
    return isCurrency ? `R$${num.toFixed(2).replace('.', ',')}` : num.toString()
  }

  // Determinar tipo de usuário para exibição
  const getUserType = () => {
    if (profile?.role === 'admin') return 'Administrador'
    if (profile?.role === 'gerente') return 'Gerente'
    if (profile?.plan_type === 'Premium') return 'Usuário Premium'
    if (profile?.plan_type === 'Gratuito') return 'Usuário Gratuito'
    return 'Usuário'
  }
  const userType = getUserType()

  return (
    <div className="min-h-screen bg-white dark:bg-dark transition-colors">
      {/* Header estilo Instagram */}
      <header className="bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Menu hambúrguer */}
          <SideMenu />
          
          {/* Nome do usuário no topo com símbolo verificado */}
          <div className="flex items-center gap-2 flex-1 justify-center">
            <h1 className="text-sm font-bold font-roboto-bold text-gray-900 dark:text-white transition-colors">{userName}</h1>
            {profile?.role === 'admin' && (
              <Image
                src="/simb-king-blue-01.png"
                alt="Verificado"
                width={15}
                height={15}
                className="w-[15px] h-[15px]"
                unoptimized
              />
            )}
          </div>
          {/* Botão de tema e logout */}
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <form action={logout}>
              <button
                type="submit"
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium px-2 py-1 transition-colors"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Perfil estilo Instagram */}
      <div className="px-4 py-6">
        {/* Foto de perfil e estatísticas lado a lado */}
        <div className="flex items-center gap-6 sm:gap-8 mb-4">
          {/* Foto de perfil circular à esquerda */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-black shrink-0">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={userName}
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-full"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-2xl sm:text-3xl">{initial}</span>
              </div>
            )}
          </div>

          {/* Estatísticas à direita da imagem */}
          <div className="flex items-center gap-6 sm:gap-8 flex-1">
            <div className="text-center">
              <div className="text-sm sm:text-base font-bold font-roboto-bold text-gray-900 dark:text-white transition-colors">
                {abbreviateNumber(totalRevenue, true)}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 transition-colors">Faturado</div>
            </div>
            <div className="text-center">
              <div className="text-sm sm:text-base font-bold font-roboto-bold text-gray-900 dark:text-white transition-colors">
                {abbreviateNumber(totalUnitsSold, false)}
              </div>
              <div className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5 transition-colors">Unidades Vendidas</div>
            </div>
          </div>
        </div>

        {/* Ícones de conquistas com seta */}
        <AchievementIcons />

        {/* Nome e tipo de usuário */}
        <div className="mb-2">
          <h2 className="text-sm font-bold font-roboto-bold text-gray-900 dark:text-white mb-1 transition-colors">{userName}</h2>
          <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors">{userType}</p>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap transition-colors">{userBio}</p>
        </div>

        {/* Botões */}
        <div className="flex gap-2 mb-4">
          <EnablePush />
          <button className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Chat Comunidade
          </button>
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>

      {/* Banner Section */}
      <div className="px-4 pb-4 pt-2">
        <BannerSection />
      </div>

      {/* Texto Animado */}
      <AnimatedText />

      {/* Áreas */}
      <div className="px-4 pb-6">
        {areas && areas.map((area) => {
          // Filtrar módulos da área (já estão ordenados)
          const areaModules = sortedModules?.filter((m) => m.area_id === area.id) || []
          
          return (
            <div key={area.id} className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold font-roboto-bold text-gray-900 dark:text-white transition-colors">{area.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{area.description}</p>
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

