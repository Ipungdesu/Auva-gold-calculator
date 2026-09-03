'use client'

import { useState } from 'react'
import { Radio, Newspaper, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/goldcalc/page-header'
import { NewsCard } from '@/components/goldcalc/news-card'
import { TradingViewNewsWidget } from '@/components/goldcalc/tradingview-news-widget'
import { news, categories, type NewsItem } from '@/lib/goldcalc-data'

interface NewsPageProps {
  showNews: (n: NewsItem) => void
}

const symbols = [
  { id: 'OANDA:XAUUSD', label: 'Spot Gold (XAUUSD)' },
  { id: 'COMEX:GC1!', label: 'Gold Futures (GC1!)' },
  { id: 'TVC:GOLD', label: 'Global Gold Index' },
  { id: 'CAPITALCOM:DXY', label: 'US Dollar Index (DXY)' },
]

export function NewsPage({ showNews }: NewsPageProps) {
  const [viewMode, setViewMode] = useState<'live' | 'curated'>('live')
  const [selectedSymbol, setSelectedSymbol] = useState('OANDA:XAUUSD')
  const [category, setCategory] = useState('All')

  const filtered = category === 'All' ? news : news.filter((n) => n.category === category)

  return (
    <>
      <PageHeader
        eyebrow="Market Intelligence"
        title="Fundamental News & Real-Time Feed"
        description="Stay informed with real-time live market news directly from TradingView alongside curated macroeconomic context."
        action={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 py-1.5 text-xs text-positive">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positive opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-positive" />
              </span>
              Live Feed Active
            </Badge>
          </div>
        }
      />

      <div className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
        {/* View mode toggle */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-fit rounded-md border bg-muted p-0.5">
            <button
              onClick={() => setViewMode('live')}
              className={`flex items-center gap-2 rounded-[3px] px-4 py-1.5 text-sm transition-colors ${
                viewMode === 'live'
                  ? 'bg-card font-medium text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Radio className="size-3.5 text-positive" />
              Live TradingView Stream
            </button>
            <button
              onClick={() => setViewMode('curated')}
              className={`flex items-center gap-2 rounded-[3px] px-4 py-1.5 text-sm transition-colors ${
                viewMode === 'curated'
                  ? 'bg-card font-medium text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Newspaper className="size-3.5 text-gold" />
              Curated Summaries ({news.length})
            </button>
          </div>

          {viewMode === 'live' && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-medium text-muted-foreground">Symbol:</span>
              {symbols.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSymbol(s.id)}
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    selectedSymbol === s.id
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:border-gold/40 hover:text-foreground'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Live TradingView Section */}
        {viewMode === 'live' ? (
          <div className="flex flex-col gap-4">
            <TradingViewNewsWidget symbol={selectedSymbol} height={700} />
          </div>
        ) : (
          /* Curated News Grid */
          <div className="flex flex-col gap-6">
            {/* Category filter */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                    category === c
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-card text-muted-foreground hover:border-gold/40 hover:text-foreground'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {filtered.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((item) => (
                  <NewsCard key={item.id} item={item} onClick={() => showNews(item)} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">
                No stories in this category.
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
