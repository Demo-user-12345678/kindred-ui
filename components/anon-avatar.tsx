import { cn } from '@/lib/utils'

const palettes = [
  ['oklch(0.42 0.072 165)', 'oklch(0.7 0.16 42)'],
  ['oklch(0.6 0.1 200)', 'oklch(0.75 0.14 90)'],
  ['oklch(0.65 0.13 300)', 'oklch(0.42 0.072 165)'],
  ['oklch(0.7 0.16 42)', 'oklch(0.6 0.1 200)'],
]

// A deterministic 5x5 symmetric identicon derived from the seed.
// Renders an abstract mark instead of any real photo, so identity stays private.
function build_cells(seed: number) {
  const cells: boolean[] = []
  for (let i = 0; i < 15; i++) {
    // pseudo-random but deterministic per seed + index
    cells.push(((seed * (i + 3)) % 7) > 3)
  }
  // mirror the 3 columns (0,1,2) into 5 columns per row
  const grid: boolean[] = []
  for (let row = 0; row < 5; row++) {
    const base = row * 3
    const r = [cells[base], cells[base + 1], cells[base + 2]]
    grid.push(r[0], r[1], r[2], r[1], r[0])
  }
  return grid
}

export function AnonAvatar({
  seed,
  size = 44,
  className,
}: {
  seed: number
  size?: number
  className?: string
}) {
  const grid = build_cells(seed)
  const [fg, bg] = palettes[seed % palettes.length]

  return (
    <div
      className={cn('grid shrink-0 overflow-hidden rounded-xl p-[3px]', className)}
      style={{ width: size, height: size, backgroundColor: bg + '22' }}
      role="img"
      aria-label="Anonymous member avatar"
    >
      <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-[1px]">
        {grid.map((on, i) => (
          <span
            key={i}
            className="rounded-[2px]"
            style={{ backgroundColor: on ? fg : 'transparent' }}
          />
        ))}
      </div>
    </div>
  )
}
