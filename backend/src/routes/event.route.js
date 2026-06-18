import { Router } from "express";
import { verifyJWT, verifyOrganizer } from "../middlewares/auth.middleware.js";
import { uploadSingle } from "../middlewares/multer.middleware.js";
import eventController from "../controllers/event.controller.js";

const eventRouter = Router();

// ── Public discovery (no auth) ───────────────────────────────────────────────
eventRouter.get("/", eventController.get.discoverEvents);

// ── Organizer management (auth + organizer/admin) ────────────────────────────
// Mounted before "/:id" so these literal paths aren't captured as an id.
eventRouter.post("/manage/upload-banner", verifyJWT, verifyOrganizer, uploadSingle("banner"), eventController.post.uploadBanner);
eventRouter.post("/manage/:id/check-in", verifyJWT, verifyOrganizer, eventController.post.checkInTicket);
eventRouter.post("/manage", verifyJWT, verifyOrganizer, eventController.post.createEvent);
eventRouter.get("/manage", verifyJWT, verifyOrganizer, eventController.get.listMyEvents);
eventRouter.get("/manage/summary", verifyJWT, verifyOrganizer, eventController.get.getOrganizerSummary);
eventRouter.get("/manage/:id", verifyJWT, verifyOrganizer, eventController.get.getMyEvent);
eventRouter.get("/manage/:id/bookings", verifyJWT, verifyOrganizer, eventController.get.getEventBookings);
eventRouter.get("/manage/:id/seats", verifyJWT, verifyOrganizer, eventController.get.getManageSeatMap);
eventRouter.put("/manage/:id", verifyJWT, verifyOrganizer, eventController.put.updateEvent);
eventRouter.delete("/manage/:id", verifyJWT, verifyOrganizer, eventController.delete.deleteEvent);
eventRouter.post("/manage/:id/generate-seats", verifyJWT, verifyOrganizer, eventController.post.generateEventSeats);
eventRouter.post("/manage/:id/publish", verifyJWT, verifyOrganizer, eventController.post.publishEvent);

// ── Public single-event views (no auth) ──────────────────────────────────────
eventRouter.get("/:id", eventController.get.getPublicEvent);
eventRouter.get("/:id/seats", eventController.get.getEventSeatMap);

export default eventRouter;
