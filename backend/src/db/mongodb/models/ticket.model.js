import { Schema, model } from "mongoose";

// One ticket per confirmed booking. The QR encodes the ticketCode, which a
// check-in endpoint can validate. PDF is generated on demand (not stored).
const ticketSchema = new Schema(
    {
        ticketCode: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
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
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "events",
            required: true,
            index: true,
        },
        // Denormalized snapshot so the ticket is renderable without joins.
        seats: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["valid", "used", "cancelled"],
            default: "valid",
            index: true,
        },
        issuedAt: {
            type: Date,
            default: null,
        },
        checkedInAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

const TicketModel = model("tickets", ticketSchema);
export default TicketModel;
