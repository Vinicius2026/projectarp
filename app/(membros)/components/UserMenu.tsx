'use client'

import { useEffect, useRef, useState } from 'react'
import { logout } from '@/app/actions/auth'

type Props = {
  name: string
  planType?: string | null
}

export default function UserMenu({ name, planType }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initial = (name?.[0] || 'U').toUpperCase()

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClickOutside)
    return () => document.removeEventListener('click', onClickOutside)
  }, [])

  return (
    <div
      ref={ref}
      className="relative flex items-center gap-3 min-w-0 select-none"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="flex items-center gap-3 min-w-0 cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-black rounded-full flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm sm:text-base">{initial}</span>
        </div>
        <div className="min-w-0 text-left">
          <h1 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
            Olá, {name || 'Usuário'}
          </h1>
          {!!planType && (
            <p className="text-[11px] sm:text-xs text-blue-600 truncate">{planType}</p>
          )}
        </div>
      </button>

      {open && (
        <div
          className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-52 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-b">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            {planType && <p className="text-xs text-gray-500 truncate">{planType}</p>}
          </div>
          <div className="p-2">
            <form action={logout} onClick={(e) => e.stopPropagation()}>
              <button
                type="submit"
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-red-600"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


