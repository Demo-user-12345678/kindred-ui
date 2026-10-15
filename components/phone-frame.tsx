import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative mx-auto w-[340px] shrink-0 rounded-[2.75rem] border border-foreground/10 bg-foreground/90 p-2 shadow-2xl shadow-foreground/20',
        className,
      )}
    >
      {/* screen */}
      <div className="relative h-[720px] w-full overflow-hidden rounded-[2.25rem] bg-background">
        {/* notch */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-foreground/90" />
        {children}
      </div>
    </div>
  )
}

export function StatusBar({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between px-5 pt-3.5 text-[11px] font-medium text-foreground/70">
      <span>9:41</span>
      <span className="font-display text-xs tracking-tight text-foreground">{title}</span>
      <span className="flex items-center gap-1">
        <span className="inline-block h-2.5 w-4 rounded-[3px] border border-foreground/50" />
      </span>
    </div>
  )
}
