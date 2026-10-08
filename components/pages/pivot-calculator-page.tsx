'use client'

import Link from 'next/link'
import { INSTRUMENTS } from '@/lib/instrument-config'
import { type PivotHistory } from '@/lib/goldcalc-data'

interface PivotCalculatorPageProps {
  addPivot?: (x: PivotHistory) => void
}

const ICONS: Record<string, React.ReactNode> = {
  gold: (
    <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="rgba(255,255,255,0.25)"
      />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontSize="18"
        fill="white"
        fontWeight="bold"
      >
        ✦
      </text>
    </svg>
  ),

  hangseng: (
    <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="rgba(255,255,255,0.25)"
      />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontSize="16"
        fill="white"
        fontWeight="bold"
      >
        韓
      </text>
    </svg>
  ),

  nikkei: (
    <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none">
      <circle
        cx="20"
        cy="20"
        r="18"
        fill="rgba(255,255,255,0.25)"
      />
      <text
        x="20"
        y="26"
        textAnchor="middle"
        fontSize="13"
        fill="white"
        fontWeight="bold"
      >
        225
      </text>
    </svg>
  ),
}

export function PivotCalculatorPage({
  addPivot,
}: PivotCalculatorPageProps) {
  const instrumentEntries = Object.entries(INSTRUMENTS)

  return (
    <div className="mx-auto min-h-screen w-full max-w-md px-4 py-6 pb-24 sm:max-w-xl">

      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Transaction Concept
        </h1>

        <p className="mt-1 text-sm leading-relaxed text-slate-500">
          Konsep transaksi untuk mengetahui level harga objektif
          yang dihitung dari data harga tertinggi, terendah, dan
          penutupan periode sebelumnya untuk menentukan area
          support dan resistance.
        </p>
      </div>

      {/* Instrument cards */}
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
            <div className="mb-3">
              {ICONS[slug] ?? null}
            </div>

            {/* Label */}
            <h2 className="text-base font-extrabold uppercase tracking-wider text-white">
              {config.label}
            </h2>

            {/* Subtitle */}
            <p className="mt-1 text-xs leading-relaxed text-white/80">
              {config.subtitle}
            </p>

            {/* Calculate */}
            <Link
              href={`/pivot/${slug}`}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-black/20 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-black/30 active:scale-[0.98]"
            >
              Calculate →
            </Link>
          </div>
        ))}
      </div>

      {/* Pivot / NEST switch */}
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

    </div>
  )
}