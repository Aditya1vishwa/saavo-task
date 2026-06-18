import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        phone: {
            type: String,
            trim: true,
        },
        profile: {
            type: String,
        },
        role: {
            type: String,
            enum: ["user", "organizer", "admin"],
            default: "user",
        },
        userType: {
            type: String,
            enum: ["attendee", "organizer", "admin"],
            default: "attendee",
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "suspended", "deleted"],
            default: "active",
        },
        lastLogin: {
            type: Date,
        },
        isProfileCompleted: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
            select: false,
        },
        forgetToken: {
            type: String,
            select: false,
        },
        // Fields to support resend/retry of forgot-password emails
        forgetEmailRetryStep: {
            type: Number,
            default: undefined,
            select: false,
        },
        forgetEmailNextAttempt: {
            type: Date,
            default: undefined,
            select: false,
        },
        isSignupCompleted: {
            type: Boolean,
            default: true,
        },
        forgetTokenCreateAt: {
            type: Date,
        },
        emailVerificationToken: {
            type: String,
            select: false,
        },
        emailVerificationTokenExpiry: {
            type: Date,
            select: false,
        },
    },
    {
        timestamps: true,
    }
);


const UserModel = model("users", userSchema);
export default UserModel;
