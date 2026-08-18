# ✉️ MailCraft AI — Готовое к продакшену MVP веб-приложение для генерации email с помощью ИИ

Высокопроизводительное адаптивное веб-приложение для генерации email-писем с помощью ИИ, построенное на **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Supabase Auth** и **Vercel AI SDK** с потоковой генерацией (streaming) через **Google Gemini API**.

![MailCraft AI Landing Page](https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Возможности

- ⚡ **Потоковая генерация текста в реальном времени**: Построчный вывод ответа с помощью Vercel AI SDK (`ai`, `@ai-sdk/google`) и моделей Gemini 1.5/2.0 / 3.6 Flash.
- 🔄 **Автономный Mock-режим (Offline)**: Режим автоматического переключения для мгновенной демонстрации и тестирования без необходимости вводить API-ключи.
- 🎯 **Выбор тональности и параметров**: Готовые пресеты тона (Профессиональный, Дружелюбный, Продающий/Убедительный, Срочный, Эмпатичный) и длины (Короткий, Средний, Длинный).
- 📜 **История черновиков (Drawer)**: Боковая панель с сохранением состояния для просмотра, копирования или повторной загрузки ранее сгенерированных писем.
- 💎 **Монетизация и процесс апгрейда**: Страница тарифов с переключателем Месяц/Год, списком преимуществ и модальным окном имитации оплаты с конфетти (`canvas-confetti`).
- 👤 **Защищенный профиль и счетчик квоты**: Отслеживание ежемесячного лимита сгенерированных писем в реальном времени (например, 4/10 писем).
- 🌓 **Тёмная и светлая тема**: Современный Glassmorphism-дизайн, адаптированный под десктопные, планшетные и мобильные устройства.

---

## 🛠️ Стек технологий и зависимости

- **Фреймворк**: Next.js 14+ (App Router), React 18, TypeScript
- **Стили и компоненты**: Tailwind CSS, архитектурный дизайн shadcn/ui, `lucide-react`, `framer-motion`
- **Интеграция ИИ**: `ai` (Vercel AI SDK), `@ai-sdk/google` (провайдер Google Gemini)
- **Аутентификация и БД**: Supabase JS (`@supabase/supabase-js`, `@supabase/ssr`) с локальным mock-фоллбэком
- **UX и уведомления**: `sonner` (тоасты), `canvas-confetti` (анимация успешной оплаты)

---

## 🚀 Быстрый старт

### 1. Требования
Убедитесь, что на вашем компьютере установлен **Node.js 18+**.

### 2. Установка
Клонируйте репозиторий и установите зависимости:
```bash
git clone https://github.com/vanyabombom/mailcraft-ai.git
cd mailcraft-ai
npm install
```

### 3. Настройка окружения
Скопируйте пример файла `.env.example` в `.env.local`:
```bash
cp .env.example .env.local
```
Укажите ваш API-ключ Google Gemini и учетные данные проекта Supabase:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Локальный запуск
Запустите сервер для разработки:
```bash
npm run dev
```
Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

---

## 📁 Структура проекта

```
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   └── profile/page.tsx
│   ├── api/
│   │   └── generate/route.ts
│   ├── pricing/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── dashboard/
│   │   ├── email-form.tsx
│   │   ├── email-output.tsx
│   │   └── history-drawer.tsx
│   ├── landing/
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── workflow.tsx
│   │   ├── faq.tsx
│   │   └── cta.tsx
│   ├── layout/
│   │   ├── navbar.tsx
│   │   └── footer.tsx
│   ├── pricing/
│   │   └── checkout-modal.tsx
│   └── ui/
├── lib/
│   ├── ai/
│   │   └── mock-stream.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── auth-context.tsx
│   └── utils.ts
└── types/
    └── index.ts
```

---

## 🔒 Лицензия
Распространяется под лицензией MIT.
