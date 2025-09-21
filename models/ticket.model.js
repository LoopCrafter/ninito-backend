import { Schema, model } from "mongoose";

const TicketSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "inProgress", "answered", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export const Ticket = model("Ticket", TicketSchema);
