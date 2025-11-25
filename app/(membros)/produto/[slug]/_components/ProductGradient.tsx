'use client'

import { useTheme } from '../../contexts/ThemeContext'

interface ProductGradientProps {
  color: string
}

export default function ProductGradient({ color }: ProductGradientProps) {
  const { theme } = useTheme()
  
  const backgroundColor = theme === 'dark' ? '#0b1014' : '#FFFFFF'
  
  return (
    <div 
      className="fixed inset-0 -z-10"
      style={{
        background: `linear-gradient(to bottom, ${color}20 0%, ${backgroundColor} 100%)`
      }}
    />
  )
}

