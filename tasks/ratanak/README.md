# Ratanak — Community

| | |
|---|---|
| **Folder** | `tasks/ratanak/` |
| **Push** | **③** |
| **រង់ចាំ** | Sophy push រួច → `git pull` |

Community feed, post detail, like, comment។

---

## ①–⑤ មុន push

```powershell
cd "d:\Full Frontend"
git pull origin main
.\scripts\paste-task.ps1 -Member ratanak
cd frontend; npm run dev; npm run build; cd ..
```

---

## ⑥ Push

**របៀប:** `git add` → `git commit` → `git push` — **មួយ folder មួយដង**។

**កុំ** `git add` file **README** (រួម `tasks/ratanak/README.md`)។

```powershell
# 1 — tasks (កុំ README)
git add tasks/ratanak/constants/ tasks/ratanak/hooks/ tasks/ratanak/lib/
git add tasks/ratanak/pages/ tasks/ratanak/services/
git commit -m "feat(ratanak): community task folder like comment feed"
git push origin main

# 2 — pages
git add frontend/src/pages/student/Community.jsx
git add frontend/src/pages/community/
git commit -m "feat(ratanak): community feed and detail pages"
git push origin main

# 3 — services + API
git add frontend/src/services/communities/
git add frontend/src/services/core/endpoints.js
git commit -m "feat(ratanak): community service endpoints"
git push origin main

# 4 — hooks + constants
git add frontend/src/hooks/forms/useCommunityPostState.js
git add frontend/src/lib/communityApiMap.js
git add frontend/src/constants/communities/
git commit -m "feat(ratanak): like comment state communityUi"
git push origin main
```

[`../README.md`](../README.md)
