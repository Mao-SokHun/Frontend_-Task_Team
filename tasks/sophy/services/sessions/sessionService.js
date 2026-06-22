/**
 * Schedule slots are mentor posts on the backend (GET/POST /v1/mentors/.../posts).
 * This module re-exports mentor post helpers for legacy imports.
 */

import { isApiEnabled } from '../core/api'
import {
  fetchPublishedSchedules,
  fetchMyMentorPosts,
  createMentorPost,
  fetchMentorPostById,
  updateMentorPost,
  deleteMentorPost,
} from '../mentors/mentorService'

export async function fetchSessions(options = {}) {
  if (!isApiEnabled()) return []
  return fetchPublishedSchedules(options)
}

export async function fetchSessionById(id) {
  if (!isApiEnabled() || id == null) return null
  return fetchMentorPostById(id)
}

export async function createSession(payload) {
  if (!isApiEnabled()) return null
  const userId = payload.mentor_id ?? payload.user_id ?? payload.mentorId
  if (!userId) return null
  return createMentorPost(userId, {
    title: payload.title ?? payload.topic ?? payload.subject ?? 'Session',
    description: payload.description ?? payload.notes ?? '',
    province_id: payload.province_id,
    sub_skill_id: payload.sub_skill_id,
    status: payload.status ?? 'published',
  })
}

export async function updateSession(id, payload) {
  if (!isApiEnabled() || id == null) return null
  return updateMentorPost(id, payload)
}

export async function deleteSession(id) {
  if (!isApiEnabled() || id == null) return null
  return deleteMentorPost(id)
}

export async function fetchMySessions() {
  if (!isApiEnabled()) return []
  return fetchMyMentorPosts()
}
