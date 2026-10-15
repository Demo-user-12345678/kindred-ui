'use client'

import { Search, Users, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Screen } from './kindred-app'

const items = [
  { key: 'discover', label: 'Discover', Icon: Search },
  { key: 'pairs', label: 'Pairs', Icon: Users },
  { key: 'schedule', label: 'Schedule', Icon: CalendarDays },
] as const

export function BottomNav({
  active,
  on_navigate,
}: {
  active: 'discover' | 'pairs' | 'schedule'
  on_navigate: (screen: Screen) => void
}) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 border-t border-border bg-card/90 px-6 pb-5 pt-2.5 backdrop-blur">
      <ul className="flex items-center justify-between">
        {items.map(({ key, label, Icon }) => {
          const is_active = key === active
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => on_navigate(key)}
                className={cn(
                  'flex flex-col items-center gap-1 text-[10px] font-medium transition-colors',
                  is_active ? 'text-primary' : 'text-muted-foreground',
                )}
                aria-current={is_active ? 'page' : undefined}
              >
                <span
                  className={cn(
                    'flex h-8 w-12 items-center justify-center rounded-full transition-colors',
                    is_active && 'bg-primary/12',
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
                </span>
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
