# Bunhieng — Shared core

| | |
|---|---|
| **Folder** | `tasks/bunhieng/` |
| **Push** | **① មុនគេ** |

Layout, nav, filters, locale, shared components។

---

## ①–⑤ មុន push

```powershell
cd "d:\Full Frontend"
git pull origin main
.\scripts\paste-task.ps1 -Member bunhieng
cd frontend; npm run dev; npm run build; cd ..
```

---

## ⑥ Push

**របៀប:** `git add` → `git commit` → `git push` — **មួយ folder មួយដង**។ រួចហើយធ្វើ folder បន្ទាប់។

**កុំ** `git add` file **README** (រួម `tasks/bunhieng/README.md`)។

```powershell
# 1 — tasks (កុំ README)
git add tasks/bunhieng/App.jsx tasks/bunhieng/index.css
git add tasks/bunhieng/components/ tasks/bunhieng/constants/
git add tasks/bunhieng/lib/ tasks/bunhieng/pages/ tasks/bunhieng/services/
git commit -m "feat(bunhieng): shared task folder filters layout colors"
git push origin main

# 2 — layout + nav
git add frontend/src/components/layout/
git commit -m "feat(bunhieng): main layout auth layout settings menu"
git push origin main

# 3 — common components (លុប animation background រួមផង)
git add frontend/src/components/common/SearchFilter.jsx
git add frontend/src/components/common/CommunityPostCard.jsx
git add frontend/src/components/index.js
git add -u frontend/src/components/
git commit -m "feat(bunhieng): search filter post card remove animation background"
git push origin main

# 4 — constants + filters
git add frontend/src/constants/filters/
git add frontend/src/constants/config/
git add frontend/src/constants/ui/
git add frontend/src/constants/index.js
git add -u frontend/src/constants/
git commit -m "feat(bunhieng): mentor filters platformFeatures tokens"
git push origin main

# 5 — primary color
git add frontend/tailwind.config.js
git add frontend/src/index.css
git commit -m "feat(bunhieng): primary color blue"
git push origin main

# 6 — App routes + pages + locale + landing
git add frontend/src/App.jsx
git add frontend/src/pages/NotFound.jsx
git add frontend/src/pages/legal/
git add frontend/src/pages/auth/Landing.jsx
git add frontend/src/lib/localeEn.js
git add frontend/src/lib/localeKm.js
git commit -m "feat(bunhieng): app routes locale legal landing"
git push origin main
```

[`../README.md`](../README.md)
