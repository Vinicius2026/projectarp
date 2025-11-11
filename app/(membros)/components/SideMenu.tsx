'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SideMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener('click', onClickOutside)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.removeEventListener('click', onClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [open])

  const menuItems = [
    { label: 'Perfil', href: '/perfil' },
    { label: 'Minhas afiliações', href: '#' },
    { label: 'Prêmios', href: '#' },
    { label: 'Chat expert', href: '#' },
    { label: 'Suporte Tec', href: '#' },
  ]

  return (
    <>
      {/* Botão hambúrguer */}
      <button
        onClick={() => setOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg transition"
        aria-label="Abrir menu"
      >
        <Menu className="w-6 h-6 text-gray-900" />
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setOpen(false)} />
      )}

      {/* Menu lateral */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header do menu */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold font-roboto-bold text-gray-900">Menu</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Fechar menu"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>
        </div>

        {/* Itens do menu */}
        <nav className="p-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const isMocked = item.href === '#'
            
            if (isMocked) {
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    alert(`${item.label} - Em breve!`)
                    setOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition text-gray-700"
                >
                  {item.label}
                </button>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}

