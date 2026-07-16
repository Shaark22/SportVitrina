import { type ReactNode } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Home } from './pages/Home'
import { Catalog } from './pages/Catalog'
import { ProductPage } from './pages/ProductPage'
import { CategoryPage } from './pages/CategoryPage'
import { About } from './pages/About'
import { Delivery } from './pages/Delivery'
import { Contacts } from './pages/Contacts'
import { AdminLayout } from './admin/AdminLayout'
import { AdminLogin } from './admin/AdminLogin'
import { AdminDashboard } from './admin/AdminDashboard'
import { AdminProducts } from './admin/AdminProducts'
import { AdminProductForm } from './admin/AdminProductForm'
import { AdminCategories } from './admin/AdminCategories'
import { AdminStatistics } from './admin/AdminStatistics'
import { AdminCategoryForm } from './admin/AdminCategoryForm'
import { AnalyticsTracker } from './components/AnalyticsTracker'
import { ScrollToTop } from './components/ScrollToTop'

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh min-w-0 flex-col overflow-x-hidden">
      <Header />
      <main className="min-w-0 flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      <AnalyticsTracker />
      <ScrollToTop />
      {isAdminRoute ? (
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="statistics" element={<AdminStatistics />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="categories/new" element={<AdminCategoryForm />} />
          <Route path="categories/:id/edit" element={<AdminCategoryForm />} />
        </Route>
      </Routes>
      ) : (
    <PublicLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/contacts" element={<Contacts />} />
      </Routes>
    </PublicLayout>
      )}
    </>
  )
}
