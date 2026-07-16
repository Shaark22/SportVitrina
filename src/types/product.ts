export interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  price: number
  oldPrice?: number
  image: string
  images?: string[]
  videoUrl?: string
  rating: number
  reviewsCount: number
  badge?: 'ХИТ' | 'НОВИНКА' | 'АКЦИЯ'
  features: string[]
  kaspiUrl: string
  inStock: boolean
}
