/**
 * Mentor browse filter UI constants.
 * Majors, subjects, and provinces are loaded from the database via
 * `useMentorFilterCatalog()` → GET /v1/mentors/catalog — do not add catalog lists here.
 */

export const FILTER_ALL = {
  major: 'All Majors',
  subject: 'All Subjects',
  location: 'All Provinces',
  sort: 'Highest Rated',
  type: 'All Types',
  time: 'Any Time',
}

export const DEFAULT_TEACHER_FILTERS = {
  ...FILTER_ALL,
  locationDistrict: '',
  locationCommune: '',
  locationVillage: '',
}

/** Sort / session UI labels — not stored in DB */
export const sortOptions = [
  'Best Match',
  'Highest Rated',
  'Most Popular',
  'Newest',
  'Most Reviewed',
  'Price: Low to High',
  'Price: High to Low',
  'Nearest Location',
  'Most Students',
  'Top Recommended',
]

export const sessionTypeOptions = [
  FILTER_ALL.type,
  'Private',
  'Group',
  'Private Math',
  'Group Science',
]

export const sessionTimeOptions = [
  FILTER_ALL.time,
  '08:00–10:00',
  '10:00–12:00',
  '12:00–14:00',
  '14:00–16:00',
  '16:00–18:00',
  '18:00–20:00',
]

/**
 * Offline / pre-catalog fallback — sentinel options only.
 * Replaced by `buildMentorFilterOptionSet()` when the API catalog loads.
 */
export const DEFAULT_FILTER_OPTION_SET = {
  majors: [FILTER_ALL.major],
  subjects: [FILTER_ALL.subject],
  locations: [FILTER_ALL.location],
  sorts: sortOptions,
  types: sessionTypeOptions,
  times: sessionTimeOptions,
}
