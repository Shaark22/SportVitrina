import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { api } from '../api/client'

export function AdminErrors() {
  const [entries, setEntries] = useState<
    { id: string; at: string; message: string; path: string; status: number }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getErrors()
      .then((data) => setEntries(data.entries))
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Не удалось загрузить логи'),
      )
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-4xl">
        Ошибки сервера
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-text-secondary sm:text-base">
        Последние ошибки API (до 100 записей). Полезно для диагностики после деплоя.
      </p>

      {loading && (
        <p className="mt-8 text-sm text-text-secondary">Загрузка…</p>
      )}
      {error && (
        <p className="mt-8 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {!loading && !error && entries.length === 0 && (
        <p className="mt-8 rounded-2xl border border-border bg-surface p-6 text-sm text-text-secondary">
          Ошибок пока нет.
        </p>
      )}

      {!loading && entries.length > 0 && (
        <ul className="mt-8 space-y-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="rounded-2xl border border-border bg-surface p-4 sm:p-5"
            >
              <div className="flex flex-wrap items-start gap-2">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-red-600" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-dark">{entry.message}</p>
                  <p className="mt-1 text-xs text-text-secondary">
                    {new Date(entry.at).toLocaleString('ru-RU')} · {entry.status} ·{' '}
                    <span className="font-mono">{entry.path || '—'}</span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
