'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from '@/lib/LanguageContext'
import { TradingViewMiniWidget } from '@/components/home/TradingViewMiniWidget'
import { ExchangeRateCard } from '@/components/home/ExchangeRateCard'
import { OfflineMarketPlaceholder } from '@/components/home/OfflineMarketPlaceholder'
import { useOnlineStatus } from '@/components/pwa/offline-support'

export function MarketIndicators() {
  const { t, lang } = useTranslation()
  const isOnline = useOnlineStatus()
  const [timeStr, setTimeStr] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const formatted =
        now.toLocaleTimeString('id-ID', {
          timeZone: 'Asia/Jakarta',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' WIB'
      setTimeStr(formatted)
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const widgetLocale = lang === 'id' ? 'id' : 'en'

  return (
    <section className="flex flex-col gap-3">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          )}
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800">
            {t.indicatorsTitle}
          </h2>
        </div>

        {isOnline && timeStr && (
          <span className="text-[11px] font-semibold text-slate-400">
            {t.synced}: {timeStr}
          </span>
        )}
      </div>

      {isOnline ? (
        <div className="grid gap-3.5 sm:grid-cols-2">
          <div className="flex h-[160px] min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
            <TradingViewMiniWidget
              symbol="OANDA:XAUUSD"
              height={134}
              locale={widgetLocale}
            />
          </div>

          <ExchangeRateCard />
        </div>
      ) : (
        <OfflineMarketPlaceholder
          message="Real-time market indicators are unavailable offline."
          className="h-[160px]"
        />
      )}
    </section>
  )
}
