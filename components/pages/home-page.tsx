'use client'

import { BarChart3, Calculator, ChevronRight, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/goldcalc/page-header'
import { GoldPriceCard } from '@/components/goldcalc/gold-price-card'
import { NewsCard } from '@/components/goldcalc/news-card'
import { goldPrice, money, news, getGreeting, type NewsItem } from '@/lib/goldcalc-data'
import type { Page } from '@/components/goldcalc/sidebar-navigation'

interface HomePageProps {
  setPage: (p: Page) => void
  showNews: (n: NewsItem) => void
}

export function HomePage({ setPage, showNews }: HomePageProps) {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title={getGreeting()}
        description="Your gold market workspace for informed calculations and clear market context."
        action={
          <Badge variant="outline" className="w-fit gap-2 py-1.5 text-xs">
            <span className="size-1.5 rounded-full bg-positive" />
            Markets open · Live mock data
          </Badge>
        }
      />

      <div className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
        {/* Price + Range */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <GoldPriceCard />
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Today&apos;s range</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">High</span>
                <span className="font-medium">{money(goldPrice.high)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Low</span>
                <span className="font-medium">{money(goldPrice.low)}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-[72%] rounded-full bg-gold" />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>Open {money(goldPrice.open)}</span>
                <span>Close {money(goldPrice.close)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access + News */}
        <div className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick access</CardTitle>
              <CardDescription>Run a calculation in a few seconds.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <button
                onClick={() => setPage('gold')}
                className="flex items-center gap-3 rounded-md border p-4 text-left transition-colors hover:border-gold/40"
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-accent">
                  <Calculator className="size-4 text-gold" />
                </div>
                <div>
                  <div className="text-sm font-medium">Gold Calculator</div>
                  <div className="text-[11px] text-muted-foreground">Estimate physical gold value</div>
                </div>
                <ChevronRight className="ml-auto size-4 text-muted-foreground" />
              </button>

              <button
                onClick={() => setPage('pivot')}
                className="flex items-center gap-3 rounded-md border p-4 text-left transition-colors hover:border-gold/40"
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-accent">
                  <BarChart3 className="size-4 text-gold" />
                </div>
                <div>
                  <div className="text-sm font-medium">Pivot Point</div>
                  <div className="text-[11px] text-muted-foreground">Calculate classic levels</div>
                </div>
                <ChevronRight className="ml-auto size-4 text-muted-foreground" />
              </button>

              <button
                onClick={() => setPage('dashboard')}
                className="flex items-center gap-3 rounded-md border p-4 text-left transition-colors sm:col-span-2 hover:border-gold/40"
              >
                <div className="flex size-9 items-center justify-center rounded-md bg-accent">
                  <TrendingUp className="size-4 text-gold" />
                </div>
                <div>
                  <div className="text-sm font-medium">Executive Dashboard</div>
                  <div className="text-[11px] text-muted-foreground">
                    Market, technicals and fundamentals in one view
                  </div>
                </div>
                <ChevronRight className="ml-auto size-4 text-muted-foreground" />
              </button>
            </CardContent>
          </Card>

          {/* News Preview */}
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Fundamental news</CardTitle>
                <CardDescription>Context from the gold market.</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setPage('news')}>
                View all <ChevronRight data-icon="inline-end" />
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              {news.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  onClick={() => showNews(item)}
                  className="flex items-center gap-3 rounded-md p-3 text-left transition-colors hover:bg-muted"
                >
                  <div className="size-1.5 shrink-0 rounded-full bg-gold" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{item.title}</div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      {item.source} · {item.published}
                    </div>
                  </div>
                  <ChevronRight className="size-3.5 text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Footer note */}
        <div className="text-[11px] text-muted-foreground">
          Last updated {goldPrice.updated} · Mock market data for prototype validation
        </div>
      </div>
    </>
  )
}
