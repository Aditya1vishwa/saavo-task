import { Router } from "express";
import { verifyJWT, verifyOrganizer } from "../middlewares/auth.middleware.js";
import ticketController from "../controllers/ticket.controller.js";

const ticketRouter = Router();

// Global organizer ticket validation / check-in (used by the scan page).
ticketRouter.post("/check-in", verifyJWT, verifyOrganizer, ticketController.post.checkIn);

export default ticketRouter;
