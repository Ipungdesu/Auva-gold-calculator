'use client'

import { Activity, Clock3, LayoutDashboard, Newspaper } from 'lucide-react'
import type { Page } from '@/components/goldcalc/sidebar-navigation'

const items = [
  { id: 'home' as Page, label: 'Home', icon: LayoutDashboard },
  { id: 'market' as Page, label: 'Market', icon: Activity },
  { id: 'news' as Page, label: 'News', icon: Newspaper },
  { id: 'history' as Page, label: 'History', icon: Clock3 },
]

interface BottomNavigationProps {
  page: Page
  setPage: (p: Page) => void
}

export function BottomNavigation({ page, setPage }: BottomNavigationProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-border bg-card/95 px-2 backdrop-blur-md lg:hidden">
      {items.map((item) => {
        const isActive = item.id === page
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`flex min-w-[4rem] flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] font-medium transition-colors ${
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <item.icon className={`size-5 ${isActive ? 'text-gold' : ''}`} />
            <span>{item.label}</span>
            {isActive && (
              <span className="absolute bottom-2.5 h-0.5 w-4 rounded-full bg-gold" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
