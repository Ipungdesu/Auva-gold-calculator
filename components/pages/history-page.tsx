'use client'

import { useState } from 'react'
import { Clock3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/goldcalc/page-header'
import { EmptyState } from '@/components/goldcalc/empty-state'
import { money, type GoldHistory, type PivotHistory } from '@/lib/goldcalc-data'

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
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Calculation history"
        description="Your recent calculations are stored locally in this browser for this prototype."
        action={
          <Button variant="outline" onClick={clear} disabled={!items.length}>
            <Trash2 data-icon="inline-start" />
            Clear all
          </Button>
        }
      />

      <div className="flex flex-col gap-6 p-5 sm:p-8 lg:p-10">
        {/* Tab toggle */}
        <div className="flex w-fit rounded-md border bg-muted p-0.5">
          <button
            onClick={() => setTab('gold')}
            className={`rounded-[3px] px-4 py-1.5 text-sm transition-colors ${
              tab === 'gold'
                ? 'bg-card font-medium text-foreground shadow-sm'
                : 'text-muted-foreground'
            }`}
          >
            Gold calculator ({goldItems.length})
          </button>
          <button
            onClick={() => setTab('pivot')}
            className={`rounded-[3px] px-4 py-1.5 text-sm transition-colors ${
              tab === 'pivot'
                ? 'bg-card font-medium text-foreground shadow-sm'
                : 'text-muted-foreground'
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
                className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="text-sm font-medium">
                    {tab === 'gold'
                      ? `${(item as GoldHistory).weight}g · ${(item as GoldHistory).purity}`
                      : `${(item as PivotHistory).type} calculation`}
                  </div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {new Date(item.date).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold text-gold">
                      {tab === 'gold'
                        ? money((item as GoldHistory).result)
                        : fmt((item as PivotHistory).result.p)}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {tab === 'gold' ? 'estimated value' : 'pivot point'}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(item.id)}
                    aria-label="Delete history item"
                    className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Clock3}
            title="No calculations yet"
            description="Completed calculations will appear here."
          />
        )}
      </div>
    </>
  )
}
