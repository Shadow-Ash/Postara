# 🚀 Postara

<p align="center">

> A modern, minimal and professional LinkedIn publishing platform built with **Next.js 16**, **React 19**, **Prisma 7**, and **Supabase**.

Postara helps creators, founders, developers and marketers write, manage and publish professional LinkedIn content from a distraction-free workspace.

</p>

---

## ✨ Features

### 🔐 Authentication & Security

- LinkedIn OAuth 2.0
- OpenID Connect
- Multiple LinkedIn Accounts
- Active Account Switching
- Secure HttpOnly Session Authentication
- Password Protected Dashboard
- Middleware Route Protection
- Secure Server-side Authentication
- Environment Variable Protected Access
- CSRF-safe Authentication Flow

---

## ✍️ Content Composer

- Beautiful Distraction-free Editor
- Live Auto Save
- Character Counter
- Draft Recovery
- Drag & Drop Uploads
- Multi Image Upload
- Video Upload
- Remove Media
- Upload Progress
- Live Save Indicator
- LinkedIn Ready Formatting

---

## 📄 Drafts

- Unlimited Drafts
- Continue Editing
- ReEdit Draft
- Duplicate Draft
- Delete Draft
- Last Saved Time
- Media Preview
- Instant Search Ready Architecture

---

## 📅 Scheduling

- Schedule Posts
- Edit Scheduled Time
- Cancel Schedule
- Publish Immediately
- Delete Scheduled Posts
- Automatic Publishing
- Exponential Retry Strategy
- Failed Job Recovery
- Duplicate Protection

---

## 🚀 Publishing

- Instant Publishing
- Scheduled Publishing
- Multiple Images
- Video Support
- LinkedIn REST API
- Automatic Upload Pipeline
- Production-grade Publishing Service

---

## 👥 Account Management

- Multiple LinkedIn Profiles
- Active Account Indicator
- One-click Account Switching
- Disconnect Account
- Secure Logout
- Reconnect Detection

---

## ⚙️ Production Cron System

Designed to run reliably on Railway, Render, VPS or any server that supports HTTP Cron Jobs.

Features include:

- Secure Cron Secret
- Atomic Job Claiming
- No Duplicate Publishing
- Exponential Backoff
- Retry Queue
- Stuck Job Recovery
- Idempotent Publishing
- Concurrent-safe Processing
- Automatic Failure Detection
- Processing Locks
- Permanent Failure Handling
- Detailed Logging

---

## 🎨 UI

- Material Design 3 Inspired
- Responsive Layout
- Beautiful Sidebar
- Minimal Interface
- Smooth Animations
- Professional Dashboard
- Modern Cards
- Soft Color Palette

---

# 🛠 Tech Stack

| Technology | Version |
|------------|----------|
| Next.js | 16 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 3 |
| Prisma | 7 |
| PostgreSQL | Supabase |
| LinkedIn REST API | Latest |
| OAuth | OpenID Connect |
| Railway Cron | Supported |
| Vercel | Supported |

---

# 📂 Project Structure

```text
src
│
├── app
│   ├── (platform)
│   ├── api
│   │   ├── auth
│   │   ├── cron
│   │   ├── drafts
│   │   ├── login
│   │   ├── logout
│   │   ├── media
│   │   ├── publish
│   │   ├── schedule
│   │   └── session
│   │
│   └── login
│
├── components
│   ├── compose
│   ├── drafts
│   ├── layout
│   └── scheduled
│
├── generated
│
├── lib
│   ├── auth.ts
│   ├── linkedin.ts
│   ├── linkedinPublish.ts
│   └── prisma.ts
│
└── middleware.ts
```

---

# ⚙️ Environment Variables

Create a `.env`

```env
DATABASE_URL=

DIRECT_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/auth/linkedin/callback
LINKEDIN_VERSION=202603

APP_PASSWORD=your_password_here

SESSION_SECRET=your_random_secret

CRON_SECRET=your_random_secret
```

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/postara.git
```

Move into the project

```bash
cd postara
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Start development

```bash
npm run dev
```

---

# 🔑 LinkedIn Setup

Create a LinkedIn Developer Application.

Enable the following Products:

- Sign In with LinkedIn using OpenID Connect
- Share on LinkedIn

Required OAuth Scopes:

- openid
- profile
- email
- w_member_social

Configure the OAuth Redirect URL:

```
http://localhost:3000/api/auth/linkedin/callback
```

The application authenticates users with OpenID Connect and publishes posts using the Share on LinkedIn product and the `w_member_social` permission. :contentReference[oaicite:0]{index=0}

---

# 🚀 Deployment

## Frontend

Recommended:

- Vercel

## Database

- Supabase PostgreSQL

## Cron

Recommended:

- Railway Cron
- Railway Scheduled Jobs

Example Cron URL

```
GET /api/cron/publish
Authorization: Bearer YOUR_CRON_SECRET
```

Run every minute.

---

# 🔒 Security

- Password Protected Dashboard
- Middleware Authentication
- HttpOnly Cookies
- OAuth 2.0
- OpenID Connect
- Secure Session Tokens
- Server-side Validation
- Protected Cron Endpoint
- Environment Secret Protection
- Prisma ORM

---

# 🗺️ Roadmap

## ✅ Phase 1

- LinkedIn Authentication
- Multiple Accounts
- Drafts
- Media Uploads
- Account Switching

---

## ✅ Phase 2

- Publishing
- Scheduling
- Scheduled Queue
- Retry System
- Production Cron

---

## 🚧 Phase 3

- Analytics Dashboard
- Post Insights
- Engagement Metrics
- Performance Charts

---

## 🚧 Phase 4

- AI Caption Generator
- AI Rewrite
- AI Hook Generator
- Carousel Generator
- AI Content Calendar

---

## 🚧 Phase 5

- Team Workspaces
- Shared Drafts
- Organizations
- Roles & Permissions

---

## 🚧 Phase 6

- X (Twitter)
- Bluesky
- Threads
- Mastodon
- Facebook
- Instagram

---

# 🖥️ Built With

- Next.js App Router
- React Server Components
- Prisma ORM
- PostgreSQL
- Supabase
- Tailwind CSS
- LinkedIn REST API

---

# 🤝 Contributing

Contributions, feature requests and bug reports are welcome.

Feel free to open an Issue or submit a Pull Request.

---

# 📄 License

MIT License

---

# ⭐ Support

If you find Postara useful,

⭐ Star the repository

🍴 Fork the project

🐞 Report issues

💡 Suggest features

---

# 👨‍💻 Author

**Shadow Ash**

Building modern Web Applications, AI tools and Web3 products.