import { Schema, model } from "mongoose";

// Per-event seat inventory — the ONLY thing the booking flow reserves against.
// Cloned from venueSeats when an event's seats are generated.
const eventSeatSchema = new Schema(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "events",
            required: true,
            index: true,
        },
        venueSeatId: {
            type: Schema.Types.ObjectId,
            ref: "venue_seats",
            default: null,
        },
        ticketTypeId: {
            type: Schema.Types.ObjectId,
            ref: "event_ticket_types",
            default: null,
            index: true,
        },
        section: {
            type: String,
            default: "",
            trim: true,
        },
        row: {
            type: String,
            default: "",
            trim: true,
        },
        seatNumber: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            default: "Regular",
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["available", "locked", "booked"],
            default: "available",
            index: true,
        },
        // Set while locked/booked so we can attribute and expire holds.
        lockedBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            default: null,
        },
        lockExpiresAt: {
            type: Date,
            default: null,
        },
        bookingId: {
            type: Schema.Types.ObjectId,
            ref: "bookings",
            default: null,
        },
    },
    { timestamps: true }
);

eventSeatSchema.index({ eventId: 1, seatNumber: 1 }, { unique: true });
eventSeatSchema.index({ eventId: 1, status: 1 });

const EventSeatModel = model("event_seats", eventSeatSchema);
export default EventSeatModel;
