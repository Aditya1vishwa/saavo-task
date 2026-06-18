import { Schema, model } from "mongoose";

const paymentSchema = new Schema(
    {
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "bookings",
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },
        // "demo" = built-in fake gateway (success/fail toggle). Real providers
        // (e.g. razorpay) can be added later without touching the booking flow.
        provider: {
            type: String,
            enum: ["demo", "razorpay"],
            default: "demo",
        },
        // Generic external references — reused by whichever provider is active.
        orderId: {
            type: String,
            default: null,
            index: true,
        },
        transactionId: {
            type: String,
            default: null,
        },
        signature: {
            type: String,
            default: null,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "INR",
        },
        status: {
            type: String,
            enum: ["created", "paid", "failed", "refunded"],
            default: "created",
            index: true,
        },
        // Raw webhook/verification payload for auditing.
        meta: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

const PaymentModel = model("payments", paymentSchema);
export default PaymentModel;
