# RokKru — GitLab monorepo (no conflict)

**មួយ frontend** + **tasks បំបែកតាម member** — កុំ push project ដាច់ 6 ប្រភេទ។

```
frontend/          ← pull មុន — structure + components រួចរាល់
tasks/<member>/    ← paste task របស់អ្នក (mirror frontend/src paths)
backend_rokkru/
```

## Member — 3 ជំហាន

```powershell
git pull
cd frontend && npm install && npm run dev   # test shared app
# កែ tasks/sophy/ ... (ឬ frontend/src/pages/student/)
.\scripts\paste-task.ps1 -Member sophy      # optional
git add tasks/sophy/
git commit -m "feat(sophy): ..."
git push
```

**អានលម្អិត:** [`GIT_WORKFLOW.md`](GIT_WORKFLOW.md)  
**Folder ownership:** [`frontend/docs/TEAM_TASKS.md`](frontend/docs/TEAM_TASKS.md)  
**Structure:** [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md)

## Bunhieng / shared

| Folder | ប្រើពេលណា |
|--------|-----------|
| `frontend/src/components/` | App រួម (pull មុន) |
| `tasks/bunhieng/` | Push GitLab |

## Team

| Member | Git folder | Frontend paths |
|--------|------------|----------------|
| Bunhieng | `tasks/bunhieng/` | `components/`, `services/core/` |
| Sorint | `tasks/sorint/` | `pages/auth`, `services/auth` |
| Sophy | `tasks/sophy/` | `pages/student`, `services/students` |
| Sokhun | `tasks/sokhun/` | `pages/mentor`, `services/mentors` |
| Ratanak | `tasks/ratanak/` | `pages/community`, `services/communities` |
| Somnang | `tasks/somnang/` | `pages/admin`, `services/admin` |

## Env

```env
# frontend/.env
VITE_API_URL=/api
```

Backend: `backend_rokkru` port **3000**
