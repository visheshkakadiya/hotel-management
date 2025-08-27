import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getAllCustomers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");

    if (!users) {
        throw new ApiError(500, "Something went wrong while getting users");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export { getAllCustomers };