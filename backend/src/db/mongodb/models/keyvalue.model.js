import { Schema, model } from "mongoose";

const keyValueSchema = new Schema(
    {
        type: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        key: {
            type: String,
            required: true,
            trim: true,
        },
        valueType: {
            type: String,
            enum: ["string", "object", "array"],
            required: true,
        },
        value: {
            type: Schema.Types.Mixed,
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
            index: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            default: null,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            default: null,
        },
    },
    { timestamps: true }
);

keyValueSchema.index({ type: 1, key: 1 }, { unique: true });

const KeyValueModel = model("key_values", keyValueSchema);
export default KeyValueModel;
