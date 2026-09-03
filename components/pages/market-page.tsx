'use client'

import { useState } from 'react'
import { ChevronRight, CircleDollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/goldcalc/page-header'
import { KpiCard } from '@/components/goldcalc/kpi-card'
import { ChartCard } from '@/components/goldcalc/chart-card'
import { goldPrice, marketSeries, money } from '@/lib/goldcalc-data'
import type { Page } from '@/components/goldcalc/sidebar-navigation'

interface MarketPageProps {
  setPage: (p: Page) => void
}

export function MarketPage({ setPage }: MarketPageProps) {
  const [range, setRange] = useState<keyof typeof marketSeries>('1M')

  return (
    <>
      <PageHeader
        eyebrow="Market"
        title="Gold market"
        description="Track the XAUUSD spot market with clean, focused price context."
        action={
          <Button onClick={() => setPage('dashboard')} variant="outline">
            Open executive dashboard <ChevronRight data-icon="inline-end" />
          </Button>
        }
      />

      <div className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Current price"
            value={money(goldPrice.price)}
            change={`+${goldPrice.change}% today`}
            icon={CircleDollarSign}
          />
          <KpiCard label="Day high" value={money(goldPrice.high)} muted="Session high" />
          <KpiCard label="Day low" value={money(goldPrice.low)} muted="Session low" />
          <KpiCard label="Opening price" value={money(goldPrice.open)} muted="Session open" />
        </div>

        <Card>
          <CardHeader className="flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>XAUUSD price chart</CardTitle>
              <CardDescription>
                Mock historical series · Updated {goldPrice.updated}
              </CardDescription>
            </div>
            <div className="flex rounded-md border bg-muted p-0.5">
              {(Object.keys(marketSeries) as (keyof typeof marketSeries)[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setRange(k)}
                  className={`rounded-[3px] px-3 py-1.5 text-xs font-medium transition-colors ${
                    range === k
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <ChartCard series={marketSeries[range]} height={330} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
