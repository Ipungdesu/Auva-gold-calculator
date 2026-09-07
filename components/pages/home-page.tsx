'use client'

import { useState } from 'react'
import {
  Banknote,
  TrendingUp,
  BarChart2,
  Newspaper,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from 'lucide-react'
import {
  goldPrice,
  money,
  news,
  marketSeries,
  type NewsItem,
} from '@/lib/goldcalc-data'
import type { Page } from '@/components/goldcalc/sidebar-navigation'

interface HomePageProps {
  setPage: (p: Page) => void
  showNews: (n: NewsItem) => void
}

export function HomePage({ setPage, showNews }: HomePageProps) {
  const [timeframe, setTimeframe] = useState<'1D' | '1W' | '1M'>('1D')
  const chartData = marketSeries[timeframe]

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-6 sm:max-w-xl sm:px-6 lg:max-w-4xl lg:px-8">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 leading-tight">
            Auva Calculation & Market Information
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            Calculate physical gold values, analyze digital gold pivot points, explore historical data, and stay informed with fundamental market news.
          </p>
        </div>

        <button
          onClick={() => setPage('dashboard')}
          className="mt-1 flex w-fit items-center justify-center gap-2 rounded-xl bg-[#241e52] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#1a153e]"
        >
          <span>View Dashboard</span>
        </button>
      </div>

      {/* 4 Tool Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Physical Gold Calculator */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#241e52]">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Physical Gold Calculator</h3>
              <p className="mt-1 text-xs text-slate-500 leading-normal">
                Calculate buying price, selling price, price difference, gold quantity, and potential profit.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPage('gold')}
            className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
          >
            Calculate Now
          </button>
        </div>

        {/* Pivot Point */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[#0292e3]">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Pivot Point</h3>
              <p className="mt-1 text-xs text-slate-500 leading-normal">
                Calculate Classic Pivot Point with Resistance (R1 to R4) and Support (S1 to S4).
              </p>
            </div>
          </div>
          <button
            onClick={() => setPage('pivot')}
            className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
          >
            Analyze Pivot
          </button>
        </div>

        {/* Historical Data */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <BarChart2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Historical Data</h3>
              <p className="mt-1 text-xs text-slate-500 leading-normal">
                View historical Open, High, Low, and Close data for XAUUSD.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPage('history')}
            className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
          >
            View Data
          </button>
        </div>

        {/* Fundamental News */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Fundamental News</h3>
              <p className="mt-1 text-xs text-slate-500 leading-normal">
                Explore important news related to gold and global financial markets.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPage('news')}
            className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
          >
            Read News
          </button>
        </div>
      </div>

      {/* Gold Market Overview Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 text-center sm:text-left">
          Gold Market Overview
        </h2>

        {/* KPI Cards Stack */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Latest Pivot Point */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              LATEST PIVOT POINT
            </span>
            <div className="mt-1 text-lg font-extrabold text-slate-900">
              {money(goldPrice.price)}
            </div>
            <span className="mt-1 text-[11px] text-slate-500">Daily timeframe</span>
          </div>

          {/* Latest Open Price */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              LATEST OPEN PRICE
            </span>
            <div className="mt-1 text-lg font-extrabold text-slate-900">
              {money(goldPrice.open)}
            </div>
            <span className="mt-1 inline-flex items-center text-[11px] font-bold text-emerald-600">
              +{goldPrice.change}%
            </span>
          </div>

          {/* Latest Resistance (R1) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              LATEST RESISTANCE (R1)
            </span>
            <div className="mt-1 flex items-center justify-between text-lg font-extrabold text-slate-900">
              <span>{money(goldPrice.r1)}</span>
              <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            </div>
            <span className="mt-1 text-[11px] text-slate-500">Distance: +$11.03</span>
          </div>

          {/* Latest Support (S1) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              LATEST SUPPORT (S1)
            </span>
            <div className="mt-1 flex items-center justify-between text-lg font-extrabold text-slate-900">
              <span>{money(goldPrice.s1)}</span>
              <ArrowDownRight className="h-4 w-4 text-rose-500" />
            </div>
            <span className="mt-1 text-[11px] text-slate-500">Distance: -$11.02</span>
          </div>
        </div>

        {/* Price Action Chart Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Price Action (XAU/USD)</h3>
            <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5">
              {(['1D', '1W', '1M'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-bold transition-all ${
                    timeframe === tf
                      ? 'bg-[#241e52] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="mt-4 h-48 w-full">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 400 150">
              {/* Dotted guideline */}
              <line x1="0" y1="75" x2="400" y2="75" stroke="#cbd5e1" strokeDasharray="4 4" />
              {/* Gold Line */}
              <polyline
                fill="none"
                stroke="#d97706"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartData
                  .map((val, i) => {
                    const x = (i / (chartData.length - 1)) * 390 + 5
                    const min = Math.min(...chartData)
                    const max = Math.max(...chartData)
                    const y = 140 - ((val - min) / (max - min || 1)) * 120
                    return `${x},${y}`
                  })
                  .join(' ')}
              />
            </svg>
          </div>
          <div className="flex justify-between pt-2 text-[10px] font-medium text-slate-400">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
          </div>
        </div>

        {/* Fundamental News Highlights */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Fundamental News Highlights</h3>
            <button
              onClick={() => setPage('news')}
              className="flex items-center gap-1 text-xs font-bold text-[#0292e3] hover:underline"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {news.slice(0, 2).map((item) => (
              <div
                key={item.id}
                onClick={() => showNews(item)}
                className="cursor-pointer rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold">{item.source}</span>
                  <span>{item.published}</span>
                </div>
                <h4 className="mt-1 text-xs font-bold text-slate-900 line-clamp-2">
                  {item.title}
                </h4>
                <p className="mt-1 text-[11px] text-slate-600 line-clamp-2">{item.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pivot Summary Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900">Pivot Summary</h3>
          <div className="mt-4 flex flex-col gap-2">
            <div className="flex justify-between rounded-md bg-slate-50 px-3 py-1.5 text-xs">
              <span className="font-bold text-slate-500">R4</span>
              <span className="font-semibold text-slate-900">$2,410.31</span>
            </div>
            <div className="flex justify-between rounded-md bg-slate-50 px-3 py-1.5 text-xs">
              <span className="font-bold text-slate-500">R3</span>
              <span className="font-semibold text-slate-900">$2,382.11</span>
            </div>
            <div className="flex justify-between rounded-md bg-slate-50 px-3 py-1.5 text-xs">
              <span className="font-bold text-slate-500">R2</span>
              <span className="font-semibold text-slate-900">$2,370.41</span>
            </div>

            {/* PP Bar */}
            <div className="relative flex justify-between rounded-md bg-[#241e52] px-3 py-2 text-xs text-white">
              <span className="font-bold uppercase">PP</span>
              <div className="absolute inset-x-12 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#0292e3]/40" />
              <span className="font-bold">$2,345.01</span>
            </div>

            <div className="flex justify-between rounded-md bg-slate-50 px-3 py-1.5 text-xs">
              <span className="font-bold text-slate-500">S1</span>
              <span className="font-semibold text-slate-900">$2,330.10</span>
            </div>
            <div className="flex justify-between rounded-md bg-slate-50 px-3 py-1.5 text-xs">
              <span className="font-bold text-slate-500">S2</span>
              <span className="font-semibold text-slate-900">$2,305.70</span>
            </div>
            <div className="flex justify-between rounded-md bg-slate-50 px-3 py-1.5 text-xs">
              <span className="font-bold text-slate-500">S3</span>
              <span className="font-semibold text-slate-900">$2,290.41</span>
            </div>
          </div>

          <button
            onClick={() => setPage('pivot')}
            className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50"
          >
            Details of Levels
          </button>
        </div>
      </div>
    </div>
  )
}
