import express from "express";
import { loginUser, logoutUser, me, registerUser, updateProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { getAllCustomers } from "../controllers/customers.controller.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), registerUser)
router.post("/login", loginUser)
router.post("/logout", authMiddleware, logoutUser)
router.get("/me", authMiddleware, me)
router.get("/all-users", authMiddleware, getAllCustomers)
router.patch("/update-profile", authMiddleware, updateProfile)

export default router;