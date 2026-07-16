import { useRef, useState } from 'react'
import { Star, Upload, X } from 'lucide-react'
import { uploadImageFile } from '../../api/client'
import { SmartImage } from '../ui/SmartImage'

interface MultiImageUploadProps {
  label?: string
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export function MultiImageUpload({
  label = 'Фото',
  images,
  onChange,
  maxImages = 8,
}: MultiImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [urlInput, setUrlInput] = useState('')

  const addImage = (src: string) => {
    if (!src.trim() || images.length >= maxImages) return
    onChange([...images, src.trim()])
  }

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return
    setError('')
    setLoading(true)

    try {
      const next = [...images]
      for (const file of Array.from(fileList)) {
        if (next.length >= maxImages) break
        const url = await uploadImageFile(file)
        next.push(url)
      }
      onChange(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки фото')
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  const setMain = (index: number) => {
    if (index === 0) return
    const next = [...images]
    const [selected] = next.splice(index, 1)
    next.unshift(selected)
    onChange(next)
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-bold uppercase">{label}</label>
      <p className="mb-3 text-xs text-text-secondary">
        Первое фото — главное в каталоге. Фото сохраняются на сервере и видны всем
        посетителям. До {maxImages} фото. Рекомендуемый формат: <strong>4:3</strong>{' '}
        или <strong>3:4</strong> — фото не будет обрезаться на сайте.
      </p>

      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((src, index) => (
            <div
              key={`${src.slice(0, 32)}-${index}`}
              className={`relative overflow-hidden rounded-xl border bg-background ${
                index === 0 ? 'border-dark ring-2 ring-primary/40' : 'border-border'
              }`}
            >
              <SmartImage
                src={src}
                alt={`Фото ${index + 1}`}
                className="aspect-square w-full object-contain bg-white p-1"
                aspect=""
              />
              {index === 0 && (
                <span className="absolute left-2 top-2 rounded-lg bg-primary px-2 py-0.5 text-[10px] font-bold uppercase text-dark">
                  Главное
                </span>
              )}
              <div className="absolute right-2 top-2 flex gap-1">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => setMain(index)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface/95 text-dark shadow"
                    aria-label="Сделать главным"
                    title="Сделать главным"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface/95 text-dark shadow"
                  aria-label="Удалить фото"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < maxImages && (
        <>
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
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />

          <p className="mt-2 text-xs text-text-secondary">
            Или вставьте ссылку на фото:
          </p>
          <div className="mt-2 flex gap-2">
            <input
              type="url"
              value={urlInput}
              placeholder="https://..."
              onChange={(e) => setUrlInput(e.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-border bg-background px-4 py-3 text-base"
            />
            <button
              type="button"
              onClick={() => {
                addImage(urlInput)
                setUrlInput('')
              }}
              className="shrink-0 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-dark"
            >
              Добавить
            </button>
          </div>
        </>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
