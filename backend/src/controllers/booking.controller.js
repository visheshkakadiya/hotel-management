import { Booking } from "../models/booking.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Room } from "../models/room.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { BookingStatus, RoomStatus } from "../utils/constants.js";

const bookRoom = asyncHandler(async (req, res) => {
    const { checkInDate, checkOutDate, guests, specialRequest, totalPrice } = req.body;
    const { roomId } = req.params;
    const userId = req.user;

    if (!roomId) {
        throw new ApiError(400, "Room id is required");
    }

    const room = await Room.findById(roomId);

    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    const booking = await Booking.create({
        checkInDate,
        checkOutDate,
        guests,
        specialRequest,
        totalPrice,
        status: BookingStatus.CONFIRMED,
        room: roomId,
        user: userId
    });

    if (!booking) {
        throw new ApiError(500, "Something went wrong while booking room");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, booking, "Room booked successfully"));
});

const cancelBooking = asyncHandler(async (req, res) => {
    const { bookingId, roomId } = req.params;

    if (!bookingId || !roomId) {
        throw new ApiError(400, "Booking id and room id is required");
    }

    const room = await Room.findById(roomId);
    if (!room) {
        throw new ApiError(404, "Room not found");
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        throw new ApiError(404, "Booking not found");
    }

    await Booking.findByIdAndUpdate(bookingId, {
        $set: {
            status: BookingStatus.CANCELLED,
            totalPrice: 0
        }
    });

    await Room.findByIdAndUpdate(roomId, {
        $set: {
            status: RoomStatus.AVAILABLE
        }
    });

    return res
        .status(200)
        .json(new ApiResponse(200, "Booking cancelled successfully"));
})

const getBookingsHistory = asyncHandler(async (req, res) => {

    if(!isValidObjectId(req.user?._id)) {
        throw new ApiError(400, "Invalid user id");
    }

    const bookings = await Booking.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "rooms",
                localField: "room",
                foreignField: "_id",
                as: "room",
                pipeline: [
                    {
                        $project: {
                            roomNo: 1,
                            roomType: 1,
                        }
                    }
                ]
            }
        },
        {
            $project: {
                checkInDate: 1,
                checkOutDate: 1,
                guests: 1,
                totalPrice: 1,
                status: 1,
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, bookings, "Bookings fetched successfully"));
})

const completePastBookings = asyncHandler(async (req, res) => {
    const now = new Date();

    const MarkCompletedBookings = await Booking.updateMany({
        checkOutDate: { $lt: now },
        status: { $nin: [BookingStatus.CANCELLED, BookingStatus.COMPLETED] }
    },
        {
            $set: {
                status: BookingStatus.COMPLETED
            }
        }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, MarkCompletedBookings, "Bookings marked as completed successfully"));
});

const getRoomOccupiedDates = asyncHandler(async (req, res) => {
    const { roomId } = req.params;

    if (!roomId) {
        throw new ApiError(400, "Room id is required");
    }

    const bookings = await Booking.find({
        room: roomId,
        status: {
            $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]
        }
    }).select("checkInDate checkOutDate");

    if (!bookings) {
        throw new ApiError(500, "Something went wrong while fetching room occupied dates");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, bookings, "Room occupied dates fetched successfully"));
});

const updateRoomsStatus = asyncHandler(async (req, res) => {
    const now = new Date();

    const rooms = await Room.find();

    for (const room of rooms) {
        const booking = await Booking.findOne({
            room: room._id,
            status: {
                $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED]
            },
            checkInDate: { $lte: now },
            checkOutDate: { $gte: now }
        });

        const newStatus = booking ? RoomStatus.OCCUPIED : RoomStatus.AVAILABLE || RoomStatus.MAINTENANCE;

        await Room.findByIdAndUpdate(room._id, {
            $set: {
                status: newStatus
            }
        })
    };

    const updatedRooms = await Room.find();

    return res
        .status(200)
        .json(new ApiResponse(200, updatedRooms, "Rooms status updated successfully"));
})

export {
    bookRoom,
    cancelBooking,
    getBookingsHistory,
    completePastBookings,
    getRoomOccupiedDates,
    updateRoomsStatus
}