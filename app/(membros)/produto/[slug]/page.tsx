import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

// Dados mockados dos produtos
const produtos = {
  'dreams-coffee': {
    nome: 'Dreams Coffee',
    marca: 'Dreams Coffee',
    preco: 139.90,
    desconto: 40,
    imagemPrincipal: '/coffe1.png',
    corPrimaria: '#8B4513', // Marrom café
    corSecundaria: '#D2691E',
    icones: [
      { emoji: '☕', texto: 'Premium' },
      { emoji: '🔥', texto: 'Energético' },
      { emoji: '😋', texto: 'Saboroso' },
    ],
    descricao: 'Café premium de alta qualidade para começar o dia com energia',
  },
  'nure': {
    nome: 'Nure Original',
    marca: 'Nure',
    preco: 139.90,
    desconto: 40,
    imagemPrincipal: '/nulle1.png',
    corPrimaria: '#00CED1', // Cyan/Turquesa
    corSecundaria: '#5F9EA0',
    icones: [
      { emoji: '💧', texto: 'Hidratante' },
      { emoji: '🌿', texto: 'Natural' },
      { emoji: '✨', texto: 'Revitalizante' },
    ],
    descricao: 'Fórmula exclusiva para hidratação e bem-estar',
  },
  'bigboom': {
    nome: 'BigBoom Rosa',
    marca: 'BigBoom',
    preco: 139.90,
    desconto: 40,
    imagemPrincipal: '/bigboom1.png',
    corPrimaria: '#FF1493', // Rosa pink
    corSecundaria: '#FF69B4',
    icones: [
      { emoji: '💪', texto: 'Força' },
      { emoji: '🔥', texto: 'Explosivo' },
      { emoji: '⚡', texto: 'Energia' },
    ],
    descricao: 'Energia explosiva para treinos intensos',
  },
  'blessy': {
    nome: 'Blessy Vida Leve',
    marca: 'Blessy',
    preco: 139.90,
    desconto: 40,
    imagemPrincipal: '/blessy1.png',
    corPrimaria: '#FFD700', // Dourado/Amarelo
    corSecundaria: '#FFA500',
    icones: [
      { emoji: '🍋', texto: 'Cítrico' },
      { emoji: '🌱', texto: 'Natural' },
      { emoji: '☀️', texto: 'Vitalidade' },
    ],
    descricao: 'Vida leve e saudável com ingredientes naturais',
  },
  'maxfem': {
    nome: 'MaxFem',
    marca: 'MaxFem',
    preco: 139.90,
    desconto: 40,
    imagemPrincipal: '/maxfem1.png',
    corPrimaria: '#FF1493', // Rosa/Pink
    corSecundaria: '#FF69B4',
    icones: [
      { emoji: '👩', texto: 'Feminino' },
      { emoji: '💖', texto: 'Bem-estar' },
      { emoji: '✨', texto: 'Qualidade' },
    ],
    descricao: 'Desenvolvido especialmente para o público feminino',
  },
}

export default function ProdutoPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const produto = produtos[params.slug as keyof typeof produtos]

  if (!produto) {
    notFound()
  }

  const precoComDesconto = produto.preco * (1 - produto.desconto / 100)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `linear-gradient(to bottom, ${produto.corPrimaria}20 0%, #FFFFFF 100%)`
        }}
      />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link 
            href="/home" 
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </Link>
          <h1 className="text-base font-bold font-roboto-bold text-gray-900">
            Detalhes
          </h1>
          <div className="w-10" /> {/* Spacer para centralizar */}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-32">
        {/* Imagem do Produto */}
        <div className="flex justify-center mb-6">
          <div className="w-64 h-64 sm:w-80 sm:h-80 relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={produto.imagemPrincipal}
              alt={produto.nome}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Ícones de características */}
        <div className="flex justify-center gap-8 mb-6">
          {produto.icones.map((icone, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-3xl mb-1">{icone.emoji}</div>
              <span className="text-xs text-gray-600">{icone.texto}</span>
            </div>
          ))}
        </div>

        {/* Nome e Preço */}
        <div className="text-center mb-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-roboto-bold text-gray-900 mb-1">
            {produto.nome}
          </h2>
          <p className="text-sm text-gray-600 mb-4">{produto.marca}</p>
          
          <div className="flex items-center justify-center gap-3 mb-2">
            <span 
              className="text-3xl font-bold font-roboto-bold"
              style={{ color: produto.corPrimaria }}
            >
              R${precoComDesconto.toFixed(2).replace('.', ',')}
            </span>
            <span 
              className="px-2 py-1 rounded text-sm font-bold text-white"
              style={{ backgroundColor: produto.corPrimaria }}
            >
              {produto.desconto}% OFF
            </span>
          </div>
        </div>

        {/* Descrição */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-600">{produto.descricao}</p>
        </div>
      </div>

      {/* Botão Fixo no Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto">
          <button
            className="w-full py-4 rounded-xl text-white font-bold font-roboto-bold text-lg transition-all hover:opacity-90 active:scale-95"
            style={{ 
              backgroundColor: produto.corPrimaria,
            }}
          >
            Me afiliar
          </button>
        </div>
      </div>
    </div>
  )
}

