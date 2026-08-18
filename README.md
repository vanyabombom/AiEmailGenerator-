# ✉️ MailCraft AI — Production-Ready AI Email Generator MVP

A high-performance, responsive AI Email Generator web application built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, **Supabase Auth**, and **Vercel AI SDK** with **Google Gemini API** streaming.

![MailCraft AI Landing Page](https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Features

- ⚡ **Real-Time Text Streaming**: Real-time line-by-line response generation powered by Vercel AI SDK (`ai`, `@ai-sdk/google`) and Gemini 1.5/2.0 Flash models.
- 🔄 **Offline Mock Mode Toggle**: Seamless fallback mode allowing instant offline demonstration and testing without requiring API keys.
- 🎯 **Multi-Tone & Customization**: Tone presets (Professional, Casual, Persuasive/Sales, Urgent, Friendly, Empathetic) and Length selection (Short, Medium, Long).
- 📜 **Draft History Drawer**: Persistent state & drawer to preview, copy, or reload past generated email drafts into the studio.
- 💎 **Monetization & Upgrade Flow**: Pricing page with Monthly/Yearly toggle, tier benefits, and simulated checkout modal with victory confetti (`canvas-confetti`).
- 👤 **Protected Profile & Quota Meter**: Live tracking of user monthly email usage against tier limits (e.g. 4/10 generated).
- 🌓 **Dark & Light Mode**: Glassmorphism aesthetic tailored for modern desktop, tablet, and mobile displays.

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 14+ (App Router), React 18, TypeScript
- **Styling & Components**: Tailwind CSS, shadcn/ui architectural design, `lucide-react`, `framer-motion`
- **AI Integration**: `ai` (Vercel AI SDK), `@ai-sdk/google` (Google Gemini provider)
- **Auth & Database**: Supabase JS (`@supabase/supabase-js`, `@supabase/ssr`) with local mock fallback
- **UX & Toasts**: `sonner` notifications, `canvas-confetti` upgrade celebration

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have **Node.js 18+** installed on your system.

### 2. Installation
Clone the repository and install project dependencies:
```bash
git clone https://github.com/vanyabombom/mailcraft-ai.git
cd mailcraft-ai
npm install
```

### 3. Environment Setup
Copy the sample `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Google Gemini API Key and Supabase project credentials:
```env
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Locally
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Folder Structure

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

## 🔒 License
Distributed under the MIT License.
