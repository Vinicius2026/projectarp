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
      <div className="flex items-center gap-3 sm:gap-4 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        <Image
          src="/5k.png"
          alt="5K"
          width={60}
          height={60}
          className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] flex-shrink-0"
          unoptimized
        />
        <Image
          src="/10k.png"
          alt="10K"
          width={60}
          height={60}
          className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] flex-shrink-0"
          unoptimized
        />
        <Image
          src="/33k.png"
          alt="33K"
          width={60}
          height={60}
          className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] flex-shrink-0"
          unoptimized
        />
        <Image
          src="/250k.png"
          alt="250K"
          width={60}
          height={60}
          className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] flex-shrink-0"
          unoptimized
        />
        <Image
          src="/500k.png"
          alt="500K"
          width={60}
          height={60}
          className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] flex-shrink-0"
          unoptimized
        />
        <Image
          src="/1m.png"
          alt="1M"
          width={60}
          height={60}
          className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] flex-shrink-0"
          unoptimized
        />
        {/* Seta após a imagem 1m.png */}
        <button
          onClick={() => setIsPrizesOpen(true)}
          className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          aria-label="Ver prêmios"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* Modal de Prêmios */}
      {isPrizesOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setIsPrizesOpen(false)}
        >
          <div 
            className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 shadow-lg overflow-hidden transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 relative transition-colors">
              <h3 className="text-lg font-bold font-roboto-bold text-gray-900 dark:text-white text-center transition-colors">
                Premios Recebidos
              </h3>
              <button
                onClick={() => setIsPrizesOpen(false)}
                className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal - Grid de Prêmios */}
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 justify-items-center mb-6">
                {prizes.map((prize, index) => (
                  <div key={index} className="flex items-center justify-center">
                    <Image
                      src={prize.image}
                      alt={prize.alt}
                      width={80}
                      height={80}
                      className="w-[80px] h-[80px]"
                      unoptimized
                    />
                  </div>
                ))}
              </div>
              
              {/* Botão Todos Premios */}
              <div className="flex justify-center">
                <button
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  disabled
                >
                  Todos Premios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

