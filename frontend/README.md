# RokKru Frontend

Main app for the RokKru tutoring platform. **Team tasks:** see [`docs/TEAM_TASKS.md`](docs/TEAM_TASKS.md).

## Tech Stack

| Area | Library |
|------|---------|
| UI | React 19 + Vite 8 |
| Routing | react-router-dom |
| Styling | Tailwind CSS + clsx |
| Components | Radix primitives + custom (`components/ui`) |
| Icons | lucide-react |
| Charts | recharts |
| HTTP | Axios via `services/core/api.js` (cookies + JWT) |
| State | React hooks + `AuthContext` |
| i18n | `lib/localeEn.js`, `lib/localeKm.js` |

## Quick Start

```powershell
# Terminal 1 — backend
cd ..\backend_rokkru
npm install
npm start

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
# http://localhost:5173
```

## Environment

```env
# .env
VITE_API_URL=/api
```

Vite proxies `/api` → `http://localhost:3000`. Full URL example: `/api` + `/v1/mentors` → `http://localhost:3000/api/v1/mentors`.

## Folder structure (`src/`)

```
src/
├── pages/           # auth | student | mentor | admin | community | legal
├── components/      # ui | layout | common | backgrounds | admin/content
├── hooks/           # auth | mentor | admin | forms | ui
├── services/        # core | auth | mentors | students | communities | admin | platform
├── lib/             # *ApiMap.js, i18n, authStorage, validation
├── constants/       # env, filters, routes, legal defaults
├── utils/           # mappers, filters, export helpers
└── contexts/
```

## API layer

- **Endpoints:** `src/services/core/endpoints.js` — must match `backend_rokkru`
- **HTTP:** `apiRequest(path, init)` from `@/services`
- **Never** call invented paths (`/sessions`, `/communities`, `/search` as standalone backend routes)

```javascript
import { apiRequest } from '@/services'
import { ENDPOINTS } from '@/services/core/endpoints'

const json = await apiRequest(ENDPOINTS.mentors.catalog)
```

## Import alias

```javascript
import { Button } from '@/components/ui'
import { useAuth } from '@/hooks'
import { fetchMentors } from '@/services/mentors/mentorService'
import { cn } from '@/lib/utils'
```

`@/` → `src/` (`jsconfig.json` + `vite.config.js`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server :5173 |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run preview` | Preview `dist/` |

## Docs

| File | Content |
|------|---------|
| [`docs/TEAM_TASKS.md`](docs/TEAM_TASKS.md) | Team folder ownership & API checklist |
| [`docs/MENTOR_FRONTEND.md`](docs/MENTOR_FRONTEND.md) | Mentor module guide |
| [`../PROJECT_STRUCTURE.md`](../PROJECT_STRUCTURE.md) | Full repo structure |
