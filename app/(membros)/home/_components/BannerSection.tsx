'use client'

export default function BannerSection() {
  return (
    <div className="mb-8">
      {/* Banner principal */}
      <div className="mb-4">
        <div className="w-full h-32 sm:h-36 md:h-40 rounded-2xl overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Banner Kingdom.png"
            alt="Banner Kingdom"
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
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        >
          {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => (
            <div
              key={number}
              className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center snap-start shadow-sm hover:shadow-md transition"
            >
              <span className="text-gray-900 font-bold text-2xl sm:text-3xl font-roboto-bold">
                {number}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

