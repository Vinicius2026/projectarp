import { createClient } from '@/lib/supabase/server'
import { Users, Calendar, TrendingUp } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  try {
    const supabase = await createClient()

    // Verificar se usuário está autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      redirect('/login')
    }

    // Verificar se é admin (com timeout)
    let profile = null
    try {
      const profileResult = await Promise.race([
        supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 5000)
        )
      ]) as any

      profile = profileResult?.data
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Se der erro, permitir acesso temporariamente para debug
    }

    if (profile && profile.role !== 'admin') {
      redirect('/home')
    }

    // Buscar estatísticas (com tratamento de erro)
    let totalUsers = 0
    try {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      totalUsers = count || 0
    } catch (error) {
      console.error('Error fetching users count:', error)
    }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
        <p className="text-gray-600 mt-1">Dados gerais sobre usuários, levels e registros</p>
      </div>

      {/* Data atualizada */}
      <div className="flex justify-end mb-6">
        <p className="text-sm text-gray-500">
          Atualizado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Usuários</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalUsers || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total de usuários cadastrados</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Hoje</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Novos usuários cadastrados hoje</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Semana</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Novos usuários cadastrados na semana</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Mês</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">0</p>
          <p className="text-sm text-gray-500 mt-1">Novos usuários cadastrados no mês</p>
        </div>
      </div>

      {/* Gráfico - Usuários por dia */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Usuários por dia</h2>
        <p className="text-sm text-gray-600 mb-6">Os dados de registros do período</p>
        
        <div className="h-64 flex items-end justify-between gap-2">
          {/* Placeholder para gráfico - você pode usar uma lib como recharts */}
          <div className="flex-1 bg-gray-100 rounded-t h-32"></div>
          <div className="flex-1 bg-gray-100 rounded-t h-48"></div>
          <div className="flex-1 bg-gray-100 rounded-t h-40"></div>
          <div className="flex-1 bg-gray-100 rounded-t h-24"></div>
          <div className="flex-1 bg-gray-100 rounded-t h-32"></div>
          <div className="flex-1 bg-gray-100 rounded-t h-56"></div>
          <div className="flex-1 bg-gray-100 rounded-t h-44"></div>
        </div>
      </div>

      {/* Saques */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Saques</h2>
        <p className="text-sm text-gray-600 mb-6">
          Métricas dos saques por período juntamente com gráficos indicativos
        </p>

        <div className="flex justify-end mb-4">
          <p className="text-sm text-gray-500">
            Atualizado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Processadas</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Total de saques processados</p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pendentes</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Total de saques pendentes</p>
          </div>

          <div className="border rounded-lg p-6 text-center">
            <div className="text-4xl mb-2">🏆</div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total</h3>
            <p className="text-3xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500 mt-1">Total de saques solicitados</p>
          </div>
        </div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('Dashboard error:', error)
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Erro ao carregar dashboard</h1>
        <p className="text-gray-600 mt-2">Verifique o console para mais detalhes.</p>
      </div>
    )
  }
}

