# 🚀 Knowledge Sharing Platform — Frontend

A modern, dark-themed React application for a knowledge sharing platform with AI-assisted writing, rich text editing, and a full CRUD article workflow.

---

## 🏗️ Architecture Overview

```
knowledge-sharing-frontend/
├── src/
│   ├── api/            # Axios instance + all API functions
│   │   └── index.js
│   ├── components/     # Reusable UI components
│   │   ├── Navbar.jsx
│   │   └── ArticleCard.jsx
│   ├── pages/          # Route-level page components
│   │   ├── Home.jsx          # Article list, search, filter
│   │   ├── Login.jsx         # Auth - Login
│   │   ├── Signup.jsx        # Auth - Register
│   │   ├── ArticleDetail.jsx # Full article view
│   │   ├── CreateEditArticle.jsx  # Editor + AI assist panel
│   │   └── Dashboard.jsx     # User's article management
│   ├── store/          # Redux Toolkit state
│   │   ├── index.js    # Store config
│   │   └── authSlice.js # Auth state + localStorage
│   ├── App.jsx         # Routes + ProtectedRoute
│   ├── main.jsx        # Entry point
│   └── index.css       # Global dark theme styles
├── index.html
├── vite.config.js
└── package.json
```

### Key Design Decisions
- **Redux Toolkit** for auth state persisted to `localStorage`
- **Axios interceptor** for automatic Bearer token injection and 401 redirect
- **ProtectedRoute** component guards `/create`, `/edit`, `/dashboard`
- **React Quill** for rich text editing (WYSIWYG)
- **AI panel** slides out beside the editor — uses backend `/api/ai/*` endpoints
- **Dark theme** with CSS variables — zero Tailwind dependency

---

## 🤖 AI Usage (How AI Was Used)

| Area | AI Tool Used | What It Did |
|------|-------------|-------------|
| Component structure | Claude AI | Suggested optimal page decomposition and routing strategy |
| CSS design system | Claude AI | Generated CSS variable tokens and card hover animations |
| Redux slice pattern | Claude AI | Generated authSlice boilerplate with localStorage sync |
| Axios interceptor | Claude AI | Generated the 401 auto-redirect interceptor pattern |
| AI panel UX | Claude AI | Suggested the slide-out panel design for editor AI assist |
| Form validation | Manual | Reviewed and improved all validation logic manually |

> **Example**: "Used Claude AI to generate the initial Axios instance with JWT interceptor, then manually customized the 401 error redirect and API endpoint naming conventions."

---

## 🛠️ Tech Stack
- **React 18** + **Vite**
- **React Router v6** — client-side routing
- **Redux Toolkit** + **React Redux** — global state management
- **Axios** — HTTP client with JWT interceptor
- **React Quill** — Rich text editor (WYSIWYG)
- **React Hot Toast** — Notifications
- **Vanilla CSS** — Custom dark design system

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+
- Backend running at `http://localhost:8080`

### Environment
The backend URL is configured in `src/api/index.js`:
```js
baseURL: 'http://localhost:8080/api'
```
Change this if your backend runs on a different port.

### Frontend Setup

```bash
# Clone the repo
git clone <your-frontend-repo-url>
cd knowledge-sharing-frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The frontend will be available at **http://localhost:5173**

---

## 📱 Pages & Routes

| Route | Page | Auth |
|-------|------|------|
| `/` | Home — article list, search, filter | Public |
| `/articles/:id` | Article detail | Public |
| `/login` | Login form | Public |
| `/signup` | Registration form | Public |
| `/create` | New article editor + AI assist | 🔒 Required |
| `/articles/:id/edit` | Edit article + AI assist | 🔒 Author only |
| `/dashboard` | My articles with edit/delete | 🔒 Required |

---

## 🤖 AI Features (Frontend)
1. **AI Assist Panel** (in editor) — toggle sidebar with 4 actions: Rewrite, Grammar, Concise, Suggest Title
2. **Auto-Summarize** — generates article summary shown on home page cards
3. **Tag Suggestions** — AI suggests tags from content in the create/edit form
