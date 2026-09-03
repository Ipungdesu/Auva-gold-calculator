'use client'

import { CircleDollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/goldcalc/page-header'
import { KpiCard } from '@/components/goldcalc/kpi-card'
import { ChartCard } from '@/components/goldcalc/chart-card'
import { NewsCard } from '@/components/goldcalc/news-card'
import { PivotLevelCard } from '@/components/goldcalc/pivot-level-card'
import { goldPrice, marketSeries, money, news, defaultPivot, type NewsItem } from '@/lib/goldcalc-data'

interface DashboardPageProps {
  showNews: (n: NewsItem) => void
}

export function DashboardPage({ showNews }: DashboardPageProps) {
  return (
    <>
      <PageHeader
        eyebrow="Executive view"
        title="Market intelligence"
        description="A concise view of the market, technical levels, and latest fundamental context."
      />

      <div className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Current price"
            value={money(goldPrice.price)}
            change={`+${goldPrice.change}%`}
            icon={CircleDollarSign}
          />
          <KpiCard label="Day high" value={money(goldPrice.high)} />
          <KpiCard label="Day low" value={money(goldPrice.low)} />
          <KpiCard
            label="Average price"
            value={money(
              (goldPrice.high + goldPrice.low + goldPrice.open + goldPrice.close) / 4
            )}
          />
        </div>

        {/* Chart + Technicals */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>Price trend</CardTitle>
              <CardDescription>90-day mock historical price</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartCard series={marketSeries['3M']} height={300} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical snapshot</CardTitle>
              <CardDescription>Classic daily pivot levels</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {(
                [
                  ['R3', defaultPivot.r3],
                  ['R2', defaultPivot.r2],
                  ['R1', defaultPivot.r1],
                  ['Pivot Point', defaultPivot.p],
                  ['S1', defaultPivot.s1],
                  ['S2', defaultPivot.s2],
                  ['S3', defaultPivot.s3],
                ] as [string, number][]
              ).map(([l, v]) => (
                <div
                  key={l}
                  className={`flex justify-between rounded-md px-3 py-2 text-sm ${
                    l === 'Pivot Point'
                      ? 'bg-accent font-semibold'
                      : 'bg-muted/40'
                  }`}
                >
                  <span>{l}</span>
                  <span>
                    {v.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* News */}
        <Card>
          <CardHeader>
            <CardTitle>Latest fundamental context</CardTitle>
            <CardDescription>
              Informational market coverage, without predictions or recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {news.slice(0, 3).map((item) => (
              <NewsCard key={item.id} item={item} onClick={() => showNews(item)} />
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
