import Link from 'next/link'
import { Home } from 'lucide-react'

export default function ProdutoNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold font-roboto-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold font-roboto-bold text-gray-900 mb-2">
          Produto não encontrado
        </h2>
        <p className="text-gray-600 mb-6">
          O produto que você está procurando não existe ou foi removido.
        </p>
        <Link
          href="/home"
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
        >
          <Home className="w-5 h-5" />
          Voltar para Home
        </Link>
      </div>
    </div>
  )
}

