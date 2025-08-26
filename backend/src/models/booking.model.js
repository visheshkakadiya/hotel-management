import mongoose, {Schema} from "mongoose";
import { AvailableRoomTypes, BookingStatus, RoomTypes } from "../utils/constants.js";

const bookingSchema = new Schema({
    checkInDate: {
        type: Date,
        required: true
    },
    checkOutDate: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    specialRequest: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: BookingStatus.PENDING
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {timestamps: true});

export const Booking = mongoose.model("Booking", bookingSchema);