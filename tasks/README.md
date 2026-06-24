# Team tasks — RokKru Frontend

គ្រប់ member កែ **`tasks/<ឈ្មោះ>/`** → copy → **`frontend/src/`** → push ដោយខ្លួន។

---

## ច្បាប់

| # | ច្បាប់ |
|---|--------|
| 1 | **`git add` → `git commit` → `git push`** — មួយរង្វង់ រួចធ្វើ folder បន្ទាប់ |
| 2 | `git add` **តែ folder របស់អ្នក** — កុំ `git add .` |
| 3 | **កុំ** `git add` file **README** (`README.md`, `tasks/README.md`, …) |
| 4 | Member បន្ទាប់ **`git pull`** មុនចាប់ push |

```
add folder A → commit → push
add folder B → commit → push
add folder C → commit → push
```

---

## អ្នកជា member ណា?

| # | Member | README |
|---|--------|--------|
| ① | [**Bunhieng**](bunhieng/README.md) | [§ Push](bunhieng/README.md#-push) |
| ② | [**Sophy**](sophy/README.md) | [§ Push](sophy/README.md#-push) |
| ③ | [**Ratanak**](ratanak/README.md) | [§ Push](ratanak/README.md#-push) |
| ④ | [**Sokhun**](sokhun/README.md) | [§ Push](sokhun/README.md#-push) |

```
① Bunhieng → ② Sophy → ③ Ratanak → ④ Sokhun
```

---

## Workflow

```powershell
cd "d:\Full Frontend"
git pull origin main
.\scripts\paste-task.ps1 -Member sophy   # ផ្លាស់ឈ្មោះ
cd frontend; npm run dev; npm run build
# បន្ទាប់មើល README §⑥ — add → commit → push តាម folder
```

[`TEAM_TASKS.md`](TEAM_TASKS.md) · [`COMMIT_GUIDE.md`](COMMIT_GUIDE.md)
