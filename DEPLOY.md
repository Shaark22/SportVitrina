# Деплой SPORT KING на Render

## Рекомендуемый план: **Starter** (~$7/мес)

- Сайт **не засыпает** (в отличие от Free)
- Подходит для постоянной работы и админки
- Можно подключить **persistent disk** — товары, фото и аналитика сохраняются при redeploy

Free-план возможен для демо, но после 15 минут без трафика сервис «засыпает» (первый заход 30–60 с).

---

## Переменные окружения (Render)

| Переменная | Обязательно | Описание |
|------------|-------------|----------|
| `NODE_ENV` | да | `production` |
| `ADMIN_PASSWORD` | **да** | Пароль админки (секрет). Default `sportking` **запрещён** в production |
| `ADMIN_PATH` | нет | Путь без `/`, default `sk-manage-kz8m2p` |
| `VITE_ADMIN_BASE` | да* | `/${ADMIN_PATH}` — нужен **на этапе build** |
| `DATA_DIR` | нет | Каталог данных; на Render с диском: `/opt/render/project/src/server/data` |
| `PORT` | — | Render задаёт автоматически |

\* Если меняете `ADMIN_PATH`, обновите `VITE_ADMIN_BASE` и сделайте **Clear build cache & deploy**.

Полный список — в `.env.example`.

---

## Blueprint (`render.yaml`)

В корне репозитория уже есть `render.yaml`:

- Web service, Node, `npm install && npm run build`, `node server/index.js`
- `healthCheckPath: /api/health`
- Persistent disk 1 GB → `server/data`
- План **starter**

### Деплой через Dashboard

1. [render.com](https://render.com) → **New +** → **Blueprint**
2. Подключите GitHub-репозиторий
3. При создании введите `ADMIN_PASSWORD`
4. Дождитесь deploy (~3–5 мин)

### Проверка после деплоя

- Сайт: `https://<service>.onrender.com`
- Health: `https://<service>.onrender.com/api/health` → `{"ok":true}`
- Админка: `https://<service>.onrender.com/sk-manage-kz8m2p/login` (или ваш `ADMIN_PATH`)

---

## Persistent disk

В `render.yaml` диск смонтирован в `/opt/render/project/src/server/data` — туда пишутся `store.json`, `uploads/` и `analytics.json`.

При **первом** deploy данные копируются из репозитория (`server/data/store.json`). Дальше изменения в админке сохраняются на диске.

Увеличить размер диска можно в Dashboard → сервис → **Disks** (уменьшить нельзя).

---

## Обновление после правок в коде

```bash
git add .
git commit -m "обновление"
git push
```

Render пересоберёт сервис автоматически (если включён auto-deploy).

---

## Локальная проверка production-режима

```powershell
cd C:\Users\Максипати\Projects\sport-king
npm run build
$env:NODE_ENV="production"
$env:ADMIN_PASSWORD="test-password"
node server/index.js
```

Откройте `http://localhost:3001` и `http://localhost:3001/api/health`.
