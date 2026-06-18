import { Router } from "express";
import { verifyJWT, verifyOrganizer } from "../middlewares/auth.middleware.js";
import venueController from "../controllers/venue.controller.js";

const venueRouter = Router();

// All venue management is organizer/admin only.
venueRouter.use(verifyJWT, verifyOrganizer);

venueRouter.post("/", venueController.post.createVenue);
venueRouter.get("/", venueController.get.listVenues);
venueRouter.get("/:id", venueController.get.getVenue);
venueRouter.put("/:id", venueController.put.updateVenue);
venueRouter.delete("/:id", venueController.delete.deleteVenue);

venueRouter.put("/:id/seat-layout", venueController.put.setSeatLayout);

export default venueRouter;
