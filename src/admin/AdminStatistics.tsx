import { useEffect, useState } from 'react'
import {
  BarChart3,
  MousePointerClick,
  ShoppingBag,
  Users,
} from 'lucide-react'
import { api, type AnalyticsSummary } from '../api/client'
import { formatNumber } from '../utils/formatPrice'
import { publicSiteUrl } from './publicSiteUrl'

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: string | number
  icon: typeof Users
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-dark">
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-extrabold text-dark">{value}</p>
          <p className="text-sm text-text-secondary">{label}</p>
        </div>
      </div>
    </div>
  )
}

function ProductRankList({
  title,
  items,
  metric,
  metricLabel,
}: {
  title: string
  items: AnalyticsSummary['topKaspi']
  metric: 'views' | 'clicks' | 'kaspiClicks'
  metricLabel: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
      <h2 className="text-sm font-bold uppercase tracking-widest text-dark">
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-text-secondary">Пока нет данных</p>
      ) : (
        <ol className="mt-4 space-y-3">
          {items.map((item, index) => (
            <li
              key={item.productId}
              className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-background px-3 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-dark text-xs font-bold text-white">
                  {index + 1}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-dark">
                    {item.name}
                  </p>
                  {item.slug && (
                    <a
                      href={publicSiteUrl(`/product/${item.slug}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-text-secondary underline underline-offset-2"
                    >
                      Открыть на сайте
                    </a>
                  )}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-extrabold text-dark">
                  {formatNumber(item[metric])}
                </p>
                <p className="text-[10px] uppercase text-text-secondary">
                  {metricLabel}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export function AdminStatistics() {
  const [data, setData] = useState<AnalyticsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getAnalytics()
      .then(setData)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Ошибка загрузки'),
      )
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-text-secondary">Загрузка статистики...</p>
  }

  if (error) {
    return <p className="text-red-600">{error}</p>
  }

  if (!data) return null

  const maxVisitors = Math.max(
    ...data.last7Days.map((d) => d.uniqueVisitors),
    1,
  )

  return (
    <div>
      <h1 className="text-2xl font-extrabold uppercase text-dark sm:text-4xl">
        Статистика сайта
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        Уникальные посетители считаются один раз. Обновление страницы не
        увеличивает счётчик.
      </p>
      <p className="mt-1 text-xs text-text-secondary">
        Обновлено:{' '}
        {new Date(data.updatedAt).toLocaleString('ru-RU', {
          dateStyle: 'short',
          timeStyle: 'short',
        })}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Уникальных посетителей"
          value={formatNumber(data.totals.uniqueVisitors ?? 0)}
          icon={Users}
        />
        <StatCard
          label="Кликов по контактам"
          value={formatNumber(data.totals.contactClicks ?? 0)}
          icon={MousePointerClick}
        />
        <StatCard
          label="Переходов на Kaspi"
          value={formatNumber(data.totals.kaspiClicks ?? 0)}
          icon={ShoppingBag}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-dark">
            <BarChart3 size={16} />
            Уникальные посетители за 7 дней
          </h2>
          <div className="mt-6 flex items-end justify-between gap-2">
            {data.last7Days.map((day) => (
              <div
                key={day.date}
                className="flex min-w-0 flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full max-w-10 rounded-t-lg bg-primary transition-all"
                  style={{
                    height: `${Math.max(8, (day.uniqueVisitors / maxVisitors) * 120)}px`,
                  }}
                  title={`${day.uniqueVisitors} уникальных`}
                />
                <span className="text-[10px] font-semibold text-text-secondary">
                  {day.date.slice(8)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-dark">
            Клики по контактам
          </h2>
          {data.contacts.length === 0 ? (
            <p className="mt-4 text-sm text-text-secondary">Пока нет кликов</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {data.contacts.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between rounded-xl bg-background px-4 py-3 text-sm"
                >
                  <span className="font-semibold text-dark">{item.label}</span>
                  <span className="font-extrabold text-dark">
                    {formatNumber(item.count)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ProductRankList
          title="Товары — больше всего кликов"
          items={data.topClicks}
          metric="clicks"
          metricLabel="кликов"
        />
        <ProductRankList
          title="Больше всего переходов на Kaspi"
          items={data.topKaspi}
          metric="kaspiClicks"
          metricLabel="переходов"
        />
      </div>
    </div>
  )
}
