import { apiRequest, isApiEnabled } from '../core/api'
import { ENDPOINTS } from '../core/endpoints'

const REVIEWS_KEY = 'rokkru_student_reviews'

function readLocalReviews() {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocalReviews(list) {
  try {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(list))
  } catch {
    /* ignore */
  }
}

/**
 * Submit mentor rating — POST /v1/mentors/:mentorId/ratings
 * @param {string|number} mentorId
 * @param {{ overall: number }} payload
 */
export async function submitMentorRating(mentorId, payload) {
  if (!mentorId) throw new Error('Mentor id is required')
  const rating = Number(payload.overall ?? payload.rating)
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Rating must be between 1 and 5')
  }

  if (!isApiEnabled()) {
    const record = {
      mentorId,
      rating,
      submittedAt: new Date().toISOString(),
    }
    writeLocalReviews([record, ...readLocalReviews()])
    return record
  }

  const json = await apiRequest(ENDPOINTS.mentors.ratings.create(mentorId), {
    method: 'POST',
    body: JSON.stringify({ rating }),
  })
  return json?.data ?? json
}

/** @deprecated Use submitMentorRating with booking.mentorId */
export async function submitSessionReview(sessionId, payload, mentorId) {
  const resolvedMentorId = mentorId ?? payload.mentorId
  if (!resolvedMentorId) {
    const record = {
      sessionId,
      overall: payload.overall,
      aspectRatings: payload.aspectRatings ?? {},
      tags: payload.tags ?? [],
      reviewText: payload.reviewText ?? '',
      wouldBookAgain: payload.wouldBookAgain ?? null,
      submittedAt: new Date().toISOString(),
    }
    writeLocalReviews([record, ...readLocalReviews()])
    return record
  }
  return submitMentorRating(resolvedMentorId, payload)
}
