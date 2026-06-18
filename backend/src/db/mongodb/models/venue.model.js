import { Schema, model } from "mongoose";

const venueSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        address: {
            type: String,
            default: "",
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        state: {
            type: String,
            default: "",
            trim: true,
        },
        country: {
            type: String,
            default: "India",
            trim: true,
        },
        pincode: {
            type: String,
            default: "",
            trim: true,
        },
        // "seated" → has a defined seat layout (venueSeats); "general" → standing/GA capacity only
        layoutType: {
            type: String,
            enum: ["seated", "general"],
            default: "seated",
        },
        capacity: {
            type: Number,
            default: 0,
            min: 0,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            index: true,
        },
    },
    { timestamps: true }
);

const VenueModel = model("venues", venueSchema);
export default VenueModel;
