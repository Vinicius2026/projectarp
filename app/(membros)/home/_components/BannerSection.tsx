const brandImages = [
  { number: 1, image: '/coffe1.png', alt: 'Dreams Coffee' },
  { number: 2, image: '/nulle1.png', alt: 'Nure' },
  { number: 3, image: '/bigboom1.png', alt: 'BigBoom' },
  { number: 4, image: '/blessy1.png', alt: 'Blessy' },
  { number: 5, image: '/maxfem1.png', alt: 'Maxfem' },
]

export default function BannerSection() {
  return (
    <div className="mb-8">
      {/* Texto acima do banner */}
      <div className="flex items-center justify-center gap-3 mb-4" style={{ fontFamily: 'Times New Roman, Times, serif' }}>
        <span className="text-lg sm:text-xl font-bold text-gray-900">Aulas</span>
        <span className="text-lg sm:text-xl font-bold text-gray-900">&gt;</span>
        <span className="text-lg sm:text-xl font-bold text-gray-900">Produto</span>
        <span className="text-lg sm:text-xl font-bold text-gray-900">&gt;</span>
        <span className="text-lg sm:text-xl font-bold text-gray-900">Aplique</span>
      </div>

      {/* Banner principal */}
      <div className="mb-3">
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
      <div className="mb-3">
        <h2 className="text-xl sm:text-2xl font-bold font-roboto-bold text-gray-900">
          Super Marcas Virais
        </h2>
      </div>

      {/* Caixas numeradas */}
      <div className="relative">
        <div 
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        >
          {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => {
            const brand = brandImages.find(b => b.number === number)
            
            return (
              <div
                key={number}
                className="flex-shrink-0 snap-start"
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
                  <div className="w-[170px] h-[170px] sm:w-[210px] sm:h-[210px] bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition">
                    <span className="text-gray-900 font-bold text-2xl sm:text-3xl font-roboto-bold">
                      {number}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

