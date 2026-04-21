# 🌐 BizVistar (Internal Documentation)

**Empowering Local Businesses with Simple, Affordable, and Professional Digital Presence**

This is an internal repository for BizVistar. It powers a comprehensive SaaS and Website Generation platform designed to help local service-based and retail businesses quickly establish a digital presence.

---

## 🧭 Project Overview

**BizVistar** provides a "do-it-with-me" subscription service. We provide an automated AI-powered website builder with integrated SaaS tools (appointment booking, galleries, menus, inventory, etc.), managed social media services, and business analytics. 

The primary business goal is to offer an all-in-one monthly subscription that removes technical complexities for non-tech-savvy business owners.

---

## 🏛 Architecture & Tech Stack

This project is built using modern web development tools and services:

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: JavaScript / Node.js
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [React UI libraries]
- **Database Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Payments**: [Razorpay](https://razorpay.com/)
- **Media Storage**: [Cloudinary](https://cloudinary.com/) (Images) & Supabase Storage
- **AI Content Generation**: [OpenAI API](https://openai.com/)
- **Analytics & Error Tracking**: [Sentry](https://sentry.io/)

---

## 📂 Project Structure

A high-level overview of the repository:

```text
├── .env.local                  # Environment variables (not committed)
├── src/
│   ├── app/                    # Next.js App Router pages (Dashboard, Auth, Templates, etc.)
│   ├── components/             # Reusable UI components (Shadcn, specialized editors)
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utility functions, configs, and third-party initializations
│   ├── middleware.js           # Next.js Middleware (Auth & Tenant routing)
│   └── scripts/                # Internal Node.js maintenance scripts
├── supabase/                   # Supabase configuration and DB schemas
├── public/                     # Static assets (images, icons, manifest.json)
└── docs/                       # Internal project documentation
```

### Key Modules
- `src/app/dashboard`: Client dashboard where users manage products, categories, subscriptions, and website data.
- `src/app/actions`: Server actions for database operations, bypassing client-side RLS where necessary.
- **Templates** (e.g., Aurora, Frostify): Dynamic paths rendered based on tenant subdomains or internal routing, applying stored user customizations.

---

## 🚀 Getting Started (Development Setup)

### Prerequisites
- Node.js (v18+)
- npm or pnpm
- Supabase Project & Credentials
- Cloudinary Account
- Razorpay Sandbox/Live Account

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local` and populate the required keys:

```bash
cp .env.example .env.local
```

Key environment variables to configure:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `CLOUDINARY_URL` / `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`
- `OPENAI_API_KEY`

### 3. Run Development Server
```bash
npm run dev
```

The app should now be running on [http://localhost:3000](http://localhost:3000).

---

## 💾 Database Schema & Migrations

The database is managed via Supabase. We utilize several key tables:
- `users`: Core user accounts and metadata.
- `subscriptions`: Stripe/Razorpay subscription states and lifecycles.
- `website_data`: Configurations, AI-generated content, themes, and layouts for the tenant websites.
- `products` / `categories`: Tenant-managed inventory.
- `draft_data`: Saved but unpublished website configurations.

*Note: Some database migrations and automated SQL setups are located in `supabase_migration_subscription.sql` and `supabase_data_cleanup.sql`.*

---

## 🛠 Internal Tools & Maintenance Scripts

- **`scripts/clean-base64-images.mjs`**: A utility script to purge bloated base64 image strings from `website_data` to comply with Vercel function limits, migrating them implicitly to Cloudinary.

---

## 🔒 Security & Deployment

- **Deployment**: The application is configured to deploy via **Vercel**. 
- **Authentication**: Using Supabase Auth with RLS (Row Level Security) on client-side requests, and bypassing RLS selectively using Server Actions (`@supabase/ssr`) where elevated privileges are needed (e.g., internal synchronization tasks).
- **Subdomains**: Managed dynamically via Next.js Middleware `middleware.js` to route `tenant.bizvistar.in` or custom domains correctly to the template renderer.

---

> ⚠️ *This is private and proprietary code for BizVistar. Do not distribute.*