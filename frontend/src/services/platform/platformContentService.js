import { apiRequest } from '../core/api'
import { ENDPOINTS } from '../core/endpoints'
import {
  helpFaqs as defaultHelpFaqs,
  helpCategories as defaultHelpCategories,
  termsSections as defaultTermsSections,
  privacySections as defaultPrivacySections,
} from '@/constants'

const STORAGE_KEY = 'rokkru_platform_content'

export const PLATFORM_CONTENT_DEFAULTS = {
  help: {
    faqs: defaultHelpFaqs,
    categories: defaultHelpCategories,
  },
  terms: {
    sections: defaultTermsSections,
  },
  privacy: {
    sections: defaultPrivacySections,
  },
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    /* ignore */
  }
}

export function loadPlatformContent() {
  const stored = readStorage()
  return {
    help: {
      ...PLATFORM_CONTENT_DEFAULTS.help,
      ...(stored?.help ?? {}),
      faqs: stored?.help?.faqs ?? defaultHelpFaqs,
      categories: stored?.help?.categories ?? defaultHelpCategories,
    },
    terms: {
      ...PLATFORM_CONTENT_DEFAULTS.terms,
      ...(stored?.terms ?? {}),
      sections: stored?.terms?.sections ?? defaultTermsSections,
    },
    privacy: {
      ...PLATFORM_CONTENT_DEFAULTS.privacy,
      ...(stored?.privacy ?? {}),
      sections: stored?.privacy?.sections ?? defaultPrivacySections,
    },
    updatedAt: stored?.updatedAt ?? null,
  }
}

/** Backend has no /v1/platform/content — legal/help copy uses local defaults + storage. */
export async function hydratePlatformContent() {
  return loadPlatformContent()
}

export async function savePlatformContent(type, payload) {
  const current = loadPlatformContent()
  const next = {
    ...current,
    [type]: { ...current[type], ...payload, updatedAt: new Date().toISOString() },
    updatedAt: new Date().toISOString(),
  }
  writeStorage(next)
  return next
}

/** Admin system settings (GET /v1/admin/system-settings) — for AdminSettings page */
export async function fetchSystemSettings() {
  const json = await apiRequest(ENDPOINTS.admin.systemSettings)
  return json?.data ?? json ?? {}
}

export async function updateSystemSettings(payload) {
  return apiRequest(ENDPOINTS.admin.systemSettings, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}
