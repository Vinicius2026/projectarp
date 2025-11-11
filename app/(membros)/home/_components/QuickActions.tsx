interface QuickAction {
  id: number
  image: string
  title: string
}

const quickActions: QuickAction[] = [
  { id: 1, image: '/1.png', title: 'Grupo Vip' },
  { id: 2, image: '/5.png', title: 'KGD IA' },
  { id: 3, image: '/2.png', title: 'Vídeos Bust' },
  { id: 4, image: '/4.png', title: 'Edição Bust' },
  { id: 5, image: '/3.png', title: 'Automação' },
]

export default function QuickActions() {
  return (
    <div className="mb-6 flex justify-center">
      <div 
        className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide justify-center px-4"
      >
        {quickActions.map((action) => (
          <div
            key={action.id}
            className="flex-shrink-0 snap-center"
          >
            <div className="flex flex-col items-center gap-2">
              {/* Círculo com imagem */}
              <div className="w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] rounded-full overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={action.image}
                  alt={action.title}
                  width={60}
                  height={60}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover scale-110"
                />
              </div>
              {/* Título abaixo */}
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium text-center max-w-[60px]">
                {action.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

