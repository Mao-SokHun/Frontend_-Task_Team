# Bunhieng — Shared core

| | |
|---|---|
| **Folder** | `tasks/bunhieng/` |
| **Push** | **① មុនគេ** |
| **Structure** | [`../FOLDER_STRUCTURE.md`](../FOLDER_STRUCTURE.md) |

Layout, nav, filters, locale, shared components។

---

## Folder structure — `tasks/bunhieng/`

```
tasks/bunhieng/
├── App.jsx
├── i18n.js
├── index.css
│
├── assets/
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
│       └── shadcn/
├── constants/
│   ├── config/
│   ├── filters/
│   ├── legal/
│   └── ui/
├── contexts/
├── hooks/
│   └── ui/
├── lib/
│   └── validation/
│       └── shared/
├── pages/
│   └── legal/
└── services/
    ├── core/
    └── platform/
```

**Paste:** `tasks/bunhieng/<path>` → `frontend/src/<path>` (path ដូចគ្នា)

**Frontend root (មិនមែន `src/`):** `frontend/tailwind.config.js`

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

**របៀប:** `git add` → `git commit` → `git push` — **មួយ folder មួយដង**។

**កុំ** `git add` file **README**។

```powershell
# 1 — tasks/bunhieng (folder ទាំងអស់ · កុំ README)
git add tasks/bunhieng/App.jsx tasks/bunhieng/i18n.js tasks/bunhieng/index.css
git add tasks/bunhieng/assets/
git add tasks/bunhieng/components/
git add tasks/bunhieng/constants/
git add tasks/bunhieng/contexts/
git add tasks/bunhieng/hooks/
git add tasks/bunhieng/lib/
git add tasks/bunhieng/pages/
git add tasks/bunhieng/services/
git commit -m "feat(bunhieng): task folder shared core"
git push origin main

# 2 — frontend · components/layout
git add frontend/src/components/layout/
git commit -m "feat(bunhieng): layout nav settings menu"
git push origin main

# 3 — frontend · components/common + ui
git add frontend/src/components/common/
git add frontend/src/components/ui/
git add frontend/src/components/index.js
git commit -m "feat(bunhieng): common ui components search filter"
git push origin main

# 4 — frontend · constants
git add frontend/src/constants/config/
git add frontend/src/constants/filters/
git add frontend/src/constants/legal/
git add frontend/src/constants/ui/
git add frontend/src/constants/index.js
git commit -m "feat(bunhieng): filters platformFeatures tokens"
git push origin main

# 5 — frontend · colors
git add frontend/tailwind.config.js
git add frontend/src/index.css
git commit -m "feat(bunhieng): primary color blue"
git push origin main

# 6 — frontend · app lib hooks pages services
git add frontend/src/App.jsx
git add frontend/src/i18n.js
git add frontend/src/hooks/ui/
git add frontend/src/lib/
git add frontend/src/pages/legal/
git add frontend/src/pages/NotFound.jsx
git add frontend/src/pages/auth/Landing.jsx
git add frontend/src/services/core/
git add frontend/src/services/platform/
git commit -m "feat(bunhieng): app locale legal landing services"
git push origin main
```

> **ចំណាំ:** `App.jsx`, `i18n.js`, `NotFound.jsx`, `Landing.jsx` នៅ root — មិនមែនក្នុង subfolder ដច់ដោយ។  
> `git add frontend/src/lib/` — add តែពេល Bunhieng paste រួច និង member ផ្សេងមិនទាន់កែ `lib/`។

[`../README.md`](../README.md) · [`../FOLDER_STRUCTURE.md`](../FOLDER_STRUCTURE.md)
