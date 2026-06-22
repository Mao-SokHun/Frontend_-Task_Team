# Frontend Team Tasks — Follow `frontend/src/` Folders

> **GitLab workflow:** [`../../GIT_WORKFLOW.md`](../../GIT_WORKFLOW.md)  
> **Paste zone:** [`../../tasks/`](../../tasks/) — mirror paths, one member per folder  
> **Main app:** `frontend/` — pull first; shared components already included

---

## Team overview

| Member | Paste folder | Owns in `frontend/src/` |
|--------|--------------|-------------------------|
| **Bunhieng** | `tasks/bunhieng/` | Shared UI + `services/core` |
| **Sorint** | `tasks/sorint/` | `pages/auth`, `pages/onboarding`, `hooks/auth`, `services/auth` |
| **Sophy** | `tasks/sophy/` | `pages/student`, `services/students`, … |
| **Sokhun** | `tasks/sokhun/` | `pages/mentor`, `services/mentors`, … |
| **Ratanak** | `tasks/ratanak/` | `pages/community`, `services/communities`, … |
| **Somnang** | `tasks/somnang/` | `pages/admin`, `services/admin`, … |

```powershell
# After editing tasks/sophy/
.\scripts\paste-task.ps1 -Member sophy
```

**Commit rule:** only your `tasks/<name>/` (+ matching `frontend/src/...` if edited there).

---

## Bunhieng — Shared core

**Folders (do not put role-specific pages here):**

```
frontend/src/
├── components/ui/
├── components/layout/
├── components/common/       # Shared blocks used by all roles
├── components/backgrounds/
├── services/core/           # api.js, endpoints.js, client.js
├── constants/config/        # env.js — isApiEnabled, API base URL
├── lib/
│   ├── authStorage.js
│   ├── utils.js             # cn()
│   ├── localeEn.js / localeKm.js
│   └── LanguageProvider.jsx
└── hooks/ui/                # useModal, usePagination, …
```

**Tasks**

- [ ] Keep `endpoints.js` in sync when backend adds routes
- [ ] `apiRequest` — cookies, 401 handler, form upload
- [ ] Shared layout: `MainLayout`, `ProtectedRoute`, settings menu
- [ ] Run `.\scripts\extract-tasks.ps1` after shared changes (lead)

---

## Sorint — Auth & onboarding

**Folders:**

```
frontend/src/
├── pages/auth/
│   ├── Login.jsx
│   ├── CreateAccount.jsx
│   ├── ForgotPassword.jsx
│   ├── Landing.jsx
│   └── AdminLogin.jsx
├── pages/onboarding/
│   ├── ChooseCommunity.jsx
│   └── CompleteProfile.jsx
├── hooks/auth/
│   └── AuthContext.jsx
└── services/auth/
    └── authService.js
```

**Backend APIs**

| Action | Method | Path |
|--------|--------|------|
| Login | POST | `/v1/auth/login` |
| Verify OTP | POST | `/v1/auth/verify-otp` |
| Register | POST | `/v1/auth/register` |
| Profile | GET | `/v1/auth/profile` |
| Logout | POST | `/v1/auth/logout` |
| Forgot password | POST | `/v1/auth/forgot-password` |
| User types | GET | `/v1/user-types` |

**Tasks**

- [ ] Login + OTP flow with real API (mini project uses real auth)
- [ ] Register with `user_type_id` from `/v1/user-types`
- [ ] Forgot / reset password UI wired to auth routes
- [ ] Onboarding redirects by role (`student` / `mentor`)

---

## Sophy — Student

**Folders:**

```
frontend/src/
├── pages/student/
│   ├── Home.jsx
│   ├── Schedule.jsx
│   ├── SchedulePostDetail.jsx
│   ├── MentorDetail.jsx
│   ├── BookSession.jsx
│   ├── StudentBookings.jsx
│   ├── SessionReview.jsx
│   ├── Profile.jsx
│   ├── StudentEditProfile.jsx
│   ├── SearchResults.jsx
│   ├── Notifications.jsx
│   └── Messages.jsx
├── services/students/
│   ├── studentProfileService.js
│   ├── studentBookingService.js   # localStorage until backend booking API
│   └── studentReviewService.js
├── lib/studentApiMap.js
└── constants/student/studentRoutes.js
```

**Backend APIs**

| Feature | Path |
|---------|------|
| My profile | `GET/PUT /v1/students/me` |
| Browse mentors | `GET /v1/mentors?q=&skillId=&subSkillId=` |
| Schedule posts | `GET /v1/mentors/posts` |
| Post detail | `GET /v1/mentors/posts/:postId` |
| Rate mentor | `POST /v1/mentors/:userId/ratings` |
| Filters | `GET /v1/mentors/catalog` |

**PUT body fields (student table):** `firstname`, `lastname`, `phone_number`, `address`, `description`, `study_major`, `university`

**Tasks**

- [ ] Profile edit uses `studentApiMap.js` field names
- [ ] Schedule browse from mentor posts (not `/sessions`)
- [ ] Session review sends `rating` 1–5 to mentor ratings API
- [ ] Bookings UI — localStorage demo (document “waiting for backend booking API”)

---

## Sokhun — Mentor

**Folders:**

```
frontend/src/
├── pages/mentor/
│   ├── MentorHome.jsx
│   ├── EditProfile.jsx
│   ├── MentorMyProfile.jsx
│   ├── Analytics.jsx
│   ├── MentorSchedule.jsx
│   ├── MentorCreatePost.jsx
│   ├── MentorEditPost.jsx
│   ├── MentorSubscription.jsx
│   ├── MentorBilling.jsx
│   ├── PaymentSuccess.jsx
│   └── PaymentCancel.jsx
├── hooks/mentor/
├── services/mentors/
│   ├── mentorService.js
│   └── mentorScheduleService.js
├── lib/mentorApiMap.js
└── utils/mentor*.js
```

