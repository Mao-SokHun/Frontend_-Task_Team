import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { isApiEnabled } from '@/constants'
import {
  createMentorRating,
  fetchMentorRatings,
  fetchMyMentorRating,
} from '@/services/students/studentReviewService'

/**
 * Mentor star ratings — public list + student create (POST only).
 * @param {string|number|null|undefined} mentorId
 */
export function useMentorRatings(mentorId) {
  const { user } = useAuth()
  const canRate = Boolean(user && user.role === 'student')
  const [ratings, setRatings] = useState([])
  const [summary, setSummary] = useState({ average: null, count: 0 })
  const [myRating, setMyRating] = useState(null)
  const [loading, setLoading] = useState(Boolean(mentorId && isApiEnabled()))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    if (!mentorId || !isApiEnabled()) {
      setRatings([])
      setSummary({ average: null, count: 0 })
      setMyRating(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const [listData, mine] = await Promise.all([
        fetchMentorRatings(mentorId, { limit: 20 }),
        canRate ? fetchMyMentorRating(mentorId) : Promise.resolve(null),
      ])
      setRatings(listData.items)
      setSummary({
        average: listData.average_rating,
        count: listData.rating_count,
      })
      setMyRating(mine)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [mentorId, canRate])

  useEffect(() => {
    reload()
  }, [reload])

  const saveRating = useCallback(
    async (starValue) => {
      if (!mentorId) throw new Error('Mentor id is required')
      if (myRating) return myRating
      setSaving(true)
      setError(null)
      try {
        const result = await createMentorRating(mentorId, { rating: starValue })
        await reload()
        return result
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setSaving(false)
      }
    },
    [mentorId, myRating, reload]
  )

  return {
    ratings,
    summary,
    myRating,
    loading,
    saving,
    error,
    canRate,
    reload,
    saveRating,
  }
}

export default useMentorRatings
