'use client'

import { Home, Banknote, TrendingUp, Newspaper, History, BarChart2 } from 'lucide-react'

export type Page = 'home' | 'gold' | 'pivot' | 'news' | 'market' | 'history' | 'dashboard'

const navItems = [
  { id: 'home' as Page, label: 'HOME', icon: Home },
  { id: 'gold' as Page, label: 'GOLD', icon: Banknote },
  { id: 'pivot' as Page, label: 'PIVOT', icon: TrendingUp },
  { id: 'news' as Page, label: 'NEWS', icon: Newspaper },
]

interface SidebarNavigationProps {
  page: Page
  setPage: (p: Page) => void
}

export function SidebarNavigation({ page, setPage }: SidebarNavigationProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <svg className="h-6 w-6 text-[#0292e3]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22h5.5l2.5-5h8l2.5 5H22L12 2zm0 6.5L14.7 14H9.3L12 8.5z" />
          </svg>
          <span className="text-[#0292e3] font-extrabold tracking-tight">Auva</span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <nav className="flex flex-col gap-1.5">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Main Navigation
          </p>
          {navItems.map((item) => {
            const isActive = item.id === page || (page === 'market' && item.id === 'home') || (page === 'dashboard' && item.id === 'home')
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-[#e6f4fe] text-[#0292e3]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-[#0292e3]' : 'text-slate-400'}`} />
                {item.label}
              </button>
            )
          })}

          <div className="my-3 border-t border-slate-100" />

          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Additional Views
          </p>
          <button
            onClick={() => setPage('history')}
            className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-xs font-bold tracking-wide transition-all ${
              page === 'history'
                ? 'bg-[#e6f4fe] text-[#0292e3]'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <History className="h-4 w-4 text-slate-400" />
            HISTORY
          </button>
        </nav>

        {/* Footer */}
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-center text-xs font-medium text-slate-500">
          Auva Gold Calculator v2.0
        </div>
      </div>
    </aside>
  )
}
