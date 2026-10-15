'use client'

import { useState } from 'react'
import { PhoneFrame } from './phone-frame'
import { WorkshopSearchScreen } from './workshop-search-screen'
import { PairingScreen } from './pairing-screen'
import { ScheduleScreen } from './schedule-screen'
import { ConfirmationScreen } from './confirmation-screen'
import type { Member, Workshop } from '@/lib/mock-data'

export type Screen = 'discover' | 'pairs' | 'schedule' | 'confirmation'

export type Booking = {
  workshop: Workshop | null
  // null partner === attending solo
  partner: Member | null
  solo: boolean
  date: string | null
  time: string | null
}

const empty_booking: Booking = {
  workshop: null,
  partner: null,
  solo: false,
  date: null,
  time: null,
}

export function KindredApp() {
  const [screen, set_screen] = useState<Screen>('discover')
  const [booking, set_booking] = useState<Booking>(empty_booking)

  function navigate(next: Screen) {
    set_screen(next)
  }

  // From search: pair up for a workshop -> go pick a partner
  function find_pair(workshop: Workshop) {
    set_booking((b) => ({ ...b, workshop, solo: false }))
    set_screen('pairs')
  }

  // From search: attend solo -> skip pairing, go straight to scheduling
  function attend_solo(workshop: Workshop) {
    set_booking((b) => ({ ...b, workshop, solo: true, partner: null }))
    set_screen('schedule')
  }

  // From pairing: proceed to schedule with a matched partner
  function schedule_with(partner: Member, workshop?: Workshop) {
    set_booking((b) => ({
      ...b,
      partner,
      solo: false,
      workshop: workshop ?? b.workshop,
    }))
    set_screen('schedule')
  }

  // From schedule: confirm the chosen date + time
  function confirm_booking(date: string, time: string) {
    set_booking((b) => ({ ...b, date, time }))
    set_screen('confirmation')
  }

  function reset() {
    set_booking(empty_booking)
    set_screen('discover')
  }

  return (
    <PhoneFrame>
      {screen === 'discover' && (
        <WorkshopSearchScreen
          on_find_pair={find_pair}
          on_attend_solo={attend_solo}
          on_navigate={navigate}
        />
      )}
      {screen === 'pairs' && (
        <PairingScreen
          booking={booking}
          on_schedule={schedule_with}
          on_navigate={navigate}
        />
      )}
      {screen === 'schedule' && (
        <ScheduleScreen
          booking={booking}
          on_confirm={confirm_booking}
          on_navigate={navigate}
        />
      )}
      {screen === 'confirmation' && (
        <ConfirmationScreen booking={booking} on_done={reset} on_navigate={navigate} />
      )}
    </PhoneFrame>
  )
}
