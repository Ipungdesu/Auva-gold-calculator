'use client'

import { useTranslation } from '@/lib/LanguageContext'

export function HomeHero() {
  const { t } = useTranslation()

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm text-center">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight">
        {t.heroTitle}
      </h1>
      <p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm text-slate-500 leading-relaxed">
        {t.heroSubtitle}
      </p>
    </div>
  )
}
