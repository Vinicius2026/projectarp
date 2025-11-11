'use client'

interface QuickAction {
  id: number
  image: string
  title: string
}

const quickActions: QuickAction[] = [
  { id: 1, image: '/whpz1.png', title: 'Grupo Vip' },
  { id: 2, image: '/chzp2.png', title: 'KGD IA' },
  { id: 3, image: '/tks3.png', title: 'Vídeos Bust' },
  { id: 4, image: '/cpt4.png', title: 'Edição Bust' },
  { id: 5, image: '/telg5.png', title: 'Automação' },
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
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl shadow-md flex items-center justify-center overflow-hidden border border-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={action.image}
                  alt={action.title}
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

