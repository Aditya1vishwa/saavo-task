import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
    {
        // Human-friendly reference, e.g. "BKG-9F3A2C".
        bookingCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "events",
            required: true,
            index: true,
        },
        // "seated" → seats[] holds assigned seats; "general" → items[] holds GA line items.
        type: {
            type: String,
            enum: ["seated", "general"],
            default: "seated",
        },
        // Denormalized seat snapshot so a booking is readable without joins (seated).
        seats: {
            type: [
                {
                    eventSeatId: { type: Schema.Types.ObjectId, ref: "event_seats" },
                    seatNumber: String,
                    category: String,
                    price: Number,
                },
            ],
            default: [],
        },
        // General-admission line items (ticket type + quantity).
        items: {
            type: [
                {
                    ticketTypeId: { type: Schema.Types.ObjectId, ref: "event_ticket_types" },
                    name: String,
                    price: Number,
                    quantity: Number,
                },
            ],
            default: [],
        },
        quantity: {
            type: Number,
            default: 0,
        },
        totalAmount: {
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
            enum: ["pending", "confirmed", "cancelled", "expired"],
            default: "pending",
            index: true,
        },
        paymentId: {
            type: Schema.Types.ObjectId,
            ref: "payments",
            default: null,
        },
        confirmedAt: {
            type: Date,
            default: null,
        },
        cancelledAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const BookingModel = model("bookings", bookingSchema);
export default BookingModel;
