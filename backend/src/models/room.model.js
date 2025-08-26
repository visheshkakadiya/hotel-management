import mongoose, { Schema } from "mongoose";
import { AvailableRoomStatus, AvailableRoomTypes, RoomStatus, RoomTypes } from "../utils/constants.js";

const roomSchema = new Schema({
    roomNo: {
        type: String,
        required: true,
        unique: true
    },
    roomType: {
        type: String,
        enum: AvailableRoomTypes,
        default: RoomTypes.STANDARD
    },
    roomImage: {
        type: {
            url: String,
            public_id: String
        },
        required: true
    },
    status: {
        type: String,
        default: RoomStatus.MAINTENANCE
    },
    price: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    capacity: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
}, { timestamps: true });

export const Room = mongoose.model("Room", roomSchema);