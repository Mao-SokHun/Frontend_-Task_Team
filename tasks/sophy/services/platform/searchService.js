import { apiRequest, isApiEnabled } from '../core/api'
import { ENDPOINTS } from '../core/endpoints'
import { fetchMentors } from '../mentors/mentorService'
import { fetchCommunityPosts } from '../communities/communityService'
import { fetchPublishedSchedules } from '../mentors/mentorService'

/** Global search — mentors (q param), community posts, mentor schedule posts */
export async function search(query, params = {}) {
  if (!isApiEnabled()) {
    return { mentors: [], posts: [], schedules: [], total: 0 }
  }

  const q = String(query ?? '').trim()
  const [mentorsRes, communityPosts, schedules] = await Promise.allSettled([
    fetchMentors({ q, page: 1, pageSize: params.limit ?? 20 }),
    fetchCommunityPosts({ q, limit: params.limit ?? 20 }),
    fetchPublishedSchedules({ status: 'published', limit: params.limit ?? 20 }),
  ])

  const mentors = mentorsRes.status === 'fulfilled' ? (mentorsRes.value.items ?? []) : []
  const posts = communityPosts.status === 'fulfilled' ? communityPosts.value : []
  const schedulePosts = schedules.status === 'fulfilled' ? schedules.value : []

  return {
    mentors,
    posts,
    schedules: schedulePosts,
    results: [...mentors, ...posts, ...schedulePosts],
    total: mentors.length + posts.length + schedulePosts.length,
  }
}
