import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cookieParser());

app.use(express.static('public'));

import authRoutes from "./routes/auth.routes.js"
import roomRoutes from "./routes/room.routes.js"
import bookingRoutes from "./routes/booking.routes.js"

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/rooms", roomRoutes);
app.use("/api/v1/bookings", bookingRoutes);

export {app};