import axios from 'axios'
import { getApiBaseUrl as getBaseUrl, isApiEnabled } from '@/constants'
import { getToken, setAccessTokenCookie } from '@/lib/authStorage'
import { ApiError } from './apiErrors'

/** @type {(() => void) | null} */
let onUnauthorized = null

/** Called on 401 — wire in AuthProvider to clear session */
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

function buildPath(path) {
  return path.startsWith('/') ? path : `/${path}`
}

function authHeaders(headers, auth) {
  const next = { ...headers }
  if (!auth) return next
  const token = getToken()
  if (token && token !== 'cookie-session') {
    setAccessTokenCookie(token)
    next.Authorization = `Bearer ${token}`
  }
  return next
}

/** @param {unknown} body */
function toAxiosData(body) {
  if (body == null) return undefined
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return body
    }
  }
  return body
}

/**
 * @param {import('axios').AxiosError} error
 * @param {boolean} skipAuthRedirect
 */
function throwApiError(error, skipAuthRedirect) {
  if (error.response) {
    const { status, data: body, statusText } = error.response
    const payload = body && typeof body === 'object' ? body : {}
    const message = payload.message ?? payload.error ?? statusText

    if (status === 401 && onUnauthorized && !skipAuthRedirect) {
      onUnauthorized()
    }

    throw new ApiError(message, status, payload)
  }

  throw error
}

/**
 * @param {string} path — e.g. `/v1/mentors`
 * @param {import('axios').AxiosRequestConfig & { auth?: boolean; skipAuthRedirect?: boolean; body?: unknown }} [init]
 */
export async function apiRequest(path, init = {}) {
  const {
    auth = true,
    skipAuthRedirect = false,
    method = 'GET',
    body,
    headers: initHeaders = {},
    data,
    signal,
  } = init

  try {
    const res = await axios.request({
      baseURL: getBaseUrl(),
      url: buildPath(path),
      method: String(method).toLowerCase(),
      data: data ?? toAxiosData(body),
      headers: authHeaders(
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(initHeaders && typeof initHeaders === 'object' ? initHeaders : {}),
        },
        auth
      ),
      withCredentials: isApiEnabled(),
      signal,
    })

    return res.status === 204 ? null : res.data
  } catch (error) {
    throwApiError(error, skipAuthRedirect)
  }
}

/** Multipart upload — Content-Type set by axios for FormData. */
export async function apiFormRequest(path, formData, init = {}) {
  const {
    auth = true,
    skipAuthRedirect = false,
    method = 'POST',
    headers: initHeaders = {},
    signal,
  } = init

  try {
    const res = await axios.request({
      baseURL: getBaseUrl(),
      url: buildPath(path),
      method: String(method).toLowerCase(),
      data: formData,
      headers: authHeaders(
        {
          Accept: 'application/json',
          ...(initHeaders && typeof initHeaders === 'object' ? initHeaders : {}),
        },
        auth
      ),
      withCredentials: isApiEnabled(),
      signal,
    })

    return res.status === 204 ? null : res.data
  } catch (error) {
    throwApiError(error, skipAuthRedirect)
  }
}

export { isApiEnabled, getBaseUrl as getApiBaseUrl, ApiError }
