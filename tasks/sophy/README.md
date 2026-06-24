# Sophy — Student

| | |
|---|---|
| **Folder** | `tasks/sophy/` |
| **Push** | **②** |
| **រង់ចាំ** | Bunhieng push រួច → `git pull` |

ទំព័រ student, services, rating star។

---

## ①–⑤ មុន push

```powershell
cd "d:\Full Frontend"
git pull origin main
.\scripts\paste-task.ps1 -Member sophy
cd frontend; npm run dev; npm run build; cd ..
```

---

## ⑥ Push

**របៀប:** `git add` → `git commit` → `git push` — **មួយ folder មួយដង**។

**កុំ** `git add` file **README** (រួម `tasks/sophy/README.md`)។

```powershell
# 1 — tasks (កុំ README)
git add tasks/sophy/components/ tasks/sophy/hooks/ tasks/sophy/pages/ tasks/sophy/services/
git add tasks/sophy/constants/
git commit -m "feat(sophy): student task folder pages services ratings"
git push origin main

# 2 — student pages
git add frontend/src/pages/student/MentorDetail.jsx
git add frontend/src/pages/student/SchedulePostDetail.jsx
git add frontend/src/pages/student/SessionReview.jsx
git add frontend/src/pages/student/StudentEditProfile.jsx
git commit -m "feat(sophy): student mentor detail profile session review"
git push origin main

# 3 — services
git add frontend/src/services/students/
git commit -m "feat(sophy): student services review profile booking"
git push origin main

# 4 — rating UI + hooks
git add frontend/src/components/mentor/MentorRatingsSection.jsx
git add frontend/src/hooks/mentor/useMentorRatings.js
git add frontend/src/hooks/mentor/index.js
git commit -m "feat(sophy): mentor rating star component hook"
git push origin main
```

[`../README.md`](../README.md)
