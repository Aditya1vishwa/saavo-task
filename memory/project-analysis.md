# Project Analysis — EventNest → Event Booking System

> **Audit date:** 2026-06-18
> **Source project:** EventNest / PrepJS — an AI-powered interview-prep & recruiting platform.
> **Target project:** Saavo Event Booking System (BookMyShow/Eventbrite-style).
> **Status:** Analysis only — no code changed yet.

---

## 1. Current Project Architecture

A classic **monorepo** with two independently-built apps served from one Express process in production.

```
d:\saavoeventbooking
├── backend/        Express 5 + Mongoose 9 (ESM) API + static host for built frontend
├── frontend/       React 19 + Vite 8 + react-router 7 + Zustand 5 SPA
├── memory/         Migration docs (this folder)
└── others/         (empty)
```

- **Backend** (`backend/src`) is an ESM Express 5 app. `index.js` boots Mongo, creates an HTTP server, attaches **two WebSocket servers** (interview STT + community chat), and listens on `PORT` (default 5002).
- **Frontend** is a Vite SPA. In production it is built to `frontend/dist` and copied into `backend/public/dist`; `app.js` serves it (with pre-compressed `.br`/`.gz` static assets) and falls back to `index.html` for client-side routing.
- **Auth** is JWT (access + refresh) via httpOnly cookies *and* `Authorization` headers, with a multi-tenant **Workspace** concept baked into the token.
- **Storage** is pluggable: local disk (`/uploads`) or AWS S3 (`STORAGE_TYPE` env).
- **AI layer** (Gemini, Deepgram, Google Cloud TTS/STT) powers interviews, resume analysis, and the chatbot.

### Request flow
```
React SPA → fetch (apiConfig/apiCall.js) → /api/* → Express router
          → middleware (verifyJWT) → controller → Mongoose model → MongoDB
WebSocket → ws://…/stt  &  ws://…/community  (realtime/)
```

---

## 2. Existing Modules

### Backend route surface (`app.js`)
| Mount | Router | Domain | Migration verdict |
|---|---|---|---|
| `/api/auth` | auth.route | Authentication | **REUSE** |
| `/api/user` | user.route | Account, notifications, **credits**, help tickets | REUSE-WITH-EDITS |
| `/api/user-details` | userdetails.route | Resume/profile builder + AI parse | **REMOVE** |
| `/api/admin` | admin.route | User mgmt + JD/credit/interview stats | REUSE-WITH-EDITS |
| `/api/location` | location.route | Country/State/City lookup | **REUSE** |
| `/api/services` | services.route | AI STT/TTS services | **REMOVE** |
| `/api/interviews` | interviews.route | Interview lifecycle | **REMOVE** |
| `/api/recruiter` | recruiter.route | Job openings / applicants | **REMOVE** |
| `/api/community` | community.route | Community posts/chat | **REMOVE** |
| `/api/feature-requests` | featurerequest.route | Feature voting | **REMOVE** |
| `/api/chatbot` | chatbot.route | AI chat assistant | **REMOVE** |
| `/api/notes` | notes.route | Notes board | **REMOVE** |
| `/api/resume-analysis` | resumeanalysis.route | Resume ATS scoring | **REMOVE** |
| `/tts` (inline in app.js) | — | Google TTS demo endpoint | **REMOVE** |

### Frontend page groups (`main.jsx`)
- **Auth:** login, signup (OTP), forget, reset — REUSE-WITH-EDITS
- **Public:** Overview (landing, ~1075 lines), Terms, Privacy — REUSE-WITH-EDITS (rewrite content)
- **User (job-seeker):** Dashboard, CreateInterview, InterviewPreStart, InterviewSession, AllInterviews, InterviewView, JobSeekerProfile, ResumeAnalysis, Credits, NotesBoard, HelpSupport — mostly **REMOVE**
- **Admin:** Dashboard, Users, UserCredits, CreditUsage, Jd, KeyValueType, HelpDesk, ManageCategories — partial REUSE
- **Recruiter:** Dashboard, JobOpenings, CreateJobOpening, JobOpeningView, CreateJobInterview, JobInterviews, RecruiterInterviewView, ShortlistedApplications — **REMOVE**
- **Interview (public):** PublicInterviewAccess, QuickInterviewStart — **REMOVE**
- **Community:** Community, FeatureRequests — **REMOVE**

