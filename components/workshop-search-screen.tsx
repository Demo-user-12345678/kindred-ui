'use client'

import { useMemo, useState } from 'react'
import { Search, MapPin, Clock, Users, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react'
import { StatusBar } from './phone-frame'
import { BottomNav } from './bottom-nav'
import { workshops, medium_color, type Workshop } from '@/lib/mock-data'
import type { Screen } from './kindred-app'
import { cn } from '@/lib/utils'

const mediums = ['All', 'Watercolor', 'Ceramics', 'Linocut', 'Life Drawing']

const fallback_badge = 'bg-primary text-primary-foreground'

export function WorkshopSearchScreen({
  on_find_pair,
  on_attend_solo,
  on_navigate,
}: {
  on_find_pair: (w: Workshop) => void
  on_attend_solo: (w: Workshop) => void
  on_navigate: (screen: Screen) => void
}) {
  const [query, set_query] = useState('')
  const [medium, set_medium] = useState('All')

  const results = useMemo(() => {
    return workshops.filter((w) => {
      const matches_medium = medium === 'All' || w.medium === medium
      const q = query.trim().toLowerCase()
      const matches_query =
        !q ||
        w.title.toLowerCase().includes(q) ||
        w.neighborhood.toLowerCase().includes(q) ||
        w.medium.toLowerCase().includes(q)
      return matches_medium && matches_query
    })
  }, [query, medium])

  return (
    <div className="flex h-full flex-col">
      <StatusBar title="Discover" />

      <header className="px-5 pb-3 pt-4">
        <p className="text-xs font-medium text-muted-foreground">Mission District, SF</p>
        <h1 className="mt-0.5 font-display text-2xl font-semibold leading-tight text-foreground text-balance">
          Find a workshop near you
        </h1>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => set_query(e.target.value)}
              placeholder="Search medium or area"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              aria-label="Search workshops"
            />
          </div>
          <button
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-label="Filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* medium chips */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {mediums.map((m) => {
          const color = medium_color[m]
          return (
            <button
              key={m}
              onClick={() => set_medium(m)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                medium === m
                  ? 'border-transparent bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground',
              )}
            >
              {m !== 'All' && color && (
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    medium === m ? 'bg-primary-foreground' : color.chip.split(' ')[0].replace('/15', '').replace('/18', '').replace('/20', ''),
                  )}
                  aria-hidden
                />
              )}
              {m}
            </button>
          )
        })}
      </div>

      {/* results */}
      <div className="flex-1 space-y-3 overflow-y-auto px-5 pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <p className="text-xs font-medium text-muted-foreground">
          {results.length} workshop{results.length === 1 ? '' : 's'} this week
        </p>

        {results.map((w) => (
          <article
            key={w.id}
            className="rounded-2xl border border-border bg-card p-4 shadow-sm shadow-foreground/[0.03]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className={cn(
                    'inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                    medium_color[w.medium]?.solid ?? fallback_badge,
                  )}
                >
                  {w.medium}
                </span>
                <h2 className="mt-2 font-display text-base font-semibold leading-snug text-foreground text-pretty">
                  {w.title}
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">{w.host}</p>
              </div>
              <span className="font-display text-sm font-semibold text-foreground">{w.price}</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--chart-3)]/15 text-[var(--chart-3)]">
                  <MapPin className="h-3 w-3" />
                </span>
                {w.neighborhood} · {w.distance}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--chart-1)]/15 text-[var(--chart-1)]">
                  <Clock className="h-3 w-3" />
                </span>
                {w.date}, {w.time}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--chart-5)]/20 text-[var(--chart-5)]">
                  <Users className="h-3 w-3" />
                </span>
                {w.spotsLeft} of {w.spots} spots left
              </span>
            </div>

            <div className="mt-3.5 flex gap-2">
              <button
                onClick={() => on_find_pair(w)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
              >
                <ShieldCheck className="h-4 w-4" />
                Find a pair
              </button>
              <button
                onClick={() => on_attend_solo(w)}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border bg-card py-2.5 text-sm font-semibold text-foreground"
              >
                <UserRound className="h-4 w-4" />
                Attend solo
              </button>
            </div>
          </article>
        ))}

        {results.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <p className="text-sm text-muted-foreground">No workshops match that search.</p>
          </div>
        )}
      </div>

      <BottomNav active="discover" on_navigate={on_navigate} />
    </div>
  )
}
