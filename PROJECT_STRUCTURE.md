# RokKru — Project Structure & Flow

> **អានរហ័ស:** `frontend/` = app រួម · `tasks/` = task របស់ member · `backend_rokkru/` = API + DB  
> **Workflow:** [`GIT_WORKFLOW.md`](GIT_WORKFLOW.md) · **Tasks:** [`frontend/docs/TEAM_TASKS.md`](frontend/docs/TEAM_TASKS.md)

---

## 1. Workspace — folder នីមួយធ្វើអី?

```
d:\Full Frontend/
├── frontend/          ← App React ពេញ (run npm run dev)
├── tasks/             ← Slice តាម member (commit GitLab)
├── backend_rokkru/    ← API Express + PostgreSQL
├── scripts/           ← extract-tasks.ps1, paste-task.ps1
├── GIT_WORKFLOW.md
└── PROJECT_STRUCTURE.md   ← file នេះ
```

| Folder | ប្រើធ្វើអី? | នរណា? |
|--------|------------|--------|
| **`frontend/`** | App រួម — routes, pages, components, services | គ្រប់គ្នា pull មុន |
| **`tasks/<member>/`** | Copy task របស់អ្នក (mirror `frontend/src/`) | Commit តែ folder របស់ខ្លួន |
| **`backend_rokkru/`** | REST API, auth, DB models | Backend team |
| **`scripts/`** | `paste-task.ps1` (tasks → frontend), `extract-tasks.ps1` (frontend → tasks) | Lead / Bunhieng |

---

## 2. Big picture — ពី Browser ទៅ Database

```mermaid
flowchart LR
  subgraph Browser["🌐 Browser :5173"]
    UI["React Pages"]
  end

  subgraph FE["frontend/"]
  direction TB
    P["pages/"]
    H["hooks/"]
    S["services/"]
    L["lib/*ApiMap.js"]
    C["components/"]
    P --> H
    P --> C
    H --> S
    S --> L
  end

  subgraph Proxy["Vite proxy"]
    V["/api → localhost:3000"]
  end

  subgraph BE["backend_rokkru/"]
  direction TB
    RT["routes/v1/"]
    MW["middleware/auth"]
    CT["controllers/"]
    MD["models/ (Sequelize)"]
    RT --> MW --> CT --> MD
  end

  DB[("PostgreSQL")]

  UI --> P
  S -->|"fetch /api/v1/..."| V
  V --> RT
  MD --> DB
```

**URL chain (ឧទាហរណ៍):**

```
Browser  →  GET /api/v1/students/community/posts
Vite     →  proxy  →  http://localhost:3000/api/v1/students/community/posts
Express  →  routes/v1/students.js  →  controller  →  PostgreSQL
```

---

## 3. Frontend — រចនាសម្ព័ន្ធ & flow

### 3.1 Layer diagram — ហៅពីណាទៅណា

```mermaid
flowchart TB
  subgraph Entry["ចូល app"]
    main["main.jsx"]
    App["App.jsx — routes + layouts"]
    main --> App
  end

  subgraph Providers["Global wrap"]
    Auth["AuthProvider"]
    Lang["LanguageProvider"]
    Ctx["Contexts — PlatformContent, MentorQuickView"]
    App --> Auth --> Lang --> Ctx
  end

  subgraph UI["UI layer — មិន fetch ផ្ទាល់"]
    Pages["pages/ — screens"]
    Comp["components/ — ui, layout, common"]
    Pages --> Comp
  end

  subgraph Logic["Logic layer"]
    Hooks["hooks/ — state, side effects"]
    Utils["utils/ — pure helpers"]
    Pages --> Hooks
    Pages --> Utils
  end

  subgraph Data["Data layer — API តែនៅទីនេះ"]
    Svc["services/*.js"]
    EP["services/core/endpoints.js"]
    API["services/core/api.js — apiRequest()"]
    Map["lib/*ApiMap.js — DB field ↔ UI field"]
    Svc --> EP
    Svc --> API
    Svc --> Map
  end

  subgraph Storage["Local"]
    AuthSt["lib/authStorage.js"]
    LS["localStorage — booking, CMS fallback"]
  end

  Ctx --> Pages
  Hooks --> Svc
  Auth --> AuthSt
  Auth --> Svc
  API -->|"fetch + JWT cookie"| Net["Backend /api/v1"]
```

### 3.2 ច្បាប់មាស (frontend)

