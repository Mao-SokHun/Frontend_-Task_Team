import { isApiEnabled } from '../core/api'

const BOOKINGS_KEY = 'rokkru_student_bookings'

function readLocalBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocalBookings(list) {
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list))
  } catch {
    /* ignore quota errors */
  }
}

function buildBookingRecord(payload) {
  const id = `local-${Date.now()}`
  return {
    id,
    mentorId: payload.mentorId,
    mentorName: payload.mentorName ?? '',
    topic: payload.topic ?? '',
    topicLabel: payload.topicLabel ?? '',
    sessionDate: payload.sessionDate ?? '',
    sessionTime: payload.sessionTime ?? '',
    durationMinutes: payload.durationMinutes ?? 60,
    totalPaid: payload.totalPaid ?? 0,
    notes: payload.notes ?? '',
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
}

/**
 * Book a session — backend has no booking endpoint yet.
 * Persists client-side until a booking API is added server-side.
 */
export async function bookSession(payload) {
  const booking = buildBookingRecord(payload)
  const list = readLocalBookings()
  writeLocalBookings([booking, ...list])
  return booking
}

export function fetchMyBookings() {
  return readLocalBookings()
}

export function getBookingById(sessionId) {
  if (!sessionId) return null
  return readLocalBookings().find((b) => String(b.id) === String(sessionId)) ?? null
}
