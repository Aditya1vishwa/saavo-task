import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/auth.middleware.js";
import adminController from "../controllers/admin.controller.js";

const adminRouter = Router();

adminRouter.use(verifyJWT, verifyAdmin);

adminRouter.get("/dashboard", adminController.get.getDashboardStats);

adminRouter.get("/users", adminController.get.getUsers);
adminRouter.patch("/users/:id", adminController.patch.updateUser);
adminRouter.delete("/users/:id", adminController.delete.deleteUser);

adminRouter.get("/key-values/types", adminController.get.getKeyValueTypes);
adminRouter.get("/key-values", adminController.get.listKeyValues);
adminRouter.post("/key-values", adminController.post.createKeyValue);
adminRouter.patch("/key-values/:id", adminController.patch.updateKeyValue);
adminRouter.delete("/key-values/:id", adminController.delete.deleteKeyValue);

adminRouter.get("/help-tickets", adminController.get.listHelpTickets);
adminRouter.post("/help-tickets/:id/answer", adminController.post.answerHelpTicket);

export default adminRouter;
