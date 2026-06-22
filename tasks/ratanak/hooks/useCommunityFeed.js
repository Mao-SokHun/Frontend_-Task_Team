import { useEffect, useState } from 'react'
import { isApiEnabled } from '@/constants'
import { fetchCommunityPosts } from '@/services/communities/communityService'

export function useCommunityFeed(params = {}) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(isApiEnabled())
  const [error, setError] = useState(null)

  const q = params.q
  const communityTypeId = params.communityTypeId

  useEffect(() => {
    if (!isApiEnabled()) {
      setPosts([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchCommunityPosts({ q, communityTypeId, limit: params.limit ?? 50 })
      .then((items) => {
        if (!cancelled) setPosts(Array.isArray(items) ? items : [])
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setPosts([])
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [q, communityTypeId, params.limit])

  return { posts, loading, error, setPosts }
}

export default useCommunityFeed
