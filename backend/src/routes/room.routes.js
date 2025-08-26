import express from "express";
import { createRoom, deleteRoom, getRoomById, getRooms, updateRoom } from "../controllers/room.controller.js";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/create-room", authMiddleware, upload.single("roomImage"), createRoom);
router.get("/all-rooms", authMiddleware, getRooms);
router.patch("/update-room/:roomId", authMiddleware, upload.single("roomImage"), updateRoom);
router.delete("/delete-room/:roomId", authMiddleware, deleteRoom);
router.get("/room/:roomId", authMiddleware, getRoomById);

export default router;