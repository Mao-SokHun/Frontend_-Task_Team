import { getStoredUser, setStoredUser } from '@/lib/authStorage'
import { isApiEnabled } from '@/constants'
import { createMentorPost, fetchMyMentorPosts } from './mentorService'
import { normalizeScheduleSlots } from '@/utils/timeRangeUtils'

/**
 * Weekly availability slots (UI shape).
 * @typedef {{ id: number|string, day: string, time: string, subject: string }} ScheduleSlot
 */

function mergeScheduleIntoSession(slots) {
  const stored = getStoredUser()
  if (!stored) return slots
  const next = { ...stored, schedule: slots }
  setStoredUser(next)
  return next
}

/** Read weekly slots from auth session (no weekly-availability API on backend). */
export function getTeacherWeeklySchedule(user) {
  return Array.isArray(user?.schedule) ? user.schedule : []
}

/** Persist weekly availability in session until backend adds availability routes. */
export async function saveTeacherWeeklySchedule(slots) {
  const normalized = normalizeScheduleSlots(slots)
  mergeScheduleIntoSession(normalized)
  return normalized
}

/**
 * Offline/demo publish — when API disabled.
 * With API enabled, MentorCreatePost uses createMentorPost directly.
 */
export async function publishTeacherSessionSlot({ userId, subject, date, time, notes }) {
  const payload = {
    mentor_id: userId,
    subject: subject?.trim(),
    session_date: date,
    time_slot: time,
    notes: notes?.trim() || '',
  }

  if (!isApiEnabled()) {
    return { ok: true, local: true, ...payload }
  }

  return { ok: true, local: true, ...payload }
}

/** Mentor schedule posts — GET /v1/mentors/me/posts */
export async function fetchMyTeacherSessions() {
  if (!isApiEnabled()) return []
  return fetchMyMentorPosts()
}
