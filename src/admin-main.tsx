import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { AdminApp } from './admin/AdminApp'
import './index.css'

const basename = (import.meta.env.VITE_ADMIN_BASE || '/sk-manage-kz8m2p').replace(
  /\/$/,
  '',
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <DataProvider>
        <AdminApp />
      </DataProvider>
    </BrowserRouter>
  </StrictMode>,
)
