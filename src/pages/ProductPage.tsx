import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Play } from 'lucide-react'
import { usePageMeta, openKaspi } from '../hooks/usePageMeta'
import { useData } from '../context/DataContext'
import { trackProductView } from '../utils/analytics'
import { formatPrice } from '../utils/formatPrice'
import { parseVideoUrl } from '../utils/videoUrl'
import { Badge } from '../components/ui/Badge'
import { Rating } from '../components/ui/Rating'
import { Button } from '../components/ui/Button'
import { ProductGallery, VideoModal } from '../components/ui/ProductGallery'
import { ProductReviews } from '../components/ui/ProductReviews'

export function ProductPage() {
  const { slug = '' } = useParams()
  const { getProductBySlug, getCategoryBySlug, getReviewsByProductId } = useData()
  const product = getProductBySlug(slug)
  const category = product ? getCategoryBySlug(product.category) : undefined
  const reviews = product ? getReviewsByProductId(product.id) : []
  const [videoOpen, setVideoOpen] = useState(false)

  usePageMeta({
    title: product
      ? `${product.name} — SPORT KING`
      : 'Товар — SPORT KING',
    description: product?.description ?? 'Товар SPORT KING.',
    ogImage: product?.image,
  })

  useEffect(() => {
    if (!product) return
    trackProductView({
      id: product.id,
      slug: product.slug,
      name: product.name,
    })
  }, [product])

  if (!product) {
    return (
      <div className="site-container py-20 text-center">
        <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-3xl">
          Товар не найден
        </h1>
        <Link
          to="/catalog"
          className="mt-6 inline-block font-semibold text-dark underline decoration-primary underline-offset-4"
        >
          Вернуться в каталог
        </Link>
      </div>
    )
  }

  const images = product.images?.length ? product.images : [product.image]
  const hasVideo = Boolean(product.videoUrl?.trim() && parseVideoUrl(product.videoUrl))

  return (
    <div className="bg-background py-10 md:py-16">
      <div className="site-container">
        <nav
          className="mb-6 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary sm:text-sm"
          aria-label="Хлебные крошки"
        >
          <Link to="/" className="hover:text-dark">
            Главная
          </Link>
          <span className="mx-2">/</span>
          <Link to="/catalog" className="hover:text-dark">
            Каталог
          </Link>
          {category && (
            <>
              <span className="mx-2">/</span>
              <Link to={`/category/${category.slug}`} className="hover:text-dark">
                {category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="min-w-0 max-w-full truncate text-dark">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={images} alt={product.name} />

          <div>
            {product.badge && (
              <div className="mb-3 sm:mb-4">
                <Badge label={product.badge} />
              </div>
            )}

            <h1 className="text-xl font-extrabold uppercase leading-tight text-dark sm:text-3xl md:text-4xl">
              {product.name}
            </h1>

            <div className="mt-3 sm:mt-4">
              <Rating
                rating={product.rating}
                reviewsCount={product.reviewsCount}
              />
            </div>

            <div className="mt-4 flex items-baseline gap-3 sm:mt-6">
              <span className="text-2xl font-extrabold text-dark sm:text-3xl md:text-4xl">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="text-base text-text-secondary line-through sm:text-lg">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>

            <p
              className={`mt-3 inline-flex rounded-lg px-3 py-1.5 text-sm font-semibold sm:mt-4 ${
                product.inStock
                  ? 'bg-success/10 text-success'
                  : 'bg-border text-text-secondary'
              }`}
            >
              {product.inStock ? 'В наличии' : 'Нет в наличии'}
            </p>

            <p className="mt-4 text-sm leading-relaxed text-text-secondary sm:mt-6 sm:text-base md:text-lg">
              {product.description}
            </p>

            <div className="mt-6 sm:mt-8">
              <h2 className="text-sm font-bold uppercase tracking-widest text-dark">
                Характеристики
              </h2>
              <ul className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
                {product.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-text-secondary sm:text-base"
                  >
                    <Check
                      size={18}
                      className="mt-0.5 shrink-0 text-primary"
                      strokeWidth={3}
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap">
              <Button
                className="w-full sm:w-auto sm:min-w-[280px]"
                onClick={() =>
                  openKaspi(product.kaspiUrl, {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                  })
                }
                aria-label={`Купить ${product.name} на Kaspi`}
              >
                Купить на KASPI
              </Button>

              {hasVideo && (
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setVideoOpen(true)}
                >
                  <Play size={18} />
                  Смотреть видео
                </Button>
              )}
            </div>
          </div>
        </div>

        <ProductReviews reviews={reviews} />
      </div>

      {videoOpen && product.videoUrl && (
        <VideoModal
          videoUrl={product.videoUrl}
          onClose={() => setVideoOpen(false)}
        />
      )}
    </div>
  )
}
