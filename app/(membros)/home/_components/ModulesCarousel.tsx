'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'
import { Module } from '@/lib/types/database'

interface ModulesCarouselProps {
  modules: Module[]
}

export default function ModulesCarousel({ modules }: ModulesCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount = 300 // Quantidade de pixels para rolar
    const scrollTo = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    })
  }

  if (modules.length === 0) {
    return (
      <div className="w-full text-center py-8 text-gray-500">
        Nenhum módulo nesta área ainda
      </div>
    )
  }

  return (
    <div className="relative">
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
      >
        {modules.map((module, index: number) => (
          <Link
            key={module.id}
            href={`/modulo/${module.id}`}
            className="flex-shrink-0 w-36 md:w-40 lg:w-44 snap-start"
          >
            <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl aspect-[9/16] p-3 md:p-4 relative overflow-hidden">
              {module.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={module.thumbnail_url} 
                  alt={module.title}
                  className="w-full h-full object-cover absolute inset-0"
                  draggable={false}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
                  <h3 className="text-xl font-bold text-center mb-2">
                    {module.title}
                  </h3>
                  <p className="text-xs text-center opacity-90">
                    {module.description}
                  </p>
                </div>
              )}
              {/* Module number badge */}
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-white text-xs font-medium">
                  #{index + 1}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation Arrows */}
      {modules.length > 1 && (
        <>
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              scroll('left')
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4 text-gray-900" />
          </button>
          <button 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              scroll('right')
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-50 transition z-10"
            aria-label="Próximo"
          >
            <ChevronRight className="w-4 h-4 text-gray-900" />
          </button>
        </>
      )}
    </div>
  )
}

