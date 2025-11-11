'use client'

import { useState } from 'react'

interface AvatarDisplayProps {
  avatarUrl: string
  userName: string
  initial: string
}

export default function AvatarDisplay({ avatarUrl, userName, initial }: AvatarDisplayProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !avatarUrl) {
    return (
      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black rounded-full flex items-center justify-center shrink-0">
        <span className="text-white font-bold text-2xl sm:text-3xl">{initial}</span>
      </div>
    )
  }

  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-black shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl}
        alt={userName}
        width={96}
        height={96}
        className="w-full h-full object-cover"
        onError={() => {
          console.error('Erro ao carregar avatar:', avatarUrl)
          setHasError(true)
        }}
      />
    </div>
  )
}

