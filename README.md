# VitaFlowBlog

Учебный проект блога о здоровом образе жизни на Next.js

(можно посмотреть здесь: https://next-blog-coral-iota.vercel.app)

## Краткое описание

Полнофункциональное приложение-блог, посвящённое здоровому питанию, фитнесу, ментальному здоровью и сбалансированному образу жизни. Проект включает публичную часть с лентой статей, поиском, фильтрацией по категориям и тегам, систему рейтингов и комментариев с лайками/дизлайками, личный кабинет автора и полноценную панель администратора (dashboard) для управления контентом, пользователями и отзывами. Реализованы: аутентификация через Clerk (включая OAuth Google и GitHub), три роли пользователей, адаптивный интерфейс, тёмная/светлая тема, визуальный редактор статей на Tiptap и загрузка изображений через ImageKit.

## Требования для установки проекта

1. Установленный Node.js 20+
2. База данных PostgreSQL (в проекте используется облачная БД Prisma Postgres на prisma.io)
3. Наличие аккаунта Clerk (аутентификация)
   - зарегистрироваться на https://clerk.com
   - создать приложение и получить ключи
   - настроить OAuth-провайдеры (Google, GitHub)
   - настроить вебхуки для синхронизации пользователей
4. Наличие аккаунта ImageKit (загрузка изображений)
   - зарегистрироваться на https://imagekit.io
   - получить API-ключи

## Установка проекта

1. Клонируйте проект на свой компьютер
   - `git clone https://github.com/Ser5976/next-blog.git`
2. Установка зависимостей
   - откройте папку проекта в терминале и наберите команду `npm install`
3. Добавление переменных окружения в `.env`

   ```env
   NEXT_PUBLIC_DOMAIN=http://localhost:3000

   # Prisma Postgres (облачная база данных)
   DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=...

   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   CLERK_WEBHOOK_SIGNING_SECRET=
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
   NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

   # E2E-тесты
   E2E_EMAIL=
   E2E_PASSWORD=

   # ImageKit
   NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
   NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=
   IMAGEKIT_PRIVATE_KEY=
   Prisma Postgres
   DATABASE_URL — строка подключения к облачной базе данных Prisma Postgres (содержит api_key)
   ```

Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY — публичный ключ Clerk

CLERK_SECRET_KEY — секретный ключ Clerk

CLERK_WEBHOOK_SIGNING_SECRET — секрет для верификации вебхуков Clerk

NEXT_PUBLIC_CLERK_SIGN_IN_URL / NEXT_PUBLIC_CLERK_SIGN_UP_URL — маршруты страниц входа и регистрации

NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL / NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL — редирект после входа и регистрации

E2E-тесты
E2E_EMAIL / E2E_PASSWORD — учётные данные тестового пользователя для Playwright

ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY — публичный ключ ImageKit

NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT — URL-эндпоинт ImageKit

IMAGEKIT_PRIVATE_KEY — приватный ключ ImageKit

Подключение Prisma:

npx prisma generate

npx prisma migrate dev

Запуск проекта

npm run dev (разработка, с Turbopack)

npm run build, npm run start (продакшен)

Основной стек технологий
Next.js 15 (App Router) — фреймворк для React с поддержкой SSR и маршрутизации, используется как для frontend, так и для backend-части проекта (API Routes)

TypeScript — статическая типизация

Prisma — ORM для работы с базой данных

Prisma Postgres — облачная база данных PostgreSQL (хостинг prisma.io) с использованием Prisma Accelerate

Clerk — аутентификация и управление пользователями (OAuth: Google, GitHub), разграничение ролей через publicMetadata

TanStack Query + Axios — работа с API и кэшированием

React Hook Form + Zod — формы и валидация

Tailwind CSS 4 — утилитарный CSS-фреймворк

Shadcn/ui + Radix UI — UI-компоненты

Tiptap — визуальный редактор для статей

ImageKit — загрузка и оптимизация изображений

Framer Motion — анимации

Sonner — библиотека уведомлений (toast)

date-fns — работа с датами

Jest + Testing Library + Supertest — unit/integration тестирование

Playwright — e2e тестирование

Архитектура проекта (FSD)
Проект построен по методологии Feature-Sliced Design (FSD). Код в папке src разделён на слои:

/app

маршрутизация Next.js (App Router): страницы, layouts, API Routes

группы маршрутов: (auth), (root)

публичные страницы: article/[slug], categories/[slug], search, tags/[slug]

страницы автора: author/articles, author/comments

страницы dashboard: dashboard/articles, dashboard/categories, dashboard/comments, dashboard/tags, dashboard/users/[userId]

служебные: create-article, edit-article/[slug], access-denied, sync-user-error

/widgets

крупные самостоятельные блоки интерфейса:

article, author-articles, author-comments, author-overview, author-sidebar

category, tag, search, home, post

header, footer, mobile-menu

dashboard-articles, dashboard-catigories, dashboard-comments, dashboard-overview,
dashboard-sidebar, dashboard-tags, dashboard-user-profile, dashboard-users

/features

пользовательские сценарии:

auth, sync-user, theme-toggle, user-profile-info

create-article, edit-article, rating-article, related-articles

comments-article, user-comments, user-posts

categories-menu, search, welcome-banner

аналитические фичи: comments-stats, posts-stats, rating-stats, users-stats, view-stats,
efficiency, popular-categories, popular-post

/entities

бизнес-сущности (Post, Category, Comment, Tag, StatCard, TimeRange) с их UI и логикой

category, coment-row, comments-stats, get-article, get-articles, post-row,
posts-stats, stat-card, time-range, dashboard-get-categories, dashboard-get-tags

/shared

переиспользуемые ресурсы:

api (articles, comment, user)

components, constants, hooks, lib, schemas, types, ui

Каждый слой имеет строгие правила импортов: слои могут импортировать только из нижележащих слоёв. Почти каждая фича и сущность содержит собственные тесты (**tests**).

Тестирование
В проекте настроены unit/integration-тесты (Jest) и e2e-тесты (Playwright). Покрытие тестами распределено по фичам и виджетам:

npm run test — запуск Jest-тестов

npm run test:coverage — тесты с покрытием (папка src/)

npm run test:e2e — e2e-тесты Playwright

Тесты присутствуют практически в каждом модуле FSD: features/_/**tests**, entities/_/**tests**, widgets/\*/**tests**, включая интеграционные тесты для dashboard-users.

Для e2e-тестов используются переменные окружения E2E_EMAIL и E2E_PASSWORD (данные тестового пользователя).

Конфигурационные файлы: jest.config.ts, jest.setup.ts, playwright.config.ts.
Планы тестирования задокументированы в TESTING_PLAN_DASHBOARD_WIDGETS.md и DASHBOARD_COMMENTS_PLAN.md.

API Routes
Backend-часть реализована через API Routes в src/app/api:

/api/author/stats

статистика по автору

/api/categories
/api/categories/[id]
/api/categories/slug/[slug]

CRUD-операции с категориями и получение по slug

/api/dashboard/comments/[commentId]/like
/api/dashboard/comments/[commentId]/dislike
/api/dashboard/comments/[commentId]/reaction

реакции на комментарии в dashboard

/api/dashboard/efficiency, popular-categories, popular-posts, posts-stats, ratings, total-views

аналитические эндпоинты для dashboard

/api/dashboard/users/[userId]/comments
/api/dashboard/users/[userId]/posts

данные пользователя для dashboard

/api/dashboard/users-clerk/[userId]

данные пользователя Clerk

/api/posts/[id]/comment, comments, publish, rate, user-rating, view

работа со статьями: комментарии, публикация, рейтинг, просмотры

/api/posts/slug/[slug]/related

связанные статьи

/api/sync-user

синхронизация пользователя Clerk с базой данных

/api/tags, /api/tags/[id], /api/tags/slug/[slug]

CRUD-операции с тегами

/api/upload-auth

авторизация загрузки файлов в ImageKit

/api/webhooks

вебхуки Clerk (создание/удаление пользователей), верификация через CLERK_WEBHOOK_SIGNING_SECRET

Работа с данными
Получение данных
Получение редко обновляемых данных
Для таких данных используется встроенный метод fetch() из Next.js в серверных компонентах с настройкой revalidate

Часто обновляемые данные — TanStack Query + Axios
Для интерактивных данных (комментарии, лайки, рейтинги, статистика dashboard) используется TanStack Query в связке с Axios
Функции запросов сосредоточены в shared/api (articles, comment, user) и в api-сегментах фич

Изменение и удаление данных
Для мутаций данных используются два подхода:

TanStack Query Mutation (для клиентских интерактивных сценариев — комментарии, рейтинги, реакции)

API Routes с прямым доступом к Prisma (создание, редактирование, публикация, удаление статей, категорий, тегов)

Обработка ошибок
При fetch() на серверной стороне ошибки обрабатываются вручную через проверку res.ok,
либо возвращается null, либо выбрасывается throw new Error() с переходом на error.tsx

При TanStack Query состояние ошибки доступно через переменную isError

При мутациях ошибки обрабатываются в компонентах через .then() / .catch() с показом уведомления через Sonner

Для ошибок синхронизации пользователя предусмотрена отдельная страница /sync-user-error и модель FailedUserDeletion для отслеживания неудачных удалений

Обработка состояния загрузки
При fetch() на серверной стороне используется Suspense с кастомным fallback

При TanStack Query состояние загрузки доступно через переменную isLoading

При мутациях состояние загрузки контролируется вручную через useState

Аутентификация и авторизация
Аутентификация реализована через Clerk:

Кастомные страницы входа и регистрации ((auth)/sign-in, (auth)/sign-up)

Поддержка OAuth-провайдеров: Google и GitHub

Управление сессиями и токенами через Clerk middleware

Синхронизация пользователей Clerk с базой данных через фичу sync-user и эндпоинт /api/sync-user, а также через вебхуки /api/webhooks (верификация подписи через CLERK_WEBHOOK_SIGNING_SECRET)

Специальная модель FailedUserDeletion и страница /sync-user-error для отслеживания неудачных удалений пользователей

Роли пользователей
Разграничение ролей реализовано через Clerk metadata (publicMetadata) — роль пользователя хранится в publicMetadata.role и доступна как на клиенте, так и на сервере через Clerk session.

User — чтение статей, комментарии, лайки/дизлайки, рейтинги

Author — всё, что доступно User, плюс личный кабинет автора:

author/articles — управление своими статьями

author/comments — управление своими комментариями

создание и редактирование статей (create-article, edit-article/[slug])

Admin — доступ к dashboard, управление всеми статьями, категориями, тегами, пользователями и комментариями

Защищённые маршруты
Страницы dashboard доступны только пользователям с ролью Admin

Страницы автора доступны только авторизованным пользователям с ролью Author

Middleware Clerk проверяет publicMetadata.role и редиректит на /access-denied при отказе (см. fix dashboard-link access-denied fix middleware)

Функционал пользователя
Просмотр ленты последних статей

Поиск по библиотеке статей (по категориям, тегам, ключевым словам)

Чтение статей по категориям: питание, фитнес, ментальное здоровье, баланс

Оставление комментариев

Лайки и дизлайки комментариев

Постановка рейтинга статьям (влияет на средний рейтинг)

Просмотр связанных статей (related articles)

Переключение светлой/тёмной темы

Личный кабинет автора
Обзорная страница автора (author-overview) со статистикой

Управление своими статьями (author-articles)

Управление своими комментариями (author-comments)

Боковая навигация (author-sidebar)

Профиль автора (user-profile-info)

Панель администратора (Dashboard)
Обзорная страница (dashboard-overview) с ключевыми метриками: users-stats, posts-stats, comments-stats, rating-stats, view-stats, efficiency

Управление статьями (dashboard-articles: создание, редактирование, черновики, публикация)

Визуальный редактор статей на Tiptap (заголовки, списки, изображения, ссылки, выравнивание)

Управление категориями (dashboard-catigories)

Управление тегами (dashboard-tags)

Управление пользователями (dashboard-users, dashboard-user-profile, dashboard/users/[userId])

Управление комментариями (dashboard-comments: реакции, лайки, дизлайки)

Популярные посты (popular-post) и популярные категории (popular-categories)

Переключение темы интерфейса (theme-toggle)

Загрузка изображений
Загрузка изображений реализована с помощью ImageKit

Авторизация загрузки происходит через эндпоинт /api/upload-auth

Авторы и администраторы могут загружать обложки статей и изображения внутри контента

Загруженные файлы автоматически оптимизируются и возвращаются в виде URL, которые сохраняются в базе данных через Prisma

Безопасность данных
Взаимодействие с базой данных строго типизировано благодаря Prisma

Все данные, приходящие от клиента, проходят валидацию через Zod-схемы (shared/schemas) до момента отправки в базу

Аутентификация и авторизация обрабатываются через Clerk с поддержкой OAuth (Google, GitHub)

Роли хранятся в publicMetadata Clerk и проверяются как на клиенте, так и на сервере (middleware)

Вебхуки Clerk обрабатываются отдельным эндпоинтом /api/webhooks с верификацией через CLERK_WEBHOOK_SIGNING_SECRET

Для отслеживания сбоев при удалении пользователей предусмотрена модель FailedUserDeletion со статусом resolved

Структура проекта (по папкам)
/prisma

схема базы данных и миграции

/src

исходный код приложения, организованный по FSD:

/app — маршрутизация Next.js (App Router), включая API Routes

/widgets — крупные блоки интерфейса (header, footer, article, dashboard-\*)

/features — пользовательские сценарии (auth, create-article, comments-article и др.)

/entities — бизнес-сущности (Post, Category, Comment, Tag, StatCard, TimeRange)

/shared — переиспользуемые ресурсы (api, ui, hooks, lib, schemas, types, constants)

/tests

unit/integration и e2e тесты

components.json

конфигурация shadcn/ui

jest.config.ts, jest.setup.ts

настройка Jest

playwright.config.ts

настройка e2e-тестов

DASHBOARD_COMMENTS_PLAN.md

план разработки комментариев в dashboard

TESTING_PLAN_DASHBOARD_WIDGETS.md

план тестирования виджетов dashboard
