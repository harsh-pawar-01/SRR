# SRR / Royal Academy of Science - Backend API

Production-ready backend API service for the SRR / Royal Academy of Science Portal. Built with **Node.js**, **Express**, and **Supabase (PostgreSQL)**, featuring custom JWT authentication, strict role-based access control (RBAC), and atomic SQL operations.

---

## 1. Architecture Overview

- **Runtime & Web Framework**: Node.js & Express 5.
- **Database Layer**: Supabase PostgreSQL database managed via `@supabase/supabase-js` using the privileged `service_role` key. Direct access via public `anon` key is revoked for maximum backend data isolation.
- **Security & Hardening**:
  - **Helmet**: Secures HTTP response headers.
  - **CORS**: Origin validation allowing approved frontend domains.
  - **express-rate-limit**: Rate limits placed on sensitive routes (`/api/auth/login` and `/api/consultations`).
  - **Zod Validation**: Strict request schema enforcement on all payload mutations before hitting controllers.
  - **Row Level Security (RLS)**: Enabled across all database tables.
  - **Atomic SQL Procedures**: Race-safe fee payment processing implemented via `record_fee_payment` PostgreSQL stored procedure with row-level locking (`FOR UPDATE`).
  - **Account Deactivation Policy**: Soft-deactivation pattern (`is_active = false`). Deactivated users cannot log in, and existing active tokens are invalidated immediately upon account deactivation via database-backed middleware checks.

---

## 2. Environment Variables

Create a `server/.env` file in the root of the `server/` directory. **Never commit `.env` or print secret values.**

