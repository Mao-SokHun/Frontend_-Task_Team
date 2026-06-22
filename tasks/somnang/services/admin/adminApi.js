import { apiRequest } from '../core/client'
import { ENDPOINTS } from '../core/endpoints'
import { isApiEnabled } from '@/constants'
import { fetchMentorCatalog, fetchMentors, fetchPublishedSchedules } from '../mentors/mentorService'
import { fetchPlans } from '../platform/subscriptionService'
import { fetchUsers } from './usersApi'

/** GET /v1/admin/dashboard/stats */
export async function fetchAdminReports() {
  if (!isApiEnabled()) return fetchAdminOverview()
  const json = await apiRequest(ENDPOINTS.admin.dashboard.stats)
  return {
    totalUsers: json.totalUsers ?? null,
    totalRevenue: json.totalRevenue ?? null,
    totalMentors: json.totalMentors ?? null,
    totalStudents: json.totalStudents ?? null,
    success: json.success ?? true,
  }
}

export async function fetchAdminUserTypes() {
  if (!isApiEnabled()) return []
  const json = await apiRequest(ENDPOINTS.userTypes.list, { auth: false })
  if (Array.isArray(json)) return json
  return json?.data ?? json?.item ?? json?.items ?? []
}

/** Dashboard overview from admin stats + catalog counts */
export async function fetchAdminOverview() {
  const empty = {
    teachers: null,
    sessions: null,
    skills: null,
    provinces: null,
    plans: null,
    users: null,
    revenue: null,
    students: null,
  }

  if (!isApiEnabled()) return empty

  const [statsRes, sessions, catalog, plans, usersRes] = await Promise.allSettled([
    fetchAdminReports(),
    fetchPublishedSchedules({ status: 'published' }),
    fetchMentorCatalog(),
    fetchPlans(),
    fetchUsers({ page: 1, limit: 1 }),
  ])

  const stats = statsRes.status === 'fulfilled' ? statsRes.value : {}

  return {
    teachers: stats.totalMentors ?? null,
    sessions:
      sessions.status === 'fulfilled' && Array.isArray(sessions.value)
        ? sessions.value.length
        : null,
    skills:
      catalog.status === 'fulfilled' && Array.isArray(catalog.value?.skills)
        ? catalog.value.skills.length
        : null,
    provinces:
      catalog.status === 'fulfilled' && Array.isArray(catalog.value?.provinces)
        ? catalog.value.provinces.length
        : null,
    plans:
      plans.status === 'fulfilled' && Array.isArray(plans.value)
        ? plans.value.length
        : null,
    users: stats.totalUsers ?? usersRes.value?.totalUsers ?? null,
    revenue: stats.totalRevenue ?? null,
    students: stats.totalStudents ?? null,
  }
}

export async function fetchAdminMentors(filters = {}) {
  if (!isApiEnabled()) {
    return { items: [], total: 0, page: filters.page ?? 1, pageSize: filters.pageSize ?? 0 }
  }
  return fetchMentors(filters)
}

export async function fetchAdminSessions(options = {}) {
  if (!isApiEnabled()) return []
  return fetchPublishedSchedules(options)
}

export async function fetchAdminCatalog() {
  if (!isApiEnabled()) {
    return { skills: [], provinces: [] }
  }
  return fetchMentorCatalog()
}

export async function fetchAdminPlans() {
  if (!isApiEnabled()) return []
  return fetchPlans()
}
