import { isApiEnabled } from '../core/api'

/**
 * Student session bookings — waiting for backend booking routes.
 * No local mock persistence; returns empty until API is wired.
 */

export async function bookSession() {
  if (!isApiEnabled()) {
    throw new Error('Set VITE_API_URL in .env to enable booking.')
  }
  throw new Error('Booking API is not available yet. Connect the backend booking endpoint.')
}

export function fetchMyBookings() {
  return []
}

export function getBookingById() {
  return null
}
