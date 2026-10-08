# Production Deployment Guide

This guide details the deployment architecture, configuration parameters, build/start commands, and pre-launch security checklist for the **SRR / Royal Academy of Science Portal**.

---

## 1. Architecture Overview

- **Frontend Client**: React Single Page Application bundled with Vite. Deployed to static hosting (Vercel, Netlify, Cloudflare Pages, or AWS S3/CloudFront).
- **Backend API**: Node.js & Express server. Deployed to a Node container/server environment (Railway, Render, Fly.io, AWS ECS, or Ubuntu VPS).
- **Database**: Supabase PostgreSQL database with Row Level Security (RLS) and custom PL/pgSQL stored procedures (`001_init.sql`, `002_hardening.sql`).

---

## 2. Environment Variables Reference

> [!NOTE]
> All secret values must be securely configured directly in your hosting platform's environment dashboard. Never commit `.env` files to git.

### Backend Environment Variables (`server/.env`)
| Variable Name | Environment | Description |
|---|---|---|
| `PORT` | All | Port on which the Express HTTP server listens (default: `5000`) |
| `NODE_ENV` | Production | Must be set to `production` to disable stack trace leaks and enforce strict CORS |
| `FRONTEND_URL` | Production | Fully qualified URL of the deployed frontend (e.g., `https://portal.srracademy.com`) |
| `JWT_SECRET` | Production | High-entropy 64-character secret key used to cryptographically sign session JWTs |
| `SUPABASE_URL` | All | Production Supabase project URL (`https://<project-ref>.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | All | Production Supabase Service Role key (bypasses RLS for secure server operations) |
| `RAZORPAY_KEY_ID` | All | Razorpay Key ID (`rzp_test_...` during testing, `rzp_live_...` in production) |
| `RAZORPAY_KEY_SECRET` | All | Razorpay Key Secret |
| `ADMIN_USERNAME` | First Run | Desired username for the initial administrator account |
| `ADMIN_PASSWORD` | First Run | Strong password for the initial administrator account |
| `ADMIN_PHONE` | First Run | Contact phone number for the administrator account |

### Frontend Environment Variables (`.env`)
| Variable Name | Description |
|---|---|
| `VITE_API_URL` | Base URL of the deployed backend API (e.g., `https://api.srracademy.com`). In local development, leave empty to use Vite's `/api` proxy. |

---

## 3. Build & Start Commands

### Backend Service
1. **Install Dependencies**:
   ```bash
   cd server
   npm ci --omit=dev
   ```
2. **Execute Database Migrations** (via Supabase SQL Editor):
   - First: `server/db/migrations/001_init.sql`
   - Second: `server/db/migrations/002_hardening.sql`
3. **Seed Root Administrator**:
   ```bash
   npm run seed:admin
   ```
4. **Start Production Server**:
   ```bash
   npm start
   ```
5. **Verify Health Endpoint**:
   ```bash
   curl https://<backend-domain>/api/health
   # Expected response: {"status":"ok","timestamp":"..."}
   ```

### Frontend Application
1. **Install Dependencies**:
   ```bash
   npm ci
   ```
2. **Build Production Bundle**:
   ```bash
   npm run build
   ```
   Generates optimized static assets in `dist/`.
3. **Serve / Deploy**:
   Deploy the `dist/` directory to your static host with single-page app (SPA) fallback routing to `dist/index.html`.

---

## 4. Pre-Launch Security Checklist

Before directing real traffic to the production instance, complete each item:

- [ ] **Generate Fresh, High-Entropy `JWT_SECRET`**:
  Generate a cryptographically secure random string before launch:
  ```bash
  openssl rand -hex 64
  ```
- [ ] **Initialize Root Administrator with Unique Password**:
  Ensure `ADMIN_PASSWORD` is unique, strong, and distinct from any local development values. Run `npm run seed:admin` once, then unset `ADMIN_PASSWORD` from production environment variables if desired.
- [ ] **Set `NODE_ENV=production`**:
  Verify `NODE_ENV=production` is set in the server hosting environment. This ensures:
  - Startup checks enforce `FRONTEND_URL`.
  - CORS strictly limits access to `FRONTEND_URL`.
  - Error responses never leak stack traces to clients.
- [ ] **Verify CORS Configuration**:
  Confirm `FRONTEND_URL` exactly matches the production frontend domain (including protocol `https://` without a trailing slash).
- [ ] **Razorpay Keys Transition**:
  - Test the complete checkout and webhook/verification flow using Razorpay **Test Mode** (`rzp_test_...`).
  - Only transition to **Live Mode** keys (`rzp_live_...`) after successful test transactions.
- [ ] **Supabase Free-Tier Auto-Pausing Mitigation**:
  Free-tier Supabase projects are automatically paused after 7 consecutive days of inactivity.
  - For free-tier deployments: Configure an automated uptime monitor (e.g., UptimeRobot, Better Uptime) to ping `GET /api/health` every 10–15 minutes.
  - For mission-critical production: Upgrade the project to Supabase Pro to prevent auto-pausing.
