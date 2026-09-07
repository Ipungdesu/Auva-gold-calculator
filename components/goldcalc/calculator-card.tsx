'use client'

import { useState } from 'react'
import { Calculator, Hourglass, TrendingUp } from 'lucide-react'
import { formatRupiah, type GoldHistory } from '@/lib/goldcalc-data'

interface CalculatorCardProps {
  addGold: (x: GoldHistory) => void
}

export function CalculatorCard({ addGold }: CalculatorCardProps) {
  const [capital, setCapital] = useState('100000000')
  const [buyingPrice, setBuyingPrice] = useState('1150000')
  const [sellingPrice, setSellingPrice] = useState('1180000')
  const [exchangeRate, setExchangeRate] = useState('15500')
  const [toz, setToz] = useState('31.103')

  const [result, setResult] = useState<{
    quantityGrams: number
    totalBuyingPrice: number
    totalSellingPrice: number
    spreadPerGram: number
    profit: number
    profitPercent: number
  } | null>({
    quantityGrams: 86.95,
    totalBuyingPrice: 99992500,
    totalSellingPrice: 102601000,
    spreadPerGram: 30000,
    profit: 2608500,
    profitPercent: 2.61,
  })

  function calculate() {
    const cap = parseFloat(capital) || 0
    const hb = parseFloat(buyingPrice) || 0
    const hj = parseFloat(sellingPrice) || 0

    if (cap <= 0 || hb <= 0 || hj <= 0) return

    const qty = cap / hb
    const totalBuy = qty * hb
    const totalSell = qty * hj
    const spread = hj - hb
    const profit = totalSell - totalBuy
    const profitPct = totalBuy > 0 ? (profit / totalBuy) * 100 : 0

    const res = {
      quantityGrams: Number(qty.toFixed(2)),
      totalBuyingPrice: Math.round(totalBuy),
      totalSellingPrice: Math.round(totalSell),
      spreadPerGram: Math.round(spread),
      profit: Math.round(profit),
      profitPercent: Number(profitPct.toFixed(2)),
    }

    setResult(res)

    addGold({
      id: crypto.randomUUID(),
      capital: cap,
      buyingPrice: hb,
      sellingPrice: hj,
      quantity: res.quantityGrams,
      profit: res.profit,
      date: new Date().toISOString(),
    })
  }

  function handleReset() {
    setCapital('100000000')
    setBuyingPrice('1150000')
    setSellingPrice('1180000')
    setExchangeRate('15500')
    setToz('31.103')
    calculate()
  }

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2">
      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Capital */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              CAPITAL
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-600">
                Rp
              </span>
              <input
                type="number"
                value={capital}
                onChange={(e) => setCapital(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-mono font-medium text-slate-900 focus:border-[#0292e3] focus:outline-none"
              />
            </div>
          </div>

          {/* Buying Price (HB) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              BUYING PRICE (HB)
            </label>
            <input
              type="number"
              value={buyingPrice}
              onChange={(e) => setBuyingPrice(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-mono font-medium text-slate-900 focus:border-[#0292e3] focus:outline-none"
            />
          </div>

          {/* Selling Price (HJ) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SELLING PRICE (HJ)
            </label>
            <input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-mono font-medium text-slate-900 focus:border-[#0292e3] focus:outline-none"
            />
          </div>

          {/* Exchange Rate */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              EXCHANGE RATE
            </label>
            <input
              type="number"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-mono font-medium text-slate-900 focus:border-[#0292e3] focus:outline-none"
            />
          </div>

          {/* TOZ */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              TOZ
            </label>
            <input
              type="number"
              step="0.001"
              value={toz}
              onChange={(e) => setToz(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-3 px-4 text-sm font-mono font-medium text-slate-900 focus:border-[#0292e3] focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="mt-2 grid grid-cols-[1fr_auto] gap-3">
            <button
              onClick={calculate}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#0292e3] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0282c4] active:scale-[0.99]"
            >
              <Calculator className="h-4 w-4" />
              <span>Calculate</span>
            </button>
            <button
              onClick={handleReset}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Output Cards */}
      {result && (
        <div className="flex flex-col gap-4">
          {/* Gold Quantity */}
          <div className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0292e3]">
                GOLD QUANTITY
              </span>
              <Hourglass className="h-5 w-5 text-[#0292e3]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {result.quantityGrams}
              </span>
              <span className="text-sm font-bold text-[#0292e3]">grams</span>
            </div>
          </div>

          {/* Total Buying Price */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL BUYING PRICE
            </span>
            <div className="mt-1 text-xl font-extrabold text-slate-900">
              {formatRupiah(result.totalBuyingPrice)}
            </div>
          </div>

          {/* Total Selling Price */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              TOTAL SELLING PRICE
            </span>
            <div className="mt-1 text-xl font-extrabold text-slate-900">
              {formatRupiah(result.totalSellingPrice)}
            </div>
          </div>

          {/* Price Difference (Spread) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              PRICE DIFFERENCE (SPREAD)
            </span>
            <div className="mt-1 flex items-baseline gap-1 text-xl font-extrabold text-[#0292e3]">
              <span>{formatRupiah(result.spreadPerGram)}</span>
              <span className="text-xs font-normal text-slate-500">/g</span>
            </div>
          </div>

          {/* Potential Profit */}
          <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 to-blue-100/40 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#241e52]">
                POTENTIAL PROFIT
              </span>
              <span className="rounded-lg bg-[#0292e3] px-2.5 py-1 text-[11px] font-bold text-white">
                +{result.profitPercent}%
              </span>
            </div>
            <div className="mt-3 flex items-center gap-2 text-2xl font-extrabold text-[#241e52]">
              <TrendingUp className="h-6 w-6 text-[#0292e3]" />
              <span>{formatRupiah(result.profit)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
