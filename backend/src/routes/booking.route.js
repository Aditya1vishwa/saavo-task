import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import bookingController from "../controllers/booking.controller.js";

const bookingRouter = Router();

// All booking actions require a logged-in user.
bookingRouter.use(verifyJWT);

// Seat hold lifecycle
bookingRouter.post("/lock", bookingController.post.lockSeats);
bookingRouter.delete("/lock/:lockId", bookingController.delete.releaseLock);

// Booking + demo payment
bookingRouter.post("/", bookingController.post.createBooking);
bookingRouter.get("/", bookingController.get.listMyBookings);
bookingRouter.get("/:id", bookingController.get.getBooking);
bookingRouter.post("/:id/pay", bookingController.post.processDemoPayment); // demo gateway: { success: true|false }
bookingRouter.post("/:id/cancel", bookingController.post.cancelBooking);

export default bookingRouter;
