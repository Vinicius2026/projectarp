'use client'

export default function AnimatedText() {
  const text = "3 fases liberadas. Complete módulos, alcance as metas de faturamento e desbloqueie novas aulas!"
  
  // Duplicar o texto para animação contínua sem cortes
  const scrollingText = `${text} • ${text} • ${text} • `
  
  return (
    <div className="overflow-hidden py-3 my-6 mx-4 rounded-lg" style={{ backgroundColor: '#ff4500' }}>
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <div className="animate-scroll-left">
          <span className="text-white font-bold text-sm sm:text-base px-8 inline-block">
            {scrollingText}
            {scrollingText}
          </span>
        </div>
      </div>
    </div>
  )
}

