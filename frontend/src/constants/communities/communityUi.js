/** Community UI tokens — feed/types/posts come from API */

export const COMMUNITY_GRADIENTS = [
  'from-primary-200 to-primary-400 text-primary-800',
  'from-sky-200 to-sky-400 text-sky-900',
  'from-emerald-200 to-emerald-400 text-emerald-900',
  'from-amber-200 to-amber-400 text-amber-900',
  'from-purple-200 to-purple-400 text-purple-900',
  'from-rose-200 to-rose-400 text-rose-900',
  'from-cyan-200 to-cyan-400 text-cyan-900',
  'from-indigo-200 to-indigo-400 text-indigo-900',
]

export const COMMUNITY_CARD_GRADIENTS = [
  'from-primary-400 to-primary-500',
  'from-sky-500 to-blue-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-500',
  'from-violet-500 to-purple-600',
  'from-rose-400 to-rose-600',
]

/** Fallback feed tab when API types are not loaded yet */
export const COMMUNITY_FEED_TABS = ['ALL POSTS']

export function filterCommunities(list, query) {
  const q = query?.trim().toLowerCase()
  if (!q) return list
  return list.filter(
    (c) =>
      c.name?.toLowerCase().includes(q) ||
      c.label?.toLowerCase().includes(q) ||
      c.category?.toLowerCase().includes(q) ||
      c.short?.toLowerCase().includes(q)
  )
}
