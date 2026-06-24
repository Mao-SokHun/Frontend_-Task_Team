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

/** @deprecated MentorCreatePost uses createMentorPost when API is enabled */
export async function publishTeacherSessionSlot() {
  if (!isApiEnabled()) {
    throw new Error('Set VITE_API_URL to publish sessions.')
  }
  throw new Error('Use createMentorPost — publishTeacherSessionSlot is deprecated.')
}

/** Mentor schedule posts — GET /v1/mentors/me/posts */
export async function fetchMyTeacherSessions() {
  if (!isApiEnabled()) return []
  return fetchMyMentorPosts()
}
