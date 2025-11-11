interface QuickAction {
  id: number
  image: string
  title: string
}

const quickActions: QuickAction[] = [
  { id: 1, image: '/whatsapp.png', title: 'Grupo Vip' },
  { id: 2, image: '/chatgpt.png', title: 'KGD IA' },
  { id: 3, image: '/tiktok.png', title: 'Vídeos Bust' },
  { id: 4, image: '/capcut.png', title: 'Edição Bust' },
  { id: 5, image: '/telegram.png', title: 'Automação' },
]

export default function QuickActions() {
  return (
    <div className="mb-6">
      <div 
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
      >
        {quickActions.map((action) => (
          <div
            key={action.id}
            className="flex-shrink-0 snap-start"
          >
            <div className="flex flex-col items-center gap-2">
              {/* Quadrado com imagem - estilo iPhone */}
              <div className="w-[59px] h-[59px] sm:w-[67px] sm:h-[67px] bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={action.image}
                  alt={action.title}
                  width={59}
                  height={59}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain p-1.5"
                />
              </div>
              {/* Título abaixo */}
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium text-center max-w-[70px]">
                {action.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

