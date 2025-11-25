import Link from 'next/link'

const brandImages = [
  { number: 1, image: '/coffe1.png', alt: 'Dreams Coffee', slug: 'dreams-coffee' },
  { number: 2, image: '/nulle1.png', alt: 'Nure', slug: 'nure' },
  { number: 3, image: '/bigboom1.png', alt: 'BigBoom', slug: 'bigboom' },
  { number: 4, image: '/blessy1.png', alt: 'Blessy', slug: 'blessy' },
  { number: 5, image: '/maxfem1.png', alt: 'Maxfem', slug: 'maxfem' },
]

export default function BannerSection() {
  return (
    <div className="mb-8">
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
        <h2 className="text-xl sm:text-2xl font-bold font-roboto-bold text-gray-900 dark:text-white transition-colors">
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
                  <Link href={`/produto/${brand.slug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={brand.image}
                      alt={brand.alt}
                      width={170}
                      height={170}
                      loading="lazy"
                      decoding="async"
                      className="w-[170px] h-[170px] sm:w-[210px] sm:h-[210px] rounded-xl object-cover border-2 border-gray-200 shadow-sm hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
                    />
                  </Link>
                ) : (
                  <div className="w-[170px] h-[170px] sm:w-[210px] sm:h-[210px] bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-colors">
                    <span className="text-gray-900 dark:text-white font-bold text-2xl sm:text-3xl font-roboto-bold transition-colors">
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

