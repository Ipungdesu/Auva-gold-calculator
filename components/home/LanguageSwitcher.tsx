'use client'

import { useTranslation } from '@/lib/LanguageContext'

export function LanguageSwitcher() {
  const { lang, setLang } = useTranslation()

  return (
    <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50/80 p-0.5">
      <button
        onClick={() => setLang('id')}
        className={`rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide transition-all ${
          lang === 'id'
            ? 'bg-[#14509b] text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
        aria-label="Bahasa Indonesia"
      >
        ID
      </button>
      <button
        onClick={() => setLang('en')}
        className={`rounded-md px-2.5 py-1 text-[11px] font-bold tracking-wide transition-all ${
          lang === 'en'
            ? 'bg-[#14509b] text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-700'
        }`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  )
}
