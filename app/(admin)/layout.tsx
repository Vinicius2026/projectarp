import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Image, 
  FileText, 
  Building2, 
  Tag, 
  Bell,
  Settings
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let fullName = ''
  let email = ''

  if (user) {
    email = user.email || ''
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    fullName = profile?.full_name || user.user_metadata?.full_name || email
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">ARD APP</h1>
              <p className="text-xs text-gray-500">Gerenciamento e Controle</p>
            </div>
          </div>

          <nav className="space-y-1">
            <h2 className="text-xs font-semibold text-gray-400 uppercase mb-2">Menu</h2>
            
            <Link 
              href="/admin/dashboard" 
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            <Link 
              href="/admin/usuarios" 
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Users className="w-5 h-5" />
              Usuários
            </Link>

            <Link 
              href="/admin/modulos" 
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <BookOpen className="w-5 h-5" />
              Módulos e Aulas
            </Link>

            <Link 
              href="/admin/banners" 
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Image className="w-5 h-5" />
              Banners
            </Link>

            <Link 
              href="/admin/saques" 
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <FileText className="w-5 h-5" />
              Saques
            </Link>

            <Link 
              href="/admin/arquivos" 
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <FileText className="w-5 h-5" />
              Arquivos
            </Link>

            <Link 
              href="/admin/empresas" 
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Building2 className="w-5 h-5" />
              Empresas
            </Link>

            <Link 
              href="/admin/ofertas" 
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Tag className="w-5 h-5" />
              Ofertas
            </Link>

            <Link 
              href="/admin/notificacoes" 
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
            >
              <Bell className="w-5 h-5" />
              Notificações
            </Link>

            <div className="pt-4 border-t border-gray-200 mt-4">
              <Link 
                href="/admin/configuracoes" 
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
              >
                <Settings className="w-5 h-5" />
                Configurações
              </Link>
            </div>
          </nav>
        </div>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center" role="img" aria-label="Avatar">
              <span className="text-white text-sm font-medium">
                {(fullName || email).slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{fullName || 'Usuário'}</p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
            <form action={logout}>
              <button
                type="submit"
                className="text-xs px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}

