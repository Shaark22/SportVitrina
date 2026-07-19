import { Routes, Route } from 'react-router-dom'
import { AdminLayout } from './AdminLayout'
import { AdminLogin } from './AdminLogin'
import { AdminDashboard } from './AdminDashboard'
import { AdminProducts } from './AdminProducts'
import { AdminProductForm } from './AdminProductForm'
import { AdminCategories } from './AdminCategories'
import { AdminStatistics } from './AdminStatistics'
import { AdminCategoryForm } from './AdminCategoryForm'
import { AdminReviews } from './AdminReviews'

export function AdminApp() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="statistics" element={<AdminStatistics />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/new" element={<AdminProductForm />} />
        <Route path="products/:id/edit" element={<AdminProductForm />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="categories/new" element={<AdminCategoryForm />} />
        <Route path="categories/:id/edit" element={<AdminCategoryForm />} />
        <Route path="reviews" element={<AdminReviews />} />
      </Route>
    </Routes>
  )
}
