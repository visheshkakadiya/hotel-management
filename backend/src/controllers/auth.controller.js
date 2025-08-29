import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessToken = async(userId) => {
    try {
        const user = await User.findById(userId);

        if(!user) {
            throw new ApiError(404, "User not found");
        }

        const accessToken = user.generateToken();

        return accessToken
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access token");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, password, contactNumber, address} = req.body;

    if([fullName, email, password, contactNumber, address].some((value) => value?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({email});

    if(existedUser) {
        throw new ApiError(400, "User already exists");
    }

    const avatarLocalPath = req.file?.path;
    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if(!avatar) {
        throw new ApiError(500, "Something went wrong while uploading avatar");
    }

    const user = await User.create({
        fullName,
        avatar: {
            url: avatar.url,
            public_id: avatar.public_id
        },
        email,
        password,
        contactNumber,
        address
    });

    const createdUser = await User.findById(user._id).select("-password");

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res
            .status(201)
            .json(
                new ApiResponse(201, createdUser, "User registered successfully")
            );
});

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    if([email, password].some((value) => value?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({email});

    if(!user) {
        throw new ApiError(400, "User not found");
    }

    const isPasswordMatched = await user.isPasswordCorrect(password);

    if(!isPasswordMatched) {
        throw new ApiError(400, "Invalid credentials");
    }

    const accessToken = await generateAccessToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
    }

    return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(
                new ApiResponse(200, loggedInUser, "User logged in successfully")
            );
});

const logoutUser = asyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    }

    return res
            .status(200)
            .clearCookie("accessToken", options)
            .json(
                new ApiResponse(200, {}, "User logged out successfully")
            );
});

const me = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).select("-password");

    if(!user) {
        throw new ApiError(500, "Something went wrong while getting user details");
    }

    return res
            .status(200)
            .json(
                new ApiResponse(200, user, "User details fetched successfully")
            );
});

const updateProfile = asyncHandler(async (req, res) => {
    const {fullName, email, contactNumber, address} = req.body;

    if([fullName, email, contactNumber, address].some((value) => value?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findById(req.user._id);

    if(!user) {
        throw new ApiError(404, "User not found");
    }

    const updateUser = await User.findByIdAndUpdate(req.user._id, {
        fullName,
        email,
        contactNumber,
        address
    }, {new: true});

    return res
            .status(200)
            .json(
                new ApiResponse(200, updateUser, "User profile updated successfully")
            );
})

export {
    registerUser,
    loginUser,
    logoutUser,
    me,
    updateProfile
}