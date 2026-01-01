# Admin Dashboard Deployment Guide

## ❌ The Problem: 404 Not Found on Refresh

When you deploy a React application using `react-router-dom` (BrowserRouter) to a static host like Vercel or GitHub Pages, typical navigation works fine because it's handled by JavaScript in the browser. However, **refreshing the page** or accessing a deep link like `/admin/dashboard` directly causes a **404 error**.

### Why?

- **Client-Side Routing (React Router):** The Router listens to URL changes in the browser and updates the view _without_ making a request to the server.
- **Server-Side Routing (The Host):** When you type a URL or refresh, the browser asks the _server_ for that specific file. Vercel looks for a file named `admin/dashboard`, doesn't find it, and returns 404.

## ✅ The Fix

### 1️⃣ Option A: Vercel (Recommended) & Netlify

Since you are using modern hosting, the best solution is to use **Rewrites**. We tell the server: _"If someone asks for ANY page, just give them `index.html` and let React handle the rest."_

**Requirements:**

1.  **`vercel.json`** in your project root (inside `admin/`):
    ```json
    {
      "rewrites": [
        {
          "source": "/(.*)",
          "destination": "/index.html"
        }
      ]
    }
    ```
2.  **`vite.config.js`**: Ensure `base` is set to `/` (root).

### 2️⃣ Option B: GitHub Pages (Alternative)

GitHub Pages does **not** support rewrites easily for SPA (Single Page Apps) with `BrowserRouter` unless you use a "404 hack". The safer alternative is **HashRouter**.

- **BrowserRouter:** `example.com/admin/dashboard` (Clean, requires server config)
- **HashRouter:** `example.com/#/admin/dashboard` (Ugly, but works everywhere)

**To use HashRouter (Only if Option A is impossible):**

1.  Open `src/App.jsx`.
2.  Replace `import { BrowserRouter } ...` with `import { HashRouter } ...`.
3.  Replace `<BrowserRouter>` with `<HashRouter>`.

## 🔒 Production Best Practices

### 1. Backend Security

Never hardcode `http://localhost:5000` in your production code.

- **Bad:** `axios.get('http://localhost:5000/api/...')`
- **Good:** Use Environment Variables.
  - Create `.env` locally: `VITE_API_URL=http://localhost:5000/api`
  - Set Environment Variable in Vercel: `VITE_API_URL` = `https://alsahasport-production.up.railway.app/api`

### 2. Route Protection

Your current `ProtectedRoute` component is excellent. Ensure it always checks for a valid token _before_ rendering children.

### 3. Build Verification

Before deploying, always run:

```bash
npm run build
```

If this fails locally, it will fail on the server.

## 🚀 Checklist for Deployment

- [ ] `vercel.json` created in `admin/` directory.
- [ ] `vite.config.js` has `base: '/'`.
- [ ] Environment Variables (`VITE_API_URL`) set in Vercel Project Settings.
- [ ] All code committed and pushed to GitHub.
- [ ] Deploy triggered on Vercel.
- [ ] **Verification:** Visit `/admin/dashboard` and refresh the page. No 404 should appear.
