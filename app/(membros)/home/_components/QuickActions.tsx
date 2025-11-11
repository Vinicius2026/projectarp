'use client'

import { useRef } from 'react'
import Image from 'next/image'

interface QuickAction {
  id: number
  image: string
  title: string
}

const quickActions: QuickAction[] = [
  { id: 1, image: '/whpz1.png', title: 'Grupo Vip' },
  { id: 2, image: '/chzp2.png', title: 'KGD IA' },
  { id: 3, image: '/tks3.png', title: 'Vídeos Bust' },
  { id: 4, image: '/cpt4.png', title: 'Edição Bust' },
  { id: 5, image: '/telg5.png', title: 'Automação' },
]

export default function QuickActions() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="mb-6">
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
      >
        {quickActions.map((action) => (
          <div
            key={action.id}
            className="flex-shrink-0 snap-start"
          >
            <div className="flex flex-col items-center gap-2">
              {/* Quadrado com imagem - estilo iPhone */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl shadow-md flex items-center justify-center overflow-hidden border border-gray-100">
                <Image
                  src={action.image}
                  alt={action.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain p-2"
                />
              </div>
              {/* Título abaixo */}
              <span className="text-xs sm:text-sm text-gray-700 font-medium text-center max-w-[80px]">
                {action.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

