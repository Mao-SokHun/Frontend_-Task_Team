import { apiRequest, isApiEnabled } from '../core/api'
import { ENDPOINTS } from '../core/endpoints'
import {
  communityTypeRowToUi,
  communityPostRowToUi,
  communityPostToApiPayload,
  unwrapCommunityPosts,
  unwrapCommunityTypes,
} from '@/lib/communityApiMap'

const communityTypesCache = new Map()

function cacheTypes(rows = []) {
  communityTypesCache.clear()
  for (const row of rows) {
    const ui = communityTypeRowToUi(row)
    if (ui.id != null) communityTypesCache.set(ui.id, ui)
  }
}

/** GET /v1/students/community/types */
export async function fetchCommunityTypes() {
  if (!isApiEnabled()) return []
  const json = await apiRequest(ENDPOINTS.students.community.types)
  const rows = unwrapCommunityTypes(json)
  cacheTypes(rows)
  return rows.map(communityTypeRowToUi)
}

/**
 * Community type list for browse/search UI.
 * Backend exposes types only (no separate /communities resource).
 */
export async function fetchCommunities(params = {}) {
  if (!isApiEnabled()) return []

  const types = await fetchCommunityTypes()
  const q = params.q?.trim().toLowerCase()
  if (!q) return types

  return types.filter(
    (c) =>
      c.name?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
  )
}

export async function fetchCommunityById(id) {
  if (!isApiEnabled() || id == null) return null
  if (communityTypesCache.has(id)) return communityTypesCache.get(id)
  const types = await fetchCommunityTypes()
  return types.find((c) => String(c.id) === String(id)) ?? null
}

/** GET /v1/students/community/posts */
export async function fetchCommunityPosts(params = {}) {
  if (!isApiEnabled()) return []

  const qs = new URLSearchParams()
  if (params.q) qs.set('search', params.q)
  if (params.communityTypeId) qs.set('community_type_id', String(params.communityTypeId))
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))

  const query = qs.toString()
  const json = await apiRequest(
    `${ENDPOINTS.students.community.posts}${query ? `?${query}` : ''}`
  )
  return unwrapCommunityPosts(json).map(communityPostRowToUi)
}

/** GET /v1/students/community/posts/:id */
export async function fetchCommunityPostById(id) {
  if (!isApiEnabled() || id == null) return null
  const json = await apiRequest(ENDPOINTS.students.community.postById(id))
  const row = json?.data?.post ?? json?.post ?? json?.data ?? json
  return row ? communityPostRowToUi(row) : null
}

/** POST /v1/students/community/posts */
export async function createCommunityPost(payload) {
  if (!isApiEnabled()) return null
  const body = communityPostToApiPayload(payload)
  const json = await apiRequest(ENDPOINTS.students.community.posts, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  const row = json?.data?.post ?? json?.post ?? json?.data ?? json
  return row ? communityPostRowToUi(row) : null
}

/** PUT /v1/students/community/posts/:id */
export async function updateCommunityPost(id, payload) {
  if (!isApiEnabled() || id == null) return null
  const body = communityPostToApiPayload(payload)
  const json = await apiRequest(ENDPOINTS.students.community.postById(id), {
    method: 'PUT',
    body: JSON.stringify(body),
  })
  const row = json?.data?.post ?? json?.post ?? json?.data ?? json
  return row ? communityPostRowToUi(row) : null
}

/** DELETE /v1/students/community/posts/:id */
export async function deleteCommunityPost(id) {
  if (!isApiEnabled() || id == null) return null
  return apiRequest(ENDPOINTS.students.community.postById(id), { method: 'DELETE' })
}

/** GET /v1/students/community/my-posts */
export async function fetchMyCommunityPosts(params = {}) {
  if (!isApiEnabled()) return []
  const qs = new URLSearchParams()
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))
  const query = qs.toString()
  const json = await apiRequest(
    `${ENDPOINTS.students.community.myPosts}${query ? `?${query}` : ''}`
  )
  return unwrapCommunityPosts(json).map(communityPostRowToUi)
}

/** @deprecated Backend has no POST /communities — use createCommunityPost */
export async function createCommunity() {
  return null
}
