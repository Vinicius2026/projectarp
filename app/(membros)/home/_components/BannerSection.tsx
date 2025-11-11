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
          className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        >
          {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => {
            const brand = brandImages.find(b => b.number === number)
            
            return (
              <div
                key={number}
                className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 bg-white border-2 border-gray-200 rounded-xl flex items-center justify-center snap-start shadow-sm hover:shadow-md transition overflow-hidden relative"
              >
                {brand ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.image}
                      alt={brand.alt}
                      width={128}
                      height={128}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain p-2"
                    />
                    {/* Número no canto superior esquerdo */}
                    <span className="absolute top-1 left-1 text-gray-900 font-bold text-sm sm:text-base font-roboto-bold bg-white/80 rounded-full w-6 h-6 flex items-center justify-center">
                      {number}
                    </span>
                  </>
                ) : (
                  <span className="text-gray-900 font-bold text-2xl sm:text-3xl font-roboto-bold">
                    {number}
                  </span>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

