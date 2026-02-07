import { Router } from "express";
import {
  login,
  logout,
  signup,
  updateProfile,
  checkAuth,
} from "../controllers/auth.controller.js";
import { protectRoute, requireAuth } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);

router.route("/update-profile").put(protectRoute, requireAuth, updateProfile);
router.route("/check").get(protectRoute, checkAuth);

export const authRouter = router;
