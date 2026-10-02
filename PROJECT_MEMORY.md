# PROJECT MEMORY — SYSTEM AWAN

> Dokumen ini adalah catatan kondisi proyek System Awan.
>
> File ini digunakan untuk menjaga konteks proyek antar sesi development.
>
> Jangan mengarang informasi.
> Jangan menghapus histori penting.
> Update bagian yang berubah saja.

---

# 1. PROJECT INFORMATION

**Project Name:** System Awan

**Project Type:** Web Inventory Management

**Domain:** Inventory Sparepart

**Project Status:** MVP COMPLETED

**Current Phase:** Phase 7 — Testing / Polish

**Deployment Target:** Vercel

---

# 2. PROJECT OBJECTIVE

System Awan adalah aplikasi web untuk membantu pengelolaan inventory sparepart secara terstruktur.

Tujuan utama:

* mengelola data sparepart
* memantau jumlah stok
* mengetahui kondisi stok
* mempermudah pencarian sparepart
* mencatat perubahan inventory
* menyediakan dashboard inventory
* menyediakan fondasi aplikasi yang mudah dikembangkan

---

# 3. TECHNOLOGY STACK

| Technology     | Decision               |
| -------------- | ---------------------- |
| Framework      | Next.js                |
| Language       | TypeScript             |
| Frontend       | React                  |
| Styling        | Tailwind CSS v4        |
| Database       | PostgreSQL             |
| ORM            | Prisma                 |
| API            | Next.js Route Handlers |
| Deployment     | Vercel                 |
| Authentication | User Model ada (belum UI) |
| UI Library     | Lucide React (Icons)   |

---

# 4. ARCHITECTURE

## Application Architecture

Final:

Browser -> Next.js App Router (Server/Client Components) -> Prisma ORM -> Local PostgreSQL

---

# 5. INITIAL FEATURE SCOPE

## Priority 1

* [x] Dashboard
* [x] CRUD Sparepart
* [x] Search Sparepart
* [x] Detail Sparepart
* [x] Stock Management

## Priority 2

* [x] Category
* [x] Brand
* [x] Stock In
* [x] Stock Out
* [x] Stock History

## Priority 3

* [ ] Reports
* [ ] Export
* [x] Low Stock Notification (Dashboard indicator)
* [ ] Other future features

---

# 6. DATABASE

Database:

**PostgreSQL**

ORM:

**Prisma**

## Final Entities

* User
* Sparepart
* Category
* Brand
* StockTransaction

---

# 7. DATABASE DECISIONS

Keputusan final:
* Semua entitas utama memakai `cuid` sebagai primary key.
* StockTransaction memiliki relasi ke Sparepart (Restrict on delete) dan User.
* Category dan Brand opsional (SetNull on delete).
* Transaksi (IN/OUT) langsung mengupdate stok pada model Sparepart secara atomic (`prisma.$transaction`).

---

# 8. API

Telah diimplementasikan:

```text
/api/categories (GET, POST, DELETE)
/api/brands (GET, POST, DELETE)
/api/spareparts (GET, POST)
/api/spareparts/[id] (GET, PUT, DELETE)
/api/transactions (GET, POST)
```

---

# 9. PAGE STRUCTURE

Final MVP Structure:

```text
/
├── Dashboard (Summary, Low Stock, Recent Transactions)
├── /categories (Category & Brand Management)
├── /spareparts (List & Search)
│   ├── /create
│   └── /[id]
│       └── /edit
└── /transactions (In/Out History)
    └── /create
```

---

# 10. UI / UX

Design direction:

* Clean, modern, responsive.
* Full Dark Mode support via `next-themes` dan Tailwind v4.
* Icons via `lucide-react`.

---

# 11. AUTHENTICATION

Status:

**PENDING / FUTURE PHASE**

Tabel `User` sudah ada di database, tetapi login UI dan proteksi route belum diimplementasikan untuk MVP.

---

# 12. DEVELOPMENT PHASES

## Phase 1 — Project Setup
Status: DONE

## Phase 2 — Database
Status: DONE

## Phase 3 — API
Status: DONE

## Phase 4 — Dashboard
Status: DONE

## Phase 5 — Sparepart Management
Status: DONE

## Phase 6 — Stock Management
Status: DONE

## Phase 7 — Testing
Status: IN PROGRESS
Tasks:
* [x] TypeScript check
* [ ] Lint
* [ ] Build
* [x] API testing (manual)
* [x] CRUD testing (manual)
* [x] UI testing (manual)

## Phase 8 — Deployment
Status: NOT STARTED

---

# 13. CURRENT TASK

**Task:** Menyelesaikan semua antarmuka web (Goal).

**Status:** COMPLETED

---

# 14. NEXT TASK

1. Testing menyeluruh dan bug fixing.
2. Deployment ke Vercel jika diinginkan.
3. Menambahkan Authentication (NextAuth / sejenisnya).

---

# 15. COMPLETED TASKS

* Setup Next.js + Tailwind v4 + PostgreSQL.
* Desain Schema Prisma lengkap.
* Pembuatan Core REST API lengkap.
* Pembuatan UI Dashboard.
* Integrasi Tema Gelap/Terang (Dark Mode) Next Themes.
* Pembuatan UI Manajemen Sparepart (CRUD).
* Pembuatan UI Kategori & Merk.
* Pembuatan UI Transaksi (Masuk/Keluar).

---

# 16. KNOWN ISSUES

* Delete Kategori/Merk lewat UI mungkin butuh API route tambahan jika belum utuh.
* Authentication belum ada, sehingga transaksi belum terekam berdasarkan user login aktif.

---

# 17. TECHNICAL DEBT

* Tidak menggunakan validasi eksternal ketat seperti Zod di server-side untuk mempercepat MVP.

---

# 18. OPEN QUESTIONS

* Kapan Authentication akan diimplementasikan?

---

# 19. TECHNICAL DECISIONS

## Decision 001 — Framework
Next.js App Router.

## Decision 002 — Database
Local PostgreSQL.

## Decision 003 — ORM
Prisma ORM.

## Decision 004 — Styling
Tailwind CSS v4 dengan `next-themes`.

---

# 20. DEVELOPMENT RULES
(Tetap)

---

# 21. MEMORY UPDATE RULE
(Tetap)

---

# 22. CHANGE LOG

## 2026-09-25
* Project System Awan dibuat.
* Setup PostgreSQL lokal selesai.
* Core API & Database Schema selesai.
* Seluruh tampilan web MVP (Dashboard, Sparepart, Kategori, Transaksi) selesai dibuat.
* Dark Mode selesai diintegrasikan secara penuh.
* Form penambahan barang diperbaiki dengan fitur auto-stok (IN) dan integrasi relasi Kategori/Merk yang stabil.
