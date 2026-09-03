import { cn } from '@/lib/utils'

interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
}

export function CustomSelect({ label, className, id, children, ...props }: CustomSelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label htmlFor={selectId} className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
      {label}
      <select
        id={selectId}
        className={cn(
          'h-10 rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/30',
          className
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
