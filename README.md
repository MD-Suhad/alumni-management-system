# University Alumni Management System
### Version 1.0 — Production-Ready Full Stack Architecture

This is a production-ready, security-audited **Alumni Management System** built with **Node.js/Express (ES Modules)**, **MongoDB/Mongoose**, and **React 18 (Vite + Tailwind CSS)**.

---

## 🏛️ Project Directory Structure

```
alumni-management-system/
├── docs/
│   └── SRS_SAD_v1.0.md            # Complete SRS, Architecture, & Traceability Matrix
├── server/
│   ├── src/
│   │   ├── config/                # Database, environment, and RBAC roles
│   │   ├── middleware/            # Auth, RBAC, Validation, Error Handling, Rate Limiting
│   │   ├── modules/               # Domain-driven modular monolith
│   │   │   ├── auth/              # JWT, HttpOnly refresh cookies, email verification
│   │   │   ├── users/             # User credentials and role states
│   │   │   ├── alumni/            # Profiles, directory search, granular privacy
│   │   │   ├── admin/             # Verification queue, stats, audit logs, CSV export
│   │   │   ├── events/            # Events, RSVP, capacity locking, QR codes
│   │   │   ├── eventRegistrations/# Unique ticket reservations and check-in
│   │   │   ├── jobs/              # Career postings and alumni moderation
│   │   │   ├── news/              # Association stories and editorial workflow
│   │   │   ├── memberships/       # Membership tiers and renewal tracking
│   │   │   ├── departments/       # Academic departments
│   │   │   ├── batches/           # Academic graduation batches
│   │   │   ├── programs/          # Degree programs
│   │   │   ├── contact/           # Public inquiry handler
│   │   │   └── auditLogs/         # Tamper-evident admin action logging
│   │   ├── scripts/
│   │   │   └── seed.js            # Initial database population script
│   │   ├── utils/                 # API Response/Error helpers, tokens, email service
│   │   ├── app.js                 # Express application middleware mounting
│   │   └── server.js              # Server entrypoint with graceful shutdown
│   ├── .env.example
│   └── package.json
└── client/
    ├── src/
    │   ├── components/
    │   │   ├── common/            # LoadingSpinner, Badge, modals
    │   │   └── layout/            # Navbar, Footer, App Layout
    │   ├── context/
    │   │   └── AuthContext.jsx    # Session state, login, register, role checks
    │   ├── lib/
    │   │   └── axios.js           # Configured Axios with auto token-refresh interceptor
    │   ├── pages/
    │   │   ├── Home.jsx           # Landing page with KPI stats, events, news, & CTA
    │   │   ├── About.jsx          # Vision, pillars, and executive committee
    │   │   ├── Directory.jsx      # Filterable alumni directory with privacy controls
    │   │   ├── Events.jsx         # Event cards, RSVP modal, & QR ticket generation
    │   │   ├── Jobs.jsx           # Alumni career board with posting & moderation
    │   │   ├── News.jsx           # Announcements & article detail view
    │   │   ├── auth/              # Login & Multi-step Registration
    │   │   ├── alumni/            # Dashboard & Profile/Privacy manager
    │   │   └── admin/             # Executive stats & pending accreditation queue
    │   ├── routes/
    │   │   └── AppRoutes.jsx      # Public, Protected, and Admin route guards
    │   ├── App.jsx
    │   ├── index.css              # Custom Tailwind styling & typography
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚡ Quick Start Guide

### 1. Database Setup
Ensure **MongoDB** is running locally (`mongodb://localhost:27017/alumni_management_db`) or provide your **MongoDB Atlas** connection string in `server/.env`.

### 2. Run Database Seeder
To populate initial academic departments, batches, administrator accounts, sample alumni, events, and job postings:
```bash
cd server
cp .env.example .env
npm install
npm run seed
```

### 3. Start Backend Server
```bash
cd server
npm run dev
# Server will run on http://localhost:5000
# Health check available at http://localhost:5000/health
```

### 4. Start Frontend Client
```bash
cd client
cp .env.example .env
npm install
npm run dev
# Client will run on http://localhost:5173
```

---

## 🔑 Pre-Configured Test Accounts (From Seeder)

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@alumni.edu` | `AdminPassword123!` | Access to `/admin`, accreditation queue, audit logs, CSV exports |
| **Verified Alumni** | `tanvir@gmail.com` | `AlumniPassword123!` | Access to `/directory`, event RSVP tickets, career posting |

---

## 🛡️ Security & Privacy Implementation
1. **HttpOnly Cookie Refresh Tokens**: Long-lived refresh tokens are stored in `HttpOnly`, `SameSite=Strict` cookies to prevent XSS credential theft.
2. **Granular Directory Privacy Controls**: Alumni can independently toggle the visibility of their phone number, email, and current employer in the directory.
3. **Atomic Event Registrations**: Prevents race conditions during event seat reservation using atomic conditional updates.
4. **Rate Limiting**: Protected `/api/v1/auth/*` endpoints against brute-force attacks via `express-rate-limit`.
5. **NoSQL Sanitization & Helmet**: Secures HTTP response headers and sanitizes incoming request payloads.