| Layer | Folder | ធ្វើអី? | ហៅពីណា? | ទៅណា? |
|-------|--------|---------|---------|-------|
| **Route** | `App.jsx` | URL → page component | Browser URL | `pages/*`, `ProtectedRoute` |
| **Page** | `pages/` | Screen UI, compose components | `App.jsx` routes | `hooks/`, `components/` |
| **Hook** | `hooks/` | Load data, form state | `pages/` | `services/` |
| **Service** | `services/` | HTTP calls only | `hooks/`, `AuthContext` | `apiRequest()` → backend |
| **Mapper** | `lib/*ApiMap.js` | Rename backend fields for UI | `services/` | — |
| **Component** | `components/` | Reusable UI blocks | `pages/`, other components | — |
| **Core** | `services/core/` | `endpoints.js`, `api.js` | All services | Backend |

> **ហាម:** `pages/` មិន `fetch()` ផ្ទាល់ — តែងតែហៅ `services/`

### 3.2.1 MVC ឬអត់? — Frontend vs Backend pattern

**ចម្លើយខ្លី:** Frontend **មិន** follow MVC បែបចាស់ — ប្រើ **Layered React** (View + Hooks + Services)។  
**Model** ពិតស្ថិតនៅ **backend** (`models/` + PostgreSQL) តែមួយ។

#### MVC បែបចាស់ vs RokKru

| MVC (classic) | RokKru frontend | Folder |
|---------------|-----------------|--------|
| **Model** — data + business rules | ❌ មិនមាន model នៅ frontend | Backend `models/` (Sequelize) |
| **View** — UI only | ✅ Pages + Components | `pages/`, `components/` |
| **Controller** — handle input, update model | ⚠️ មិនមាន folder `controllers/` | `hooks/`, `contexts/` ធ្វើតួជំនួស |
| API / data access | ✅ Services | `services/` |

#### Frontend pattern (Layered React)

```mermaid
flowchart TB
  V["View — pages/ + components/"]
  H["Logic — hooks/ + contexts/"]
  S["Data — services/ + lib/*ApiMap.js"]
  API["Backend API + models/"]

  V --> H
  V --> S
  H --> S
  S --> API
```

| Layer | Folder | តួនាទី (≈ MVC) |
|-------|--------|----------------|
| **View** | `pages/`, `components/` | បង្ហាញ UI — មិនដាក់ business logic ធ្ងន់ |
| **Logic** | `hooks/`, `contexts/` | ≈ Controller — state, side effects, orchestration |
| **Data** | `services/`, `lib/*ApiMap.js` | ≈ Model access — HTTP + map API fields |
| **Route** | `App.jsx` | URL → page (React Router, មិនមែន MVC controller) |

#### Backend vs Frontend — ប្រៀបធៀប

| | Backend (`backend_rokkru/`) | Frontend (`frontend/src/`) |
|---|------------------------------|----------------------------|
| **Pattern** | **MVC-style** ✅ | **Layered / Feature-based** |
| **Model** | `models/` — Sequelize + PostgreSQL | — (data មកពី API) |
| **Controller** | `controllers/` | `hooks/` + `contexts/` |
| **View** | — (JSON response) | `pages/` + `components/` |
| **Routes** | `routes/v1/` | `App.jsx` |

#### ហេតុផល Frontend មិនប្រើ full MVC

**1. MVC បែបចាស់ = server-rendered apps**

```
User request → Controller → Model (DB) → Controller → View (HTML)
```

ល្អពេល server បង្កើត HTML ហើយផ្ញើទៅ browser (PHP, Rails, Laravel…)។  
RokKru frontend = **SPA** — React load ម្តង, UI update ក្នុង browser, data មកជា **JSON** ពី API។

**2. Model មានតែមួយ — នៅ backend**

```
PostgreSQL + Sequelize  →  backend/models/
                              ↓ JSON (/api/v1)
                         frontend/services/   (ទទួល + map data តែប៉ុណ្ណោះ)
```

បើដាក់ `models/` នៅ frontend ផង → duplicate business rules, sync លំបាក, team conflict។

**3. React មិនធ្វើបែប MVC class-based**

React រួម **View + Logic** ក្នុង component/hook — មិនមាន `Controller` class ដាច់ដូច MVC។  
Pattern ធម្មតា៖ **Components** + **Hooks** + **Service layer** (standard សម្រាប់ React + REST API)។

**4. បង្ខំ MVC 3 folder ធ្វើឲ្យ team confusing**

```
views/StudentProfile.jsx
controllers/StudentController.js   ← hook ឬ class?
models/Student.js                  ← copy DB schema? localStorage?
```

RokKru workflow `pages → hooks → services` **ច្បាស់ជាង** — ត្រូវនឹង folder ownership (`tasks/sophy/`, …)។

