'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronRight, X } from 'lucide-react'

const prizes = [
  { image: '/5k.png', alt: '5K' },
  { image: '/10k.png', alt: '10K' },
  { image: '/33k.png', alt: '33K' },
  { image: '/250k.png', alt: '250K' },
  { image: '/500k.png', alt: '500K' },
  { image: '/1m.png', alt: '1M' },
]

export default function AchievementIcons() {
  const [isPrizesOpen, setIsPrizesOpen] = useState(false)

  return (
    <>
      {/* Ícones de conquistas */}
      <div className="flex items-center gap-2 mb-2">
        <Image
          src="/5k.png"
          alt="5K"
          width={30}
          height={30}
          className="w-[30px] h-[30px]"
          unoptimized
        />
        <Image
          src="/10k.png"
          alt="10K"
          width={30}
          height={30}
          className="w-[30px] h-[30px]"
          unoptimized
        />
        <Image
          src="/33k.png"
          alt="33K"
          width={30}
          height={30}
          className="w-[30px] h-[30px]"
          unoptimized
        />
        <Image
          src="/250k.png"
          alt="250K"
          width={30}
          height={30}
          className="w-[30px] h-[30px]"
          unoptimized
        />
        <Image
          src="/500k.png"
          alt="500K"
          width={30}
          height={30}
          className="w-[30px] h-[30px]"
          unoptimized
        />
        <Image
          src="/1m.png"
          alt="1M"
          width={30}
          height={30}
          className="w-[30px] h-[30px]"
          unoptimized
        />
        {/* Seta após a imagem 1m.png */}
        <button
          onClick={() => setIsPrizesOpen(true)}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Ver prêmios"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Modal de Prêmios */}
      {isPrizesOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsPrizesOpen(false)}
        >
          <div 
            className="w-full max-w-md rounded-lg bg-white shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-4 border-b relative">
              <h3 className="text-lg font-bold font-roboto-bold text-gray-900 text-center">
                Premios Recebidos
              </h3>
              <button
                onClick={() => setIsPrizesOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal - Grid de Prêmios */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 justify-items-center">
                {prizes.map((prize, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <Image
                      src={prize.image}
                      alt={prize.alt}
                      width={50}
                      height={50}
                      className="w-[50px] h-[50px]"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

