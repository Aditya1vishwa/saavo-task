# Removal Report — EventNest → Event Booking System

> **Generated:** 2026-06-18 · **Status:** REPORT ONLY — nothing deleted yet (Phase 2 deliverable).
> Removal is executed in **Phase 3** after this report is reviewed. Each item: file path · why not needed · impact of removal.

**Legend for "Impact":** LOW = self-contained, no other module imports it · MED = referenced by a router/entry file that must also be edited · HIGH = shared edits required so the app still boots.

---

## A. Backend Removal Candidates

### A1. Controllers
| File | Why not needed | Impact |
|---|---|---|
| `backend/src/controllers/interviews.controller.js` | Interview lifecycle (create/run/evaluate) — not part of event booking | MED — unmount in `app.js`, remove `interviews.route` |
| `backend/src/controllers/resumeanalysis.controller.js` | Resume ATS scoring via AI | MED |
| `backend/src/controllers/chatbot.controller.js` | AI chat assistant | MED |
| `backend/src/controllers/services.controller.js` | AI STT/TTS service endpoints | MED |
| `backend/src/controllers/community.controller.js` | Community posts/comments/likes | MED |
| `backend/src/controllers/recruiter.controller.js` | Job openings + applicants | MED |
| `backend/src/controllers/featurerequest.controller.js` | Feature-voting board | MED |
| `backend/src/controllers/notes.controller.js` | Notes board | MED |
| `backend/src/controllers/userdetails.controller.js` | Resume upload + Gemini parse + ATS — 100% interview | MED — unmount `user-details` route |

### A2. Routes
| File | Why not needed | Impact |
|---|---|---|
| `backend/src/routes/interviews.route.js` | Mounts interview controller | MED — remove import + `app.use` in `app.js` |
| `backend/src/routes/resumeanalysis.route.js` | Resume analysis endpoints | MED |
| `backend/src/routes/chatbot.route.js` | Chatbot endpoints | MED |
| `backend/src/routes/services.route.js` | AI services endpoints | MED |
| `backend/src/routes/community.route.js` | Community endpoints | MED |
| `backend/src/routes/recruiter.route.js` | Recruiter endpoints | MED |
| `backend/src/routes/featurerequest.route.js` | Feature-request endpoints | MED |
| `backend/src/routes/notes.route.js` | Notes endpoints | MED |
| `backend/src/routes/userdetails.route.js` | Resume/profile endpoints | MED |
| `backend/src/routes/oauth.route.js` | Stub redirect-preview only; no real OAuth | LOW — remove import + `app.use` (or keep if OAuth planned) |
| Inline `/tts` handler in `app.js` (lines ~168–210) | Google TTS demo | HIGH — also delete `import textToSpeech …` at top of `app.js` so the file loads without `@google-cloud/text-to-speech` |

### A3. Services / Helpers
| File | Why not needed | Impact |
|---|---|---|
| `backend/src/helpers/ai/gemini.js` | Gemini LLM integration | LOW |
| `backend/src/helpers/ai/deepgram.js` | Deepgram STT | LOW |
| `backend/src/helpers/ai/google.js` | Google Cloud STT/TTS | LOW |
| `backend/src/helpers/ai/usageLogger.js` | AI usage logging | LOW |
| `backend/src/helpers/credit.helper.js` | Credit deduction logic | MED — referenced by user/userdetails/admin controllers |
| `backend/src/constant/pricing.js` | AI cost → credit pricing tables | LOW |
| `backend/src/helpers/email-templates/interview-completed.html` | Interview email | LOW |
| `backend/src/helpers/email-templates/interview-invite.html` | Interview email | LOW |
| `backend/src/helpers/email-templates/quick-interview-invite.html` | Interview email | LOW |
| `backend/src/helpers/email-templates/application-status.html` | Recruiting email | LOW |
| `backend/src/helpers/Common.js` (partial) | Remove `encryptInterviewToken`/`decryptInterviewToken`; **keep** `deleteLocalFiles` | LOW — edit, don't delete file |

### A4. Models
| File | Why not needed | Impact |
|---|---|---|
| `backend/src/db/mongodb/models/interview.model.js` | Interview sessions | LOW |
| `backend/src/db/mongodb/models/interviewattempt.model.js` | Interview attempts | LOW |
| `backend/src/db/mongodb/models/resumeanalysis.model.js` | Resume ATS records | LOW |
| `backend/src/db/mongodb/models/aiUsage.model.js` | AI metering | LOW |
| `backend/src/db/mongodb/models/credit.model.js` | Credit balances | MED — referenced by credit.helper, user/admin controllers |
| `backend/src/db/mongodb/models/creditusage.model.js` | Credit transactions | MED |
| `backend/src/db/mongodb/models/chatConversation.model.js` | Chatbot history | LOW |
| `backend/src/db/mongodb/models/communityMessage.model.js` | Community chat | LOW |
| `backend/src/db/mongodb/models/communitypost.model.js` | Community posts | LOW |
| `backend/src/db/mongodb/models/communitypostcomments.model.js` | Community comments | LOW |
| `backend/src/db/mongodb/models/communitypostlikes.model.js` | Community likes | LOW |
| `backend/src/db/mongodb/models/communitycategories.model.js` | Community categories | LOW |
| `backend/src/db/mongodb/models/jobopening.model.js` | Recruiting | LOW |
| `backend/src/db/mongodb/models/jobapplicant.model.js` | Recruiting | LOW |
| `backend/src/db/mongodb/models/jobdescription.model.js` | Recruiting JD | LOW |
| `backend/src/db/mongodb/models/featurerequest.model.js` | Feature voting | LOW |
| `backend/src/db/mongodb/models/noteBoard.model.js` | Notes | LOW |
| `backend/src/db/mongodb/models/useruploads.model.js` | Generic uploads — **REVIEW** before deleting (may be reusable for event media) | LOW |
| `backend/src/db/mongodb/models/userdetail.model.js` | Resume/AI profile — **REVIEW**: strip to organizer profile or remove | MED |

