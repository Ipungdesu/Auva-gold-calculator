import { ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { NewsItem } from '@/lib/goldcalc-data'

interface NewsCardProps {
  item: NewsItem
  onClick: () => void
}

export function NewsCard({ item, onClick }: NewsCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col gap-3 rounded-lg border bg-card p-4 text-left transition-colors hover:border-gold/40 hover:shadow-sm"
    >
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="font-normal">
          {item.category}
        </Badge>
        <span className="text-[11px] text-muted-foreground">{item.published}</span>
      </div>
      <div className="text-sm font-medium leading-5 text-foreground group-hover:text-primary">
        {item.title}
      </div>
      <div className="line-clamp-2 text-[13px] leading-5 text-muted-foreground">
        {item.summary}
      </div>
      <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
        <span>{item.source}</span>
        <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  )
}
