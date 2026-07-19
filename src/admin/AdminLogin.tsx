import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'

export function AdminLogin() {
  const { isAdmin, login } = useData()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (isAdmin) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await login(password)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный пароль')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <div className="mb-8 flex justify-center">
          <Logo size="hero" />
        </div>
        <h1 className="text-center text-2xl font-extrabold uppercase text-dark">
          Вход в админку
        </h1>
        <p className="mt-2 text-center text-sm text-text-secondary">
          Введите пароль администратора
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-dark">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base"
              placeholder="Введите пароль"
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm font-semibold text-red-600">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </div>
    </div>
  )
}