#### Architecture split — MVC ពេញនៅ backend

```mermaid
flowchart TB
  subgraph FE["FRONTEND — Layered React"]
    V2["View: pages/ + components/"]
    L2["Logic: hooks/ + contexts/"]
    D2["Data: services/ + lib/*ApiMap.js"]
    V2 --> L2 --> D2
  end

  subgraph BE["BACKEND — MVC-style"]
    R["Routes: routes/v1/"]
    C["Controller: controllers/"]
    M["Model: models/ + PostgreSQL"]
    R --> C --> M
  end

  D2 -->|"REST /api/v1"| R
```

#### Example — Login (layered, not MVC)

| Step | Path | Layer |
|------|------|-------|
| 1 | `pages/auth/Login.jsx` | View |
| 2 | `services/auth/authService.js` | Data (API call) |
| 3 | `hooks/auth/AuthContext.jsx` | Logic (session state) |
| 4 | `backend/controllers/auth/` | MVC controller (server) |
| 5 | `backend/models/userModel.js` | MVC model (server) |

#### សង្ខេប

| សំណួរ | ចម្លើយ |
|--------|--------|
| Frontend use full MVC? | **ទេ** — Layered React |
| Backend use MVC? | **បាទ** — routes → controllers → models |
| Model នៅណា? | **Backend** តែមួយ |
| Controller នៅ frontend? | **`hooks/` + `contexts/`** (≈ controller) |
| View នៅ frontend? | **`pages/` + `components/`** |

#### Example — Community (layered flow)

```
User opens /community
  → pages/student/Community.jsx       (View)
  → hooks/useCommunityFeed.js         (Logic)
  → services/communities/communityService.js  (Data)
  → lib/communityApiMap.js            (transform API ↔ UI)
  → GET /api/v1/students/community/posts
  → backend controller + model        (MVC នៅ server)
```

### 3.3 Folder tree — `frontend/src/`

```
src/
├── App.jsx              # រៀប routes ទាំងអស់
├── main.jsx             # React entry
├── i18n.js              # EN / KM
│
├── pages/               # 📱 Screens (1 folder = 1 role/module)
│   ├── auth/            # Login, Register, Forgot password
│   ├── onboarding/      # Complete profile, choose community
│   ├── student/         # Home, Schedule, Community, Profile, BookSession…
│   ├── mentor/          # Dashboard, Schedule posts, Billing, Analytics…
│   ├── admin/           # Dashboard, Users, Reports, Settings…
│   ├── community/       # Create community, post detail
│   └── legal/           # Help, Terms, Privacy
│
├── components/
│   ├── ui/              # Button, Input, Modal… (shadcn-style)
│   ├── layout/          # MainLayout, AdminLayout, ProtectedRoute, Navbar
│   ├── common/          # MentorCard, PageCard, CreatePostModal…
│   ├── backgrounds/     # Page ambient backgrounds
│   └── mentor/          # Mentor-only widgets
│
├── hooks/
│   ├── auth/            # AuthContext, useAuth
│   ├── mentor/          # useMentors, useMentorDashboard…
│   ├── admin/           # useAdminUsers, useDashboardStats…
│   ├── forms/           # useBookingForm, useReviewForm…
│   └── ui/              # useModal, usePagination…
│
├── services/            # 🌐 API layer
│   ├── core/            # api.js, endpoints.js, apiErrors.js
│   ├── auth/
│   ├── mentors/
│   ├── students/
│   ├── communities/
│   ├── admin/
│   ├── platform/        # search, filters, stripe, notifications
│   └── sessions/        # wraps mentor posts as schedule slots
│
├── lib/                 # Mappers + i18n + authStorage
├── constants/           # env.js, routes, filter defaults
├── utils/               # Pure helpers
├── contexts/            # PlatformContent, MentorQuickView
└── assets/
```

### 3.4 Example flow — Community page (Ratanak)

```mermaid
sequenceDiagram
  participant U as User
  participant P as pages/student/Community.jsx
  participant H as hooks/useCommunityFeed.js
  participant S as services/communities/communityService.js
  participant M as lib/communityApiMap.js
  participant A as services/core/api.js
  participant B as Backend /api/v1/students/community/posts

  U->>P: Open /community
  P->>H: useCommunityFeed()
  H->>S: fetchCommunityPosts()
  S->>M: communityPostRowToUi()
  S->>A: apiRequest(ENDPOINTS.students.community.posts)
  A->>B: GET /api/v1/students/community/posts
  B-->>A: JSON rows
  A-->>S: parsed JSON
  S-->>H: UI posts[]
  H-->>P: { posts, loading }
  P-->>U: CommunityPostCard list
```

