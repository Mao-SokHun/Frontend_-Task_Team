# GitLab workflow — គ្មាន conflict

## គោលការណ៍

| អ្វីដែល push | អ្វីដែលមិន push |
|-------------|----------------|
| `frontend/` — app រួម 1 គត់ | `node_modules/`, `dist/`, `.env` |
| `tasks/<member>/` — ឯកសារ task របស់ member | |
| `backend_rokkru/` | |
| `scripts/` | |

**មិនមាន** project frontend 6 ប្រភេទក្នុង repo — មាន **frontend មួយ** + **tasks បំបែកតាម member**។

### Shared components — មានតែមួយជាប្រភពពិត (GitLab)

| Folder | តួនាទី | Push GitLab? |
|--------|--------|--------------|
| **`frontend/src/components/`** + **`services/core/`** | App រួម — pull មុន | ✅ តែ Bunhieng / lead |
| **`tasks/bunhieng/`** | Bunhieng commit zone (mirror paths) | ✅ Bunhieng only |

Bunhieng: កែ `tasks/bunhieng/` ឬ `frontend/src/components/` → `extract-tasks.ps1`។

---

## រចនាសម្ព័ន្ធ repo

```
Full Frontend/
├── frontend/              ← Structure + shared components (pull មុនគេ)
│   └── src/
│       ├── components/    ← Bunhieng ថែ (ui, layout, common)
│       ├── pages/         ← រៀងតាម role
│       ├── services/core/ ← endpoints.js, api.js
│       └── ...
├── tasks/                 ← Member paste zone (mirror frontend/src paths)
│   ├── bunhieng/
│   ├── sorint/
│   ├── sophy/
│   ├── sokhun/
│   ├── ratanak/
│   └── somnang/
├── backend_rokkru/
├── scripts/
│   ├── extract-tasks.ps1  ← Lead: split frontend → tasks/
│   └── paste-task.ps1     ← Member: tasks/X → frontend/src
```

---

## Member — រៀងរហូតធ្វើ

### 1. Clone / pull

```powershell
git clone <gitlab-url>
cd Full-Frontend
git pull origin main
```

### 2. Setup frontend (មួយដង)

```powershell
cd frontend
copy .env.example .env    # VITE_API_URL=/api
npm install
```

### 3. ធ្វើការតែ folder របស់អ្នក

**ជម្រើស A — កែត្រង់ `frontend/src/...` (ណែរណែលចុងក្រោយ merge)**

**ជម្រើស B — កែក្នុង `tasks/sophy/` រួច paste**

```powershell
cd ..
.\scripts\paste-task.ps1 -Member sophy
cd frontend
npm run dev
```

### 4. Commit តែ path របស់អ្នក

```powershell
git add tasks/sophy/
# បើកែត្រង់ frontend:
git add frontend/src/pages/student/
git add frontend/src/services/students/
git status   # ពិនិត្យមិនមាន file របស់គេដទៃ
git commit -m "feat(sophy): student profile API alignment"
git push origin feat/sophy/student-profile
```

### 5. Branch naming

```
feat/<name>/<short-topic>
```

ឧ. `feat/sokhun/mentor-posts`, `feat/ratanak/community-feed`

---

## កុំឱ្យ conflict — ច្បាប់មាស

1. **មិន commit** folder របស់ member ផ្សេង (`tasks/sokhun/` បើអ្នកជា Sophy)
2. **មិន rename** shared files (`components/ui`, `services/core/endpoints.js`) ដោយឯករាជ្យ — Bunhieng / lead review
3. **Pull main រៀងរាល់ព្រឹក** មុនពេលចាប់ធ្វើ
4. **API paths** — កែតែ `frontend/src/services/core/endpoints.js` (រួមគ្នា ឬ MR តូច)
5. **មិន push** `node_modules`, `.env`, `dist`

---

## Bunhieng / Lead

```powershell
# បន្ទាប់ពី merge shared ទៅ frontend
.\scripts\extract-tasks.ps1    # update tasks/* slices for team
git add frontend/src/components frontend/src/services/core tasks/bunhieng
git commit -m "chore(shared): sync components and endpoints"
```

---

## Merge Request

- Title: `[Sophy] Student community feed`
- Changed paths ត្រូវស្ថិតក្នុង ownership table (`frontend/docs/TEAM_TASKS.md`)
- Reviewer ពិនិត្យមិនជះដល់ folder របស់ role ផ្សេង

---

## Backend

```powershell
cd backend_rokkru
npm install
npm start   # port 3000
```

Frontend proxy: `VITE_API_URL=/api` → `localhost:3000`
