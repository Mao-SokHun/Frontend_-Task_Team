import { useState, useEffect, useCallback } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  defaultSubscriptionState,
  hasPremiumAccess,
  normalizeSubscription,
} from '../../utils/mentorSubscription'
import {
  fetchCurrentSubscription,
  fetchSubscriptionFromCheckoutSession,
} from '../../services/platform/subscriptionService'

const SUBSCRIPTION_STORAGE_KEY = 'rokkru_mentor_subscription'

/** Keeps billing/subscription UI in sync with Stripe checkout session API. */
export const useMentorSubscription = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [subscription, setSubscription] = useState(() => {
    try {
      const raw = localStorage.getItem(SUBSCRIPTION_STORAGE_KEY)
      return raw ? normalizeSubscription(JSON.parse(raw)) : defaultSubscriptionState()
    } catch {
      return defaultSubscriptionState()
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const persist = useCallback((next) => {
    const normalized = normalizeSubscription(next)
    setSubscription(normalized)
    try {
      localStorage.setItem(SUBSCRIPTION_STORAGE_KEY, JSON.stringify(normalized))
    } catch {
      /* ignore */
    }
  }, [])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const sessionId = searchParams.get('session_id')
      if (sessionId) {
        const fromCheckout = await fetchSubscriptionFromCheckoutSession(sessionId)
        persist(fromCheckout)
        return
      }
      const data = await fetchCurrentSubscription()
      persist(data)
    } catch (err) {
      setError(err?.message || 'Failed to load subscription')
      persist(defaultSubscriptionState())
    } finally {
      setLoading(false)
    }
  }, [persist, searchParams])

  useEffect(() => {
    refresh()
  }, [location.pathname, refresh])

  return {
    subscription,
    isPremium: hasPremiumAccess(subscription),
    hasSubscription: subscription.plan === 'premium',
    loading,
    error,
    refresh,
    setSubscription: persist,
  }
}

export default useMentorSubscription
