import { useCallback, useEffect, useMemo, useState } from 'react'
import { isApiEnabled } from '@/constants'
import {
  createCommunityPostComment,
  fetchCommunityPostComments,
  fetchCommunityPostLikes,
  toggleCommunityPostLike,
} from '@/services/communities/communityService'

const postKey = (id) => String(id)

/**
 * Community post likes & comments via /v1/community/* (posts CRUD stays on /v1/students/community).
 * @param {string|number|null|undefined} [focusPostId] — when set, loads likes + comments for that post
 */
export function useCommunityPostState(focusPostId = null) {
  const [likedIds, setLikedIds] = useState(() => new Set())
  const [likeCounts, setLikeCounts] = useState({})
  const [commentsByPost, setCommentsByPost] = useState({})
  const [engagementLoading, setEngagementLoading] = useState(false)
  const [engagementError, setEngagementError] = useState(null)

  const likedIdList = useMemo(() => [...likedIds], [likedIds])

  const refreshLikes = useCallback(async (postId) => {
    if (!postId || !isApiEnabled()) return
    const counts = await fetchCommunityPostLikes(postId)
    const key = postKey(postId)
    setLikeCounts((prev) => ({ ...prev, [key]: counts.likes_count }))
  }, [])

  const refreshComments = useCallback(async (postId) => {
    if (!postId || !isApiEnabled()) return
    const items = await fetchCommunityPostComments(postId)
    const key = postKey(postId)
    setCommentsByPost((prev) => ({ ...prev, [key]: items }))
  }, [])

  useEffect(() => {
    if (!focusPostId || !isApiEnabled()) return

    let cancelled = false
    setEngagementLoading(true)
    setEngagementError(null)

    Promise.all([refreshLikes(focusPostId), refreshComments(focusPostId)])
      .catch((err) => {
        if (!cancelled) setEngagementError(err)
      })
      .finally(() => {
        if (!cancelled) setEngagementLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [focusPostId, refreshLikes, refreshComments])

  const isLiked = useCallback(
    (postId) => likedIds.has(postKey(postId)),
    [likedIds]
  )

  const getLikeCount = useCallback(
    (postId, fallback = 0) => {
      const key = postKey(postId)
      if (likeCounts[key] != null) return likeCounts[key]
      return fallback
    },
    [likeCounts]
  )

  const toggleLike = useCallback(
    async (postId) => {
      if (!postId || !isApiEnabled()) return
      const key = postKey(postId)
      const wasLiked = likedIds.has(key)

      setEngagementError(null)
      try {
        await toggleCommunityPostLike(postId, { is_like: true })
        setLikedIds((prev) => {
          const next = new Set(prev)
          if (wasLiked) next.delete(key)
          else next.add(key)
          return next
        })
        await refreshLikes(postId)
      } catch (err) {
        setEngagementError(err)
        throw err
      }
    },
    [likedIds, refreshLikes]
  )

  const addComment = useCallback(
    async (postId, text) => {
      if (!postId || !text?.trim() || !isApiEnabled()) return
      setEngagementError(null)
      try {
        await createCommunityPostComment(postId, text)
        await refreshComments(postId)
      } catch (err) {
        setEngagementError(err)
        throw err
      }
    },
    [refreshComments]
  )

  return {
    likedIds: likedIdList,
    isLiked,
    getLikeCount,
    commentsByPost,
    toggleLike,
    addComment,
    refreshLikes,
    refreshComments,
    engagementLoading,
    engagementError,
  }
}

export default useCommunityPostState
