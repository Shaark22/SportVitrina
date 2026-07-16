import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { parseVideoUrl } from '../../utils/videoUrl'
import { SmartImage } from './SmartImage'

interface ProductGalleryProps {
  images: string[]
  alt: string
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0)
  const gallery = images.length ? images : []

  useEffect(() => {
    if (active >= gallery.length) setActive(0)
  }, [active, gallery.length])

  if (!gallery.length) return null

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-border bg-white sm:rounded-3xl">
        <div className="flex min-h-[280px] items-center justify-center p-3 sm:min-h-[360px] sm:p-4 md:min-h-[420px]">
          <SmartImage
            src={gallery[active]}
            alt={alt}
            className="max-h-[min(70vw,520px)] w-full object-contain sm:max-h-[480px]"
            aspect=""
            loading="eager"
          />
        </div>
      </div>

      {gallery.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {gallery.map((src, index) => (
            <button
              key={`${src.slice(0, 24)}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors sm:h-20 sm:w-20 ${
                index === active
                  ? 'border-dark'
                  : 'border-border opacity-80 hover:opacity-100'
              }`}
              aria-label={`Фото ${index + 1}`}
            >
              <SmartImage
                src={src}
                alt={`${alt} ${index + 1}`}
                className="h-full w-full object-contain bg-white p-0.5"
                aspect=""
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

interface VideoModalProps {
  videoUrl: string
  onClose: () => void
}

export function VideoModal({ videoUrl, onClose }: VideoModalProps) {
  const video = parseVideoUrl(videoUrl)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!video) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-dark/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative z-10 w-full overflow-hidden rounded-2xl bg-surface shadow-2xl ${
          video.type === 'instagram' ? 'max-w-md' : 'max-w-3xl'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5">
          <h3 className="text-sm font-bold uppercase text-dark">Видео о товаре</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border"
            aria-label="Закрыть"
          >
            <X size={18} />
          </button>
        </div>

        {video.embedUrl ? (
          video.type === 'instagram' ? (
            <div className="flex justify-center bg-black px-2 py-3 sm:px-4">
              <iframe
                src={video.embedUrl}
                title="Видео о товаре"
                className="h-[min(78vh,720px)] w-full max-w-[400px] rounded-lg border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                scrolling="no"
              />
            </div>
          ) : (
            <div className="aspect-video w-full bg-black">
              <iframe
                src={video.embedUrl}
                title="Видео о товаре"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-text-secondary">
              Видео откроется на внешней странице.
            </p>
            <a
              href={video.openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-12 items-center justify-center rounded-xl bg-dark px-6 text-sm font-bold uppercase tracking-wide text-white"
            >
              Открыть видео
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
