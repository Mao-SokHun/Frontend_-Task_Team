# Team tasks

**មួយ member = មួយ folder** — mirror path ក្នុង `frontend/src/`

### រូបជំហាន (គ្រប់គ្នា)

```mermaid
flowchart LR
  A["① Pull<br/>git pull"] --> B["② Write/Paste<br/>tasks/ឈ្មោះអ្នក/"]
  B --> C["③ Copy file<br/>→ frontend/src/"]
  C --> D["④ Test<br/>npm run dev"]
  D --> E["⑤ Build<br/>npm run build"]
  E --> F["⑥ Push<br/>git push"]
```

### រូប paste file — សរសេរ tasks មុន → copy ទៅ frontend

```mermaid
flowchart LR
  PULL["① git pull"] --> TASK

  subgraph TASK["② សរសេរ / paste"]
    T["tasks/sophy/pages/student/Profile.jsx"]
  end

  COPY["③ copy paste"]

  subgraph FE["app រួម"]
    F["frontend/src/pages/student/Profile.jsx"]
  end

  TEST["④ test → ⑤ build → ⑥ push"]

  TASK --> COPY --> F --> TEST
```

> path ដូចគ្នា — `tasks/<member>/...` = `frontend/src/...` (copy paste ធម្មតា)

**កុំ commit:** `node_modules/`, `.env`, `dist/`

---

## ជ្រើស folder របស់អ្នក

| Member | អាន step guide |
|--------|----------------|
| Bunhieng | [`bunhieng/README.md`](bunhieng/README.md) |
| Sorint | [`sorint/README.md`](sorint/README.md) |
| Sophy | [`sophy/README.md`](sophy/README.md) |
| Sokhun | [`sokhun/README.md`](sokhun/README.md) |
| Ratanak | [`ratanak/README.md`](ratanak/README.md) |
| Somnang | [`somnang/README.md`](somnang/README.md) |

---

ឯកសារពេញ: [`../frontend/docs/TEAM_TASKS.md`](../frontend/docs/TEAM_TASKS.md)
