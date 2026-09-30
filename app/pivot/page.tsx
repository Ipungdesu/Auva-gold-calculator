import Link from 'next/link'
import { INSTRUMENTS } from '@/lib/instrument-config'
import { Home, Banknote, TrendingUp, Newspaper } from 'lucide-react'
import { AppHeader } from '@/components/goldcalc/app-header'

export const metadata = {
  title: 'Digital Pivot Point — AUVA',
  description:
    'Calculate Classic Pivot Point using historical data or manual OHLC input for Gold, Hangseng, and Nikkei.',
}

// ── Card icons (SVG) per instrument ─────────────────────────────────────────
const ICONS: Record<string, React.ReactNode> = {
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

export default function PivotLandingPage() {
  const instrumentEntries = Object.entries(INSTRUMENTS)

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 font-sans antialiased pb-24">
      {/* Header */}
      <AppHeader />

      {/* Main content */}
      <main className="mx-auto w-full max-w-md px-4 py-6 sm:max-w-xl">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Transaction Concept
          </h1>
          <p className="mt-1 text-sm text-slate-500 leading-relaxed">
            Konsep transaksi untuk mengetahui level harga objektif yang dihitung dari dari data harga tertinggi, terendah, dan penutupan periode sebelumnya
            untuk menentukan area support dan resistance.
          </p>
        </div>

        {/* Instrument cards — driven purely from INSTRUMENTS config */}
        <div className="flex flex-col gap-4">
          {instrumentEntries.map(([slug, config]) => (
            <div
              key={slug}
              className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${config.gradient} p-5 shadow-md`}
            >
              {/* Decorative circle */}
              <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -right-2 bottom-4 h-20 w-20 rounded-full bg-white/10" />

              {/* Icon */}
              <div className="mb-3">{ICONS[slug] ?? null}</div>

              {/* Label */}
              <h2 className="text-base font-extrabold uppercase tracking-wider text-white">
                {config.label}
              </h2>

              {/* Subtitle */}
              <p className="mt-1 text-xs text-white/80 leading-relaxed">
                {config.subtitle}
              </p>

              {/* CTA button */}
              <Link
                href={`/pivot/${slug}`}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black/20 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-black/30 active:scale-[0.98]"
              >
                Calculate →
              </Link>
            </div>
          ))}
        </div>
         {/* ⬇️ TARUH SWITCH DI SINI ⬇️ */}
        <div className="mt-6 rounded-xl bg-slate-200/70 p-1">
          <div className="grid grid-cols-2 gap-1">
            <Link
              href="/pivot"
              className="rounded-lg bg-white py-2.5 text-center text-xs font-bold tracking-wider text-[#0292e3] shadow-sm"
            >
              PIVOT POINT
            </Link>

            <Link
              href="/pivot/nest"
              className="rounded-lg py-2.5 text-center text-xs font-bold tracking-wider text-[#64748b]"
            >
              NEST
            </Link>
          </div>
        </div>
      </main>

      {/* Bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md">
        <Link
          href="/"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-slate-400 hover:text-slate-600"
        >
          <Home className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">HOME</span>
        </Link>
        <Link
          href="/gold"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-slate-400 hover:text-slate-600"
        >
          <Banknote className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">GOLD</span>
        </Link>
        <Link
          href="/pivot"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[#0292e3]"
        >
          <TrendingUp className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">PIVOT</span>
        </Link>
        <Link
          href="/news"
          className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-slate-400 hover:text-slate-600"
        >
          <Newspaper className="h-5 w-5" />
          <span className="text-[11px] font-bold tracking-wider">NEWS</span>
        </Link>
      </nav>
    </div>
  )
}
