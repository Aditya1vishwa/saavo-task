import { Schema, model } from "mongoose";

const eventSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        organizerId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },
        venueId: {
            type: Schema.Types.ObjectId,
            ref: "venues",
            required: true,
            index: true,
        },
        // Denormalized from the venue for fast discovery/filtering.
        city: {
            type: String,
            default: "",
            trim: true,
            index: true,
        },
        category: {
            type: String,
            default: "Other",
            trim: true,
            index: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        bannerUrl: {
            type: String,
            default: "",
        },
        startAt: {
            type: Date,
            required: true,
            index: true,
        },
        endAt: {
            type: Date,
        },
        status: {
            type: String,
            enum: ["draft", "published", "cancelled", "completed"],
            default: "draft",
            index: true,
        },
        // Lowest ticket price, denormalized for "from ₹X" listings & sorting.
        minPrice: {
            type: Number,
            default: 0,
        },
        // Whether per-event seat inventory (eventSeats) has been generated.
        seatsGenerated: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

eventSchema.index({ status: 1, startAt: 1 });
eventSchema.index({ city: 1, category: 1, status: 1 });

const EventModel = model("events", eventSchema);
export default EventModel;