**Backend APIs**

| Feature | Path |
|---------|------|
| Catalog | `GET /v1/mentors/catalog` |
| My dashboard | `GET /v1/mentors/me/dashboard` |
| Edit profile bundle | `GET /v1/mentors/me/edit-profile` |
| Shared profile | `GET/PUT /v1/users/me` |
| Portfolio | `GET/POST/PATCH/DELETE /v1/mentors/:id/portfolio` |
| Posts (schedule) | `GET/POST /v1/mentors/:id/posts`, `PATCH /v1/mentors/posts/:id` |
| Stripe | `GET /v1/stripe/plans`, `POST /v1/stripe/create-checkout-session` |

**Tasks**

- [ ] Onboarding creates mentor row + user profile
- [ ] Khmer name mapping: `mentorApiMap.js` (family/given ↔ firstname/lastname)
- [ ] Create post requires `title`, `province_id`, `sub_skill_id`
- [ ] Portfolio: link-only (no file upload endpoint on backend)
- [ ] See `docs/MENTOR_FRONTEND.md` for code style

---

## Ratanak — Community

**Folders:**

```
frontend/src/
├── pages/community/
│   ├── CommunityDetail.jsx
│   ├── CommunityPostDetail.jsx
│   ├── CreateCommunity.jsx
│   └── CommunityCreatePost.jsx
├── pages/student/Community.jsx
├── components/common/
│   ├── CommunityPostCard.jsx
│   ├── CommunityPicker.jsx
│   └── CreatePostModal.jsx
├── services/communities/communityService.js
├── lib/communityApiMap.js
├── hooks/useCommunities.js
└── hooks/useCommunityFeed.js
```

**Backend APIs** (all under student role auth)

| Action | Path |
|--------|------|
| Community types | `GET /v1/students/community/types` |
| List posts | `GET /v1/students/community/posts` |
| Create post | `POST /v1/students/community/posts` |
| My posts | `GET /v1/students/community/my-posts` |
| Post by id | `GET/PUT/DELETE /v1/students/community/posts/:id` |

**Create body:** `community_type_id`, `title`, `description`, `image_url` (optional)

**Tasks**

- [ ] Feed loads from API (not static `COMMUNITY_FEED_POSTS`)
- [ ] Create post modal posts to `/v1/students/community/posts`
- [ ] Community picker loads types from API
- [ ] Post detail page uses `fetchCommunityPostById`

---

## Somnang — Admin

**Folders:**

```
frontend/src/
├── pages/admin/
│   ├── AdminDashboard.jsx
│   ├── UserManagement.jsx
│   ├── MentorManagement.jsx
│   ├── SessionManagement.jsx
│   ├── SystemReports.jsx
│   ├── AdminSettings.jsx
│   ├── ContentManagement.jsx
│   ├── PlatformCatalog.jsx
│   ├── RoleManagement.jsx
│   └── Billing.jsx
├── components/admin/content/
├── hooks/admin/
└── services/admin/
    ├── adminApi.js
    └── usersApi.js
```

**Backend APIs**

| Feature | Path |
|---------|------|
| Dashboard stats | `GET /v1/admin/dashboard/stats` |
| Users list | `GET /v1/admin/dashboard/users` |
| Suspend user | `PUT /v1/admin/dashboard/users/status` |
| Change role | `PUT /v1/admin/dashboard/users/:id/role` |
| Broadcast notification | `POST /v1/admin/notifications` |
| System settings | `GET/PUT /v1/admin/system-settings` |
| Mentors (admin view) | `GET /v1/mentors` |
| Sessions (admin view) | `GET /v1/mentors/posts` |

**Tasks**

- [ ] Dashboard cards from `/admin/dashboard/stats`
- [ ] User table from `/admin/dashboard/users` (`firstname` / `lastname` fields)
- [ ] Session management = published mentor posts
- [ ] Help/Terms admin editor — local storage until CMS API exists
- [ ] Wire suspend / role change actions to admin APIs

---

## Daily workflow (every member)

```powershell
# 1. Pull latest main frontend
cd "d:\Full Frontend\frontend"
git pull

# 2. Work in your mini project OR directly in frontend/src/<your-folder>
npm run dev

# 3. Backend must run for API tests
cd "d:\Full Frontend\backend_rokkru"
npm start

# 4. Before merge — build check
cd frontend
npm run build
```

### Environment (all projects)

```env
# frontend/.env
VITE_API_URL=/api
```

Vite proxies `/api` → `http://localhost:3000` (see `vite.config.js`).

### Branch naming

```
feat/sorint/auth-otp
feat/sophy/student-profile
feat/sokhun/mentor-posts
feat/ratanak/community-feed
feat/somnang/admin-users
feat/bunhieng/shared-api
```

### Merge checklist

- [ ] Only touched **your** folders (+ shared if Bunhieng)
- [ ] No new API paths without `endpoints.js` + backend route
- [ ] `npm run build` passes
- [ ] Tested with backend on port **3000**

---

## What is NOT on the backend (do not fake API calls)

| UI feature | Current approach |
|------------|------------------|
| Student session booking | `studentBookingService` → localStorage |
| Student notification inbox | Empty list (admin broadcast only) |
| Platform help/terms CMS | `platformContentService` → localStorage + defaults |

When backend adds these routes, update `endpoints.js` and the matching service first.
