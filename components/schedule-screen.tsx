'use client'

import { useState } from 'react'
import { MapPin, Check, CalendarCheck, UserRound, ChevronLeft } from 'lucide-react'
import { StatusBar } from './phone-frame'
import { BottomNav } from './bottom-nav'
import { AnonAvatar } from './anon-avatar'
import { calendar_days, schedule_slots, current_user } from '@/lib/mock-data'
import type { Booking, Screen } from './kindred-app'
import { cn } from '@/lib/utils'

export function ScheduleScreen({
  booking,
  on_confirm,
  on_navigate,
}: {
  booking: Booking
  on_confirm: (date: string, time: string) => void
  on_navigate: (screen: Screen) => void
}) {
  const default_day = calendar_days.find((d) => d.recommended) ?? calendar_days.find((d) => d.available)!
  const [day_id, set_day_id] = useState(default_day.id)
  const [slot_id, set_slot_id] = useState(schedule_slots[0].id)

  const day = calendar_days.find((d) => d.id === day_id)!
  const slot = schedule_slots.find((s) => s.id === slot_id)!
  const date_label = `${day.dow}, ${day.month} ${day.day}`

  const workshop_title = booking.workshop?.title ?? 'Intro to Linocut Printing'
  const workshop_host = booking.workshop?.host ?? 'Press Room Collective'
  const workshop_area = booking.workshop?.neighborhood ?? 'Hayes Valley'
  const solo = booking.solo || !booking.partner

  return (
    <div className="flex h-full flex-col">
      <StatusBar title="Schedule" />

      <header className="px-5 pb-2 pt-4">
        <button
          onClick={() => on_navigate(solo ? 'discover' : 'pairs')}
          className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Back
        </button>
        <h1 className="font-display text-2xl font-semibold leading-tight text-foreground text-balance">
          Schedule your session
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          {workshop_title} · {workshop_host}
        </p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* pair / solo banner */}
        <section className="rounded-2xl border border-primary/25 bg-primary/[0.06] p-4">
          {solo ? (
            <>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <UserRound className="h-3.5 w-3.5" /> Attending solo
              </p>
              <div className="mt-2.5 flex items-center gap-3">
                <AnonAvatar seed={current_user.seed} size={44} className="ring-2 ring-card" />
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">Just you</p>
                  <p className="text-xs text-muted-foreground">
                    You can invite a pair anytime before the session
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                <Check className="h-3.5 w-3.5" /> You&apos;re matched
              </p>
              <div className="mt-2.5 flex items-center gap-3">
                <div className="flex -space-x-3">
                  <AnonAvatar seed={current_user.seed} size={44} className="ring-2 ring-card" />
                  <AnonAvatar seed={booking.partner!.seed} size={44} className="ring-2 ring-card" />
                </div>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    You &amp; {booking.partner!.realName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Pick a time that works for you both
                  </p>
                </div>
              </div>
            </>
          )}
        </section>

        {/* calendar day selection */}
        <section>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Choose a date</p>
          <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {calendar_days.map((d) => {
              const active = d.id === day_id
              return (
                <button
                  key={d.id}
                  disabled={!d.available}
                  onClick={() => set_day_id(d.id)}
                  className={cn(
                    'relative flex w-12 shrink-0 flex-col items-center rounded-2xl border py-2.5 transition-colors',
                    !d.available && 'cursor-not-allowed opacity-35',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px] font-medium',
                      active ? 'text-primary-foreground/80' : 'text-muted-foreground',
                    )}
                  >
                    {d.dow}
                  </span>
                  <span className="font-display text-base font-semibold leading-tight">{d.day}</span>
                  {d.recommended && (
                    <span
                      className={cn(
                        'mt-0.5 h-1.5 w-1.5 rounded-full',
                        active ? 'bg-primary-foreground' : 'bg-accent',
                      )}
                    />
                  )}
                </button>
              )
            })}
          </div>
          {day.recommended && (
            <p className="mt-1.5 text-[11px] text-accent">Recommended — the workshop&apos;s session date</p>
          )}
        </section>

        {/* time slots */}
        <section>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Pick a time</p>
          <ul className="space-y-2.5">
            {schedule_slots.map((s) => {
              const active = slot_id === s.id
              return (
                <li key={s.id}>
                  <button
                    onClick={() => set_slot_id(s.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-2xl border p-3.5 text-left transition-colors',
                      active ? 'border-primary bg-primary/[0.06]' : 'border-border bg-card',
                    )}
                  >
                    <div>
                      <p className="font-display text-sm font-semibold text-foreground">{s.time}</p>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {s.recommended && (
                        <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
                          Best fit
                        </span>
                      )}
                      <span
                        className={cn(
                          'flex h-5 w-5 items-center justify-center rounded-full border',
                          active ? 'border-primary bg-primary text-primary-foreground' : 'border-border',
                        )}
                      >
                        {active && <Check className="h-3 w-3" />}
                      </span>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* location */}
        <section className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-primary">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">{workshop_host}</p>
            <p className="text-xs text-muted-foreground">{workshop_area} · 0.9 mi away</p>
          </div>
        </section>
      </div>

      {/* sticky confirm bar */}
      <div className="absolute inset-x-0 bottom-[76px] z-20 px-5">
        <button
          onClick={() => on_confirm(date_label, slot.time)}
          className="flex w-full items-center justify-center gap-1.5 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
        >
          <CalendarCheck className="h-4 w-4" />
          Confirm {date_label}, {slot.time}
        </button>
      </div>

      <BottomNav active="schedule" on_navigate={on_navigate} />
    </div>
  )
}