| Variable | Description |
|---|---|
| `PORT` | Local server port (e.g., `5000`) |
| `NODE_ENV` | Application environment (`development` or `production`) |
| `FRONTEND_URL` | Approved frontend origin URL for CORS (e.g., `http://localhost:5173`) |
| `JWT_SECRET` | High-entropy secret string used to sign and verify 7-day session JWTs |
| `SUPABASE_URL` | Supabase project URL (`https://<project-ref>.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role secret key (bypasses RLS for secure backend operations) |
| `RAZORPAY_KEY_ID` | Razorpay API key identifier for fee payment integration |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret key for payment signature verification |
| `ADMIN_USERNAME` | Desired username for the root administrator seed script |
| `ADMIN_PASSWORD` | Initial password for the root administrator seed script |
| `ADMIN_PHONE` | Contact phone number for the root administrator account |

A template is available in `server/.env.example`.

---

## 3. Database Migrations

Run migrations in numerical order using the **Supabase Dashboard SQL Editor** or via the Supabase CLI:

1. **`server/db/migrations/001_init.sql`**
   - Creates tables: `users`, `students`, `marks`, `attendance`, `fees`, `fee_payments`, `syllabus`, `consultations`.
   - Establishes foreign keys with cascading deletions (`ON DELETE CASCADE`).
   - Configures database performance indexes on high-cardinality and filter columns.
   - Enables Row Level Security (RLS) on all 8 tables.
   - Deploys `record_fee_payment()` atomic transaction function.

2. **`server/db/migrations/002_hardening.sql`**
   - Updates `record_fee_payment` to `SECURITY INVOKER` with explicit `search_path = public`.
   - Revokes execute privileges on `record_fee_payment` from `PUBLIC`, `anon`, and `authenticated`, granting execute solely to `service_role`.
   - Revokes all direct table permissions on all 8 tables from `anon` and `authenticated`.

---

## 4. Administrator Account Seeding

To initialize the root system administrator account in Supabase:

```bash
npm run seed:admin
```

This runs `scripts/seedAdmin.js`, which securely hashes `ADMIN_PASSWORD` with bcrypt (salt factor 10) and inserts the administrator into the `users` table if not already present.

---

## 5. Test Suite & Dedicated Test Database Setup

> [!IMPORTANT]
> The automated test suite (`npm test`) is **strictly forbidden from running against the production database**. The test runner performs safety checks and will immediately abort if `server/.env.test` is missing or if its `SUPABASE_URL` matches `server/.env`.

### Step-by-Step: Setting Up a Dedicated Test Database

1. **Create a Second Free Supabase Project**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard) and click **New Project** (e.g., `srr-portal-test`).
   - Choose a strong database password and select your preferred region.

2. **Execute Database Migrations on the Test Project**:
   - Open the **SQL Editor** in your test project's Supabase dashboard.
   - Run `server/db/migrations/001_init.sql` to initialize tables, relations, indexes, and RLS.
   - Run `server/db/migrations/002_hardening.sql` to apply function permissions and revoke public table access.

3. **Configure `server/.env.test`**:
   - Copy the test template:
     ```bash
     cp .env.test.example .env.test
     ```
   - In `server/.env.test`, populate `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` with your test project's API credentials (found under Project Settings -> API).
   - Set `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` for the test environment.

4. **Seed the Test Administrator Account**:
   ```bash
   npm run seed:admin:test
   ```
   This seeds the administrator account into your dedicated test Supabase project.

5. **Run the Automated Integration Tests**:
   ```bash
   npm test
   ```
   - Starts an isolated in-memory Express server.
   - Runs 17 end-to-end integration tests (auth, RBAC, subject boundaries, student permissions, fee idempotency).
   - Automatically cleans up and purges all `test_` prefixed records created during the run.

---

## 6. API Endpoint & Role Access Matrix

All routes except `/`, `/api/auth/login`, and `POST /api/consultations` require an `Authorization: Bearer <token>` header.

### Authentication (`/api/auth`)
| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public (Rate-limited) | Authenticates user; returns 7-day JWT and sanitized profile |
| `GET` | `/api/auth/me` | Authenticated (All) | Returns profile of currently authenticated user |

### User Management (`/api/users`)
| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/users` | `admin` | List staff users (filterable by `role`, `is_active`) |
| `POST` | `/api/users` | `admin` | Onboard staff user (`teacher`, `reception`, `admin`) |
| `PATCH` | `/api/users/:id` | `admin` | Update user profile, password, or contact information |
| `DELETE` | `/api/users/:id` | `admin` | Soft-deactivates user account (`is_active = false`) |

### Student Management (`/api/students`)
| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `POST` | `/api/students/admit` | `admin`, `reception` | Creates student user account and academic profile |
| `POST` | `/api/students/swap-11-to-12` | `admin`, `reception` | Batch promotes 11th standard students to 12th standard |
| `POST` | `/api/students/bulk-archive-12th` | `admin`, `reception` | Archives/removes completed 12th standard student batch |
| `GET` | `/api/students` | `admin`, `reception`, `teacher` | List all students with search & filter |
| `GET` | `/api/students/:id` | `admin`, `reception`, `teacher`, `student` (self) | Get student details, marks, and attendance |
| `PATCH` | `/api/students/:id` | `admin`, `reception` | Update student demographic and academic data |
| `DELETE` | `/api/students/:id` | `admin`, `reception` | Removes student and associated account |

### Syllabus (`/api/syllabus`)
| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/syllabus/:grade` | Authenticated (All) | Get syllabus for standard (`11th` or `12th`) and subject |
| `POST` | `/api/syllabus` | `admin`, `teacher` (own subject) | Add chapter to syllabus |
| `DELETE` | `/api/syllabus/:id` | `admin`, `teacher` (own subject) | Remove chapter from syllabus |

### Test Marks (`/api/marks`)
| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/marks` | Authenticated | Staff views marks list; Students view strictly own marks |
| `POST` | `/api/marks` | `admin`, `teacher` (own subject) | Record marks for a student |
| `DELETE` | `/api/marks/:id` | `admin`, `teacher` (own subject) | Remove a marks record |

### Attendance (`/api/attendance`)
| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/attendance` | Authenticated | Staff views records; Students view strictly own records |
| `POST` | `/api/attendance` | `admin`, `reception` | Bulk upsert daily attendance per student and date |

### Fees & Accounting (`/api/fees`)
| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `GET` | `/api/fees` | Authenticated | Staff views all ledgers; Students view strictly own ledger |
| `POST` | `/api/fees` | `admin`, `reception` | Assign fee ledger to a student |
| `POST` | `/api/fees/:id/pay` | `admin`, `reception` | Record cash/manual installment payment atomically |
| `POST` | `/api/fees/:id/create-order` | Authenticated | Generate Razorpay order for online payment |
| `POST` | `/api/fees/:id/verify-payment` | Authenticated | Verify Razorpay HMAC-SHA256 signature and record payment |

### Consultations & Inquiries (`/api/consultations`)
| Method | Endpoint | Allowed Roles | Description |
|---|---|---|---|
| `POST` | `/api/consultations` | Public (Rate-limited) | Public website admission inquiry submission |
| `GET` | `/api/consultations` | `admin`, `reception` | List consultation inquiries (filterable by status) |
| `PATCH` | `/api/consultations/:id` | `admin`, `reception` | Update inquiry status (`Followed Up`, `Enrolled`, `Closed`) |
| `DELETE` | `/api/consultations/:id` | `admin`, `reception` | Delete consultation record |
