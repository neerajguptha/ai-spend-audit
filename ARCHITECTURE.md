# Architecture

## System Overview

User Input → Frontend Form → API Route → Audit Engine → Supabase → UI + Public Page

---

## Flow

1. User enters AI tool spend
2. Data stored in React state
3. POST /api/summary
4. Audit engine calculates savings
5. Supabase stores audit
6. Result shown on dashboard
7. Public URL generated (/audit/[id])

---

## Stack Choice

- Next.js → SSR + routing + API in one
- Supabase → fast backend + database
- Tailwind → fast UI iteration
- Recharts → analytics visualization

---

## Scaling Plan (10k audits/day)

- Move audit engine to server-only service
- Add caching layer (Redis)
- Use queue for email sending
- Separate analytics DB

---

## Why this architecture

Chose simplicity over microservices because:
- MVP speed matters
- Single repo reduces complexity
- Easy deployment on Vercel