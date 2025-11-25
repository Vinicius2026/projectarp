import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './_components/ProfileForm'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default async function PerfilPage() {
  const supabase = await createClient()

  // Buscar usuário atual
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Buscar perfil
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-white dark:bg-dark transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/home" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white transition-colors" />
          </Link>
          <h1 className="text-lg font-bold font-roboto-bold text-gray-900 dark:text-white transition-colors">Perfil</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="p-4">
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}

