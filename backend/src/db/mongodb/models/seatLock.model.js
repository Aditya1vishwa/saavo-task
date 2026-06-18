import { Schema, model } from "mongoose";

// A short-lived hold over a set of event seats while the user pays.
// `expiresAt` carries a TTL index so stale locks self-expire in Mongo;
// the booking flow also defensively checks status + expiry.
const seatLockSchema = new Schema(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: "events",
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },
        seatIds: {
            type: [{ type: Schema.Types.ObjectId, ref: "event_seats" }],
            default: [],
        },
        status: {
            type: String,
            enum: ["active", "released", "converted"],
            default: "active",
            index: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

// TTL: Mongo removes the lock document once expiresAt passes.
seatLockSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SeatLockModel = model("seat_locks", seatLockSchema);
export default SeatLockModel;
