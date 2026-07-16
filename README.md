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

URL: `/admin/login`

- Пароль по умолчанию: `sportking` (меняется в `src/data/site.ts`)
- Добавление и редактирование товаров и категорий
- Изменение цен, описаний, ссылок Kaspi
- Данные сохраняются в localStorage браузера
