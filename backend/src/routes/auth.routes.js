import express from "express";
import { loginUser, logoutUser, me, registerUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), registerUser)
router.post("/login", loginUser)
router.post("/logout", authMiddleware, logoutUser)
router.get("/me", authMiddleware, me)

export default router;