'use client'

import { Home, Banknote, TrendingUp, Newspaper } from 'lucide-react'
import type { Page } from '@/components/goldcalc/sidebar-navigation'

const items = [
  { id: 'home' as Page, label: 'HOME', icon: Home },
  { id: 'gold' as Page, label: 'GOLD', icon: Banknote },
  { id: 'pivot' as Page, label: 'PIVOT', icon: TrendingUp },
  { id: 'news' as Page, label: 'NEWS', icon: Newspaper },
]

interface BottomNavigationProps {
  page: Page
  setPage: (p: Page) => void
}

export function BottomNavigation({ page, setPage }: BottomNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md">
      {items.map((item) => {
        const isActive = item.id === page
        const Icon = item.icon

        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 transition-colors ${
              isActive ? 'text-[#0292e3]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className={`h-5 w-5 ${isActive ? 'text-[#0292e3]' : 'text-slate-400'}`} />
            <span className={`text-[11px] font-bold tracking-wider ${isActive ? 'text-[#0292e3]' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
