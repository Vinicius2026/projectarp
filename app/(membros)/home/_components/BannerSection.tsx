'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronRight, X } from 'lucide-react'

const brandImages = [
  { number: 1, image: '/coffe1.png', alt: 'Dreams Coffee' },
  { number: 2, image: '/nulle1.png', alt: 'Nure' },
  { number: 3, image: '/bigboom1.png', alt: 'BigBoom' },
  { number: 4, image: '/blessy1.png', alt: 'Blessy' },
  { number: 5, image: '/maxfem1.png', alt: 'Maxfem' },
]

const prizes = [
  { image: '/5k.png', alt: '5K' },
  { image: '/10k.png', alt: '10K' },
  { image: '/33k.png', alt: '33K' },
  { image: '/250k.png', alt: '250K' },
  { image: '/500k.png', alt: '500K' },
  { image: '/1m.png', alt: '1M' },
]

export default function BannerSection() {
  const [isPrizesOpen, setIsPrizesOpen] = useState(false)

  return (
    <div className="mb-8">
      {/* Banner principal */}
      <div className="mb-4">
        <div className="w-full h-32 sm:h-36 md:h-40 rounded-2xl overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Banner%20Kingdom.png"
            alt="Banner Kingdom"
            width={800}
            height={200}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Título */}
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl font-bold font-roboto-bold text-gray-900">
          Super Marcas Virais
        </h2>
      </div>

      {/* Caixas numeradas */}
      <div className="relative">
        <div 
          className="flex items-center gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        >
          {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => {
            const brand = brandImages.find(b => b.number === number)
            const showArrow = number === 6 // Seta após a imagem 6
            
            return (
              <div
                key={number}
                className="flex items-center gap-2 flex-shrink-0 snap-start"
              >
                {brand ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.image}
                      alt={brand.alt}
                      width={170}
                      height={170}
                      loading="lazy"
                      decoding="async"
                      className="w-[170px] h-[170px] sm:w-[210px] sm:h-[210px] rounded-xl object-cover border-2 border-gray-200 shadow-sm hover:shadow-md transition"
                    />
                  </>
                ) : (
                  <>
                    <div className="w-[170px] h-[170px] sm:w-[210px] sm:h-[210px] bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition">
                      <span className="text-gray-900 font-bold text-2xl sm:text-3xl font-roboto-bold">
                        {number}
                      </span>
                    </div>
                    {/* Seta após a imagem 6 */}
                    {showArrow && (
                      <button
                        onClick={() => setIsPrizesOpen(true)}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors"
                        aria-label="Ver prêmios"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
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
    </div>
  )
}

