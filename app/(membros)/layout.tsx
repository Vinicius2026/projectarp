'use client'

import { Home, Send, ChevronLeft, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { ThemeProvider } from './contexts/ThemeContext'

export default function MembrosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <div className="bg-gray-100 dark:bg-dark flex justify-center min-h-screen transition-colors" data-members-area>
        {/* Container com largura de celular */}
        <div className="w-full max-w-md bg-white dark:bg-dark shadow-lg min-h-screen relative flex flex-col transition-colors">
          {/* Conteúdo principal */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>

          {/* Barra de navegação inferior - Fixed */}
          <div className="sticky bottom-0 left-0 right-0 bg-white dark:bg-dark border-t border-gray-200 dark:border-gray-700 shadow-lg transition-colors">
            <div className="flex justify-around items-center h-16">
              {/* Ícone de compartilhamento */}
              <button className="flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Send className="w-6 h-6" />
              </button>
              
              {/* Ícone de vendas */}
              <button 
                className="flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                disabled
              >
                <DollarSign className="w-6 h-6" />
              </button>
              
              {/* Ícone de home */}
              <Link 
                href="/home" 
                className="flex flex-col items-center justify-center gap-1 text-gray-900 dark:text-white transition-colors"
              >
                <Home className="w-6 h-6" />
              </Link>
              
              {/* Ícone de voltar */}
              <button className="flex flex-col items-center justify-center gap-1 text-gray-400 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}

