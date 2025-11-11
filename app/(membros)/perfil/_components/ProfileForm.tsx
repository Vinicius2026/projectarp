'use client'

import { useState, useRef } from 'react'
import { Profile } from '@/lib/types/database'
import { updateProfile, uploadProfileImage } from '@/app/actions/profile'
import { Camera, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ProfileFormProps {
  profile: Profile | null
}

export default function ProfileForm({ profile }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [bio, setBio] = useState(profile?.bio || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const initial = (fullName?.[0] || 'U').toUpperCase()

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    const result = await uploadProfileImage(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
      setUploading(false)
    } else if (result.success && result.url) {
      // Atualizar o estado local com a nova URL
      setAvatarUrl(result.url)
      setMessage({ type: 'success', text: 'Imagem atualizada com sucesso!' })
      
      // Forçar refresh da página após um pequeno delay para garantir que o cache seja atualizado
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }

    setUploading(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('full_name', fullName)
    formData.append('bio', bio)

    const result = await updateProfile(formData)

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Upload de imagem */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Foto de Perfil
        </label>
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <div className="w-24 h-24 rounded-full overflow-hidden bg-black">
                <Image
                  src={avatarUrl}
                  alt="Avatar"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-3xl">{initial}</span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="avatar-upload"
              disabled={uploading}
            />
            <label
              htmlFor="avatar-upload"
              className={`inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Camera className="w-4 h-4" />
              {uploading ? 'Enviando...' : 'Alterar foto'}
            </label>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG ou GIF. Máximo 25MB
            </p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Nome completo */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
            Nome Completo
          </label>
          <input
            type="text"
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Seu nome completo"
            required
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
            placeholder="Conte um pouco sobre você..."
            maxLength={150}
          />
          <p className="text-xs text-gray-500 mt-1">{bio.length}/150 caracteres</p>
        </div>

        {/* Mensagem de feedback */}
        {message && (
          <div
            className={`p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Botão salvar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar alterações'
          )}
        </button>
      </form>
    </div>
  )
}

