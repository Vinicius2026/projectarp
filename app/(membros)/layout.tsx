import { Home, Share2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export default function MembrosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-gray-100 flex justify-center min-h-screen">
      {/* Container com largura de celular */}
      <div className="w-full max-w-md bg-white shadow-lg min-h-screen relative flex flex-col">
        {/* Conteúdo principal */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>

        {/* Barra de navegação inferior - Fixed */}
        <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around items-center h-16">
            <button className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
            
            <Link 
              href="/home" 
              className="flex flex-col items-center justify-center gap-1 text-gray-900 transition-colors"
            >
              <Home className="w-6 h-6" />
            </Link>
            
            <button className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

