import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon: React.ElementType
  title: string
  description: string
  className?: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, className, action }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[16rem] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center',
        className
      )}
    >
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" />
      </div>
      <div className="text-sm font-medium text-foreground">{title}</div>
      <div className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
        {description}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
