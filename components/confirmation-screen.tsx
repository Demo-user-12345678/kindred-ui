'use client'

import {
  CheckCircle2,
  CalendarDays,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  UserRound,
  Home,
} from 'lucide-react'
import { StatusBar } from './phone-frame'
import { BottomNav } from './bottom-nav'
import { AnonAvatar } from './anon-avatar'
import { current_user } from '@/lib/mock-data'
import type { Booking, Screen } from './kindred-app'

export function ConfirmationScreen({
  booking,
  on_done,
  on_navigate,
}: {
  booking: Booking
  on_done: () => void
  on_navigate: (screen: Screen) => void
}) {
  const solo = booking.solo || !booking.partner
  const workshop_title = booking.workshop?.title ?? 'Intro to Linocut Printing'
  const workshop_host = booking.workshop?.host ?? 'Press Room Collective'
  const workshop_area = booking.workshop?.neighborhood ?? 'Hayes Valley'

  return (
    <div className="flex h-full flex-col">
      <StatusBar title="Confirmed" />

      <div className="flex-1 overflow-y-auto px-5 pb-28 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* success hero */}
        <div className="flex flex-col items-center pb-2 pt-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/12 text-primary">
            <CheckCircle2 className="h-9 w-9" strokeWidth={2} />
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold leading-tight text-foreground text-balance">
            You&apos;re all set!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            {solo
              ? 'Your solo spot is booked. See you there.'
              : `You and ${booking.partner!.realName} are booked in together.`}
          </p>
        </div>

        {/* ticket card */}
        <section className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-sm shadow-foreground/[0.04]">
          <div className="border-b border-dashed border-border p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-accent">
              Workshop pass
            </p>
            <h2 className="mt-1 font-display text-base font-semibold text-foreground text-pretty">
              {workshop_title}
            </h2>
            <p className="text-xs text-muted-foreground">{workshop_host}</p>
          </div>

          <dl className="grid grid-cols-2 gap-x-3 gap-y-3.5 p-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <div>
                <dt className="text-[10px] text-muted-foreground">Date</dt>
                <dd className="text-xs font-medium text-foreground">{booking.date ?? 'Wed, May 22'}</dd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <dt className="text-[10px] text-muted-foreground">Time</dt>
                <dd className="text-xs font-medium text-foreground">{booking.time ?? '6:30 PM'}</dd>
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <dt className="text-[10px] text-muted-foreground">Location</dt>
                <dd className="text-xs font-medium text-foreground">
                  {workshop_host} · {workshop_area}
                </dd>
              </div>
            </div>
          </dl>
        </section>

        {/* attendees */}
        <section className="mt-3 rounded-2xl border border-border bg-card p-4">
          <p className="mb-2.5 text-xs font-medium text-muted-foreground">
            {solo ? 'Attendee' : 'Your pair'}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              <AnonAvatar seed={current_user.seed} size={40} className="ring-2 ring-card" />
              {!solo && (
                <AnonAvatar seed={booking.partner!.seed} size={40} className="ring-2 ring-card" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {solo ? (
                  <span className="flex items-center gap-1.5">
                    <UserRound className="h-3.5 w-3.5 text-primary" /> {current_user.realName} (you)
                  </span>
                ) : (
                  `${current_user.realName} & ${booking.partner!.realName}`
                )}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-primary" />
                {solo
                  ? 'Your identity stays private until you choose to share'
                  : 'Identities revealed only to each other'}
              </p>
            </div>
          </div>
        </section>

        {!solo && (
          <button className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full border border-border bg-card py-2.5 text-sm font-semibold text-foreground">
            <MessageSquare className="h-4 w-4 text-primary" /> Message {booking.partner!.realName}
          </button>
        )}
      </div>

      {/* sticky done bar */}
      <div className="absolute inset-x-0 bottom-[76px] z-20 px-5">
        <button
          onClick={on_done}
          className="flex w-full items-center justify-center gap-1.5 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
        >
          <Home className="h-4 w-4" />
          Back to Discover
        </button>
      </div>

      <BottomNav active="schedule" on_navigate={on_navigate} />
    </div>
  )
}