---

## 3. Dependencies

### Backend (`backend/package.json`)
**Keep:** `express`, `mongoose`, `mongoose-aggregate-paginate-v2`, `jsonwebtoken`, `bcrypt`, `cookie-parser`, `cors`, `cross-env`, `dayjs`, `dotenv`, `multer`, `nodemailer`, `@sendgrid/mail`, `@aws-sdk/client-s3`, `@aws-sdk/lib-storage`, `express-winston`/`winston`.
**Remove (AI/interview):** `@deepgram/sdk`, `@google-cloud/speech`, `@google-cloud/text-to-speech`, `@google/genai`, `pdf-parse`, `ws`.
**Add (new):** Razorpay SDK (`razorpay`), QR code (`qrcode`), PDF generation (`pdfkit` or `puppeteer`), validation (`zod`/`joi`), and (recommended) `helmet` + `express-rate-limit`.

### Frontend (`frontend/package.json`)
**Keep:** `react`, `react-dom`, `react-router`, `zustand`, `js-cookie`, `lodash`, `react-hot-toast`, `react-select`, `@tinymce/tinymce-react`/`tinymce`, `react-markdown`/`remark-gfm`.
**Remove (AI/interview):** `@deepgram/sdk`, `@xyflow/react`, `@zumer/snapdom`, `mammoth`, `pdfjs-dist`.
**Add (new):** Razorpay checkout script (CDN), a charting lib for analytics (e.g. `recharts`), optional seat-map rendering lib.

---

## 4. Reusable Components

### Frontend (REUSE as-is)
- `components/common/CustomTable.jsx` — paginated data table (events, bookings, attendees lists).
- `components/common/FullScreenLoader.jsx` — loading overlay.
- `components/common/SettingsTableCard.jsx` — settings form card.
- `components/Modal.jsx` — portal modal with ESC/backdrop close.
- `components/Tooltip.jsx` — auto-positioning tooltip.
- `components/CookieConsent.jsx` — GDPR consent banner.
- `components/TextEditor.jsx` — TinyMCE wrapper (event descriptions, policies).
- `useMetaHandler.js` — per-route SEO meta hook (rebrand strings).

### Frontend (REUSE-WITH-EDITS)
- `apiConfig/apiCall.js` — fetch wrapper; **hardcoded base URLs → move to env**, drop `sttWsDomain`.
- `store/useUserStore.js` — auth/workspace Zustand store.
- `AuthLayout.jsx` / `MainLayout.jsx` — shells (drop credit load; adapt roles).
- `components/wrapper/Header.jsx` / `Sidebar.jsx` — rebrand + rebuild nav.
- `components/auth/AuthLeftPanel.jsx` — rebrand marketing copy.
- `pages/auth/*` (login, signup, forget, reset), `pages/user/settings/UserSettings.jsx`.

---

## 5. Reusable Backend Services

### REUSE as-is
- `utils/ApiError.js`, `utils/ApiResponse.js`, `utils/asyncHandler.js` — response/error envelope.
- `utils/AwsS3.js`, `utils/fileName.js` — S3 client + filename sanitizer.
- `helpers/Auth.js` — bcrypt hashing + JWT generate/verify.
- `helpers/Upload.js` — local/S3 upload abstraction.
- `helpers/email.helper.js` — multi-provider email (Brevo → SendGrid → SMTP) + template renderer.
- `helpers/notification.helper.js` + `models/notification.model.js` — in-app notifications.
- `middlewares/auth.middleware.js` — `verifyJWT`, `verifyAdmin`, role guards.
- `middlewares/multer.middleware.js` — multipart upload.
- `db/mongodb/mongodbConnection.js` — Mongo connect.
- `constant/others.js` — `passwordRegex`.
- `controllers/location.controller.js` + route + model — geo lookup (event cities).

