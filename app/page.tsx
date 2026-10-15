import { ShieldCheck, Search, Users, CalendarDays, CheckCircle2, UserRound } from 'lucide-react'
import { KindredApp } from '@/components/kindred-app'

const steps = [
  {
    step: '01',
    title: 'Search art workshops',
    desc: 'Browse workshops in your city and filter by medium. Choose to find a pair or attend solo.',
    Icon: Search,
  },
  {
    step: '02',
    title: 'Send a pairing request',
    desc: 'Invite neighbors from your interested list — names and photos stay anonymous until you both accept.',
    Icon: Users,
  },
  {
    step: '03',
    title: 'Schedule the workshop',
    desc: 'Pick a date on the calendar and a time you both prefer, then confirm the session.',
    Icon: CalendarDays,
  },
  {
    step: '04',
    title: 'Confirmation',
    desc: 'Get a workshop pass with the date, time, location, and your anonymous pair.',
    Icon: CheckCircle2,
  },
]

export default function Page() {
  return (
    <main className="min-h-screen bg-background">
      {/* header */}
      <header className="mx-auto max-w-6xl px-6 pt-14 pb-6 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-primary" />
          Privacy-first · anonymous by default
        </span>
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground text-balance sm:text-5xl">
          Kindred
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
          Discover neighbors who share your interests and pair up for local art
          workshops — or attend solo — without ever revealing your name or face until you both say yes.
        </p>
      </header>

      <section className="mx-auto grid max-w-6xl items-start gap-10 px-6 pb-20 lg:grid-cols-[minmax(0,1fr)_auto]">
        {/* flow legend */}
        <div className="order-2 lg:order-1 lg:pt-6">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-accent">
            <UserRound className="h-3.5 w-3.5" /> One connected prototype
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-foreground text-balance">
            Four screens, one flow
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
            The phone on the right is fully interactive. Search a workshop, then either
            send a pairing request or attend solo — both paths lead to calendar scheduling
            and a confirmation pass. Use the bottom tabs to jump between sections.
          </p>

          <ol className="mt-6 space-y-4">
            {steps.map(({ step, title, desc, Icon }) => (
              <li key={step} className="flex gap-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold text-foreground">
                    <span className="text-accent">{step}</span> · {title}
                  </p>
                  <p className="mt-0.5 max-w-sm text-xs leading-relaxed text-muted-foreground text-pretty">
                    {desc}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* interactive phone */}
        <div className="order-1 flex justify-center lg:order-2">
          <KindredApp />
        </div>
      </section>
    </main>
  )
}
