# Team tasks — paste into `frontend/`

**មិនមែន project ដាច់** — folder នេះជា **តែឯកសាររបស់ member** ដែល mirror path ក្នុង `frontend/src/`។

## Workflow (គ្មាន conflict)

```
1. git pull                    ← យក frontend ពេញ (components + structure រួចរាល់)
2. កែតែក្នុង tasks/<ឈ្មោះអ្នក>/   ← ឬកែត្រង់ frontend/src/<folder របស់អ្នក>
3. .\scripts\paste-task.ps1 -Member sophy   ← optional: copy task → frontend
4. cd frontend && npm run dev  ← test
5. git add tasks/sophy/        ← commit តែ folder របស់អ្នក (+ frontend បើកែត្រង់នោះ)
6. git push
```

## Folder ownership

| Member | Commit only under |
|--------|-------------------|
| Bunhieng | `tasks/bunhieng/` → `frontend/src/components/`, `services/core/`, shared `lib/` |
| Sorint | `tasks/sorint/` → `pages/auth`, `pages/onboarding`, `hooks/auth`, `services/auth` |
| Sophy | `tasks/sophy/` → `pages/student`, `services/students`, … |
| Sokhun | `tasks/sokhun/` → `pages/mentor`, `services/mentors`, … |
| Ratanak | `tasks/ratanak/` → `pages/community`, `services/communities`, … |
| Somnang | `tasks/somnang/` → `pages/admin`, `services/admin`, … |

**កុំ commit** `node_modules/`, `.env`, `dist/`

## Lead: refresh all task slices from frontend

```powershell
.\scripts\extract-tasks.ps1
```

Full guide: [`../frontend/docs/TEAM_TASKS.md`](../frontend/docs/TEAM_TASKS.md)
