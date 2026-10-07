'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, AlertCircle } from 'lucide-react'
import { useTranslation } from '@/lib/LanguageContext'

interface ExchangeRateData {
  rate: number
  lastUpdate: string
}

export function ExchangeRateCard() {
  const { t, lang } = useTranslation()
  const [data, setData] = useState<ExchangeRateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchRate = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/exchange-rate')
      if (!res.ok) throw new Error('Failed to fetch')
      const json: ExchangeRateData = await res.json()
      setData(json)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRate()
    // Refresh every 5 minutes
    const interval = setInterval(fetchRate, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchRate])

  return (
    <div className="flex h-[160px] min-w-0 flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          USD / IDR
        </span>
        <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 border border-emerald-100">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          LIVE
        </span>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="my-auto flex flex-col gap-2">
          <div className="h-6 w-3/4 animate-pulse rounded-md bg-slate-100" />
          <div className="h-3 w-1/2 animate-pulse rounded-md bg-slate-100" />
        </div>
      ) : error ? (
        <div className="my-auto flex flex-col items-start gap-2">
          <div className="flex items-center gap-1.5 text-xs text-rose-500">
            <AlertCircle className="h-3.5 w-3.5" />
            <span className="text-[11px]">{t.errorMessage}</span>
          </div>
          <button
            onClick={fetchRate}
            className="flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 text-[10px] font-bold text-slate-600 transition-colors hover:bg-slate-50 active:scale-95"
          >
            <RefreshCw className="h-3 w-3" />
            {t.retry}
          </button>
        </div>
      ) : data ? (
        <div className="my-auto min-w-0">
          <div className="text-[10px] font-medium text-slate-400">1 USD =</div>
          <div className="flex min-w-0 items-baseline gap-1.5 whitespace-nowrap">
            <span className="text-sm font-bold text-slate-500">Rp</span>
            <span className="truncate text-2xl font-extrabold tabular-nums tracking-tight text-slate-900">
              {new Intl.NumberFormat('id-ID', {
                maximumFractionDigits: 0,
              }).format(data.rate)}
            </span>
          </div>
          <div className="mt-0.5 text-[11px] font-medium text-slate-400">
            <span>{t.exchangeRate}</span>
          </div>
        </div>
      ) : null}

      {/* Footer / Last Updated */}
      <div className="border-t border-slate-100 pt-2 text-[10px] text-slate-400 truncate">
        {data?.lastUpdate
          ? `${t.updatedAt}: ${new Date(data.lastUpdate).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US')}`
          : loading
            ? t.loading
            : t.dataUnavailable}
      </div>
    </div>
  )
}
