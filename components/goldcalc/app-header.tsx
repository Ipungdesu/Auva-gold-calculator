'use client'

import React from 'react'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-white px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2.5">
        {/* Brand Logo - A Auva */}
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <svg
            className="h-6 w-6 text-[#0292e3]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2L2 22h5.5l2.5-5h8l2.5 5H22L12 2zm0 6.5L14.7 14H9.3L12 8.5z" />
          </svg>
          <span className="text-[#0292e3] font-extrabold tracking-tight">Auva</span>
        </div>
      </div>
    </header>
  )
}
