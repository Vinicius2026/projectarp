import { Home, Send, ChevronLeft, DollarSign } from 'lucide-react'
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
            {/* Ícone de compartilhamento */}
            <button className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
              <Send className="w-6 h-6" />
            </button>
            
            {/* Ícone de vendas */}
            <button 
              className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-900 transition-colors"
              disabled
            >
              <DollarSign className="w-6 h-6" />
            </button>
            
            {/* Ícone de home */}
            <Link 
              href="/home" 
              className="flex flex-col items-center justify-center gap-1 text-gray-900 transition-colors"
            >
              <Home className="w-6 h-6" />
            </Link>
            
            {/* Ícone de voltar */}
            <button className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

