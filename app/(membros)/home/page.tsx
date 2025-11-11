import { createClient } from '@/lib/supabase/server'
import EnablePush from '../components/EnablePush'
import ModulesCarousel from './_components/ModulesCarousel'
import Image from 'next/image'

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

  // Dados mockados (podem ser substituídos por dados reais do banco depois)
  const totalRevenue = profile?.total_revenue ?? 1402294.39
  const totalUnitsSold = profile?.total_units_sold ?? 54908
  const userBio = profile?.bio ?? '❤️‍🔥 Jesus @pedrobertotto'
  const userRole = profile?.role === 'admin' ? 'Administrador' : 'Usuário'
  const userName = profile?.full_name || 'Usuário'
  const initial = (userName?.[0] || 'U').toUpperCase()

  return (
    <div className="min-h-screen bg-white">
      {/* Header estilo Instagram */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        {/* Nome do usuário no topo com símbolo verificado */}
        <div className="flex items-center justify-center gap-2 px-4 py-3">
          <h1 className="text-sm font-bold font-roboto-bold text-gray-900">{userName}</h1>
          {profile?.role === 'admin' && (
            <Image
              src="/simb-king-blue-01.png"
              alt="Verificado"
              width={15}
              height={15}
              className="w-[15px] h-[15px]"
            />
          )}
        </div>
      </header>

      {/* Perfil estilo Instagram */}
      <div className="px-4 py-6">
        <div className="flex items-start gap-4 mb-4">
          {/* Foto de perfil circular */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black rounded-full flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-2xl sm:text-3xl">{initial}</span>
          </div>

          {/* Estatísticas */}
          <div className="flex-1 flex items-center justify-around sm:justify-start sm:gap-8">
            <div className="text-center sm:text-left">
              <div className="text-base sm:text-lg font-bold font-roboto-bold text-gray-900">
                R${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Faturado</div>
            </div>
            <div className="text-center sm:text-left">
              <div className="text-base sm:text-lg font-bold font-roboto-bold text-gray-900">
                {totalUnitsSold.toLocaleString('pt-BR')}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Unidades Vendidas</div>
            </div>
          </div>
        </div>

        {/* Nome e função */}
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-bold font-roboto-bold text-gray-900">{userName}</h2>
            {profile?.role === 'admin' && (
              <Image
                src="/simb-king-blue-01.png"
                alt="Verificado"
                width={15}
                height={15}
                className="w-[15px] h-[15px]"
              />
            )}
          </div>
          <p className="text-xs text-gray-600">{userRole}</p>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <p className="text-sm text-gray-900 whitespace-pre-wrap">{userBio}</p>
        </div>

        {/* Botões */}
        <div className="flex gap-2 mb-6">
          <EnablePush />
          <button className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition">
            Chat Comunidade
          </button>
        </div>
      </div>

      {/* Áreas */}
      <div className="px-4 pb-6">
        {areas && areas.map((area) => {
          const areaModules = modules?.filter((m) => m.area_id === area.id) || []
          
          return (
            <div key={area.id} className="mb-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold font-roboto-bold text-gray-900">{area.title}</h2>
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

