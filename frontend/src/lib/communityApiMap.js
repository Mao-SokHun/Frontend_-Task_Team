import { COMMUNITY_GRADIENTS } from '@/constants/communities/communityUi'

/** Map backend student community API rows → UI shapes */

function unwrapData(json) {
  return json?.data ?? json
}

export function communityTypeRowToUi(row = {}) {
  const id = row.community_type_id ?? row.id
  const name = String(row.community_name ?? row.name ?? '').trim()
  const description = String(row.community_description ?? row.description ?? '').trim()
  const short = name
    ? name
        .split(/\s+/)
        .map((w) => w[0])
        .join('')
        .slice(0, 4)
        .toUpperCase()
    : 'COM'

  const gradientIndex =
    typeof id === 'number' ? id % COMMUNITY_GRADIENTS.length : 0

  return {
    id,
    name,
    short,
    label: name,
    category: description || 'General',
    description,
    members: row.member_count ?? 0,
    topics: row.post_count ?? 0,
    icon: row.icon ?? null,
    badgeGradient: COMMUNITY_GRADIENTS[gradientIndex] ?? COMMUNITY_GRADIENTS[0],
  }
}

export function communityPostRowToUi(row = {}) {
  const type = row.communityType ?? row.community_type ?? {}
  const student = row.student ?? {}
  const user = student.user ?? student.User ?? {}
  const authorName =
    user.user_name ??
    ([student.firstname, student.lastname].filter(Boolean).join(' ').trim() ||
      user.email?.split('@')[0] ||
      'Student')

  const typeName = type.community_name ?? type.name ?? ''

  return {
    id: row.community_post_id ?? row.id,
    author: authorName,
    authorRole: 'Student',
    dept: typeName,
    category: typeName ? typeName.toUpperCase() : 'ALL POSTS',
    title: row.title ?? '',
    body: row.description ?? '',
    preview: row.description ?? '',
    image: row.image_url ?? null,
    time: row.create_date ?? row.created_at ?? '',
    comments: row.comment_count ?? 0,
    likes: row.like_count ?? 0,
    communityTypeId: row.community_type_id ?? type.community_type_id ?? null,
  }
}

export function unwrapCommunityPosts(json) {
  const data = unwrapData(json)
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.posts)) return data.posts
  return []
}

export function unwrapCommunityTypes(json) {
  const data = unwrapData(json)
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.types)) return data.types
  return []
}

export function communityPostToApiPayload({ communityTypeId, title, description, imageUrl }) {
  return {
    community_type_id: communityTypeId,
    title: String(title ?? '').trim(),
    description: String(description ?? '').trim() || null,
    image_url: imageUrl?.trim() || null,
  }
}

function formatCommentDate(value) {
  if (!value) return ''
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return String(value)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  } catch {
    return String(value)
  }
}

/** Backend comment row → feed UI */
export function communityCommentRowToUi(row = {}) {
  const user = row.User ?? row.user ?? {}
  const author =
    user.user_name ??
    user.email?.split('@')[0] ??
    'User'

  return {
    id: row.comment_id ?? row.id,
    author,
    time: formatCommentDate(row.create_date ?? row.created_at),
    content: row.content ?? '',
  }
}

/** Root comments + nested replies as a flat list for the feed UI */
export function flattenCommunityComments(comments = []) {
  const out = []
  for (const row of comments) {
    out.push(communityCommentRowToUi(row))
    const replies = row.Replies ?? row.replies ?? []
    for (const reply of replies) {
      const ui = communityCommentRowToUi(reply)
      out.push({ ...ui, author: `↳ ${ui.author}` })
    }
  }
  return out
}
