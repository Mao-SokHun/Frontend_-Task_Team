# Team ownership — file រួម

ពេល **មិនដឹង** file ណាជា member ណា → មើលតារាងនេះ។

**Commit commands:** [`COMMIT_GUIDE.md`](COMMIT_GUIDE.md) · **Hub:** [`README.md`](README.md)

---

## Push order

```
Bunhieng (①) → Sophy (②) → Ratanak (③) → Sokhun (④)
```

---

## Shared files — តើជា member ណា?

| File / folder | Owner | ហេតុ |
|---------------|-------|------|
| `App.jsx` | Bunhieng | routes + លាក់ feature |
| `MainLayout`, `settingsMenuConfig` | Bunhieng | nav |
| `SearchFilter`, `constants/filters/` | Bunhieng | mentor catalog |
| `platformFeatures.js` | Bunhieng | on/off feature |
| `localeEn.js`, `localeKm.js` | Bunhieng | i18n |
| `CommunityPostCard.jsx` | Bunhieng | UI រួម (Ratanak កុំកែឯករាជ្យ) |
| `MentorRatingsSection.jsx` | Sophy | Sokhun import |
| `services/students/` | Sophy | student API |
| `pages/community/`, `services/communities/` | Ratanak | community |
| `endpoints.js` (community block) | Ratanak | like/comment API |
| `communityUi.js` | Ratanak | community constants |
| `MentorPublicProfile.jsx` | Sokhun | mentor public page |

---

## Folder mirror

```
tasks/bunhieng/components/...  →  frontend/src/components/...
tasks/sophy/pages/student/...   →  frontend/src/pages/student/...
tasks/ratanak/pages/community/  →  frontend/src/pages/community/...
tasks/sokhun/pages/mentor/...   →  frontend/src/pages/mentor/...
```

path ក្រោម `tasks/<member>/` ត្រូវ **ដូច** path ក្រោម `frontend/src/`។
