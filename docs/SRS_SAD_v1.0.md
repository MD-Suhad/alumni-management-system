# Software Requirements Specification (SRS) & Software Architecture Document (SAD)
## Version 1.0 — Production-Ready University Alumni Management System

---

## 1. Executive Summary & Project Scope

The **University Alumni Management System** is a secure, modern, multi-tier web application designed to connect university graduates, current students, faculty, and administrative leadership. The system facilitates lifelong alumni engagement, career networking, event organization, membership management, institutional fundraising, and administrative verification.

### Core Objectives
1. **Accredited Alumni Registry**: Streamlined registration with administrative verification against university graduation records to maintain directory integrity.
2. **Privacy-Preserving Directory**: Multi-tiered privacy controls allowing alumni to selectively expose personal, contact, and career information.
3. **Engagement & Networking**: Moderated event registrations with real-time capacity management, QR code check-ins, job board, and alumni spotlight news.
4. **Institutional Governance**: Comprehensive Role-Based Access Control (RBAC), multi-tier membership types, and tamper-evident audit logging for sensitive administrative actions.

---

## 2. User Roles & Permission Matrix

The system enforces six discrete user roles:

| Role | Description | Core Capabilities |
| :--- | :--- | :--- |
| `super_admin` | System Administrator / Registrar | Unrestricted access, RBAC assignment, system configuration, database backup/restore triggers, full audit log access. |
| `admin` | Alumni Association Executive | Alumni approval/rejection, membership validation, event oversight, financial report exports, broad moderation. |
| `moderator` | Content & Career Officer | Review and approve job postings, moderate discussion boards, manage photo gallery albums. |
| `editor` | Communications Officer | Publish news articles, event highlights, press releases, banner announcements, newsletter drafts. |
| `event_manager` | Program & Logistics Officer | Create and manage events, configure ticket capacities, manage RSVPs, scan/verify attendee QR codes. |
| `alumni` | Verified University Graduate | Maintain profile & privacy settings, search directory, register for events, post job opportunities, pay dues. |
| `guest` (Unauthenticated) | General Public | View public homepage, about/committee details, public news, public gallery, submit registration/contact forms. |

---

## 3. Requirements Traceability Matrix (RTM)

| Req ID | Module | Functional Description | API Endpoint(s) | Role(s) |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-AUTH-01** | Auth | Alumni Registration with academic credentials | `POST /api/v1/auth/register` | Public |
| **REQ-AUTH-02** | Auth | Email Verification with expiring cryptographic token | `GET /api/v1/auth/verify-email/:token` | Public |
| **REQ-AUTH-03** | Auth | Credential Login with rate-limiting & HttpOnly refresh token | `POST /api/v1/auth/login` | Public |
| **REQ-AUTH-04** | Auth | Refresh Token rotation and session renewal | `POST /api/v1/auth/refresh-token` | Public |
| **REQ-AUTH-05** | Auth | Password Reset request and validation | `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password` | Public |
| **REQ-ALUM-01** | Alumni | Profile retrieval and granular privacy controls | `GET /api/v1/alumni/profile`, `PUT /api/v1/alumni/profile` | `alumni`, Admin |
| **REQ-ALUM-02** | Directory | Advanced Search & Filter (Batch, Dept, Company, Location) | `GET /api/v1/alumni/directory` | Verified `alumni`, Admin |
| **REQ-ADMN-01** | Admin | Alumni Verification queue with Approve / Reject / Flag | `GET /api/v1/admin/alumni/pending`, `PATCH /api/v1/admin/alumni/:id/status` | `admin`, `super_admin` |
| **REQ-ADMN-02** | Admin | System Metrics & Demographic Distribution Reports | `GET /api/v1/admin/reports/summary`, `GET /api/v1/admin/reports/export-csv` | `admin`, `super_admin` |
| **REQ-EVNT-01** | Events | Event creation with capacity limits and RSVP deadlines | `POST /api/v1/events`, `PUT /api/v1/events/:id` | `event_manager`, `admin` |
| **REQ-EVNT-02** | Events | Alumni event registration with atomic seat allocation | `POST /api/v1/events/:id/register` | Verified `alumni` |
| **REQ-EVNT-03** | Events | Attendance verification via unique QR code validation | `POST /api/v1/events/:id/check-in` | `event_manager`, `admin` |
| **REQ-CARE-01** | Careers | Job postings by alumni with moderation pipeline | `POST /api/v1/jobs`, `GET /api/v1/jobs` | Verified `alumni` |
| **REQ-CARE-02** | Careers | Job moderation (Approve, Reject, Archive) | `PATCH /api/v1/jobs/:id/status` | `moderator`, `admin` |
| **REQ-NEWS-01** | News | Editorial publishing for news and announcements | `POST /api/v1/news`, `PUT /api/v1/news/:id` | `editor`, `admin` |
| **REQ-MBRS-01** | Members | Membership subscription tiers (Annual, Lifetime, General) | `POST /api/v1/memberships`, `GET /api/v1/memberships/my` | Verified `alumni` |
| **REQ-META-01** | Metadata | Academic hierarchy (Departments, Programs, Batches) | `GET /api/v1/metadata/departments`, `GET /api/v1/metadata/batches` | Public |
| **REQ-AUDT-01** | Security | Tamper-evident Audit Logging for all mutating admin calls | `GET /api/v1/admin/audit-logs` | `super_admin` |

