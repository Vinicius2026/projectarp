'use client'

import { useRef } from 'react'

export default function BannerSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return

    const container = scrollContainerRef.current
    const scrollAmount = 200
    const scrollTo = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    })
  }

  return (
    <div className="mb-8">
      {/* Banner principal */}
      <div className="mb-4">
        <div className="w-full h-48 sm:h-56 md:h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden">
          {/* Mock LOGO K */}
          <div className="text-white text-6xl sm:text-7xl md:text-8xl font-bold font-roboto-bold">
            LOGO K
          </div>
        </div>
      </div>

      {/* Caixas numeradas */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        >
          {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => (
            <div
              key={number}
              className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center snap-start shadow-sm hover:shadow-md transition"
            >
              <span className="text-gray-900 font-bold text-xl sm:text-2xl font-roboto-bold">
                {number}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

