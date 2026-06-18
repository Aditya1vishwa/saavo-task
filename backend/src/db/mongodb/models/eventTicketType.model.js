import { Schema, model } from "mongoose";

// Pricing tier for an event. For seated venues, `category` maps to
// venueSeat.category so generated eventSeats inherit the right price.
const eventTicketTypeSchema = new Schema(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "events",
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        // Maps to venueSeat.category for seated venues. Empty for general admission.
        category: {
            type: String,
            default: "",
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "INR",
        },
        // For general-admission events (no seat map): total tickets in this tier.
        totalQuantity: {
            type: Number,
            default: 0,
            min: 0,
        },
        // Remaining quantity for general admission (kept in sync on booking).
        availableQuantity: {
            type: Number,
            default: 0,
            min: 0,
        },
        // UI hint for the seat map / listings.
        color: {
            type: String,
            default: "#2563eb",
        },
    },
    { timestamps: true }
);

const EventTicketTypeModel = model("event_ticket_types", eventTicketTypeSchema);
export default EventTicketTypeModel;