---

## 4. Software Architecture Overview

### Architectural Style: Modular Monolith
The backend is structured as a **Modular Monolith** in Node.js (Express ES Modules). It separates concerns into self-contained vertical domain modules (`auth`, `alumni`, `events`, `news`, `jobs`, `admin`, `memberships`) sharing a standardized infrastructure layer (`config`, `middleware`, `utils`, `database`).

```
                    +-----------------------------+
                    |    React 18 + Vite Client   |
                    | (Tailwind CSS, TanStack)    |
                    +--------------+--------------+
                                   | HTTPS / REST
                                   v
                    +-----------------------------+
                    |       Express.js API        |
                    |   (Helmet, Rate-Limit, JWT) |
                    +--------------+--------------+
                                   |
         +-------------------------+-------------------------+
         |                         |                         |
         v                         v                         v
+------------------+      +------------------+      +------------------+
|   Auth & RBAC    |      |  Alumni Core &   |      | Events, Jobs &   |
|   Module         |      |  Directory       |      | News Modules     |
+--------+---------+      +--------+---------+      +--------+---------+
         |                         |                         |
         +-------------------------+-------------------------+
                                   | Mongoose ODM
                                   v
                    +-----------------------------+
                    |        MongoDB Atlas        |
                    |  (Indexed, Atomic Sessions) |
                    +-----------------------------+
```

### Database Entity Relationship Model (MongoDB Collections)
1. **users**: Core credentials, email, password hash, role (`alumni` ... `super_admin`), verification state (`isEmailVerified`, `status`: pending/approved/rejected).
2. **alumniProfiles**: Referenced 1-to-1 with `users`. Houses Student ID, Degree, Department ID, Batch ID, Graduation Year, Current Company, Designation, Bio, Social Links, and `privacySettings`.
3. **departments** & **programs** & **batches**: Academic taxonomies.
4. **memberships**: Tracks membership plan (General, Annual, Life, Donor), validity start/end, transaction ID, payment status.
5. **events** & **eventRegistrations**: Event metadata, capacity, ticket type, deadline, registrant list with unique QR check-in hash and status.
6. **news**: Articles, category tags, author reference, published timestamp, feature banners.
7. **jobs**: Job opportunities posted by alumni, required experience, deadline, salary range, moderation status (`pending`, `active`, `expired`, `rejected`).
8. **auditLogs**: User ID, action name, resource affected, client IP address, user-agent, timestamp, previous vs updated state diff.

---

## 5. Security & Privacy Blueprint
1. **JWT Strategy**: Short-lived access token (15 mins) transmitted in Authorization header; long-lived refresh token (7 days) stored in an `HttpOnly`, `SameSite=Strict`, `Secure` cookie with automatic rotation.
2. **Password Storage**: Hashed using `bcryptjs` with salt round of 12.
3. **Granular Privacy Filter**: Profile serialization engine checks viewer authorization. Hidden fields (`phone`, `email`, `linkedin`) are stripped on the database query or service layer if marked private.
4. **Injection & Attack Mitigation**: `express-mongo-sanitize` to stop NoSQL injection, `helmet` for security headers, strict CORS origin controls, and IP rate-limiting on sensitive endpoints (`/api/v1/auth/*`).