### 3.5 Auth flow

```mermaid
flowchart LR
  Login["pages/auth/Login.jsx"]
  AS["services/auth/authService.js"]
  API["apiRequest /v1/auth/login"]
  BE["backend controllers/auth"]
  Store["lib/authStorage.js"]
  Ctx["hooks/auth/AuthContext"]

  Login --> AS --> API --> BE
  BE -->|"JWT + user"| AS
  AS --> Store
  Store --> Ctx
  Ctx -->|"user, role"| PR["ProtectedRoute"]
  PR --> Pages["pages/student | mentor | admin"]
```

| Role | UI folder | URL prefix |
|------|-----------|------------|
| Guest | `pages/auth`, `pages/legal` | `/`, `/login`, `/register` |
| Student | `pages/student` | `/student/*`, `/community` |
| Mentor | `pages/mentor` | `/mentor/*` |
| Admin | `pages/admin` | `/admin/*` |

---

## 4. Backend — រចនាសម្ព័ន្ធ & flow

### 4.1 Layer diagram

```mermaid
flowchart TB
  subgraph Server["backend_rokkru/"]
    app["app.js — entry, CORS, /api/v1 mount"]
    swagger["/api-docs — Swagger UI"]
    health["/health — DB check"]
  end

  subgraph Routes["routes/v1/"]
    idx["index.js — mount all routers"]
    authR["auth/auth.js"]
    mentorR["mentor/mentors.js"]
    studentR["students.js"]
    userR["Users/UsersRoutes.js"]
    adminR["admin/dashboard, notifications, settings"]
    stripeR["stripe.js"]
  end

  subgraph Middleware["middleware/"]
    protect["auth.js — JWT verify"]
    rbac["rbacAuthorize.js — role check"]
    upload["upload.js — Cloudinary"]
  end

  subgraph Controllers["controllers/"]
    authC["auth/"]
    mentorC["mentorSystem/"]
    studentC["studentSystem/"]
    adminC["Admin/"]
    stripeC["stripe/"]
  end

  subgraph Data["models/ + PostgreSQL"]
    models["Sequelize models + associations"]
  end

  app --> idx
  idx --> authR & mentorR & studentR & userR & adminR & stripeR
  authR & mentorR & studentR --> protect --> rbac --> Controllers
  Controllers --> models
```

### 4.2 Folder tree — `backend_rokkru/`

```
backend_rokkru/
├── app.js                     # Entry — mount /api/v1, CORS, DB sync
├── config/                    # DB connection, Swagger
├── models/                    # Sequelize models (User, Mentor, Student, Post…)
├── controllers/
│   ├── auth/                  # login, register, OTP, password reset
│   ├── mentorSystem/          # mentors, posts, portfolio, skills, ratings
│   ├── studentSystem/         # profile, community posts, history
│   ├── Users/                 # GET/PUT /users/me
│   ├── Admin/                 # dashboard, users, notifications
│   └── stripe/                # checkout, webhook, plans
├── routes/v1/
│   ├── index.js               # Mount all v1 routes
│   ├── auth/auth.js
│   ├── mentor/                # /mentors, posts, portfolio, skills…
│   ├── students.js            # /students/me, /students/community/*
│   ├── Users/UsersRoutes.js
│   ├── stripe.js
│   └── admin/
├── middleware/auth/           # JWT + role authorize
└── utils/                     # email, stripe helpers, mentor helpers
```

### 4.3 Request path inside backend

```
HTTP request
  → app.js (CORS, cookies, static)
  → /api/v1  (routes/v1/index.js)
  → specific router  (e.g. students.js)
  → protect middleware  (verify JWT)
  → authorize('student'|'mentor'|'admin')
  → controller function
  → Sequelize model query
  → JSON response
```

---

## 5. Frontend ↔ Backend — API map

**Base URL:** `VITE_API_URL=/api` → Vite proxy → `http://localhost:3000`

