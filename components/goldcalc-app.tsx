'use client'

import { useEffect, useState } from 'react'
import { ChevronRight, Gem, PanelLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
    }
  })()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop Sidebar */}
      <SidebarNavigation page={page} setPage={setPage} />

      {/* Mobile Header */}
      <header className="sticky top-0 z-20 flex h-14 items-center border-b bg-card/95 px-4 backdrop-blur-md lg:hidden">
        <button className="mr-3" onClick={() => setPage('home')}>
          <PanelLeft className="size-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <div className="flex size-6 items-center justify-center rounded-md bg-gold text-gold-foreground">
            <Gem className="size-3.5" />
          </div>
          GoldCalc
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20 lg:ml-64 lg:pb-0">
        <div className="min-h-screen">{content}</div>
      </main>

      {/* Mobile Bottom Nav */}
      <BottomNavigation page={page} setPage={setPage} />

      {/* News Dialog (shared across all pages) */}
      <Dialog open={!!selectedNews} onOpenChange={(open) => !open && setSelectedNews(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="secondary">{selectedNews?.category}</Badge>
              <span className="text-xs text-muted-foreground">{selectedNews?.published}</span>
            </div>
            <DialogTitle className="text-lg leading-7">{selectedNews?.title}</DialogTitle>
            <DialogDescription>
              {selectedNews?.source} · Fundamental market coverage
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm leading-6 text-muted-foreground">{selectedNews?.summary}</p>
          <Button asChild className="w-fit">
            <a href="https://example.com" target="_blank" rel="noreferrer">
              Read Original News <ChevronRight data-icon="inline-end" />
            </a>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
