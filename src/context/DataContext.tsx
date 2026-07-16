import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../types/product'
import type { Category } from '../types/category'
import { defaultProducts } from '../data/products'
import { defaultCategories } from '../data/categories'
import { api, setAuthToken, type StoreData } from '../api/client'

const AUTH_KEY = 'sportking-admin-token'

interface DataContextValue {
  products: Product[]
  categories: Category[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  getProductBySlug: (slug: string) => Product | undefined
  getCategoryBySlug: (slug: string) => Category | undefined
  getProductsByCategory: (slug: string) => Product[]
  getPopularProducts: (limit?: number) => Product[]
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>
  updateCategory: (id: string, data: Partial<Category>) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  resetToDefaults: () => Promise<void>
  isAdmin: boolean
  login: (password: string) => Promise<void>
  logout: () => Promise<void>
}

const DataContext = createContext<DataContextValue | null>(null)

const fallbackStore: StoreData = {
  version: 2,
  products: defaultProducts,
  categories: defaultCategories,
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreData>(fallbackStore)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(() => !!sessionStorage.getItem(AUTH_KEY))

  const refresh = useCallback(async () => {
    try {
      const data = await api.getStore()
      setStore(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные')
      setStore(fallbackStore)
    }
  }, [])

  useEffect(() => {
    const token = sessionStorage.getItem(AUTH_KEY)

    async function init() {
      if (token) {
        setAuthToken(token)
        try {
          await api.verifyAuth()
          setIsAdmin(true)
        } catch {
          sessionStorage.removeItem(AUTH_KEY)
          setAuthToken(null)
          setIsAdmin(false)
        }
      }
      await refresh()
      setLoading(false)
    }

    init()
  }, [refresh])

  const getProductBySlug = useCallback(
    (slug: string) => store.products.find((p) => p.slug === slug),
    [store.products],
  )

  const getCategoryBySlug = useCallback(
    (slug: string) => store.categories.find((c) => c.slug === slug),
    [store.categories],
  )

  const getProductsByCategory = useCallback(
    (slug: string) => store.products.filter((p) => p.category === slug),
    [store.products],
  )

  const getPopularProducts = useCallback(
    (limit = 6) =>
      [...store.products]
        .sort((a, b) => b.reviewsCount - a.reviewsCount)
        .slice(0, limit),
    [store.products],
  )

  const addProduct = useCallback(async (data: Omit<Product, 'id'>) => {
    const product = await api.createProduct(data)
    setStore((prev) => ({ ...prev, products: [...prev.products, product] }))
    return product
  }, [])

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    const product = await api.updateProduct(id, data)
    setStore((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? product : p)),
    }))
  }, [])

  const deleteProduct = useCallback(async (id: string) => {
    await api.deleteProduct(id)
    setStore((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== id),
    }))
  }, [])

  const addCategory = useCallback(async (data: Omit<Category, 'id'>) => {
    const category = await api.createCategory(data)
    setStore((prev) => ({ ...prev, categories: [...prev.categories, category] }))
    return category
  }, [])

  const updateCategory = useCallback(async (id: string, data: Partial<Category>) => {
    const category = await api.updateCategory(id, data)
    const old = store.categories.find((c) => c.id === id)
    setStore((prev) => {
      let products = prev.products
      if (old && data.slug && data.slug !== old.slug) {
        products = products.map((p) =>
          p.category === old.slug ? { ...p, category: data.slug! } : p,
        )
      }
      return {
        ...prev,
        products,
        categories: prev.categories.map((c) => (c.id === id ? category : c)),
      }
    })
  }, [store.categories])

  const deleteCategory = useCallback(async (id: string) => {
    const cat = store.categories.find((c) => c.id === id)
    await api.deleteCategory(id)
    setStore((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
      products: cat
        ? prev.products.filter((p) => p.category !== cat.slug)
        : prev.products,
    }))
  }, [store.categories])

  const resetToDefaults = useCallback(async () => {
    const data = await api.resetStore()
    setStore(data)
  }, [])

  const login = useCallback(async (password: string) => {
    const { token } = await api.login(password)
    sessionStorage.setItem(AUTH_KEY, token)
    setAuthToken(token)
    setIsAdmin(true)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } catch {
      /* token may already be invalid */
    }
    sessionStorage.removeItem(AUTH_KEY)
    setAuthToken(null)
    setIsAdmin(false)
  }, [])

  const value = useMemo<DataContextValue>(
    () => ({
      products: store.products,
      categories: store.categories,
      loading,
      error,
      refresh,
      getProductBySlug,
      getCategoryBySlug,
      getProductsByCategory,
      getPopularProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      resetToDefaults,
      isAdmin,
      login,
      logout,
    }),
    [
      store,
      loading,
      error,
      refresh,
      getProductBySlug,
      getCategoryBySlug,
      getProductsByCategory,
      getPopularProducts,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      resetToDefaults,
      isAdmin,
      login,
      logout,
    ],
  )

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
