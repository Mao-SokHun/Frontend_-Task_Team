# Sokhun — Mentor

**ធ្វើតាមលំដាប់នេះ — កុំខុសជំហាន**

Folder របស់អ្នក: **`tasks/sokhun/`**

### រូបជំហាន (មើលមុនពេលធ្វើ)

```mermaid
flowchart LR
  A["① Pull<br/>git pull"] --> B["② Write/Paste<br/>tasks/sokhun/"]
  B --> C["③ Copy file<br/>→ frontend/src/"]
  C --> D["④ Test<br/>npm run dev"]
  D --> E["⑤ Build<br/>npm run build"]
  E --> F["⑥ Push<br/>git push"]
```

### រូប paste file — សរសេរទីនេះមុន → copy ទៅ app

```mermaid
flowchart LR
  subgraph STEP2["② សរសេរ / paste ទីនេះមុន"]
    T1["tasks/sokhun/pages/mentor/"]
    T2["tasks/sokhun/hooks/mentor/"]
    T3["tasks/sokhun/services/mentors/"]
    T4["tasks/sokhun/lib/ + utils/"]
  end

  subgraph APP["③ copy paste → app រួម"]
    F1["frontend/src/pages/mentor/"]
    F2["frontend/src/hooks/mentor/"]
    F3["frontend/src/services/mentors/"]
    F4["frontend/src/lib/ + utils/"]
  end

  T1 --> F1
  T2 --> F2
  T3 --> F3
  T4 --> F4
```

> ឧ. `tasks/sokhun/pages/mentor/MentorCreatePost.jsx` → `frontend/src/pages/mentor/MentorCreatePost.jsx`

---

## ① Pull — យក code ថ្មី

ធ្វើ **រៀងរាល់ព្រឹក** មុនចាប់ធ្វើ

```powershell
cd "d:\Full Frontend"
git pull origin main
cd frontend
npm install
```

---

## ② កែ code — write / paste file

កែ file ក្នុង **`tasks/sokhun/`** តែប៉ុណ្ណោះ

| Folder | ធ្វើអី |
|--------|--------|
| `pages/mentor/` | Dashboard, Profile, Create post, … |
| `hooks/mentor/` | data + page logic |
| `services/mentors/` | ហៅ API |
| `lib/mentorApiMap.js` | map field name (Khmer name) |
| `utils/`, `components/mentor/` | helper + UI |

ឧទាហរណ៍: `tasks/sokhun/pages/mentor/MentorCreatePost.jsx`

---

## ③ Copy — paste file ទៅ app រួម

**Copy file ដែលកែ** ពី `tasks/sokhun/` → `frontend/src/` (**path ដូចគ្នា**)

```
tasks/sokhun/pages/mentor/MentorCreatePost.jsx
        ↓ copy paste
frontend/src/pages/mentor/MentorCreatePost.jsx
```

- **Ctrl+C** → **Ctrl+V** (folder ដូចគ្នា)
- ឬ drag & drop ក្នុង File Explorer

---

## ④ Test — រត់ app

**Terminal 1** — backend

```powershell
cd backend_rokkru
npm start
```

**Terminal 2** — frontend

```powershell
cd frontend
npm run dev
```

បើក `http://localhost:5173` → login mentor → dashboard, profile, create post

---

## ⑤ Build — ពិនិត្យ error

```powershell
cd frontend
npm run build
```

---

## ⑥ Push — ផ្ញើ GitLab

```powershell
cd "d:\Full Frontend"
git add tasks/sokhun/
git status
git commit -m "feat(sokhun): ..."
git push
```

**កុំ commit:** `node_modules/`, `.env`, `dist/`, folder member ផ្សេង

---

## អានបន្ថែម

**API សំខាន់**

- Dashboard → `GET /v1/mentors/me/dashboard`
- Profile → `GET/PUT /v1/users/me`
- Posts → `GET/POST /v1/mentors/:id/posts`
- Stripe → `POST /v1/stripe/create-checkout-session`

**Task ត្រូវធ្វើ**

- [ ] Create post: `title`, `province_id`, `sub_skill_id`
- [ ] Khmer name mapping ក្នុង `mentorApiMap.js`
- [ ] Portfolio = link only (មិនមាន upload API)

**ឯកសារពេញ:** [`../../frontend/docs/MENTOR_FRONTEND.md`](../../frontend/docs/MENTOR_FRONTEND.md)
