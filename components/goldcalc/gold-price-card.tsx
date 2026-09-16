'use client'

import { ArrowUpRight, CircleDollarSign } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ChartCard } from '@/components/goldcalc/chart-card'
import { goldPrice, marketSeries, money } from '@/lib/goldcalc-data'

export function GoldPriceCard() {
  return (
    <Card className="border-[#8f5b00]/30 bg-linear-to-br from-[#8f5b00] via-[#c98905] to-[#f0c040] text-white">
      <CardContent className="flex flex-col justify-between gap-6 p-6 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-sm text-primary-foreground/60">
            <CircleDollarSign className="size-4" />
            {goldPrice.symbol}
            <span className="size-1 rounded-full bg-primary-foreground/30" />
            Spot Gold
          </div>
          <div className="mt-4 text-4xl font-semibold tracking-tight">
            {money(goldPrice.price)}
          </div>
          <div className="mt-2 flex items-center gap-1 text-sm text-positive">
            <ArrowUpRight className="size-4" />
            +{goldPrice.change}% today
          </div>
        </div>
        <div className="w-full max-w-xs">
          <ChartCard
            series={marketSeries['1D']}
            height={100}
            minimal
          />
        </div>
      </CardContent>
    </Card>
  )
}
