import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        message: {
            type: String,
            required: true,
            trim: true,
        },
        key: {
            type: String,
            default: "general",
            index: true,
        },
        data: {
            type: Schema.Types.Mixed,
            default: {},
        },
        status: {
            type: String,
            enum: ["unread", "read"],
            default: "unread",
            index: true,
        },
    },
    { timestamps: true }
);

notificationSchema.index({ userId: 1, status: 1, createdAt: -1 });

const NotificationModel = model("notifications", notificationSchema);
export default NotificationModel;
