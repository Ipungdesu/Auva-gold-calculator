'use client'

import { PageHeader } from '@/components/goldcalc/page-header'
import { CalculatorCard } from '@/components/goldcalc/calculator-card'
import type { GoldHistory } from '@/lib/goldcalc-data'

interface GoldCalculatorPageProps {
  addGold: (x: GoldHistory) => void
}

export function GoldCalculatorPage({ addGold }: GoldCalculatorPageProps) {
  return (
    <>
      <PageHeader
        eyebrow="Tools / Gold Calculator"
        title="Physical gold calculator"
        description="Estimate the value of physical gold using weight, purity, and the current spot price."
      />
      <div className="p-5 sm:p-8 lg:p-10">
        <CalculatorCard addGold={addGold} />
      </div>
    </>
  )
}
