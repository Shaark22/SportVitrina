import { useLocation, Navigate, Outlet, NavLink, Link } from 'react-router-dom'
import { LayoutGrid, Package, Tags, LogOut, ExternalLink, BarChart3 } from 'lucide-react'
import { useData } from '../context/DataContext'
import { Logo } from '../components/ui/Logo'

const links = [
  { to: '/admin', label: 'Обзор', icon: LayoutGrid, end: true },
  { to: '/admin/statistics', label: 'Статистика', icon: BarChart3 },
  { to: '/admin/products', label: 'Товары', icon: Package },
  { to: '/admin/categories', label: 'Категории', icon: Tags },
]

export function AdminLayout() {
  const { isAdmin, logout } = useData()
  const location = useLocation()

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/admin" className="flex items-center gap-3">
            <Logo className="h-9 w-[108px] sm:h-10 sm:w-[130px]" />
            <span className="hidden text-xs font-bold uppercase tracking-widest text-text-secondary sm:inline">
              Админ
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              target="_blank"
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold uppercase tracking-wide text-dark sm:px-4 sm:text-sm"
            >
              <ExternalLink size={16} />
              <span className="hidden sm:inline">На сайт</span>
            </Link>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-dark px-3 text-xs font-bold uppercase tracking-wide text-white sm:px-4 sm:text-sm"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <nav className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {links.map(({ to, label, icon: Icon, end }) => {
            const active = end
              ? location.pathname === to
              : location.pathname.startsWith(to)
            return (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${
                  active
                    ? 'bg-primary text-dark'
                    : 'bg-surface text-text-secondary hover:text-dark'
                }`}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            )
          })}
        </nav>
        <Outlet />
      </div>
    </div>
  )
}
