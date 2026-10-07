'use client'

import { HomeHero } from '@/components/home/HomeHero'
import { MarketIndicators } from '@/components/home/MarketIndicators'
import { HomeQuickTools } from '@/components/home/HomeQuickTools'
import { HomeLiveCharts } from '@/components/home/HomeLiveCharts'
import { HomeNewsSection } from '@/components/home/HomeNewsSection'
import type { Page } from '@/components/goldcalc/sidebar-navigation'
import type { NewsItem } from '@/lib/goldcalc-data'

interface HomePageProps {
  setPage?: (p: Page) => void
  showNews?: (n: NewsItem) => void
}

export function HomePage({}: HomePageProps = {}) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-5 px-3.5 py-4 sm:max-w-xl sm:gap-6 sm:px-6 lg:max-w-4xl lg:px-8">
      {/* 1. Hero Card */}
      <HomeHero />

      {/* 2. Real-time Market Indicators (XAU/USD and USD/IDR) */}
      <MarketIndicators />

      {/* 3. Quick Action Tools (Links to /gold, /pivot & /pivot/nest, /news) */}
      <HomeQuickTools />

      {/* 4. Real-time Live Market Charts (Tabbed TradingView Charts) */}
      <HomeLiveCharts />

      {/* 5. Fundamental News (Real data from Supabase, 2 latest articles, View all link) */}
      <HomeNewsSection />
    </div>
  )
}
