# Task Remaining — Event Booking System

> **Generated:** 2026-06-18 · Source of truth for the migration backlog.
> **Status values:** `Not Started` · `In Progress` · `Blocked` · `Done` (move Done items to `task-completed.md`).
> **Priority:** P0 (critical path) · P1 (high) · P2 (nice-to-have).

> **Progress snapshot (2026-06-18, end of session):**
> - ✅ Phase 3 cleanup · ✅ Workspace removed · ✅ Email → nodemailer-only · ✅ controller convention standardized · ✅ demo-user/admin seed.
> - ✅ **Backend foundation:** roles (admin/organizer/attendee), all core models, Venue CRUD + seat layout, Event CRUD + ticket types + seat generation + publish + public discovery/detail/seat-map, Booking flow (lock → booking → **demo pay yes/no** → history/cancel), admin user mgmt (role editing).
> - ✅ **Frontend (production UI):** landing page, public event discovery + detail w/ live seat map, attendee dashboard + bookings + demo checkout, organizer dashboard/events/venues/seat-layout/publish, admin users, role-based nav + routing + branding.
> - ✅ **Added (2026-06-18 pm):** PDF+QR ticket system & download; admin analytics dashboard (revenue/bookings/events) w/ CustomTable; Terms & Privacy rewrites; helmet + auth rate-limit; booking-cancellation email; shared-component reuse (FullScreenLoader/CustomTable/Modal); demo organizer seed.
> - 🔜 **Remaining:** real payment provider (Razorpay) to replace demo gateway; general-admission (non-seated) booking path; refund model + tracking (2.9) + real refunds; QR check-in endpoint (9.4); zod/joi request validation; automated tests (13.x); DB-integration testing of all flows.

---

## 0. Cleanup (Phase 3) — ✅ COMPLETE (2026-06-18)

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 0.1 | Strip interview/community/recruiter/chatbot lazy imports + routes from `frontend/src/main.jsx`; remove `<ChatBot/>` from root render | P0 | removal-report | **Done** |
| 0.2 | Remove Socket.IO/WS: delete `backend/src/realtime/`, edit `index.js` to stop calling socket setup; delete `frontend/src/socket/` | P0 | 0.1 | **Done** |
| 0.3 | Edit `backend/src/app.js`: unmount AI/interview/community/recruiter/notes/chatbot/resume routers, remove `/tts` + `@google-cloud` import | P0 | — | **Done** |
| 0.4 | Delete interview/resume/chatbot/services/community/recruiter/featurerequest/notes controllers + routes | P0 | 0.3 | **Done** |
| 0.5 | Delete `helpers/ai/*`, `credit.helper.js`, `constant/pricing.js`, interview/application email templates | P0 | 0.4 | **Done** |
| 0.6 | Delete interview/community/recruiter/credit/notes/featurerequest models | P0 | 0.4 | **Done** |
| 0.7 | Edit shared files: `user.controller` (drop credits), `admin.controller` (drop JD/credit/interview), `Common.js` (drop interview crypto), routes | P0 | 0.6 | **Done** |
| 0.8 | Delete interview/resume/recruiter/community/notes frontend pages, `useChatBotStore`, `ChatBot/`, interview CSS | P0 | 0.1 | **Done** |
| 0.9 | Uninstall obsolete deps (backend: deepgram/google/genai/pdf-parse/ws; frontend: deepgram/xyflow/snapdom/mammoth/pdfjs) | P1 | 0.5,0.8 | **Done** |
| 0.10 | Smoke test: backend import graph resolves; frontend builds clean | P0 | 0.1–0.9 | **Done** |

> **Deferred from cleanup** (no longer blocking, tracked elsewhere): prune `user.model` community-ban fields + drop `verifyRecruiter` → folded into task **3.1**; rebuild Sidebar/Header nav → task **12.1**; replace `user/Dashboard.jsx` interview API calls → task **12.3**; prune obsolete env vars → task **1.1**.

---

