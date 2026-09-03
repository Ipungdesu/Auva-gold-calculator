'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PageHeader } from '@/components/goldcalc/page-header'
import { PivotLevelCard } from '@/components/goldcalc/pivot-level-card'
import { CustomInput } from '@/components/goldcalc/custom-input'
import { CustomSelect } from '@/components/goldcalc/custom-select'
import {
  calculatePivot,
  defaultPivot,
  mockOHLC,
  money,
  type PivotHistory,
} from '@/lib/goldcalc-data'

interface PivotCalculatorPageProps {
  addPivot: (x: PivotHistory) => void
}

export function PivotCalculatorPage({ addPivot }: PivotCalculatorPageProps) {
  const [tab, setTab] = useState<'auto' | 'manual'>('auto')
  const [vals, setVals] = useState({ ...mockOHLC })
  const [result, setResult] = useState(defaultPivot)
  const [error, setError] = useState('')

  const update = (k: keyof typeof vals, v: string) =>
    setVals((x) => ({ ...x, [k]: Number(v) }))

  function calc() {
    const { open, high, low, close } = vals
    if ([open, high, low, close].some((v) => !Number.isFinite(v) || v <= 0)) {
      return setError('Enter positive values for every OHLC field.')
    }
    if (high < low) return setError('High must be greater than or equal to Low.')
    if (open > high || open < low || close > high || close < low) {
      return setError('Open and Close must fall between High and Low.')
    }
    setError('')
    const r = calculatePivot(open, high, low, close)
    setResult(r)
    addPivot({
      id: crypto.randomUUID(),
      type: tab === 'auto' ? 'Automatic' : 'Manual',
      ohlc: { open, high, low, close },
      result: r,
      date: new Date().toISOString(),
    })
  }

  return (
    <>
      <PageHeader
        eyebrow="Tools / Technicals"
        title="Classic pivot point"
        description="Calculate support and resistance levels from historical or manually entered OHLC data."
      />

      <div className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
        {/* Tab toggle */}
        <div className="flex w-fit rounded-md border bg-muted p-0.5">
          <button
            onClick={() => setTab('auto')}
            className={`rounded-[3px] px-4 py-1.5 text-sm transition-colors ${
              tab === 'auto'
                ? 'bg-card font-medium text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            Automatic calculation
          </button>
          <button
            onClick={() => setTab('manual')}
            className={`rounded-[3px] px-4 py-1.5 text-sm transition-colors ${
              tab === 'manual'
                ? 'bg-card font-medium text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            Manual calculation
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle>
                {tab === 'auto' ? 'Historical OHLC' : 'Manual OHLC input'}
              </CardTitle>
              <CardDescription>
                {tab === 'auto'
                  ? 'Mock historical values for XAUUSD · Daily · 27 Aug 2026'
                  : 'Enter valid open, high, low, and close values.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {tab === 'auto' ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <CustomSelect label="Instrument">
                    <option>XAUUSD</option>
                  </CustomSelect>
                  <CustomSelect label="Timeframe">
                    <option>Daily</option>
                    <option>4 Hours</option>
                  </CustomSelect>
                  <CustomInput
                    label="Date"
                    type="date"
                    defaultValue="2026-08-27"
                  />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {(['open', 'high', 'low', 'close'] as const).map((k) => (
                    <CustomInput
                      key={k}
                      label={k.charAt(0).toUpperCase() + k.slice(1)}
                      type="number"
                      value={vals[k]}
                      onChange={(e) => update(k, e.target.value)}
                    />
                  ))}
                </div>
              )}

              {tab === 'auto' && (
                <div className="grid gap-3 sm:grid-cols-4">
                  {(['open', 'high', 'low', 'close'] as const).map((k) => (
                    <div key={k} className="rounded-md bg-muted p-3">
                      <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {k}
                      </div>
                      <div className="mt-1 text-sm font-semibold">{money(vals[k])}</div>
                    </div>
                  ))}
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button onClick={calc} className="h-10">
                {tab === 'auto' ? 'GET MOCK DATA & CALCULATE' : 'CALCULATE'}
                <ArrowUpRight data-icon="inline-end" />
              </Button>
            </CardContent>
          </Card>

          {/* Result Card */}
          <Card>
            <CardHeader>
              <CardTitle>Pivot levels</CardTitle>
              <CardDescription>Classic formula · values in USD</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <PivotLevelCard result={result} />
              <div className="rounded-md bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
                <strong className="text-foreground">R4 / S4:</strong> Formula pending
                confirmation and intentionally not included in this MVP.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
