export type OrderStatus = 'new' | 'contacted' | 'completed' | 'cancelled'

export interface Order {
  id: string
  productId: string
  productName: string
  productSlug: string
  productPrice: number
  customerName: string
  phone: string
  comment: string
  status: OrderStatus
  createdAt: string
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'Новая',
  contacted: 'Связались',
  completed: 'Выполнена',
  cancelled: 'Отменена',
}
