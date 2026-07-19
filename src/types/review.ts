export interface Review {
  id: string
  productId: string
  authorName: string
  rating: number
  text: string
  date: string
  source?: 'kaspi' | 'manual'
}
