import { Router } from "express";
import {
  getUsersForSidebar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";
import { protectRoute, requireAuth } from "../middlewares/auth.middleware.js";
const router = Router();

router.use(protectRoute, requireAuth);

router.route("/users").get(getUsersForSidebar);
router.route("/:id").get(getMessages);
router.route("/send/:id").post(sendMessage);
export const messageRouter = router;
