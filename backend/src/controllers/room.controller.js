import { Room } from "../models/room.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const createRoom = asyncHandler(async (req, res) => {
    const {roomNo, roomType, status, price, capacity} = req.body;

    if([roomNo, roomType, price, capacity].some((value) => value?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    if(req.user.role !== "admin") {
        throw new ApiError(401, "you are not authorized to create room");
    }

    const roomImageLocalPath = req.file?.path;

    if(!roomImageLocalPath) {
        throw new ApiError(400, "Room image is required");
    }

    const roomImage = await uploadOnCloudinary(roomImageLocalPath);

    if(!roomImage) {
        throw new ApiError(500, "Something went wrong while uploading room image");
    }

    const room = await Room.create({
        roomNo,
        roomType,
        roomImage: {
            url: roomImage.url,
            public_id: roomImage.public_id
        },
        status,
        price,
        capacity
    });

    if(!room) {
        throw new ApiError(500, "Something went wrong while creating room");
    }

    return res
            .status(201)
            .json(new ApiResponse(201, room, "Room created successfully"));
})

const getRooms = asyncHandler(async (req, res) => {

    const rooms = await Room.find();

    if(!rooms) {
        throw new ApiError(500, "Something went wrong while getting rooms");
    }

    return res
            .status(200)
            .json(new ApiResponse(200, rooms, "Rooms fetched successfully"));
});

const updateRoom = asyncHandler(async (req, res) => {
    const {roomNo, roomType, status, price, capacity} = req.body;
    const {roomId} = req.params;

    if(!roomId) {
        throw new ApiError(400, "Room id is required");
    }

    const room = await Room.findById(roomId);

    if(!room) {
        throw new ApiError(404, "Room not found");
    }

    if(req.user.role !== "admin") {
        throw new ApiError(401, "you are not authorized to update room");
    }

    let updatedFields = {
        roomNo,
        roomType,
        status,
        price,
        capacity
    };

    const roomImageLocalPath = req.file?.path;

    if(roomImageLocalPath) {
        // If new image provided, upload and update
        const roomImage = await uploadOnCloudinary(roomImageLocalPath);
        if(!roomImage) {
            throw new ApiError(500, "Something went wrong while uploading room image");
        }
        updatedFields.roomImage = {
            url: roomImage.url,
            public_id: roomImage.public_id
        };
        // Delete old image from cloudinary
        await deleteOnCloudinary(room.roomImage.public_id);
    }

    const updatedRoom = await Room.findByIdAndUpdate(roomId, updatedFields, {new: true});

    if(!updatedRoom) {
        throw new ApiError(500, "Something went wrong while updating room");
    }

    return res
            .status(200)
            .json(new ApiResponse(200, updatedRoom, "Room updated successfully"));
});

const deleteRoom = asyncHandler(async (req, res) => {
    const {roomId} = req.params;

    if(!roomId) {
        throw new ApiError(400, "Room id is required");
    }

    const room = await Room.findById(roomId);

    if(!room) {
        throw new ApiError(404, "Room not found");
    }

    if(req.user.role !== "admin") {
        throw new ApiError(401, "you are not authorized to delete room");
    }

    const deletedRoom = await Room.findByIdAndDelete(roomId);

    if(!deletedRoom) {
        throw new ApiError(500, "Something went wrong while deleting room");
    }

    await deleteOnCloudinary(room.roomImage.public_id);

    return res
            .status(200)
            .json(new ApiResponse(200, "Room deleted successfully"));
});

const getRoomById = asyncHandler(async (req, res) => {
    const {roomId} = req.params;
    const userId = req.user;

    if(!roomId) {
        throw new ApiError(400, "Room id is required");
    }

    const room = await Room.findById(roomId);

    if(!room) {
        throw new ApiError(404, "Room not found");
    }
    
    const user = await User.findById(userId).select("-password -role");

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    const taxRate = 0.15;
    const totalPrice = room.price + (room.price * taxRate);

    return res
            .status(200)
            .json(new ApiResponse(200, {room, user}, "Room fetched successfully"));
})

export {
    createRoom,
    getRooms,
    updateRoom,
    deleteRoom,
    getRoomById
}