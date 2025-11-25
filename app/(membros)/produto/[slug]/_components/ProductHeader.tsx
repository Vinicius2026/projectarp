'use client'

import Link from 'next/link'
import { ChevronLeft, MoreVertical } from 'lucide-react'
import { useTheme } from '../../../contexts/ThemeContext'

export default function ProductHeader() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  return (
    <header 
      className="border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10 transition-colors"
      style={{
        backgroundColor: isDark ? '#0b1014' : '#ffffff'
      }}
    >
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <Link 
          href="/home" 
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white transition-colors" />
        </Link>
        <h1 className="text-base font-bold font-roboto-bold text-gray-900 dark:text-white transition-colors">
          Detalhes
        </h1>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <MoreVertical className="w-6 h-6 text-gray-900 dark:text-white transition-colors" />
        </button>
      </div>
    </header>
  )
}

