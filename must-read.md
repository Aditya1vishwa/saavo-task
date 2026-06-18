# 👋 MUST READ — EventNest (Event Booking System)

Hi, and thank you for taking the time to review this project!

This is **EventNest**, an end-to-end event ticket booking platform (think BookMyShow / Eventbrite). It was migrated from an older interview-prep codebase into a clean, production-shaped booking system. This file is a quick map of **what it does, how to run it, and how to test every flow** in a few minutes.

If you only read one thing: set `CREATE_DEMO_USERS=true` + `DEMO_PASS` in the backend `.env`, start both apps, and the console prints three ready-to-use logins (admin / organizer / attendee).

---

## 1. What it does

Three roles, one app:

| Role | Can do |
|---|---|
| **Organizer** | Create venues + seat layouts, create/publish events, set ticket types & prices, see bookings + revenue + seat status, scan/validate tickets |
| **Attendee** | Browse & search events, pick seats (or quantity for general admission), pay (demo gateway), download a QR/PDF ticket, manage bookings |
| **Admin** | Platform dashboard (revenue, bookings, events, users), manage users (promote to organizer), help desk |

**Payments are a built-in demo gateway** (Success / Simulate-failure toggle) — no real payment keys needed.

---

## 2. Tech stack

- **Backend:** Node + Express 5, MongoDB (Mongoose), JWT auth (httpOnly cookies), Multer + local/S3 uploads, PDFKit + qrcode for tickets, helmet + rate-limit.
- **Frontend:** React 19 + Vite, react-router 7, Zustand, react-select, html5-qrcode (ticket scanner).

---

## 3. Prerequisites

- **Node.js 18+** and **npm**
- **MongoDB** running locally (or a connection string) — e.g. `mongodb://127.0.0.1:27017/eventnest`

---

## 4. Setup & run

### Backend
```bash
cd backend
npm install
cp .env.example .env        # then edit .env (see below)
npm run dev                 # starts on http://localhost:8002
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local  # optional — defaults work for localhost
npm run dev                 # starts on http://localhost:5173
```

Open **http://localhost:5173**.

### Minimum backend `.env`
```env
MONGODB_URI=mongodb://127.0.0.1:27017/eventnest
ACCESS_TOKEN_SECRET=any-long-random-string
REFRESH_TOKEN_SECRET=another-long-random-string

# Demo logins (printed to the console on boot)
CREATE_DEMO_USERS=true
DEMO_PASS=Demo@1234
```

**Optional but recommended:**
- `COUNTRY_STATE_CITY_API_KEY` — enables the Country/State/City dropdowns on the venue form (free key at https://countrystatecity.in/). Without it those selects are empty (you can still type other fields).
- `SMTP_*` — email delivery. **Not required**: signup has a **"Verify without OTP"** button for the no-mail flow.

---

## 5. Demo accounts

When `CREATE_DEMO_USERS=true`, these are auto-created on startup and printed to the backend console (all share `DEMO_PASS`):

| Role | Email | Password |
|---|---|---|
| Admin | `admin@eventnest.app` | `DEMO_PASS` |
| Organizer | `organizer@eventnest.app` | `DEMO_PASS` |
| Attendee | `user@eventnest.app` | `DEMO_PASS` |

You can also **sign up** fresh and pick a role (Attendee / Organizer); on the verify step click **"Verify without OTP"**.

---

## 6. How to test (full happy path, ~5 min)

### A) Organizer — set up an event
1. Log in as **organizer@eventnest.app**.
2. **Venues → New venue** → fill name + location → pick **Seated** (assigned seats) or **General admission** → Save.
3. (Seated only) On the venue, click **Seat layout** → add blocks (Section, Rows, Seats/row, **Category** e.g. `VIP`, `Regular`) → **Save layout**.
4. **My Events → New event** → choose the venue. Ticket types auto-seed from the venue's seat categories:
   - *Seated:* each row = Name + **Seat category (dropdown)** + Price → just set prices.
   - *General:* each row = Name + **Quantity** + Price.
   - Upload a **banner image**, set date, etc. → **Create draft**.
5. Open the event → **Generate seats** (seated) → **Publish**.

### B) Attendee — book & pay
1. Log in as **user@eventnest.app** (or browse `/events` as a guest).
2. Open the published event → **select seats** (or set **quantity** for general admission) → **Proceed to checkout**.
3. On checkout (demo gateway) → **Pay (Success)** to confirm, or **Simulate failure** to test the failure path (seats/inventory are released).
4. Go to **My Bookings → open booking → Download ticket** (PDF with a QR code).

### C) Organizer — see results & validate entry
1. Back as the organizer → open the event:
   - **Stat cards:** Revenue received, Tickets sold, Confirmed bookings, Seats booked.
   - **Bookings table:** attendee, seats/tickets, amount, status, date.
   - **Seat status grid:** green = available, blue = booked, amber = held.
2. **Scan Tickets** (sidebar) → enter the ticket code (or scan the QR with a camera on `localhost`) → it validates and **marks the ticket used** (scan again → "already checked in").

### D) Admin — oversight
1. Log in as **admin@eventnest.app**.
2. **Dashboard:** revenue, confirmed bookings, events, users, recent bookings.
3. **Users:** promote an attendee to **Organizer**, change status.
4. **Help Desk:** answer support tickets (filter by status).

---

## 7. Good to know (demo notes)

- **Payments** are simulated (no Razorpay/Stripe keys). The payment model is provider-agnostic so a real gateway can drop in later.
- **Seat holds** last 5 minutes during checkout (Mongo TTL); expired holds free the seats automatically.
- **Email** isn't required — use **Verify without OTP** on signup. (When SMTP is configured, booking-confirmation and cancellation emails are sent.)
- **Camera scanning** needs `localhost` or HTTPS (browser security); the scan page always supports **manual ticket-code entry**.
- **Auth** uses httpOnly JWT cookies; public pages (`/`, `/events`, `/login`, `/signup`, `/terms`, `/privacy`) don't call the auth API.

---

## 8. Project layout

```
backend/    Express + Mongoose API (controllers grouped by HTTP method)
frontend/   React + Vite SPA (api/ service layer, components/common reused everywhere)
memory/     Migration docs — project-analysis.md, task-completed.md, task-remaining.md, removal-report.md
```

For deeper context on the migration and what's done vs. pending, see **`memory/task-completed.md`** and **`memory/task-remaining.md`**.

Thanks again for reviewing — enjoy testing EventNest! 🎟️
