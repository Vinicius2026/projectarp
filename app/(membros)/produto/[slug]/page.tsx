import Link from 'next/link'
import { ChevronLeft, Send, DollarSign, Home, ChevronRight, MoreVertical } from 'lucide-react'
import { notFound } from 'next/navigation'
import ProductGradient from './_components/ProductGradient'

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
    <div className="min-h-screen relative overflow-hidden bg-white dark:bg-dark transition-colors">
      {/* Gradient Background */}
      <ProductGradient color={produto.corPrimaria} />

      {/* Header */}
      <header className="bg-white/80 dark:bg-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10 transition-colors">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link 
            href="/home" 
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900 dark:text-white transition-colors" />
          </Link>
          <h1 className="text-base font-bold font-roboto-bold text-gray-900 dark:text-white transition-colors">
            Detalhes
          </h1>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <MoreVertical className="w-6 h-6 text-gray-900 dark:text-white transition-colors" />
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="max-w-2xl mx-auto px-4 py-6 pb-40">
        {/* Imagem do Produto Estilizada (Pop-out Effect) */}
        <div className="flex justify-center mb-10 mt-4">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center">
            {/* 1. Glow/Brilho de fundo intenso */}
            <div 
              className="absolute inset-0 rounded-full opacity-40 blur-3xl transform scale-110 transition-all duration-700 animate-pulse"
              style={{ backgroundColor: produto.corPrimaria }}
            />
            
            {/* 2. Disco de vidro/fundo sutil atrás da imagem */}
            <div className="absolute inset-6 rounded-full bg-white/30 backdrop-blur-sm border border-white/60 shadow-xl" />

            {/* 3. Imagem com Zoom, Recorte e Sombra Projetada */}
            <img
              src={produto.imagemPrincipal}
              alt={produto.nome}
              className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)] transform scale-125 transition-transform duration-500 hover:scale-135"
              style={{ 
                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.2))' 
              }}
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

      {/* Footer com Botão e Menu de Navegação */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-dark shadow-lg transition-colors">
        {/* Botão Me Afiliar */}
        <div className="px-4 pt-4 pb-2">
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

        {/* Menu de Navegação Inferior */}
        <nav className="border-t border-gray-200 dark:border-gray-700 transition-colors">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-around">
              {/* Ícone Enviar/Compartilhar */}
              <button className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Send className="w-6 h-6" />
              </button>

              {/* Ícone Dinheiro/Preço */}
              <button className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <DollarSign className="w-6 h-6" />
              </button>

              {/* Ícone Home - Ativo */}
              <Link 
                href="/home"
                className="flex flex-col items-center gap-1 transition-colors"
                style={{ color: produto.corPrimaria }}
              >
                <Home className="w-6 h-6" />
              </Link>

              {/* Ícone Próximo */}
              <button className="flex flex-col items-center gap-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

