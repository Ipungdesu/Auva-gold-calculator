import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface KpiCardProps {
  label: string
  value: string
  change?: string
  changeDirection?: 'up' | 'down'
  icon?: React.ElementType
  muted?: string
}

export function KpiCard({ label, value, change, changeDirection = 'up', icon: Icon, muted }: KpiCardProps) {
  const isPositive = changeDirection === 'up'

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          {Icon && (
            <div className="flex size-8 items-center justify-center rounded-md bg-accent">
              <Icon className="size-4 text-gold" />
            </div>
          )}
        </div>
        <div className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
          {value}
        </div>
        {change && (
          <div
            className={`mt-1.5 flex items-center gap-1 text-xs font-medium ${
              isPositive ? 'text-positive' : 'text-negative'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="size-3" />
            ) : (
              <ArrowDownRight className="size-3" />
            )}
            {change}
          </div>
        )}
        {muted && (
          <div className="mt-1.5 text-xs text-muted-foreground">{muted}</div>
        )}
      </CardContent>
    </Card>
  )
}
