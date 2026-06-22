import { apiRequest } from '../core/api'
import { ENDPOINTS } from '../core/endpoints'
import { defaultSubscriptionState, normalizeSubscription } from '@/utils/mentorSubscription'

function unwrap(json) {
  return normalizeSubscription(json?.data ?? json)
}

/**
 * Backend has no GET /v1/stripe/subscription/current.
 * Subscription status is available after checkout via GET /v1/stripe/session/:id.
 */
export async function fetchCurrentSubscription() {
  return defaultSubscriptionState()
}

export async function fetchSubscriptionFromCheckoutSession(sessionId) {
  if (!sessionId) return defaultSubscriptionState()
  const json = await apiRequest(ENDPOINTS.stripe.session(sessionId))
  const paid =
    json?.status === 'paid' ||
    json?.subscriptionStatus === 'completed' ||
    json?.payment_status === 'paid'

  if (paid) {
    return normalizeSubscription({
      plan: 'premium',
      status: 'active',
      subscribedAt: new Date().toISOString(),
    })
  }
  return unwrap(json)
}

export async function fetchPlans() {
  const json = await apiRequest(ENDPOINTS.stripe.plans, { auth: false })
  return Array.isArray(json) ? json : (json?.data ?? [])
}

export async function createCheckoutSession({ subscriptionPlanId }) {
  const origin = window.location.origin
  const json = await apiRequest(ENDPOINTS.stripe.createCheckout, {
    method: 'POST',
    body: JSON.stringify({
      subscription_plan_id: subscriptionPlanId,
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
    }),
  })
  return json
}

export async function getCheckoutSession(sessionId) {
  return apiRequest(ENDPOINTS.stripe.session(sessionId))
}

export async function getPaymentReceipt(paymentId, userId) {
  const qs = userId != null ? `?user_id=${encodeURIComponent(userId)}` : ''
  return apiRequest(`${ENDPOINTS.stripe.receipt(paymentId)}${qs}`)
}
