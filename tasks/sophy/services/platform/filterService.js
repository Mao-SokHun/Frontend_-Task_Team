import { isApiEnabled } from '../core/api'
import { DEFAULT_FILTER_OPTION_SET } from '@/constants'
import { fetchMentorCatalog } from '../mentors/mentorService'
import { buildMentorFilterOptionSet } from '@/utils/mentorFilterOptions'

/** Filter dropdowns — GET /v1/mentors/catalog */
export async function fetchFilterOptions(lang = 'en') {
  if (!isApiEnabled()) {
    return DEFAULT_FILTER_OPTION_SET
  }

  const { skills, provinces } = await fetchMentorCatalog()
  if (!skills.length && !provinces.length) {
    return DEFAULT_FILTER_OPTION_SET
  }
  return buildMentorFilterOptionSet(skills, provinces, lang)
}
