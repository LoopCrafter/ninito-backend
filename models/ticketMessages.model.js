import { Schema, model } from "mongoose";

const TicketMessageSchema = new Schema(
  {
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [String],
  },
  { timestamps: true }
);

export const TicketMessage = model("TicketMessage", TicketMessageSchema);
