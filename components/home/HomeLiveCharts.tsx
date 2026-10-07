'use client'

import { BarChart3 } from 'lucide-react'
import { useTranslation } from '@/lib/LanguageContext'
import { TradingViewChart } from '@/components/home/TradingViewChart'

export function HomeLiveCharts() {
  const { t, lang } = useTranslation()
  const widgetLocale = lang === 'id' ? 'id' : 'en'

  return (
    <section className="flex flex-col gap-3">
      {/* Section Header */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#14509b]">
            <BarChart3 className="h-4 w-4" />
          </div>
          <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800">
            {t.chartsTitle}
          </h2>
        </div>

        <div className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#14509b]">
          {t.chartXauusd}
        </div>
      </div>

      {/* Chart Card Container */}
      <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-sm sm:p-4">
        <div className="h-[440px] w-full">
          <TradingViewChart
            symbol="OANDA:XAUUSD"
            height={440}
            locale={widgetLocale}
          />
        </div>
      </div>
    </section>
  )
}
