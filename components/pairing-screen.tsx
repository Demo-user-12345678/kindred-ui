'use client'

import { useState } from 'react'
import { ShieldCheck, Sparkles, Check, Clock3, Send, CalendarPlus, ChevronLeft } from 'lucide-react'
import { StatusBar } from './phone-frame'
import { BottomNav } from './bottom-nav'
import { AnonAvatar } from './anon-avatar'
import { members, pair_requests, type Member } from '@/lib/mock-data'
import type { Booking, Screen } from './kindred-app'
import { cn } from '@/lib/utils'

export function PairingScreen({
  booking,
  on_schedule,
  on_navigate,
}: {
  booking: Booking
  on_schedule: (partner: Member, workshop?: import('@/lib/mock-data').Workshop) => void
  on_navigate: (screen: Screen) => void
}) {
  // track which members we've sent a request to
  const [sent, set_sent] = useState<Record<string, boolean>>({})
  // once a request is "accepted", the pair is matched and the name is revealed
  const [matched, set_matched] = useState<Record<string, boolean>>({})
  const incoming = pair_requests.find((r) => r.status === 'incoming')

  return (
    <div className="flex h-full flex-col">
      <StatusBar title="Pairs" />

      <header className="px-5 pb-3 pt-4">
        {booking.workshop && (
          <button
            onClick={() => on_navigate('discover')}
            className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> {booking.workshop.title}
          </button>
        )}
        <h1 className="font-display text-2xl font-semibold leading-tight text-foreground text-balance">
          Your interested list
        </h1>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Names &amp; photos stay hidden until you both accept
        </p>
      </header>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-28 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* incoming request highlight */}
        {incoming && (
          <section className="rounded-2xl border border-accent/40 bg-accent/10 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Incoming request
            </p>
            <div className="mt-2.5 flex items-start gap-3">
              <AnonAvatar seed={incoming.member.seed} size={48} />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-foreground">
                  {matched[incoming.member.id] ? incoming.member.realName : incoming.member.moniker}
                </p>
                <p className="text-xs text-muted-foreground">
                  for {incoming.workshopTitle} · {incoming.sentAgo}
                </p>
                <p className="mt-1.5 rounded-xl bg-card px-3 py-2 text-xs text-foreground">
                  &ldquo;{incoming.note}&rdquo;
                </p>
              </div>
            </div>
            {matched[incoming.member.id] ? (
              <button
                onClick={() => on_schedule(incoming.member)}
                className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-accent py-2 text-xs font-semibold text-accent-foreground"
              >
                <CalendarPlus className="h-3.5 w-3.5" /> Schedule with {incoming.member.realName}
              </button>
            ) : (
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => set_matched((m) => ({ ...m, [incoming.member.id]: true }))}
                  className="flex-1 rounded-full bg-accent py-2 text-xs font-semibold text-accent-foreground"
                >
                  Accept &amp; reveal
                </button>
                <button className="flex-1 rounded-full border border-border bg-card py-2 text-xs font-semibold text-muted-foreground">
                  Not now
                </button>
              </div>
            )}
          </section>
        )}

        {/* interested members to pair with */}
        <section>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Neighbors interested in the same workshops
          </p>
          <ul className="space-y-2.5">
            {members.map((m) => {
              const is_sent = sent[m.id]
              const is_matched = matched[m.id]
              return (
                <li
                  key={m.id}
                  className="rounded-2xl border border-border bg-card p-3.5 shadow-sm shadow-foreground/[0.03]"
                >
                  <div className="flex items-start gap-3">
                    <AnonAvatar seed={m.seed} size={48} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-display text-sm font-semibold text-foreground">
                          {is_matched ? m.realName : m.moniker}
                        </p>
                        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          {m.matchPercent}% match
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{m.distance}</p>
                      <p className="mt-1 line-clamp-2 text-xs text-foreground/80">{m.blurb}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.sharedInterests.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {is_matched ? (
                    <button
                      onClick={() => on_schedule(m)}
                      className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground"
                    >
                      <CalendarPlus className="h-3.5 w-3.5" /> Schedule workshop
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        is_sent
                          ? set_matched((mm) => ({ ...mm, [m.id]: true }))
                          : set_sent((s) => ({ ...s, [m.id]: true }))
                      }
                      className={cn(
                        'mt-3 flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-xs font-semibold transition-colors',
                        is_sent ? 'bg-primary/10 text-primary' : 'bg-primary text-primary-foreground',
                      )}
                    >
                      {is_sent ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Request sent · tap to simulate accept
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" /> Send pairing request
                        </>
                      )}
                    </button>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {/* sent / pending */}
        <section>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5" /> Awaiting reply
          </p>
          {pair_requests
            .filter((r) => r.status === 'sent')
            .map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-card/60 p-3"
              >
                <AnonAvatar seed={r.member.seed} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{r.member.moniker}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Sent {r.sentAgo} · {r.workshopTitle}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
                  Pending
                </span>
              </div>
            ))}
        </section>
      </div>

      <BottomNav active="pairs" on_navigate={on_navigate} />
    </div>
  )
}
