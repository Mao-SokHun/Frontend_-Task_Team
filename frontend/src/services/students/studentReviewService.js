import { apiRequest, isApiEnabled } from '../core/api'
import { ENDPOINTS } from '../core/endpoints'

function unwrapData(json) {
  return json?.data ?? json
}

function parseStarRating(payload) {
  const rating = Number(payload?.overall ?? payload?.rating)
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5')
  }
  return Math.round(rating * 100) / 100
}

function assertApi() {
  if (!isApiEnabled()) {
    throw new Error('Set VITE_API_URL in .env to use mentor ratings.')
  }
}

/** @param {Record<string, unknown>} row */
export function mentorRatingRowToUi(row) {
  if (!row || typeof row !== 'object') return null
  return {
    id: row.rating_id ?? row.id,
    rating: Number(row.rating) || 0,
    timestamp: row.timestamp ?? row.created_at ?? null,
  }
}

/** GET /v1/mentors/:mentorId/ratings/summary */
export async function fetchMentorRatingSummary(mentorId) {
  if (!mentorId || !isApiEnabled()) {
    return { average_rating: null, rating_count: 0 }
  }
  const json = await apiRequest(ENDPOINTS.mentors.ratings.summary(mentorId), {
    auth: false,
    skipAuthRedirect: true,
  })
  const data = unwrapData(json)
  return {
    average_rating: data?.average_rating ?? null,
    rating_count: Number(data?.rating_count ?? 0),
  }
}

/**
 * GET /v1/mentors/:mentorId/ratings
 * @returns {{ items: ReturnType<typeof mentorRatingRowToUi>[], average_rating: number|null, rating_count: number, pagination: object }}
 */
export async function fetchMentorRatings(mentorId, params = {}) {
  if (!mentorId || !isApiEnabled()) {
    return { items: [], average_rating: null, rating_count: 0, pagination: {} }
  }
  const qs = new URLSearchParams()
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))
  const query = qs.toString()
  const json = await apiRequest(
    `${ENDPOINTS.mentors.ratings.list(mentorId)}${query ? `?${query}` : ''}`,
    { auth: false, skipAuthRedirect: true }
  )
  const data = unwrapData(json)
  const items = Array.isArray(data?.items) ? data.items.map(mentorRatingRowToUi).filter(Boolean) : []
  return {
    items,
    average_rating: data?.average_rating ?? null,
    rating_count: Number(data?.rating_count ?? items.length),
    pagination: data?.pagination ?? {},
  }
}

/** GET /v1/mentors/:mentorId/ratings/me — null when student has not rated */
export async function fetchMyMentorRating(mentorId) {
  if (!mentorId || !isApiEnabled()) return null
  try {
    const json = await apiRequest(ENDPOINTS.mentors.ratings.me(mentorId), {
      skipAuthRedirect: true,
    })
    return mentorRatingRowToUi(unwrapData(json))
  } catch (err) {
    if (err?.status === 404) return null
    throw err
  }
}

/** POST /v1/mentors/:mentorId/ratings — create only (no update/delete on frontend) */
export async function createMentorRating(mentorId, payload) {
  if (!mentorId) throw new Error('Mentor id is required')
  assertApi()
  const rating = parseStarRating(payload)
  const json = await apiRequest(ENDPOINTS.mentors.ratings.create(mentorId), {
    method: 'POST',
    body: JSON.stringify({ rating }),
  })
  return unwrapData(json)
}

/** @alias createMentorRating */
export async function submitMentorRating(mentorId, payload) {
  return createMentorRating(mentorId, payload)
}

/** Session review → POST star rating only */
export async function submitSessionReview(sessionId, payload, mentorId) {
  const resolvedMentorId = mentorId ?? payload?.mentorId
  if (!resolvedMentorId) {
    throw new Error('Mentor id is required to submit a review.')
  }
  void sessionId
  return createMentorRating(resolvedMentorId, payload)
}
