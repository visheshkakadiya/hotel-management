import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AvailableUserRoles, UserRoles } from "../utils/constants.js";

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    avatar: {
        type: {
            url: String,
            public_id: String
        },
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contactNumber: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: AvailableUserRoles,
        default: UserRoles.USER
    },
    address: {
        type: String,
        required: true
    }
}, {timestamps: true});

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateToken = function() {
    return jwt.sign({
        _id: this._id,
        role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User", userSchema);