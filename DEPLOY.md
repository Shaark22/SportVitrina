# Деплой SPORT KING (бесплатно)

## Рекомендуется: Render.com

Бесплатный план: сайт работает 24/7, но **засыпает** после 15 минут без посетителей.  
Первый заход после сна — загрузка 30–60 секунд. Для показа заказчику — нормально.

### Шаг 1 — GitHub

1. Зайдите на [github.com](https://github.com) и создайте аккаунт (если нет).
2. Нажмите **New repository** → имя: `sport-king` → **Create repository**.
3. В папке проекта выполните в терминале:

```bash
cd C:\Users\SenetUser\sport-king
git init
git add .
git commit -m "SPORT KING — готовый сайт с админкой"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/sport-king.git
git push -u origin main
```

Замените `ВАШ_ЛОГИН` на свой логин GitHub.

### Шаг 2 — Render

1. Зайдите на [render.com](https://render.com) → **Get Started** → войдите через GitHub.
2. **New +** → **Web Service**.
3. Подключите репозиторий `sport-king`.
4. Настройки (подставятся из `render.yaml`, проверьте):

| Поле | Значение |
|------|----------|
| Build Command | `npm install && npm run build` |
| Start Command | `node server/index.js` |
| Plan | **Free** |

5. **Environment Variables** → добавьте:
   - `NODE_ENV` = `production`
   - `ADMIN_PASSWORD` = ваш пароль (например `sportking2026`)

6. Нажмите **Create Web Service**.

7. Через 3–5 минут появится ссылка вида:  
   `https://sport-king-xxxx.onrender.com`

### Шаг 3 — Отправить заказчику

- Сайт: `https://ваш-url.onrender.com`
- Админка: `https://ваш-url.onrender.com/admin/login`
- Пароль: тот, что задали в `ADMIN_PASSWORD`

---

## Что сохраняется на Render (бесплатно)

- Товары и категории из `server/data/store.json` (из репозитория).
- Загруженные фото из `server/data/uploads/` (если закоммичены в git).

После деплоя заказчик может загружать фото в админке — они сохранятся на сервере.  
При **новом деплое** (обновление кода) загрузки могут сброситься, если не закоммитить `server/data/` снова.

---

## Быстрый показ с компьютера (без деплоя)

Если нужно показать **прямо сейчас**, пока ПК включён:

```bash
npm run dev
```

Установите [ngrok](https://ngrok.com), затем в другом терминале:

```bash
ngrok http 5173
```

Скопируйте ссылку `https://....ngrok-free.dev` и отправьте заказчику.  
Работает только пока ваш компьютер и `npm run dev` запущены.

---

## Обновление сайта после правок

```bash
git add .
git commit -m "обновление"
git push
```

Render автоматически пересоберёт сайт за 3–5 минут.
