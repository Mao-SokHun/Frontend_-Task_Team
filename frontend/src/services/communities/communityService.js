import { apiRequest, isApiEnabled } from '../core/api'
import { ENDPOINTS } from '../core/endpoints'
import {
  communityTypeRowToUi,
  communityPostRowToUi,
  communityPostToApiPayload,
  communityCommentRowToUi,
  flattenCommunityComments,
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
  return unwrapCommunityPosts(json).map(communityPostRowToUi)
}

/** GET /v1/community/posts/:id/like — public like/dislike counts */
export async function fetchCommunityPostLikes(postId) {
  if (!postId || !isApiEnabled()) {
    return { likes_count: 0, dislikes_count: 0 }
  }
  const json = await apiRequest(ENDPOINTS.community.postLikes(postId), {
    auth: false,
    skipAuthRedirect: true,
  })
  const data = json?.data ?? json
  return {
    likes_count: Number(data?.likes_count ?? 0),
    dislikes_count: Number(data?.dislikes_count ?? 0),
  }
}

/** POST /v1/community/posts/:id/like — toggle like (auth required) */
export async function toggleCommunityPostLike(postId, { is_like = true } = {}) {
  if (!postId || !isApiEnabled()) {
    throw new Error('Set VITE_API_URL in .env to like community posts.')
  }
  return apiRequest(ENDPOINTS.community.postLikes(postId), {
    method: 'POST',
    body: JSON.stringify({ is_like }),
  })
}

/** GET /v1/community/posts/:id/comments */
export async function fetchCommunityPostComments(postId, params = {}) {
  if (!postId || !isApiEnabled()) return []
  const qs = new URLSearchParams()
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit ?? 50))
  const query = qs.toString()
  const json = await apiRequest(
    `${ENDPOINTS.community.postComments(postId)}${query ? `?${query}` : ''}`,
    { auth: false, skipAuthRedirect: true }
  )
  const data = json?.data ?? json
  const rows = Array.isArray(data?.comments) ? data.comments : []
  return flattenCommunityComments(rows)
}

/** POST /v1/community/posts/:id/comments */
export async function createCommunityPostComment(postId, content, parentCommentId = null) {
  if (!postId || !isApiEnabled()) {
    throw new Error('Set VITE_API_URL in .env to comment on community posts.')
  }
  const body = { content: String(content ?? '').trim() }
  if (parentCommentId != null) body.parent_comment_id = parentCommentId
  const json = await apiRequest(ENDPOINTS.community.postComments(postId), {
    method: 'POST',
    body: JSON.stringify(body),
  })
  const data = json?.data ?? json
  const row = data?.comment ?? data
  return row ? communityCommentRowToUi(row) : null
}
