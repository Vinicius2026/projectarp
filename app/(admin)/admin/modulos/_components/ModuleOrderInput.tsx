'use client'

import { useState, useTransition } from 'react'
import { updateModuleOrder } from '@/app/actions/modules'
import { Check, X } from 'lucide-react'

interface ModuleOrderInputProps {
  moduleId: number
  currentOrder: number | null
  areaId: number
  maxOrder: number
}

export default function ModuleOrderInput({ 
  moduleId, 
  currentOrder, 
  areaId,
  maxOrder 
}: ModuleOrderInputProps) {
  const [order, setOrder] = useState(currentOrder?.toString() || '1')
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = () => {
    const newOrder = parseInt(order)
    
    if (isNaN(newOrder) || newOrder < 1 || newOrder > 10) {
      setError('A ordem deve estar entre 1 e 10')
      return
    }

    if (newOrder === currentOrder) {
      setIsEditing(false)
      return
    }

    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await updateModuleOrder(moduleId, newOrder, areaId)
      
      if (result.error) {
        setError(result.error)
        setOrder(currentOrder?.toString() || '1')
      } else {
        setSuccess(true)
        setTimeout(() => {
          setSuccess(false)
          setIsEditing(false)
        }, 1000)
      }
    })
  }

  const handleCancel = () => {
    setOrder(currentOrder?.toString() || '1')
    setIsEditing(false)
    setError(null)
    setSuccess(false)
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Ordem:</span>
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 transition"
        >
          {currentOrder || 'N/A'}
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Ordem:</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min="1"
          max="10"
          value={order}
          onChange={(e) => {
            setOrder(e.target.value)
            setError(null)
          }}
          disabled={isPending}
          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSave()
            } else if (e.key === 'Escape') {
              handleCancel()
            }
          }}
        />
        <button
          onClick={handleSave}
          disabled={isPending}
          className="p-1 text-green-600 hover:bg-green-50 rounded transition"
          title="Salvar"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          disabled={isPending}
          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
          title="Cancelar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
      {success && (
        <span className="text-xs text-green-600">Salvo!</span>
      )}
      {isPending && (
        <span className="text-xs text-gray-500">Salvando...</span>
      )}
    </div>
  )
}

