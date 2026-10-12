'use client'

import { CalculatorCard } from '@/components/goldcalc/calculator-card'
import type { GoldHistory } from '@/lib/goldcalc-data'
import { useTranslation } from '@/lib/LanguageContext'

interface GoldCalculatorPageProps {
  addGold: (x: GoldHistory) => void
}

export function GoldCalculatorPage({ addGold }: GoldCalculatorPageProps) {
  const { translate } = useTranslation()

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-6 sm:max-w-xl sm:px-6 lg:max-w-4xl lg:px-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {translate('Physical Gold Calculator')}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-600 leading-relaxed">
          {translate('Calculate physical gold values and potential profit.')}
        </p>
      </div>

      <CalculatorCard addGold={addGold} />
    </div>
  )
}
