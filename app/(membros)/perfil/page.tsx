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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/home" className="p-2 hover:bg-gray-100 rounded-lg">
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </Link>
          <h1 className="text-lg font-bold font-roboto-bold text-gray-900">Perfil</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="p-4">
        <ProfileForm profile={profile} />
      </div>
    </div>
  )
}

