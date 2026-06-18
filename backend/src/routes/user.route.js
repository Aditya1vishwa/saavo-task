import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.use(verifyJWT);

userRouter.post("/help-tickets", userController.post.createHelpTicket);
userRouter.get("/help-tickets", userController.get.listHelpTickets);

userRouter.get("/notifications", userController.get.listNotifications);
userRouter.patch("/notifications/read-all", userController.patch.markAllNotificationsRead);
userRouter.patch("/notifications/:id/read", userController.patch.markNotificationRead);

export default userRouter;
