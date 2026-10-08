'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, X, Sparkles, ShieldCheck } from 'lucide-react'
import { LanguageSwitcher } from '@/components/home/LanguageSwitcher'

export interface AppHeaderProps {
  /** Optional link for back navigation button (e.g. on sub-pages) */
  backHref?: string
  /** Optional custom element on the right side of the navbar */
  rightElement?: React.ReactNode
  /** Optional extra classes */
  className?: string
}

export function AppHeader({ backHref, rightElement, className = '' }: AppHeaderProps) {
  const [showTrademarkModal, setShowTrademarkModal] = useState(false)

  return (
    <>
      <header
        className={`sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 sm:px-5 lg:px-8 backdrop-blur-md ${className}`}
      >
        {/* Left side: Back Button + Logo (nest-style) */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          {backHref && (
            <Link
              href={backHref}
              className="mr-0.5 flex h-8 w-8 items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}

          {/* Brand Logo — nest style: icon in bordered circle + navy text */}
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-90 shrink-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-white shadow-sm">
              <svg
                className="h-5 w-5 text-[#0292e3]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 22h5.5l2.5-5h8l2.5 5H22L12 2zm0 6.5L14.7 14H9.3L12 8.5z" />
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-[#14509b]">AUVA</span>
          </Link>
        </div>

        {/* Right side: LIVE badge + Language Switcher + optional rightElement + Trademark Badge */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* LIVE status pill */}
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold tracking-wide text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>LIVE</span>
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {rightElement && (
            <div className="flex items-center">{rightElement}</div>
          )}

          {/* Trademark Badge — Black & White — far right */}
          <button
            type="button"
            onClick={() => setShowTrademarkModal(true)}
            className="group relative h-9 w-9 overflow-hidden rounded-full border border-slate-900/30 bg-black shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95"
            title="AUVA Trademark: Low Profile | High Profit (Click to view)"
            aria-label="View AUVA trademark"
          >
            <img
              src="/trademark.jpg"
              alt="AUVA Trademark"
              className="h-full w-full object-cover filter grayscale contrast-125 brightness-95 transition-transform duration-300 group-hover:scale-110"
            />
          </button>
        </div>
      </header>

      {/* Trademark Detail Modal Dialog */}
      {showTrademarkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-sm sm:max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-linear-to-b from-[#18181b] to-[#09090b] text-white shadow-2xl animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowTrademarkModal(false)}
              className="absolute right-3.5 top-3.5 z-10 rounded-full bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center text-center">
              {/* Top Tag */}
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
                <span>Official Trademark &bull; AUVA</span>
              </div>

              {/* Artwork Container - Filtered to Black and White */}
              <div className="relative mb-5 w-48 h-48 sm:w-56 sm:h-56 overflow-hidden rounded-2xl border-2 border-white/20 bg-black shadow-inner">
                <img
                  src="/trademark.jpg"
                  alt="AUVA Trademark - Low profile | high profit"
                  className="h-full w-full object-cover filter grayscale contrast-125 brightness-95"
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
              </div>

              {/* Slogan & Philosophy */}
              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  Low Profile <span className="text-slate-500 font-light">|</span> High Profit
                  <span className="ml-1 text-xs align-super font-bold text-slate-400">™</span>
                </h3>
                <p className="text-xs uppercase tracking-widest text-slate-400 font-medium">
                  Believe &bull; What&apos;s coming your way is more beautiful than you think
                </p>
              </div>

              {/* Key Principles Pills */}
              <div className="mt-5 grid grid-cols-1 gap-2 w-full text-left">
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2">
                  <Sparkles className="h-4 w-4 text-slate-300 shrink-0" />
                  <span className="text-xs text-slate-200 font-medium">
                    Grow through what you go through.
                  </span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2">
                  <Sparkles className="h-4 w-4 text-slate-300 shrink-0" />
                  <span className="text-xs text-slate-200 font-medium">
                    Trust the process. Better days are ahead.
                  </span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2">
                  <Sparkles className="h-4 w-4 text-slate-300 shrink-0" />
                  <span className="text-xs text-slate-200 font-medium">
                    Focus on process. Trust your strategy. Let results speak.
                  </span>
                </div>
              </div>

              {/* Close Action */}
              <button
                type="button"
                onClick={() => setShowTrademarkModal(false)}
                className="mt-6 w-full rounded-xl bg-white py-2.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-slate-200 active:scale-[0.99]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

