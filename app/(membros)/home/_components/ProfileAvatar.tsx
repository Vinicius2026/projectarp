'use client'

import { useState } from 'react'

interface ProfileAvatarProps {
  avatarUrl: string | null
  userName: string
  initial: string
}

export default function ProfileAvatar({ avatarUrl, userName, initial }: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false)

  // Se não tem URL ou houve erro, mostrar fallback
  if (!avatarUrl || imageError) {
    return (
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black rounded-full flex items-center justify-center shrink-0">
        <span className="text-white font-bold text-2xl sm:text-3xl">{initial}</span>
      </div>
    )
  }

  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-black shrink-0 relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl}
        alt={userName}
        width={96}
        height={96}
        className="w-full h-full object-cover"
        style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
        onError={(e) => {
          console.error('Erro ao carregar imagem de perfil:', avatarUrl)
          setImageError(true)
          // Esconder a imagem e mostrar fallback
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
        }}
      />
      {/* Fallback que aparece se a imagem falhar */}
      {imageError && (
        <div className="absolute inset-0 bg-black rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-2xl sm:text-3xl">{initial}</span>
        </div>
      )}
    </div>
  )
}

