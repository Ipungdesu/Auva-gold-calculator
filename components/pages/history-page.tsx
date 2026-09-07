'use client'

import { useState } from 'react'
import { Clock3, Trash2 } from 'lucide-react'
import { formatRupiah, money, type GoldHistory, type PivotHistory } from '@/lib/goldcalc-data'

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

interface HistoryPageProps {
  goldItems: GoldHistory[]
  pivotItems: PivotHistory[]
  setGoldItems: React.Dispatch<React.SetStateAction<GoldHistory[]>>
  setPivotItems: React.Dispatch<React.SetStateAction<PivotHistory[]>>
}

export function HistoryPage({ goldItems, pivotItems, setGoldItems, setPivotItems }: HistoryPageProps) {
  const [tab, setTab] = useState<'gold' | 'pivot'>('gold')

  const remove = (id: string) =>
    tab === 'gold'
      ? setGoldItems((x) => x.filter((i) => i.id !== id))
      : setPivotItems((x) => x.filter((i) => i.id !== id))

  const clear = () => (tab === 'gold' ? setGoldItems([]) : setPivotItems([]))

  const items = tab === 'gold' ? goldItems : pivotItems

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-6 sm:max-w-xl sm:px-6 lg:max-w-4xl lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Calculation History
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Stored locally in your browser session.
          </p>
        </div>

        <button
          onClick={clear}
          disabled={!items.length}
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-rose-600 disabled:opacity-50 hover:bg-rose-50"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear all
        </button>
      </div>

      {/* Tab toggle */}
      <div className="flex w-fit rounded-xl border border-slate-200 bg-slate-100 p-1">
        <button
          onClick={() => setTab('gold')}
          className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
            tab === 'gold'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Gold calculator ({goldItems.length})
        </button>
        <button
          onClick={() => setTab('pivot')}
          className={`rounded-lg px-4 py-1.5 text-xs font-bold transition-all ${
            tab === 'pivot'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Pivot point ({pivotItems.length})
        </button>
      </div>

      {/* Items */}
      {items.length ? (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="text-sm font-bold text-slate-900">
                  {tab === 'gold'
                    ? `${(item as GoldHistory).quantity || 0} grams · Physical Gold`
                    : `${(item as PivotHistory).type} calculation`}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">
                  {new Date(item.date).toLocaleString()}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-extrabold text-[#0292e3]">
                    {tab === 'gold'
                      ? formatRupiah((item as GoldHistory).profit || 0)
                      : fmt((item as PivotHistory).result?.p || 0)}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {tab === 'gold' ? 'potential profit' : 'pivot point'}
                  </div>
                </div>
                <button
                  onClick={() => remove(item.id)}
                  aria-label="Delete history item"
                  className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400">
          <Clock3 className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          No history items stored yet.
        </div>
      )}
    </div>
  )
}
