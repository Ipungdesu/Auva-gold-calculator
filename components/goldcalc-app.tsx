'use client'

import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { AppHeader } from '@/components/goldcalc/app-header'
import { SidebarNavigation, type Page } from '@/components/goldcalc/sidebar-navigation'
import { BottomNavigation } from '@/components/goldcalc/bottom-navigation'
import { HomePage } from '@/components/pages/home-page'
import { MarketPage } from '@/components/pages/market-page'
import { NewsPage } from '@/components/pages/news-page'
import { HistoryPage } from '@/components/pages/history-page'
import { GoldCalculatorPage } from '@/components/pages/gold-calculator-page'
import { PivotCalculatorPage } from '@/components/pages/pivot-calculator-page'
import { DashboardPage } from '@/components/pages/dashboard-page'
import type { NewsItem, GoldHistory, PivotHistory } from '@/lib/goldcalc-data'

export default function GoldCalcApp() {
  const [page, setPage] = useState<Page>('home')
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null)
  const [goldItems, setGoldItems] = useState<GoldHistory[]>([])
  const [pivotItems, setPivotItems] = useState<PivotHistory[]>([])

  // Hydrate from localStorage
  useEffect(() => {
    try {
      setGoldItems(JSON.parse(localStorage.getItem('goldcalc-gold') || '[]'))
      setPivotItems(JSON.parse(localStorage.getItem('goldcalc-pivot') || '[]'))
    } catch {}
  }, [])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('goldcalc-gold', JSON.stringify(goldItems))
  }, [goldItems])

  useEffect(() => {
    localStorage.setItem('goldcalc-pivot', JSON.stringify(pivotItems))
  }, [pivotItems])

  const addGold = (x: GoldHistory) => setGoldItems((i) => [x, ...i])
  const addPivot = (x: PivotHistory) => setPivotItems((i) => [x, ...i])

  // Page router
  const content = (() => {
    switch (page) {
      case 'home':
        return <HomePage setPage={setPage} showNews={setSelectedNews} />
      case 'gold':
        return <GoldCalculatorPage addGold={addGold} />
      case 'pivot':
        return <PivotCalculatorPage addPivot={addPivot} />
      case 'market':
        return <MarketPage setPage={setPage} />
      case 'dashboard':
        return <DashboardPage showNews={setSelectedNews} />
      case 'news':
        return <NewsPage showNews={setSelectedNews} />
      case 'history':
        return (
          <HistoryPage
            goldItems={goldItems}
            pivotItems={pivotItems}
            setGoldItems={setGoldItems}
            setPivotItems={setPivotItems}
          />
        )
      default:
        return <HomePage setPage={setPage} showNews={setSelectedNews} />
    }
  })()

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-900 font-sans antialiased">
      {/* Desktop Sidebar Navigation */}
      <SidebarNavigation page={page} setPage={setPage} />

      {/* Global Header */}
      <div className="lg:pl-64">
        <AppHeader />

        {/* Main Content Area */}
        <main className="min-h-[calc(100vh-4rem)] pb-24 lg:pb-12">
          {content}
        </main>
      </div>

      {/* Mobile Persistent Bottom Navigation */}
      <BottomNavigation page={page} setPage={setPage} />

      {/* News Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
            {selectedNews.image && (
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="flex flex-col gap-3 p-6 overflow-y-auto">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>{selectedNews.source}</span>
                <span>{selectedNews.published}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">{selectedNews.title}</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedNews.summary}
              </p>
              <div className="mt-4 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setSelectedNews(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>
                <a
                  href={selectedNews.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 rounded-xl bg-[#241e52] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1a153e]"
                >
                  Read Full Article <ChevronRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
