# Constants (`@/constants`)

App configuration and UI labels — **not** database catalog data.

```
constants/
  config/       env (API URL)
  ui/           tokens, typography
  filters/      FILTER_ALL, sort/time labels (catalog from API)
  student/      empty profile shape, learning-focus labels
  mentor/       empty mentor profile defaults
  communities/  gradients, feed tab fallback (types from API)
  legal/        admin CMS seed copy (editable in admin)
```

## Rules

| Source | Use for |
|--------|---------|
| **API / database** | Majors, subjects, provinces, community posts, mentors, profiles |
| **constants** | `FILTER_ALL`, sort labels, routes, empty form shapes, UI tokens |
| **contexts** | Share UI state across components |

## Filter catalog

- `useMentorFilterCatalog()` → `GET /v1/mentors/catalog`
- Do **not** add `majorOptions`, `majors.json`, or `majorSubjects.js` (removed)

## Community

- Feed tabs built from `fetchCommunityTypes()` when API loads
- `COMMUNITY_FEED_TABS` is only `['ALL POSTS']` until types load

## Ownership

| Folder | Owner |
|--------|-------|
| `constants/filters/mentorFilters.js` | Bunhieng |
| `constants/student/` | Sophy |
| `constants/communities/` | Ratanak |
