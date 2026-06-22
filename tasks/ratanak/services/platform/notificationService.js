import { apiRequest, isApiEnabled } from '../core/api'
import { ENDPOINTS } from '../core/endpoints'

/**
 * Backend exposes POST /v1/admin/notifications (broadcast) only.
 * No per-user notification inbox — return empty list for student UI.
 */
export async function fetchNotifications() {
  if (!isApiEnabled()) return []
  return []
}

export async function markNotificationRead() {
  return { read: true }
}

export async function markAllNotificationsRead() {
  return { success: true }
}

/** Admin broadcast — POST /v1/admin/notifications */
export async function broadcastNotification(payload) {
  return apiRequest(ENDPOINTS.admin.notifications, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
