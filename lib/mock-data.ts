// Anonymous personas — no real names or photos, only auto-generated monikers
// and a deterministic color seed used to render an abstract avatar.

export type Member = {
  id: string
  moniker: string
  // Fictional placeholder name — only revealed after both members accept.
  realName: string
  seed: number
  distance: string
  sharedInterests: string[]
  matchPercent: number
  blurb: string
}

// The signed-in (fictional) user for this prototype.
export const current_user = {
  moniker: 'Teal Sparrow',
  realName: 'Jane Doe',
  seed: 999,
}

export type Workshop = {
  id: string
  title: string
  medium: string
  host: string
  neighborhood: string
  distance: string
  date: string
  time: string
  spots: number
  spotsLeft: number
  price: string
  tags: string[]
  accent: 'primary' | 'accent' | 'chart-3' | 'chart-4'
}

export type PairRequest = {
  id: string
  member: Member
  workshopTitle: string
  status: 'incoming' | 'sent' | 'matched'
  note: string
  sentAgo: string
}

// Colorful pastel identity per art medium — used to tint symbols and badges
// so the interface reads bright, modern, and playful.
export const medium_color: Record<string, { chip: string; solid: string }> = {
  Watercolor: { chip: 'bg-[var(--chart-3)]/15 text-[var(--chart-3)]', solid: 'bg-[var(--chart-3)] text-primary-foreground' },
  Ceramics: { chip: 'bg-[var(--chart-5)]/20 text-[var(--chart-5)]', solid: 'bg-[var(--chart-5)] text-primary-foreground' },
  Linocut: { chip: 'bg-[var(--chart-1)]/15 text-[var(--chart-1)]', solid: 'bg-[var(--chart-1)] text-primary-foreground' },
  'Life Drawing': { chip: 'bg-[var(--chart-2)]/15 text-[var(--chart-2)]', solid: 'bg-[var(--chart-2)] text-primary-foreground' },
  Collage: { chip: 'bg-[var(--chart-4)]/18 text-[var(--chart-4)]', solid: 'bg-[var(--chart-4)] text-primary-foreground' },
}

export const current_interests = [
  'Watercolor',
  'Ceramics',
  'Linocut',
  'Life Drawing',
  'Collage',
]

export const members: Member[] = [
  {
    id: 'm1',
    moniker: 'Cobalt Wren',
    realName: 'John Doe',
    seed: 214,
    distance: '0.4 mi away',
    sharedInterests: ['Watercolor', 'Collage'],
    matchPercent: 92,
    blurb: 'Sunday painter, prefers quiet studios and strong coffee.',
  },
  {
    id: 'm2',
    moniker: 'Amber Fox',
    realName: 'Jane Doe',
    seed: 47,
    distance: '0.8 mi away',
    sharedInterests: ['Ceramics', 'Life Drawing'],
    matchPercent: 88,
    blurb: 'Just moved to the neighborhood, looking for a pottery buddy.',
  },
  {
    id: 'm3',
    moniker: 'Slate Heron',
    realName: 'John A. Doe',
    seed: 133,
    distance: '1.1 mi away',
    sharedInterests: ['Linocut', 'Watercolor'],
    matchPercent: 81,
    blurb: 'Printmaker by night. Happy to share a bench and swap tips.',
  },
  {
    id: 'm4',
    moniker: 'Marigold Lark',
    realName: 'Jane B. Doe',
    seed: 302,
    distance: '1.3 mi away',
    sharedInterests: ['Collage', 'Life Drawing'],
    matchPercent: 76,
    blurb: 'Sketchbook always in bag. Loves loud, messy sessions.',
  },
]

export const workshops: Workshop[] = [
  {
    id: 'w1',
    title: 'Loose Watercolor Landscapes',
    medium: 'Watercolor',
    host: 'Riverside Studio',
    neighborhood: 'Mission District',
    distance: '0.5 mi',
    date: 'Sat, May 18',
    time: '10:00 AM',
    spots: 12,
    spotsLeft: 3,
    price: '$28',
    tags: ['Beginner friendly', 'Materials included'],
    accent: 'primary',
  },
  {
    id: 'w2',
    title: 'Wheel Throwing Basics',
    medium: 'Ceramics',
    host: 'Kiln & Co.',
    neighborhood: 'Dogpatch',
    distance: '1.2 mi',
    date: 'Sun, May 19',
    time: '1:00 PM',
    spots: 8,
    spotsLeft: 2,
    price: '$45',
    tags: ['Hands-on', 'Small group'],
    accent: 'accent',
  },
  {
    id: 'w3',
    title: 'Intro to Linocut Printing',
    medium: 'Linocut',
    host: 'Press Room Collective',
    neighborhood: 'Hayes Valley',
    distance: '0.9 mi',
    date: 'Wed, May 22',
    time: '6:30 PM',
    spots: 10,
    spotsLeft: 6,
    price: '$34',
    tags: ['Evening', 'All levels'],
    accent: 'chart-3',
  },
  {
    id: 'w4',
    title: 'Life Drawing Open Session',
    medium: 'Life Drawing',
    host: 'North Light Atelier',
    neighborhood: 'North Beach',
    distance: '1.6 mi',
    date: 'Thu, May 23',
    time: '7:00 PM',
    spots: 20,
    spotsLeft: 11,
    price: '$18',
    tags: ['Drop-in', 'BYO supplies'],
    accent: 'chart-4',
  },
]

export const pair_requests: PairRequest[] = [
  {
    id: 'p1',
    member: members[1],
    workshopTitle: 'Wheel Throwing Basics',
    status: 'incoming',
    note: 'Want to split a wheel and go halves on clay?',
    sentAgo: '2h ago',
  },
  {
    id: 'p2',
    member: members[0],
    workshopTitle: 'Loose Watercolor Landscapes',
    status: 'sent',
    note: 'Loved your palette notes — pair up Saturday?',
    sentAgo: '5h ago',
  },
  {
    id: 'p3',
    member: members[2],
    workshopTitle: 'Intro to Linocut Printing',
    status: 'matched',
    note: "We're matched! Time to pick a slot.",
    sentAgo: 'Yesterday',
  },
]

// A week of selectable calendar days for the schedule screen.
export type CalendarDay = {
  id: string
  dow: string
  day: number
  month: string
  available: boolean
  recommended?: boolean
}

export const calendar_days: CalendarDay[] = [
  { id: 'd18', dow: 'Sat', day: 18, month: 'May', available: false },
  { id: 'd19', dow: 'Sun', day: 19, month: 'May', available: true },
  { id: 'd20', dow: 'Mon', day: 20, month: 'May', available: false },
  { id: 'd21', dow: 'Tue', day: 21, month: 'May', available: true },
  { id: 'd22', dow: 'Wed', day: 22, month: 'May', available: true, recommended: true },
  { id: 'd23', dow: 'Thu', day: 23, month: 'May', available: true },
  { id: 'd24', dow: 'Fri', day: 24, month: 'May', available: false },
]

export const schedule_slots = [
  { id: 's1', time: '6:30 PM', label: 'Session start', recommended: true },
  { id: 's2', time: '5:45 PM', label: 'Coffee first' },
  { id: 's3', time: '8:00 PM', label: 'Evening group', recommended: false },
]
