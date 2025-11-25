'use client'

import { Lightbulb, LightbulbOff } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      title={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
      aria-label="Alternar tema"
    >
      {theme === 'light' ? (
        <Lightbulb className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      ) : (
        <LightbulbOff className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  )
}

