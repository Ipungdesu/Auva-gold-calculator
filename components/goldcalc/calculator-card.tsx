'use client'

import { useState } from 'react'
import { Calculator, Gem } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CustomInput } from '@/components/goldcalc/custom-input'
import { CustomSelect } from '@/components/goldcalc/custom-select'
import { goldPrice, money, purityFactors, type GoldHistory } from '@/lib/goldcalc-data'

interface CalculatorCardProps {
  addGold: (x: GoldHistory) => void
}

export function CalculatorCard({ addGold }: CalculatorCardProps) {
  const [weight, setWeight] = useState('1')
  const [purity, setPurity] = useState('24K')
  const [price, setPrice] = useState(String(goldPrice.price))
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState('')

  function calc() {
    const w = Number(weight)
    const p = Number(price)
    if (!weight || !price || !Number.isFinite(w) || !Number.isFinite(p) || w <= 0 || p <= 0) {
      return setError('Enter positive numbers for weight and price.')
    }
    setError('')
    const value = w * p * purityFactors[purity]
    setResult(value)
    addGold({
      id: crypto.randomUUID(),
      weight: w,
      purity,
      price: p,
      result: value,
      date: new Date().toISOString(),
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle>Enter gold details</CardTitle>
          <CardDescription>All values are calculated locally in your browser.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <CustomInput
            label="Gold weight"
            type="number"
            min="0"
            step="0.01"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            suffix="grams"
          />

          <CustomSelect
            label="Gold purity"
            value={purity}
            onChange={(e) => setPurity(e.target.value)}
          >
            {Object.keys(purityFactors).map((k) => (
              <option key={k}>{k}</option>
            ))}
          </CustomSelect>

          <CustomInput
            label="Price per gram"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            suffix="USD"
          />

          <button
            type="button"
            onClick={() => setPrice(String(goldPrice.price))}
            className="-mt-2 self-start text-xs font-medium text-gold hover:underline"
          >
            Use current spot price · {money(goldPrice.price)}
          </button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={calc} className="h-10">
            HITUNG <Calculator data-icon="inline-end" />
          </Button>
        </CardContent>
      </Card>

      {/* Result Card */}
      <Card className={result ? 'border-gold/30 bg-accent/20' : ''}>
        <CardHeader>
          <CardTitle>Estimated value</CardTitle>
          <CardDescription>Your calculation result will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {result !== null ? (
            <div className="flex flex-col gap-5">
              <div className="text-3xl font-semibold tracking-tight text-gold">
                {money(result)}
              </div>
              <div className="flex flex-col gap-3 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium">{weight} g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Purity</span>
                  <span className="font-medium">{purity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price / gram</span>
                  <span className="font-medium">{money(Number(price))}</span>
                </div>
              </div>
              <div className="rounded-md bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
                Calculated as weight × price × purity factor ({purityFactors[purity].toFixed(4)}).
              </div>
            </div>
          ) : (
            <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Gem className="size-5 text-muted-foreground" />
              </div>
              <div className="text-sm font-medium">Ready when you are</div>
              <div className="max-w-xs text-xs leading-5 text-muted-foreground">
                Enter your gold details and select Hitung to estimate its current value.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
