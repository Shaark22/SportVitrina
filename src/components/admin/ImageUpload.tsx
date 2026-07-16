import { useRef, useState } from 'react'
import { Upload } from 'lucide-react'
import { uploadImageFile } from '../../api/client'
import { SmartImage } from '../ui/SmartImage'

interface ImageUploadProps {
  label?: string
  value: string
  onChange: (value: string) => void
}

export function ImageUpload({
  label = 'Фото',
  value,
  onChange,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setError('')
    setLoading(true)
    try {
      const url = await uploadImageFile(file)
      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки фото')
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const isUploaded = value.startsWith('/uploads/')

  return (
    <div>
      <label className="mb-2 block text-sm font-bold uppercase">{label}</label>
      <p className="mb-3 text-xs text-text-secondary">
        Фото сохраняется на сервере и видно всем посетителям сайта.
      </p>

      {value && (
        <div className="mb-3 overflow-hidden rounded-xl border border-border bg-background">
          <SmartImage
            src={value}
            alt="Превью"
            className="aspect-[4/3] w-full object-contain bg-white p-2"
            aspect=""
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-4 py-5 text-sm font-semibold text-dark transition-colors hover:border-dark disabled:opacity-60"
      >
        <Upload size={18} />
        {loading ? 'Загрузка на сервер...' : 'Загрузить с компьютера'}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <p className="mt-2 text-xs text-text-secondary">
        Или вставьте ссылку на фото (Kaspi, Instagram, любой хостинг):
      </p>
      <input
        type="url"
        value={isUploaded ? '' : value}
        placeholder="https://..."
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-base"
      />

      {isUploaded && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="mt-2 text-xs font-semibold text-text-secondary underline underline-offset-2"
        >
          Удалить загруженное фото
        </button>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
