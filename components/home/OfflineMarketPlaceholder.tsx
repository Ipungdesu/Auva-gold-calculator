'use client'

import { WifiOff } from 'lucide-react'
import { useTranslation } from '@/lib/LanguageContext'

export function OfflineMarketPlaceholder({
  message,
  className = '',
}: {
  message: string
  className?: string
}) {
  const { translate } = useTranslation()

  return (
    <div
      className={`flex h-full min-h-40 w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-2xl border border-slate-200 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-50 via-white to-slate-100 p-6 text-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm">
        <WifiOff className="h-7 w-7" aria-hidden="true" />
      </div>
      <p className="max-w-sm text-sm font-semibold text-slate-600">{translate(message)}</p>
    </div>
  )
}
