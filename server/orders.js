import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const STATUSES = new Set(['new', 'contacted', 'completed', 'cancelled'])

export function createOrdersStore(ordersPath) {
  function defaultData() {
    return { version: 1, orders: [] }
  }

  function read() {
    if (!existsSync(ordersPath)) return defaultData()
    try {
      const data = JSON.parse(readFileSync(ordersPath, 'utf8'))
      if (!Array.isArray(data.orders)) return defaultData()
      return data
    } catch {
      return defaultData()
    }
  }

  function write(data) {
    writeFileSync(ordersPath, JSON.stringify(data, null, 2))
  }

  function normalizePhone(phone) {
    const digits = String(phone || '').replace(/\D/g, '')
    if (digits.length < 10 || digits.length > 15) {
      throw new Error('Укажите корректный номер телефона')
    }
    return digits
  }

  function createOrder(payload) {
    const customerName = String(payload.customerName || '').trim().slice(0, 100)
    const comment = String(payload.comment || '').trim().slice(0, 500)
    const productId = String(payload.productId || '').trim()
    const productName = String(payload.productName || '').trim()
    const productSlug = String(payload.productSlug || '').trim()
    const productPrice = Number(payload.productPrice)

    if (!customerName || customerName.length < 2) {
      throw new Error('Укажите ваше имя')
    }
    if (!productId || !productName || !productSlug) {
      throw new Error('Товар не указан')
    }
    if (!Number.isFinite(productPrice) || productPrice <= 0) {
      throw new Error('Некорректная цена товара')
    }

    const phone = normalizePhone(payload.phone)
    const data = read()
    const order = {
      id: `ord-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productId,
      productName,
      productSlug,
      productPrice,
      customerName,
      phone,
      comment,
      status: 'new',
      createdAt: new Date().toISOString(),
    }
    data.orders.unshift(order)
    write(data)
    return order
  }

  function listOrders({ status } = {}) {
    const data = read()
    let orders = [...data.orders]
    if (status && STATUSES.has(status)) {
      orders = orders.filter((o) => o.status === status)
    }
    return orders.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }

  function updateOrder(id, patch) {
    const data = read()
    const index = data.orders.findIndex((o) => o.id === id)
    if (index === -1) throw new Error('Заявка не найдена')

    const next = { ...data.orders[index] }
    if (patch.status !== undefined) {
      if (!STATUSES.has(patch.status)) throw new Error('Некорректный статус')
      next.status = patch.status
    }
    data.orders[index] = next
    write(data)
    return next
  }

  function deleteOrder(id) {
    const data = read()
    const before = data.orders.length
    data.orders = data.orders.filter((o) => o.id !== id)
    if (data.orders.length === before) throw new Error('Заявка не найдена')
    write(data)
    return { ok: true }
  }

  function countByStatus(status) {
    return read().orders.filter((o) => o.status === status).length
  }

  return { createOrder, listOrders, updateOrder, deleteOrder, countByStatus }
}
