# 🚀 Postara

> A modern, minimal and professional LinkedIn publishing platform built with **Next.js 16**, **React 19**, **Prisma 7**, and **Supabase**.

Postara helps creators, founders, developers and marketers write, manage and publish professional LinkedIn content from a distraction-free workspace.

> **Current Status:** MVP (LinkedIn Personal Accounts)

---

# ✨ Features

### 🔐 Authentication

- LinkedIn OAuth 2.0 Login
- OpenID Connect
- Multiple LinkedIn Accounts
- One-click Active Account Switching
- Secure Token Storage
- Persistent Sessions

---

### ✍️ Composer

- Beautiful distraction-free editor
- Auto Save
- Character Counter
- Draft Recovery
- Drag & Drop Upload
- Image Upload
- Video Upload
- Multiple Media Support
- Remove Uploaded Media
- Live Saving Status

---

### 📄 Draft Management

- Unlimited Drafts
- Auto Saved Drafts
- Continue Editing
- Duplicate Draft
- Rename Draft
- Delete Draft
- Created Timestamp
- Updated Timestamp
- Media Preview

---

### 👥 Account Manager

- Multiple LinkedIn Profiles
- Active Account Indicator
- One Click Account Switch
- Disconnect Account
- Add New Account

---

### 🎨 UI

- Material 3 Inspired
- Minimal
- Professional
- Responsive
- Modern Sidebar
- Beautiful Cards
- Soft Color Palette
- Smooth Animations

---

# 🛠 Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 3 |
| Prisma | 7 |
| PostgreSQL | Supabase |
| OAuth | LinkedIn OAuth 2.0 |
| OpenID | Yes |

---

# 📂 Project Structure

```
src
│
├── app
│   ├── api
│   ├── compose
│   ├── drafts
│   └── scheduled
│
├── components
│   ├── compose
│   ├── drafts
│   ├── layout
│   └── ui
│
├── lib
│
└── generated
```

---

# ⚙️ Environment Variables

Create a `.env` file.

```env
DATABASE_URL=

DIRECT_URL=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
LINKEDIN_REDIRECT_URI=http://localhost:3000/api/auth/linkedin/callback
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

Start the development server

```bash
npm run dev
```

---

# 🔑 LinkedIn Setup

Create a LinkedIn Developer App.

Enable the following Products:

- Sign In with LinkedIn using OpenID Connect
- Share on LinkedIn

Configure the OAuth Redirect URL:

```
http://localhost:3000/api/auth/linkedin/callback
```

Required OAuth scopes:

- openid
- profile
- email
- w_member_social

LinkedIn uses OAuth 2.0 with OpenID Connect for authentication, and `w_member_social` is required to publish posts on behalf of an authenticated member. :contentReference[oaicite:0]{index=0}

---

# 📸 Current Screens

- Compose
- Drafts
- Account Manager
- LinkedIn Authentication

---

# 🚧 Roadmap

## Phase 1 ✅

- LinkedIn Login
- Multiple Accounts
- Drafts
- Media Upload
- Account Switching

---

## Phase 2 ✅

- Publish to LinkedIn
- Schedule Posts
- Queue Manager
- Scheduled Feed

---

## Phase 3 🚧

- Analytics Dashboard
- Engagement Metrics
- Performance Charts

---

## Phase 4

- AI Caption Generator
- AI Rewrite
- AI Hook Generator
- AI Carousel Writer

---

## Phase 5

- Team Workspace
- Shared Drafts
- Organizations
- Roles & Permissions

---

## Phase 6

- X (Twitter)
- Bluesky
- Threads
- Mastodon

---

# 🔒 Security

- OAuth 2.0
- OpenID Connect
- CSRF Protection
- Secure Token Storage
- Server-side Authentication
- Prisma ORM

---

# 🖥️ Built With

- Next.js App Router
- React Server Components
- Prisma ORM
- PostgreSQL
- Supabase
- Tailwind CSS

---

# 🤝 Contributing

Pull requests are welcome.

For major changes, please open an issue first to discuss what you'd like to change.

---

# 📜 License

MIT License

---

# ⭐ Support

If you like this project,

⭐ Star the repository

🍴 Fork it

🐛 Report Issues

💡 Suggest Features

---

# 👨‍💻 Author

**Shadow Ash**

Building modern Web applications, AI tools and Web3 products.

---