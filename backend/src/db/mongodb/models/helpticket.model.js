import { Schema, model } from "mongoose";

const helpTicketSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
            index: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        query: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["open", "answered", "closed"],
            default: "open",
            index: true,
        },
        answeredBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            default: null,
        },
        answer: {
            type: String,
            default: "",
            trim: true,
        },
        answeredAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

helpTicketSchema.index({ userId: 1, createdAt: -1 });

const HelpTicketModel = model("help_tickets", helpTicketSchema);
export default HelpTicketModel;
