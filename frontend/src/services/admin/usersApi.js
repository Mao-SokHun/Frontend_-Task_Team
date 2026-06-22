import { apiRequest } from '../core/client'
import { ENDPOINTS } from '../core/endpoints'
import { isApiEnabled } from '@/constants'

/** GET /v1/admin/dashboard/users */
export async function fetchUsers(params = {}) {
  if (!isApiEnabled()) return []

  const qs = new URLSearchParams()
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.search) qs.set('search', params.search)

  const query = qs.toString()
  const json = await apiRequest(
    `${ENDPOINTS.admin.dashboard.users}${query ? `?${query}` : ''}`
  )

  if (Array.isArray(json)) return json
  if (Array.isArray(json?.users)) return json.users
  return json?.data?.users ?? json?.data ?? []
}

export async function fetchUserById(id) {
  if (!isApiEnabled() || id == null) return null
  const json = await apiRequest(ENDPOINTS.admin.dashboard.userById(id))
  return json?.user ?? json?.data?.user ?? json?.data ?? json
}

export async function suspendUser(userId) {
  if (!isApiEnabled() || userId == null) return null
  return apiRequest(ENDPOINTS.admin.dashboard.userStatus, {
    method: 'PUT',
    body: JSON.stringify({ user_id: userId, status: 'suspended' }),
  })
}

export async function changeUserRole(userId, userTypeId) {
  if (!isApiEnabled() || userId == null) return null
  return apiRequest(ENDPOINTS.admin.dashboard.userRole(userId), {
    method: 'PUT',
    body: JSON.stringify({ user_type_id: userTypeId }),
  })
}