## 1. Backend (foundation & infrastructure)

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 1.1 | Introduce frontend env config (`VITE_API_BASE_URL`, `VITE_IMG_BASE_URL`); replace hardcoded URLs in `apiCall.js` | P0 | 0.10 | Not Started |
| 1.2 | Rebrand: replace "EventNest" strings (CORS origins, email `SMTP_FROM_NAME`, `useMetaHandler`, AuthLeftPanel) with Saavo Events | P1 | 0.10 | Not Started |
| 1.3 | Add input validation layer (zod/joi) + `helmet` + `express-rate-limit` | P1 | 0.10 | Not Started |
| 1.4 | Add seat-lock expiry job (Mongo TTL index or interval sweeper) | P0 | 6.x | Not Started |
| 1.5 | Standardize service layer folder (`services/`) for new domain logic | P2 | 0.10 | Not Started |

---

## 2. Database (new collections / models)

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 2.1 | `venue.model` (name, address, city, capacity, layout meta) | P0 | 0.6 | Not Started |
| 2.2 | `venueSeat.model` (venue ref, section, row, number, type) | P0 | 2.1 | Not Started |
| 2.3 | `event.model` (title, desc, venue, datetime, category, banner, status draft/published) | P0 | 2.1 | Not Started |
| 2.4 | `eventTicketType.model` / seat categories + pricing | P0 | 2.3 | Not Started |
| 2.5 | `eventSeat.model` (cloned from venueSeats per event, price, status) | P0 | 2.3,2.4 | Not Started |
| 2.6 | `seatLock.model` (event, seats, user, expiresAt TTL) | P0 | 2.5 | Not Started |
| 2.7 | `booking.model` + `bookingSeat.model` | P0 | 2.5 | Not Started |
| 2.8 | `payment.model` (booking ref, Razorpay order/payment ids, status) | P0 | 2.7 | Not Started |
| 2.9 | `cancellation.model` + `refund.model` | P1 | 2.7,2.8 | Not Started |
| 2.10 | `ticket.model` (booking ref, QR payload, PDF url, ticket code) | P1 | 2.7 | Not Started |

---

## 3. Authentication (adapt existing)

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 3.1 | Repurpose role/userType enums → `admin`, `organizer`, `user`(attendee) | P0 | 0.7 | Not Started |
| 3.2 | Verify Register / Login / Forgot / Reset / Refresh / Logout still work post-cleanup | P0 | 0.10 | Not Started |
| 3.3 | RBAC guards for organizer vs admin vs attendee endpoints | P0 | 3.1 | Not Started |
| 3.4 | Rework email-verification + forgot-password templates branding | P2 | 1.2 | Not Started |

---

## 4. Venue Management

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 4.1 | Create/Edit/Delete Venue API (organizer/admin) | P0 | 2.1 | Not Started |
| 4.2 | Seat layout builder API (define sections/rows/seats) | P0 | 2.2,4.1 | Not Started |
| 4.3 | Venue list + detail API | P0 | 4.1 | Not Started |
| 4.4 | Frontend: Venue CRUD pages + seat-layout designer | P1 | 4.1,4.2 | Not Started |

---

## 5. Event Management

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 5.1 | Create/Edit Event API | P0 | 2.3 | Not Started |
| 5.2 | Publish/Draft Event API | P0 | 5.1 | Not Started |
| 5.3 | Event banner upload (reuse `Upload.js`/S3) | P0 | 5.1 | Not Started |
| 5.4 | Event discovery API: search/filter (city,date,category,price)/sort/paginate | P0 | 5.1 | Not Started |
| 5.5 | Generate event seat inventory from venue seats + pricing | P0 | 2.5,5.1 | Not Started |
| 5.6 | Frontend: Event create/edit form, event list, event detail page | P1 | 5.1–5.5 | Not Started |

---

## 6. Booking Flow

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 6.1 | Seat availability API (event seat map) | P0 | 2.5 | Not Started |
| 6.2 | Seat lock API (create lock, 5-min expiry) + release | P0 | 2.6 | Not Started |
| 6.3 | Booking creation (reserve locked seats) | P0 | 2.7,6.2 | Not Started |
| 6.4 | Booking history API (user) | P0 | 2.7 | Not Started |
| 6.5 | Frontend: seat selection UI + booking confirmation + history | P1 | 6.1–6.4 | Not Started |

