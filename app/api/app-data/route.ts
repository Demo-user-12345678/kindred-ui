import { NextResponse } from 'next/server'
import { current_interests, current_user, members, pair_requests, schedule_slots, workshops, calendar_days } from '@/lib/mock-data'
import { read_all_items, save_item, key_for } from '@/lib/dynamodb'

const seed_items = [
  { id: 'app:current-user', entity: 'current_user', data: current_user },
  { id: 'app:current-interests', entity: 'current_interests', data: current_interests },
  { id: 'app:members', entity: 'members', data: members },
  { id: 'app:pair-requests', entity: 'pair_requests', data: pair_requests },
  { id: 'app:workshops', entity: 'workshops', data: workshops },
  { id: 'app:calendar-days', entity: 'calendar_days', data: calendar_days },
  { id: 'app:schedule-slots', entity: 'schedule_slots', data: schedule_slots },
]

function with_key(item: Record<string, unknown>) {
  return { ...item, ...key_for(String(item.id)) }
}

async function ensure_seeded() {
  const items = await read_all_items()
  const existing_ids = new Set(items.map((item) => item.id))
  await Promise.all(seed_items.filter((item) => !existing_ids.has(item.id)).map((item) => save_item(with_key(item))))
  return items.length >= seed_items.length ? items : [...items, ...seed_items.map(with_key)]
}

export async function GET() {
  try {
    const items = await ensure_seeded()
    const by_entity = Object.fromEntries(items.filter((item) => item.entity).map((item) => [item.entity, item.data]))
    return NextResponse.json(by_entity)
  } catch (error) {
    console.error('[v0] DynamoDB read failed:', error)
    return NextResponse.json({ error: 'Unable to load app data' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    if (payload?.type !== 'booking' || !payload.booking?.workshop?.id) {
      return NextResponse.json({ error: 'Invalid booking payload' }, { status: 400 })
    }

    const booking_id = `booking:${crypto.randomUUID()}`
    await save_item(with_key({
      id: booking_id,
      entity: 'booking',
      user_id: 'demo-user',
      booking: payload.booking,
      created_at: new Date().toISOString(),
    }))

    return NextResponse.json({ id: booking_id }, { status: 201 })
  } catch (error) {
    console.error('[v0] DynamoDB write failed:', error)
    return NextResponse.json({ error: 'Unable to save booking' }, { status: 503 })
  }
}
