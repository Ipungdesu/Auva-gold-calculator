'use client'

import {
  Activity,
  BarChart3,
  Calculator,
  Clock3,
  Gem,
  LayoutDashboard,
  Newspaper,
  Settings2,
  TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export type Page = 'home' | 'market' | 'news' | 'history' | 'gold' | 'pivot' | 'dashboard'

const mainNav = [
  { id: 'home' as Page, label: 'Home', icon: LayoutDashboard },
  { id: 'market' as Page, label: 'Market', icon: Activity },
  { id: 'news' as Page, label: 'News', icon: Newspaper },
  { id: 'history' as Page, label: 'History', icon: Clock3 },
]

const toolNav = [
  { id: 'gold' as Page, label: 'Gold Calculator', icon: Calculator },
  { id: 'pivot' as Page, label: 'Pivot Point', icon: BarChart3 },
  { id: 'dashboard' as Page, label: 'Executive Dashboard', icon: TrendingUp },
]

interface SidebarNavigationProps {
  page: Page
  setPage: (p: Page) => void
}

export function SidebarNavigation({ page, setPage }: SidebarNavigationProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gold text-gold-foreground">
          <Gem className="size-4" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight text-sidebar-foreground">
            GoldCalc
          </div>
          <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-sidebar-foreground/50">
            Market Intelligence
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col gap-8 px-3 py-6">
        {/* Workspace */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/40">
            Workspace
          </p>
          <nav className="flex flex-col gap-0.5">
            {mainNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  page === item.id
                    ? 'bg-gold/15 font-medium text-gold'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground'
                }`}
              >
                <item.icon className="size-[17px]" />
                {item.label}
                {item.id === 'news' && (
                  <Badge className="ml-auto h-4 bg-gold/20 px-1.5 text-[10px] text-gold">
                    6
                  </Badge>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tools */}
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-sidebar-foreground/40">
            Tools
          </p>
          <nav className="flex flex-col gap-0.5">
            {toolNav.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                  page === item.id
                    ? 'bg-gold/15 font-medium text-gold'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-foreground/5 hover:text-sidebar-foreground'
                }`}
              >
                <item.icon className="size-[17px]" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-7 items-center justify-center rounded-full bg-sidebar-foreground/10 text-[10px] font-semibold text-sidebar-foreground/70">
            M
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium text-sidebar-foreground/80">
              MVP Workspace
            </div>
            <div className="text-[10px] text-sidebar-foreground/40">Local session</div>
          </div>
          <Settings2 className="size-3.5 text-sidebar-foreground/30" />
        </div>
      </div>
    </aside>
  )
}
