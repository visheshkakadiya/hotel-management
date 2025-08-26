import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import { bookRoom, cancelBooking, completePastBookings, getBookingsHistory, getRoomOccupiedDates, updateRoomsStatus } from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/book-room/:roomId", authMiddleware, bookRoom);
router.patch("/cancel-booking/:roomId/:bookingId", authMiddleware, cancelBooking);
router.get("/booking-history", authMiddleware, getBookingsHistory);
router.patch("/complete-past-bookings", authMiddleware, completePastBookings);
router.get("/occupied-dates/:roomId", authMiddleware, getRoomOccupiedDates);
router.patch("/update-rooms-status", authMiddleware, updateRoomsStatus);

export default router;