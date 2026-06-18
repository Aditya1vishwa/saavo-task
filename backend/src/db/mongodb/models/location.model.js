import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        data: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    { timestamps: true }
);

export const LocationCache = mongoose.models.LocationCache || mongoose.model("locationcaches", locationSchema);
