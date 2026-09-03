import { cn } from '@/lib/utils'

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  suffix?: string
  error?: string
}

export function CustomInput({ label, suffix, error, className, id, ...props }: CustomInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-')

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5 text-sm font-medium text-foreground">
      {label}
      <span className="relative">
        <input
          id={inputId}
          className={cn(
            'h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-gold focus:ring-1 focus:ring-gold/30',
            suffix && 'pr-14',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/30',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {suffix}
          </span>
        )}
      </span>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </label>
  )
}