### REUSE-WITH-EDITS
- `controllers/auth.controller.js` — drop `seedDummyUser`; keep full auth lifecycle.
- `models/user.model.js` — drop community-ban fields; repurpose `userType`/`role` enums.
- `models/Workspace.model.js` — generic multi-tenant team container (organizer teams).
- `controllers/user.controller.js` — keep notifications + help tickets; drop credit endpoints.
- `controllers/admin.controller.js` — keep user CRUD + key-value config + help tickets; drop JD/credit/interview-stats; rebuild dashboard stats for events.
- `helpers/Common.js` — keep `deleteLocalFiles`; drop interview-token crypto.
- `models/userdetail.model.js` — strip resume/AI fields; optionally keep bio/photo/socials as organizer profile.

---

## 6. Existing Authentication Flow

JWT access + refresh, stored as httpOnly cookies and also returned for header use. Token payload carries `currentWorkspaceId`.

```
Signup    POST /api/auth/signup        → create user, email OTP (email-verification.html)
Verify    POST /api/auth/verify-email  → isEmailVerified = true
Login     POST /api/auth/login         → ensure default Workspace, issue access+refresh, set cookies
Guard     verifyJWT                    → decode ACCESS_TOKEN_SECRET, inject req.user + req.currentWorkspace
Refresh   POST /api/auth/refresh-token → verify REFRESH_TOKEN_SECRET, rotate tokens
Forgot    POST /api/auth/forgot-password → forgetToken + email (forgot-password.html, 15-min)
Reset     POST /api/auth/reset-password  → verify token, hash new password
Change    POST /api/auth/change-password (auth)
Logout    GET  /api/auth/logout        → clear refreshToken + cookies
Workspace POST /api/auth/change-workspace → re-issue token with new currentWorkspaceId
```

- **Roles today:** `role` = user|admin; `userType` = job-seeker|recruiter|admin.
- **RBAC guards:** `verifyJWT`, `verifyAdmin`, `verifyRecruiter`, optional-JWT variants.
- **Target roles:** `admin` (platform), `organizer` (creates events/venues), `user`/attendee (books). Map `recruiter` → `organizer` or replace.

---

## 7. Existing Database Structure (MongoDB / Mongoose)

| Model | Domain | Verdict |
|---|---|---|
| `user.model` | Core identity + auth | REUSE-WITH-EDITS |
| `Workspace.model` | Multi-tenant team | REUSE |
| `notification.model` | In-app notifications | REUSE |
| `location.model` | Geo cache | REUSE |
| `keyvalue.model` | Generic config KV | REUSE |
| `helpticket.model` | Support tickets | REUSE (optional) |
| `userdetail.model` | Resume/profile + AI | REUSE-WITH-EDITS / REMOVE |
| `teammember.model` | Workspace members | REUSE (optional) |
| `interview.model`, `interviewattempt.model` | Interviews | **REMOVE** |
| `resumeanalysis.model` | Resume ATS | **REMOVE** |
| `aiUsage.model` | AI metering | **REMOVE** |
| `credit.model`, `creditusage.model` | Credit billing | **REMOVE** |
| `chatConversation.model` | Chatbot history | **REMOVE** |
| `communityMessage/post/comments/likes/categories.model` | Community | **REMOVE** |
| `jobopening/jobapplicant/jobdescription.model` | Recruiting | **REMOVE** |
| `featurerequest.model` | Feature voting | **REMOVE** |
| `noteBoard.model` | Notes | **REMOVE** |
| `useruploads.model` | Generic uploads | REVIEW (may reuse) |

### New collections to add (per roadmap)
`venues`, `venueSeats`, `events`, `eventTicketTypes`, `eventSeats`, `seatLocks`, `bookings`, `bookingSeats`, `payments`, `cancellations`, `refunds`, `tickets`.

---

## 8. Current Frontend Structure