### A5. Socket Handlers (remove Socket/WS entirely)
| File | Why not needed | Impact |
|---|---|---|
| `backend/src/realtime/interviewSttSocket.js` | Interview speech streaming | HIGH — remove import + call in `index.js` |
| `backend/src/realtime/communityChatSocket.js` | Community realtime chat | HIGH — remove import + call in `index.js` |
| Entire `backend/src/realtime/` folder | No realtime needed (seat-lock uses DB TTL, not sockets) | HIGH |

### A6. Middlewares
| File | Why not needed | Impact |
|---|---|---|
| `backend/src/middlewares/auth.middleware.js` (partial) | Remove `verifyRecruiter` if recruiter role dropped; **keep** `verifyJWT`/`verifyAdmin` | LOW — edit only |
| _All other middlewares_ | **KEEP** (`multer.middleware.js`) | — |

### A7. Cron Jobs
| File | Why not needed | Impact |
|---|---|---|
| _None found_ | No cron/scheduler currently exists. Note in `index.js`: a "background retry worker" was already removed. A new TTL/expiry job for `seatLocks` will be **added** in Phase 4. | — |

### A8. Helpers to KEEP (explicitly not removed)
`utils/ApiError.js`, `utils/ApiResponse.js`, `utils/asyncHandler.js`, `utils/AwsS3.js`, `utils/fileName.js`, `helpers/Auth.js`, `helpers/Upload.js`, `helpers/email.helper.js`, `helpers/notification.helper.js`, `constant/others.js`, `db/mongodb/mongodbConnection.js`, `controllers/location.controller.js`, `controllers/auth.controller.js`.

---

## B. Frontend Removal Candidates

### B1. Pages
| File | Why not needed | Impact |
|---|---|---|
| `frontend/src/pages/user/interview/CreateInterview.jsx` | Interview creation | MED — remove lazy import + route in `main.jsx` |
| `frontend/src/pages/user/interview/InterviewPreStart.jsx` | Interview pre-start | MED |
| `frontend/src/pages/user/interview/InterviewSession.jsx` | Live interview session | MED |
| `frontend/src/pages/user/interview/InterviewView.jsx` | Interview report | MED |
| `frontend/src/pages/user/interview/AllInterviews.jsx` | Interview list | MED |
| `frontend/src/pages/interview/PublicInterviewAccess.jsx` | Public interview link | MED |
| `frontend/src/pages/interview/QuickInterviewStart.jsx` | Quick interview | MED |
| `frontend/src/pages/user/resume/ResumeAnalysis.jsx` | Resume ATS UI | MED |
| `frontend/src/pages/user/profile/JobSeekerProfile.jsx` | Resume/portfolio builder (~1210 lines) | MED |
| `frontend/src/pages/user/Credits.jsx` | Credit balance UI | MED |
| `frontend/src/pages/user/HelpSupport.jsx` | Help tickets — **REVIEW** (may keep for attendees) | MED |
| `frontend/src/pages/notes/NotesBoard.jsx` | Notes board | MED |
| `frontend/src/pages/Community/Community.jsx` | Community feed/chat | MED |
| `frontend/src/pages/Community/FeatureRequests.jsx` | Feature voting | MED |
| `frontend/src/pages/Community/community.css` | Community styles | LOW |
| `frontend/src/pages/recruiter/Dashboard.jsx` | Recruiter dashboard | MED |
| `frontend/src/pages/recruiter/job-opening/JobOpenings.jsx` | Recruiting | MED |
| `frontend/src/pages/recruiter/job-opening/CreateJobOpening.jsx` | Recruiting | MED |
| `frontend/src/pages/recruiter/job-opening/JobOpeningView.jsx` | Recruiting | MED |
| `frontend/src/pages/recruiter/interview/CreateJobInterview.jsx` | Recruiting interviews | MED |
| `frontend/src/pages/recruiter/interview/JobInterviews.jsx` | Recruiting interviews | MED |
| `frontend/src/pages/recruiter/interview/RecruiterInterviewView.jsx` | Recruiting interviews | MED |
| `frontend/src/pages/recruiter/interview/ShortlistedApplications.jsx` | Recruiting | MED |
| `frontend/src/pages/user/Dashboard.jsx` | Interview dashboard — **REPLACE** with attendee dashboard | MED |
| `frontend/src/pages/admin/Jd.jsx` | JD management | MED |
| `frontend/src/pages/admin/UserCredits.jsx` | Credit admin | MED |
| `frontend/src/pages/admin/CreditUsage.jsx` | Credit audit | MED |
| `frontend/src/pages/admin/ManageCategories.jsx` | Community categories — **REVIEW** (event categories may reuse concept) | MED |
| `frontend/src/pages/admin/HelpDesk.jsx` | Help desk — **REVIEW** (may keep) | MED |
| `frontend/src/pages/RedirectHandler.jsx` | Empty/unused file | LOW |

