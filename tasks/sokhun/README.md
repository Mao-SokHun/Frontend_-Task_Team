# Sokhun — Mentor

| | |
|---|---|
| **Folder** | `tasks/sokhun/` |
| **Push** | **④** |
| **រង់ចាំ** | Ratanak push រួច → `git pull` |

ទំព័រ mentor — dashboard, profile, schedule។

---

## ①–⑤ មុន push

```powershell
cd "d:\Full Frontend"
git pull origin main
.\scripts\paste-task.ps1 -Member sokhun
cd frontend; npm run dev; npm run build; cd ..
```

---

## ⑥ Push

**របៀប:** `git add` → `git commit` → `git push` — **មួយ folder មួយដង**។

**កុំ** `git add` file **README** (រួម `tasks/sokhun/README.md`)។

```powershell
# 1 — tasks (កុំ README)
git add tasks/sokhun/pages/ tasks/sokhun/services/
git add tasks/sokhun/constants/
git commit -m "feat(sokhun): mentor task folder profile dashboard schedule"
git push origin main

# 2 — mentor pages
git add frontend/src/pages/mentor/MentorPublicProfile.jsx
git add frontend/src/pages/mentor/MentorHome.jsx
git add frontend/src/pages/mentor/Analytics.jsx
git commit -m "feat(sokhun): mentor public profile dashboard chart colors"
git push origin main

# 3 — schedule service
git add frontend/src/services/mentors/mentorScheduleService.js
git commit -m "feat(sokhun): mentor schedule service"
git push origin main
```

[`../README.md`](../README.md)
