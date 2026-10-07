'use client'

import Link from 'next/link'
import { Banknote, TrendingUp, Newspaper } from 'lucide-react'
import { useTranslation } from '@/lib/LanguageContext'

export function HomeQuickTools() {
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-3">
      {/* 1. Kalkulator Emas Fisik -> /gold */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-[#14509b]">
            <Banknote className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {t.goldCalcTitle}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {t.goldCalcDesc}
            </p>
          </div>
        </div>

        <Link
          href="/gold"
          className="shrink-0 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
        >
          {t.goldCalcBtn}
        </Link>
      </div>

      {/* 2. Pivot Point & NEST -> /pivot & /pivot/nest */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-[#0292e3]">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {t.pivotTitle}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {t.pivotDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Link
            href="/pivot"
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
          >
            {t.pivotBtn}
          </Link>
          <Link
            href="/pivot/nest"
            className="rounded-xl border border-[#0292e3]/20 bg-[#0292e3]/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#0292e3] transition-all hover:bg-[#0292e3]/20 active:scale-95"
          >
            {t.nestBtn}
          </Link>
        </div>
      </div>

      {/* 3. Berita Fundamental -> /news */}
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-emerald-600">
            <Newspaper className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {t.newsTitle}
            </h3>
            <p className="text-xs text-slate-500 truncate">
              {t.newsDesc}
            </p>
          </div>
        </div>

        <Link
          href="/news"
          className="shrink-0 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95"
        >
          {t.newsBtn}
        </Link>
      </div>
    </section>
  )
}
