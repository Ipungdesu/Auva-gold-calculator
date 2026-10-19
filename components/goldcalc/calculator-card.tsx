'use client'

import { useState } from 'react'
import { Calculator, Hourglass, TrendingUp, Trash2 } from 'lucide-react'
import { formatRupiah, type GoldHistory } from '@/lib/goldcalc-data'
import { useGoldHistory } from '@/components/providers/gold-history-provider'
import { useTranslation } from '@/lib/LanguageContext'

interface CalculatorCardProps {
  addGold: (x: GoldHistory) => void
  goldItems: GoldHistory[]
}

export function CalculatorCard({ addGold, goldItems }: CalculatorCardProps) {
  const { translate } = useTranslation()
  const {
    calculatorDraft,
    setCalculatorDraft,
    setGoldItems,
    loadGoldCalculation,
  } = useGoldHistory()
  const { capital, buyingPrice, sellingPrice, exchangeRate, toz, result } =
    calculatorDraft
  const [showHistory, setShowHistory] = useState(false)

  function calculate() {
    const cap = parseFloat(capital) || 0
    const hbUsd = parseFloat(buyingPrice) || 0
    const hjUsd = parseFloat(sellingPrice) || 0
    const rate = parseFloat(exchangeRate) || 0
    const ounce = parseFloat(toz) || 0

    if (
      cap <= 0 ||
      hbUsd <= 0 ||
      hjUsd <= 0 ||
      rate <= 0 ||
      ounce <= 0
    ) {
      return
    }

    // Convert USD/TOZ to IDR/gram
    const hb = (hbUsd * rate) / ounce
    const hj = (hjUsd * rate) / ounce

    // Calculate gold quantity based on buying price
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

    setCalculatorDraft((draft) => ({ ...draft, result: res }))

    addGold({
      id: crypto.randomUUID(),
      capital: cap,
      buyingPrice: hb,
      sellingPrice: hj,
      buyingPriceUsd: hbUsd,
      sellingPriceUsd: hjUsd,
      exchangeRate: rate,
      toz: ounce,
      quantity: res.quantityGrams,
      profit: res.profit,
      date: new Date().toISOString(),
    })
  }

  function updateInput(
    field: 'capital' | 'buyingPrice' | 'sellingPrice' | 'exchangeRate' | 'toz',
    value: string,
  ) {
    setCalculatorDraft((draft) => ({ ...draft, [field]: value }))
  }

  function handleReset() {
    setCalculatorDraft({
      capital: '',
      buyingPrice: '',
      sellingPrice: '',
      exchangeRate: '',
      toz: '',
      result: null,
    })
  }

  return (
    <div className="flex w-full flex-col gap-5">
      {/* ========================================================= */}
      {/* CALCULATOR FORM CARD */}
      {/* ========================================================= */}
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Capital */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {translate('CAPITAL')}
            </label>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                Rp
              </span>

              <input
                type="number"
                value={capital}
                placeholder="0"
                onChange={(e) => updateInput('capital', e.target.value)}
                className="h-[43px] w-full rounded-xl border border-slate-200 bg-slate-50/40 py-2.5 pl-10 pr-4 text-sm font-mono font-semibold text-slate-900 outline-none transition focus:border-[#0292e3] focus:ring-2 focus:ring-[#0292e3]/10"
              />
            </div>
          </div>

          {/* Buying and selling price */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">
                  {translate('BUYING PRICE (HB)')}
                </label>
                <input
                  type="number"
                  value={buyingPrice}
                  placeholder="0"
                  onChange={(e) => updateInput('buyingPrice', e.target.value)}
                  className="h-[43px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-mono font-semibold text-slate-900 outline-none transition focus:border-[#0292e3] focus:ring-2 focus:ring-[#0292e3]/10"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">
                  {translate('SELLING PRICE (HJ)')}
                </label>
                <input
                  type="number"
                  value={sellingPrice}
                  placeholder="0"
                  onChange={(e) => updateInput('sellingPrice', e.target.value)}
                  className="h-[43px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-mono font-semibold text-slate-900 outline-none transition focus:border-[#0292e3] focus:ring-2 focus:ring-[#0292e3]/10"
                />
              </div>
            </div>
          </div>

          {/* Exchange rate and TOZ */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">
                  {translate('EXCHANGE RATE')}
                </label>
                <input
                  type="number"
                  value={exchangeRate}
                  placeholder="0"
                  onChange={(e) => updateInput('exchangeRate', e.target.value)}
                  className="h-[43px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-mono font-semibold text-slate-900 outline-none transition focus:border-[#0292e3] focus:ring-2 focus:ring-[#0292e3]/10"
                />
              </div>
              <div className="flex min-w-0 flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-500">
                  TOZ
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={toz}
                  placeholder="0"
                  onChange={(e) => updateInput('toz', e.target.value)}
                  className="h-[43px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-mono font-semibold text-slate-900 outline-none transition focus:border-[#0292e3] focus:ring-2 focus:ring-[#0292e3]/10"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-1 grid grid-cols-[1fr_auto] gap-3">
            <button
              onClick={calculate}
              className="flex h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#291F6C] to-[#00A9E8] text-sm font-semibold text-white shadow-md shadow-[#291F6C]/10 transition hover:opacity-95 active:scale-[0.99]"
            >
              <Calculator className="h-4 w-4" />
              <span>{translate('Calculate')}</span>
            </button>

            <button
              onClick={handleReset}
              className="h-[42px] rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {translate('Reset')}
            </button>
          </div>

          {/* Calculation History */}
          <button
            type="button"
            onClick={() => setShowHistory(true)}
            className="flex w-fit items-center gap-1.5 text-xs font-medium text-[#0292e3] transition hover:opacity-80"
          >
            <span className="text-sm">◷</span>
            <span>{translate('Calculation History')}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUMMARY RESULTS */}
      {/* ========================================================= */}
      {result && (
        <div className="flex w-full flex-col gap-3">
          {/* Summary Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
              {translate('SUMMARY RESULTS')}
            </span>

            <span className="text-[10px] font-medium text-slate-400">
              {translate('Updated Just Now')}
            </span>


          </div>


          {/* Gold Quantity */}
          <div className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0292e3]">
                {translate('GOLD QUANTITY')}
              </span>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#00A9E8]/20 bg-[#00A9E8]/10">
                <Hourglass className="h-5 w-5 text-[#00A9E8]" />
              </div>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[26px] font-extrabold tracking-tight text-[#291F6C]">
                {result.quantityGrams}
              </span>
              <span className="text-sm font-bold text-[#0292e3]">{translate('grams')}</span>
            </div>
          </div>

          {/* Total Buying Price */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {translate('TOTAL BUYING PRICE')}
            </span>
            <div className="mt-1 text-xl font-extrabold text-slate-900">
              {formatRupiah(result.totalBuyingPrice)}
            </div>
          </div>

          {/* Total Selling Price */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {translate('TOTAL SELLING PRICE')}
            </span>
            <div className="mt-1 text-xl font-extrabold text-slate-900">
              {formatRupiah(result.totalSellingPrice)}
            </div>
          </div>

          {/* Price Difference (Spread) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {translate('PRICE DIFFERENCE (SPREAD)')}
            </span>
            <div className="mt-1 flex items-baseline gap-1 text-xl font-extrabold text-[#0292e3]">
              <span>{formatRupiah(result.spreadPerGram)}</span>
              <span className="text-xs font-normal text-slate-500">/g</span>
            </div>
          </div>

          {/* Potential Profit */}
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-cyan-50/60 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#241e52]">
                {translate('POTENTIAL PROFIT')}
              </span>

              <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white">
                +{result.profitPercent}%
              </span>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>

              <span className="text-[22px] font-extrabold tracking-tight text-[#291F6C]">
                {formatRupiah(result.profit)}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Calculation History Modal */}
{showHistory && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
    <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

      {/* Modal Header */}
      <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {translate('Calculation History')}
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            {translate('Physical Gold Calculator')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowHistory(false)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 space-y-3 overflow-y-auto p-5">
        {goldItems.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-slate-500">
              {translate('No calculation history yet.')}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {translate('Your calculations will appear here.')}
            </p>
          </div>
        ) : (
          goldItems.map((item) => {
            const profitPercent =
              item.capital > 0
                ? (item.profit / item.capital) * 100
                : 0

            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
              >
                {/* Capital */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {translate('CAPITAL')}
                  </span>

                  <span className="text-sm font-bold text-slate-900">
                    {formatRupiah(item.capital)}
                  </span>
                </div>

                {/* HB / HJ */}
                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-slate-500">
                    HB / HJ
                  </span>

                  <span className="text-right text-sm font-semibold text-slate-800">
                    {item.buyingPriceUsd !== undefined
                      ? `$${item.buyingPriceUsd.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : '—'}
                    {' / '}
                    {item.sellingPriceUsd !== undefined
                      ? `$${item.sellingPriceUsd.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : '—'}
                  </span>
                </div>

                {/* Gold Quantity */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {translate('GOLD QUANTITY')}
                  </span>

                  <span className="text-sm font-semibold text-slate-800">
                    {item.quantity.toFixed(2)} {translate('grams')}
                  </span>
                </div>

                {/* Potential Profit */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-xs font-medium text-slate-500">
                    {translate('POTENTIAL PROFIT')}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-600">
                      {formatRupiah(item.profit)}
                    </span>

                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-600">
                      +{profitPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      loadGoldCalculation(item)
                      setShowHistory(false)
                    }}
                    className="rounded-lg bg-[#0292e3] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#027dc2]"
                  >
                    {translate('Use this')}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setGoldItems((items) => items.filter((historyItem) => historyItem.id !== item.id))
                    }
                    aria-label={translate('Delete history item')}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  </div>
)}
    </div>
  )
}