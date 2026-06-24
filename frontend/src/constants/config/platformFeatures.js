/**
 * Platform features — set true only when backend API exists.
 * UI routes, nav links, and CTAs respect these flags.
 */
export const PLATFORM_FEATURES = {
  bookings: false,
  messages: false,
  leaderboard: false,
}

export function isBookingsEnabled() {
  return PLATFORM_FEATURES.bookings
}

export function isMessagesEnabled() {
  return PLATFORM_FEATURES.messages
}

export function isLeaderboardEnabled() {
  return PLATFORM_FEATURES.leaderboard
}
