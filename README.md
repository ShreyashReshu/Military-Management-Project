# 🪖 Military Management Project

A full-stack web application designed to manage military assets, personnel, and role-based access using modern technologies like Supabase, React, and Node.js.

---

## 🚀 1. Project Overview

### Description
This project enables military administrators to manage assets, personnel records, role assignments, and operational tracking within a secure environment. It features role-based access control (RBAC) to ensure that only authorized personnel can access or modify data.

### Assumptions
- All users have a predefined role: Admin, Officer, or Viewer.
- Internet connectivity is available for Supabase DB access.
- Secure JWT-based authentication is implemented.

### Limitations
- Currently supports only web UI (no mobile).
- Only PostgreSQL (via Supabase) is supported as the DB.
- Audit logs are stored in the same DB for now.

---

## 🧱 2. Tech Stack & Architecture

| Layer       | Technology               | Reason                                  |
|------------|--------------------------|-----------------------------------------|
| Frontend   | React + Vite             | Fast, modern UI with component system   |
| Backend    | Node.js + Express        | Lightweight REST API                    |
| Database   | Supabase (PostgreSQL)    | Managed SQL with Auth & Realtime        |
| Auth       | Supabase Auth            | Easy JWT-based RBAC                     |
| Hosting    | Supabase + Vercel        | Free-tier friendly, low latency         |

---

## 🗃️ 3. Data Models / Schema

### Tables:
- **Users** (`id`, `email`, `role_id`, `created_at`)
- **Roles** (`id`, `name`, `permissions`)
- **Assets** (`id`, `name`, `type`, `assigned_to`, `status`)
- **Assignments** (`id`, `user_id`, `asset_id`, `assigned_at`)
- **Logs** (`id`, `user_id`, `action`, `timestamp`, `endpoint`)

> Relationships:
- One `User` has one `Role`
- One `Asset` can be assigned to one `User`
- Logs store API actions per user

---

## 🔐 4. RBAC Explanation

### Roles
- **Admin**: Full access to all features
- **Officer**: Can view and manage assets but not users
- **Viewer**: Read-only access

### Enforcement Method
- Supabase JWT tokens include the `role`
- Backend middleware verifies role before granting access
- Frontend hides components based on permissions

---

## 🧾 5. API Logging

All API requests are logged in the `Logs` table with:
- `user_id`
- `action`
- `endpoint`
- `timestamp`

Logged using a custom Express middleware.

---

## ⚙️ 6. Setup Instructions

### ✅ Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in Supabase creds in .env
npm run dev