### B2. Components
| File | Why not needed | Impact |
|---|---|---|
| `frontend/src/components/ChatBot/ChatBot.jsx` (referenced in `main.jsx:55,309`) | AI chatbot widget | MED — remove lazy import + render in `main.jsx` root |

### B3. Stores
| File | Why not needed | Impact |
|---|---|---|
| `frontend/src/store/useChatBotStore.js` | Chatbot UI state | LOW |

### B4. Hooks
| File | Why not needed | Impact |
|---|---|---|
| _None interview-specific_ | `useMetaHandler.js` is generic — **KEEP** (rebrand strings only) | — |

### B5. APIs / Config
| File | Why not needed | Impact |
|---|---|---|
| `apiConfig/apiCall.js` → `sttWsDomain` export + STT WS helper | Interview speech socket | LOW — edit file, keep `apiCall`/`apiDomain`/`imgDomain` |

### B6. Contexts
| File | Why not needed | Impact |
|---|---|---|
| `frontend/src/socket/communitySocketContext.jsx` | Community Socket.IO/WS context | MED — remove provider usages |
| Entire `frontend/src/socket/` folder | No realtime needed | MED |

### B7. Utilities / Styles
| File | Why not needed | Impact |
|---|---|---|
| `frontend/styles/InterviewSession.css` | Interview UI | LOW |
| `frontend/styles/InterviewView.css` | Interview UI | LOW |
| `frontend/styles/QuickInterviewStart.css` | Interview UI | LOW |
| `frontend/styles/PublicInterview.css` | Interview UI | LOW |
| `frontend/styles/ResumeAnalysis.css` | Resume UI | LOW |
| `frontend/styles/AllInterviews.css` | Interview UI | LOW |
| `frontend/styles/JobSeekerProfile.css` | Resume profile | LOW |
| `frontend/styles/NotesBoard.css` | Notes | LOW |
| `frontend/styles/index.css`, `Modal.css`, `custom-table.css`, `UserSettings.css`, `legal.css` | Shared — **KEEP** | — |

### B8. Frontend KEEP (explicitly not removed)
`apiConfig/apiCall.js` (edited), `store/useUserStore.js`, `AuthLayout.jsx`, `MainLayout.jsx`, `components/common/*`, `components/Modal.jsx`, `components/Tooltip.jsx`, `components/CookieConsent.jsx`, `components/TextEditor.jsx`, `components/auth/AuthLeftPanel.jsx` (rebrand), `components/wrapper/Header.jsx` + `Sidebar.jsx` (nav rebuild), `pages/auth/*`, `pages/user/settings/UserSettings.jsx`, `pages/Overview.jsx` + `Terms`/`Privacy` (content rewrite), `useMetaHandler.js`.

---

## C. Dependencies to uninstall after code removal
- **Backend:** `@deepgram/sdk`, `@google-cloud/speech`, `@google-cloud/text-to-speech`, `@google/genai`, `pdf-parse`, `ws`.
- **Frontend:** `@deepgram/sdk`, `@xyflow/react`, `@zumer/snapdom`, `mammoth`, `pdfjs-dist`.

## D. Obsolete environment variables (remove after cleanup)
`GEMINI_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL_*`, `DEEPGRAM_API_KEY`, `DEEPGRAM_STT_MODEL`, `DEEPGRAM_TTS_MODEL`, `GOOGLE_APPLICATION_CREDENTIALS`, `GOOGLE_PRIVATE_KEY`, `INTERVIEW_TOKEN_SECRET`.
**New env to add:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `VITE_API_BASE_URL`, `VITE_IMG_BASE_URL`, `VITE_RAZORPAY_KEY_ID`.

---

## E. Removal order (safe sequence for Phase 3)
1. **Frontend routes first** — strip lazy imports + routes in `main.jsx` and `ChatBot` from root render (prevents build breakage), then delete pages/components/socket/store/styles.
2. **Backend entry** — edit `index.js` (drop socket setup) and `app.js` (drop AI routers, `/tts`, `@google-cloud` import).
3. **Delete backend routes → controllers → helpers/ai → models** (in that dependency order).
4. **Edit shared files** (`user.model`, `user.controller`, `admin.controller`, `Common.js`, `auth.middleware`) to remove credit/community/interview references.
5. **Uninstall deps**, prune env, smoke-test server boot + login.