| Frontend service | Backend route | អ្វីដែលធ្វើ |
|------------------|---------------|------------|
| `auth/authService.js` | `POST /v1/auth/login` … | Login, register, OTP |
| `users/userProfileService.js` | `GET/PUT /v1/users/me` | Profile + avatar |
| `mentors/mentorService.js` | `GET /v1/mentors/*` | List mentors, catalog, profile |
| `mentors/mentorScheduleService.js` | `GET/POST /v1/mentors/me/posts` | Mentor schedule posts |
| `students/studentProfileService.js` | `GET/PUT /v1/students/me` | Student profile |
| `students/studentReviewService.js` | `POST /v1/mentors/:id/ratings` | Star rating |
| `communities/communityService.js` | `GET/POST /v1/students/community/*` | Community types & posts |
| `sessions/sessionService.js` | `GET /v1/mentors/posts` | Published schedule (student view) |
| `admin/adminApi.js` | `GET /v1/admin/dashboard/*` | Admin stats & users |
| `platform/subscriptionService.js` | `POST /v1/stripe/*` | Stripe checkout |
| `platform/filterService.js` | `GET /v1/mentors/catalog` | Skills + provinces |
| `students/studentBookingService.js` | — | **No API** — localStorage only |
| `platform/platformContentService.js` | — | **No API** — localStorage CMS |

**Path constants:** កំណត់ម្តងនៅ `frontend/src/services/core/endpoints.js` — ត្រូវ match `backend_rokkru/routes/v1/`

---

## 6. Team — folder ownership (`tasks/`)

```mermaid
flowchart TB
  FE["frontend/ — app រួម"]
  T["tasks/ — member slices"]

  B["tasks/bunhieng/"] -->|"components, services/core"| FE
  SO["tasks/sorint/"] -->|"pages/auth, services/auth"| FE
  SP["tasks/sophy/"] -->|"pages/student, services/students"| FE
  SK["tasks/sokhun/"] -->|"pages/mentor, services/mentors"| FE
  R["tasks/ratanak/"] -->|"pages/community, services/communities"| FE
  SM["tasks/somnang/"] -->|"pages/admin, services/admin"| FE
```

| Member | `tasks/` folder | `frontend/src/` paths |
|--------|-----------------|----------------------|
| Bunhieng | `tasks/bunhieng/` | `components/`, `services/core/`, shared `lib/` |
| Sorint | `tasks/sorint/` | `pages/auth`, `pages/onboarding`, `hooks/auth`, `services/auth` |
| Sophy | `tasks/sophy/` | `pages/student`, `services/students`, student hooks |
| Sokhun | `tasks/sokhun/` | `pages/mentor`, `hooks/mentor`, `services/mentors` |
| Ratanak | `tasks/ratanak/` | `pages/community`, `services/communities`, community hooks |
| Somnang | `tasks/somnang/` | `pages/admin`, `hooks/admin`, `services/admin` |

```powershell
# Member workflow
git pull
.\scripts\paste-task.ps1 -Member sophy   # optional
cd frontend && npm run dev
git add tasks/sophy/
git push
```

---

## 7. Config files

| File | ធ្វើអី? |
|------|--------|
| `frontend/.env` | `VITE_API_URL=/api` |
| `frontend/vite.config.js` | Proxy `/api` → `:3000`, alias `@/` → `src/` |
| `frontend/src/services/core/endpoints.js` | API path constants |
| `frontend/src/constants/config/env.js` | `isApiEnabled()`, `getApiBaseUrl()` |
| `backend_rokkru/.env` | `PORT=3000`, DB, JWT, Stripe keys |
| `backend_rokkru/app.js` | `FRONTEND_URL=http://localhost:5173` |

---

## 8. Quick start

```powershell
# Terminal 1 — Backend
cd backend_rokkru
npm install
npm start
# http://localhost:3000  |  Swagger: /api-docs  |  Health: /health

# Terminal 2 — Frontend
cd frontend
copy .env.example .env
npm install
npm run dev
# http://localhost:5173
```

---

## 9. Tech stack

| | Frontend | Backend |
|---|----------|---------|
| **Runtime** | React 19 + Vite 8 | Node.js + Express |
| **Style** | Tailwind CSS | — |
| **Router** | React Router | Express routes |
| **HTTP** | `fetch` via `apiRequest` | — |
| **DB** | — | PostgreSQL + Sequelize |
| **Auth** | JWT + cookies (`authStorage`) | JWT middleware + RBAC |
| **i18n** | `localeEn.js` / `localeKm.js` | — |
| **Not used** | Redux, MUI, Axios | — |

---

## 10. Docs index

| File | Content |
|------|---------|
| [`GIT_WORKFLOW.md`](GIT_WORKFLOW.md) | GitLab workflow — avoid conflicts |
| [`frontend/docs/TEAM_TASKS.md`](frontend/docs/TEAM_TASKS.md) | Full task checklist per member |
| [`tasks/TEAM_TASKS.md`](tasks/TEAM_TASKS.md) | Quick reference table |
| [`frontend/docs/MENTOR_FRONTEND.md`](frontend/docs/MENTOR_FRONTEND.md) | Mentor module conventions |
| [`frontend/README.md`](frontend/README.md) | Dev setup & imports |