```
frontend/
├── styles/                 index.css (keep), overview.css, legal.css, + interview CSS (remove)
├── public/tinymce/         TinyMCE assets (keep)
└── src/
    ├── main.jsx            router + lazy routes (entry)
    ├── AuthLayout.jsx      auth-gate shell  ── MainLayout.jsx  app shell
    ├── apiConfig/apiCall.js  fetch client (hardcoded URLs ⚠)
    ├── store/              useUserStore (keep), useChatBotStore (remove)
    ├── components/
    │   ├── common/         CustomTable, FullScreenLoader, SettingsTableCard (keep)
    │   ├── wrapper/        Header, Sidebar (rebuild nav)
    │   ├── auth/           AuthLeftPanel (rebrand)
    │   ├── ChatBot/        (referenced in main.jsx; remove)
    │   └── Modal/Tooltip/CookieConsent/TextEditor (keep)
    ├── socket/             communitySocketContext (remove)
    ├── pages/              auth/ public/ user/ admin/ recruiter/ interview/ Community/ notes/
    └── useMetaHandler.js   SEO meta (rebrand)
```

### ⚠ Configuration gaps found
- **No env usage** on the frontend — API/img/WS domains and the "EventNest" brand are **hardcoded** (`apiConfig/apiCall.js`, `useMetaHandler.js`, multiple components). Introduce `import.meta.env.VITE_*` during migration.
- Backend reads many env vars (see `removal-report.md` / migration notes) — Mongo, JWT secrets, SMTP/SendGrid/Brevo, AWS S3, location API. AI keys (Gemini/Deepgram/Google) become obsolete.

---

## 9. Key Risks & Notes for Migration
1. `index.js` boots two WebSocket servers — removing sockets requires editing `index.js` to stop importing/calling `setupInterviewSttSocket` and `setupCommunitySocket`.
2. `app.js` mounts 14 routers + an inline `/tts` endpoint and imports `@google-cloud/text-to-speech` at module top — must be edited carefully so the server still boots after AI deps are removed.
3. `user.model` and `admin`/`user` controllers mix generic (auth, notifications) and domain (credits, community ban) concerns — edit, don't delete.
4. Frontend `main.jsx` eagerly references `ChatBot` and many lazy interview pages — router must be rebuilt as pages are removed or the build breaks.
5. No tests exist; no CI. Add a smoke-test checklist as modules are removed.

---

## 10. Conventions (adopted during migration — follow for all new code)

### Controller shape — group handlers by HTTP method
Every controller exports a **default object whose top-level keys are HTTP verbs**, mirroring the original `authController`. Routes reference `controller.<verb>.<handler>`. This makes the route↔handler mapping explicit and consistent across the codebase.

```js
// xyz.controller.js
const xyzController = {
    post:   { createXyz, doAction },
    get:    { listXyz, getXyz },
    put:    { updateXyz },        // PUT for full/replace updates
    patch:  { patchXyz },         // PATCH for partial updates
    delete: { deleteXyz },
};
export default xyzController;

// xyz.route.js
router.post("/", xyzController.post.createXyz);
router.get("/:id", xyzController.get.getXyz);
```

Applied to: `auth`, `admin`, `user`, `location`, `venue`, `event`, `booking` controllers. **All future controllers must follow this shape.**

### Response envelope
Handlers return `{ success: boolean, data?, message? }` (the newer controllers) — or the `ApiResponse`/`ApiError` classes used by `auth.controller`. Prefer the `{ success, data, message }` shape for new domain controllers; both coexist.

### Ownership scoping
Organizer-facing list/get/update/delete filter by `organizerId`/`createdBy === req.user._id` unless `req.user.role === "admin"` (see `ownerFilter`/`ownershipFilter` helpers in `event`/`venue` controllers).

### Demo accounts (auto-seed)
`db/mongodb/mongodbConnection.js` runs `seedDemoUsers()` after a successful connect. If `DEMO_PASS` is set it creates (idempotently, never overwriting):
- **Demo Admin** — `DEMO_ADMIN_EMAIL` (default `admin@eventnest.app`), role `admin`.
- **Demo User** — `DEMO_USER_EMAIL` (default `user@eventnest.app`), role `user`/attendee.
Both are created `isEmailVerified: true`. The admin doubles as an organizer for testing (organizer guards allow admins). See `backend/.env.example`.

### Payments
Current flow is a **demo gateway** (`booking.controller.processDemoPayment`, `POST /api/bookings/:id/pay` with `{ success: true|false }`). `payment.model` is provider-agnostic (`provider: demo|razorpay`, generic `orderId/transactionId/signature`) so a real gateway slots in later without changing the booking flow.
