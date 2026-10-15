'use client'

import Link from 'next/link'
import { Home, Banknote, TrendingUp, Newspaper } from 'lucide-react'
import { INSTRUMENTS } from '@/lib/instrument-config'
import { AppHeader } from '@/components/goldcalc/app-header'
import { useTranslation } from '@/lib/LanguageContext'

const icons: Record<string, React.ReactNode> = {
  gold: (
    <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
      <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.25)" />
      <text x="20" y="26" textAnchor="middle" fontSize="18" fill="white" fontWeight="bold">
        ✦
      </text>
    </svg>
  ),
  hangseng: (
    <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
      <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.25)" />
      <text x="20" y="26" textAnchor="middle" fontSize="16" fill="white" fontWeight="bold">
        韓
      </text>
    </svg>
  ),
  nikkei: (
    <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
      <circle cx="20" cy="20" r="18" fill="rgba(255,255,255,0.25)" />
      <text x="20" y="26" textAnchor="middle" fontSize="13" fill="white" fontWeight="bold">
        225
      </text>
    </svg>
  ),
}

export function PivotLandingPage({ mode = 'pivot' }: { mode?: 'pivot' | 'nest' }) {
  const { translate } = useTranslation()
  const instrumentEntries = Object.entries(INSTRUMENTS)
  const intro = translate(
    mode === 'pivot' ? 'Pivot transaction concept' : 'NEST transaction concept',
  )

  return (
    <div className="min-h-screen bg-[#f4f7fb] pb-24 font-sans antialiased text-slate-900">
      <AppHeader />

      <main className="mx-auto w-full max-w-md px-4 py-6 sm:max-w-xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {translate('Transaction Concept')}
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">{intro}</p>
        </div>

        <div className="flex flex-col gap-4">
          {instrumentEntries.map(([slug, config]) => (
            <div
              key={slug}
              className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${config.gradient} p-5 shadow-md`}
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -right-2 bottom-4 h-20 w-20 rounded-full bg-white/10" />
              <div className="mb-3">{icons[slug] ?? null}</div>
              <h2 className="text-base font-extrabold uppercase tracking-wider text-white">
                {translate(config.label)}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-white/80">
                {translate(config.subtitle)}
              </p>
              <Link
                href={`/pivot/${mode === 'nest' ? 'nest/' : ''}${slug}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black/20 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-black/30 active:scale-[0.98]"
              >
                {translate('Calculate →')}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-slate-200/70 p-1">
          <div className="grid grid-cols-2 gap-1">
            <Link
              href="/pivot"
              className={`rounded-lg py-2.5 text-center text-xs font-bold tracking-wider ${
                mode === 'pivot'
                  ? 'bg-white text-[#0292e3] shadow-sm'
                  : 'text-[#64748b] hover:text-[#0292e3]'
              }`}
            >
              {translate('PIVOT POINT')}
            </Link>
            <Link
              href="/pivot/nest"
              className={`rounded-lg py-2.5 text-center text-xs font-bold tracking-wider ${
                mode === 'nest'
                  ? 'bg-white text-[#0292e3] shadow-sm'
                  : 'text-[#64748b]'
              }`}
            >
              NEST
            </Link>
          </div>
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md">
        {[
          { href: '/', label: 'HOME', icon: Home },
          { href: '/gold', label: 'GOLD', icon: Banknote },
          { href: '/pivot', label: 'PIVOT', icon: TrendingUp },
          { href: '/news', label: 'NEWS', icon: Newspaper },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 ${
              href === '/pivot' ? 'text-[#0292e3]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[11px] font-bold tracking-wider">{translate(label)}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
