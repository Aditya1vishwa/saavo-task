import { Schema, model } from "mongoose";

// A reusable seat-layout template for a venue. Event-specific inventory
// (eventSeats) is cloned from these — bookings NEVER touch venueSeats directly.
const venueSeatSchema = new Schema(
    {
        venueId: {
            type: Schema.Types.ObjectId,
            ref: "venues",
            required: true,
            index: true,
        },
        section: {
            type: String,
            required: true,
            trim: true,
        },
        row: {
            type: String,
            default: "",
            trim: true,
        },
        // Human-facing seat label, unique within a venue (e.g. "A12", "VIP-3").
        seatNumber: {
            type: String,
            required: true,
            trim: true,
        },
        // Logical category used to map pricing tiers (e.g. "VIP", "Regular", "Balcony").
        category: {
            type: String,
            default: "Regular",
            trim: true,
        },
        // Optional coordinates for a visual seat-map designer.
        position: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

venueSeatSchema.index({ venueId: 1, seatNumber: 1 }, { unique: true });

const VenueSeatModel = model("venue_seats", venueSeatSchema);
export default VenueSeatModel;