---

## 7. Payments

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 7.1 | Add `razorpay` dep + config (`RAZORPAY_KEY_ID/SECRET/WEBHOOK_SECRET`) | P0 | — | Not Started |
| 7.2 | Create order API → on booking | P0 | 6.3,7.1 | Not Started |
| 7.3 | Verify payment signature API | P0 | 7.2 | Not Started |
| 7.4 | Webhook endpoint (verify + mark booking paid, finalize seats) | P0 | 7.2 | Not Started |
| 7.5 | Payment tracking / status | P1 | 2.8 | Not Started |
| 7.6 | Frontend: Razorpay checkout integration | P1 | 7.2,7.3 | Not Started |

---

## 8. Cancellation & Refund

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 8.1 | Booking cancellation API + rules (cutoff window) | P1 | 6.3 | Not Started |
| 8.2 | Refund flow (Razorpay refund API) | P1 | 7.x,8.1 | Not Started |
| 8.3 | Refund tracking + status | P1 | 2.9 | Not Started |
| 8.4 | Frontend: cancel booking + refund status | P2 | 8.1–8.3 | Not Started |

---

## 9. Ticket System

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 9.1 | QR code generation per ticket (`qrcode`) | P1 | 2.10,6.3 | Not Started |
| 9.2 | PDF ticket generation (event, date, venue, seats, QR) | P1 | 9.1 | Not Started |
| 9.3 | Ticket download/email API | P1 | 9.2 | Not Started |
| 9.4 | (Optional) QR check-in/validation endpoint | P2 | 9.1 | Not Started |

---

## 10. Notifications

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 10.1 | New email templates: booking-confirmation, cancellation-confirmation, refund | P1 | 1.2 | Not Started |
| 10.2 | Send booking confirmation email + in-app notification on paid booking | P1 | 7.4,10.1 | Not Started |
| 10.3 | Send cancellation/refund confirmation | P1 | 8.x,10.1 | Not Started |
| 10.4 | Reuse `notification.helper` for in-app event/booking notifications | P2 | — | Not Started |

---

## 11. Admin Dashboard

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 11.1 | Rebuild admin dashboard stats: revenue, events, bookings, users analytics | P1 | 2.x,7.x | Not Started |
| 11.2 | Event analytics (occupancy, top events) | P1 | 5.x,6.x | Not Started |
| 11.3 | Booking analytics (trend, cancellation rate) | P1 | 6.x,8.x | Not Started |
| 11.4 | User analytics | P2 | — | Not Started |
| 11.5 | Frontend: admin analytics charts (recharts) | P1 | 11.1–11.4 | Not Started |
| 11.6 | Admin: manage venues/events/users/categories | P1 | 4.x,5.x | Not Started |

---

## 12. Frontend Refactor (Phase 5)

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 12.1 | Rebuild Sidebar/Header nav for event roles | P0 | 0.8,3.1 | Not Started |
| 12.2 | Landing page (Overview): Hero (event discovery + search + CTA), Featured Events, Why Choose Us | P1 | 5.4 | Not Started |
| 12.3 | Overview/dashboard page: upcoming events, popular events, user bookings, recent activity | P1 | 5.4,6.4 | Not Started |
| 12.4 | Terms page rewrite (booking/cancellation/refund/user-responsibility) | P2 | — | Not Started |
| 12.5 | Privacy page rewrite (data collection/payment/cookies/security/retention) | P2 | — | Not Started |
| 12.6 | Rebrand AuthLeftPanel + auth pages copy | P2 | 1.2 | Not Started |

---

## 13. Testing

| # | Task | Priority | Dependencies | Status |
|---|---|---|---|---|
| 13.1 | API smoke tests for auth + booking critical path | P1 | 6.x,7.x | Not Started |
| 13.2 | Concurrent seat-lock / double-booking test | P0 | 6.2,6.3 | Not Started |
| 13.3 | Payment webhook verification test | P0 | 7.4 | Not Started |
| 13.4 | E2E happy path: browse → select → lock → pay → ticket | P1 | 6–9 | Not Started |
