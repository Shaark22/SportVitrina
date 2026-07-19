# SPORT KING

Сайт-витрина спортивного оборудования для домашних тренировок.

## Стек

- React + Vite + TypeScript
- Tailwind CSS v4
- React Router
- Lucide React

## Запуск

```bash
npm install
npm run dev
```

Сайт откроется на `http://localhost:5173`

## Сборка

```bash
npm run build
npm run preview
```

## Структура

- `src/pages/` — страницы сайта
- `src/components/` — UI-компоненты, layout, секции
- `src/data/` — товары, категории, настройки сайта
- `public/` — логотип и изображения

## Покупка

Все товары ведут на Kaspi через кнопку **«КУПИТЬ НА KASPI»**.

Ссылки на товары настраиваются в `src/data/products.ts`.

## Админ-панель

URL: секретный путь из `VITE_ADMIN_BASE` / `ADMIN_PATH` (см. `.env.example`), по умолчанию `/sk-manage-kz8m2p/login`. Путь `/admin` отключён.

- Пароль: переменная `ADMIN_PASSWORD` (локально в `.env`, на Render — в Environment)
- Добавление и редактирование товаров, категорий и отзывов
- Данные и загрузки: `server/data/` (`store.json`, `uploads/`)

## Деплой

См. [DEPLOY.md](./DEPLOY.md) и `render.yaml` (Render Blueprint, план Starter + persistent disk).
