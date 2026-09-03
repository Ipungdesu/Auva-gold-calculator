import { cn } from '@/lib/utils'
import { money } from '@/lib/goldcalc-data'
import type { PivotResult } from '@/lib/goldcalc-data'

interface PivotLevelCardProps {
  result: PivotResult
  className?: string
}

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function PivotLevelCard({ result, className }: PivotLevelCardProps) {
  const levels: [string, number, 'resistance' | 'pivot' | 'support'][] = [
    ['R3', result.r3, 'resistance'],
    ['R2', result.r2, 'resistance'],
    ['R1', result.r1, 'resistance'],
    ['Pivot Point', result.p, 'pivot'],
    ['S1', result.s1, 'support'],
    ['S2', result.s2, 'support'],
    ['S3', result.s3, 'support'],
  ]

  return (
    <div className={cn('grid grid-cols-2 gap-2 sm:grid-cols-4', className)}>
      {levels.map(([label, value, type]) => (
        <div
          key={label}
          className={cn(
            'rounded-md border p-3',
            type === 'pivot' && 'border-gold/30 bg-accent/50 sm:col-span-2',
            type === 'resistance' && 'bg-card',
            type === 'support' && 'bg-card'
          )}
        >
          <div
            className={cn(
              'text-[11px] font-medium uppercase tracking-wide',
              type === 'pivot' ? 'text-gold' : 'text-muted-foreground'
            )}
          >
            {label}
          </div>
          <div className="mt-1 text-lg font-semibold text-foreground">{fmt(value)}</div>
        </div>
      ))}
    </div>
  )
}
