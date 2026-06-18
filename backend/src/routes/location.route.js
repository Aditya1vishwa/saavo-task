import { Router } from "express";
import locationController from "../controllers/location.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/countries", verifyJWT, locationController.get.getCountries);
router.get("/countries/:ciso/states", verifyJWT, locationController.get.getStates);
router.get("/countries/:ciso/states/:siso/cities", verifyJWT, locationController.get.getCities);

export default router;
