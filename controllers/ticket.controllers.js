import mongoose from "mongoose";
import { Ticket } from "../models/ticket.model.js";
import { TicketMessage } from "../models/ticketMessages.model.js";

const createNewTicket = async (req, res) => {
  const user = req.userId;
  const { subject, message } = req.body;
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();
    const newTicket = await Ticket.create({ user, subject, status: "open" });

    const newMessage = await TicketMessage.create({
      ticket: newTicket._id,
      message: message.trim(),
      sender: user,
      attachments: [],
    });
    session.commitTransaction();
    session.endSession();
    return res.status(201).json({ success: true, newTicket });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getAllTickets = async (req, res) => {
  const user = req.userId;
  console.log("User ID:", req.userRole, user);
  try {
    let tickets = [];
    if (req.userRole === "admin") {
      tickets = await Ticket.find()
        .sort({ createdAt: -1 })
        .populate("user", "name email");
    } else {
      tickets = await Ticket.find({ user })
        .sort({ createdAt: -1 })
        .populate("user", "name email");
    }
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const updateTicket = (req, res) => {
  res.send(`Update ticket with ID ${req.params.ticketId}`);
};

const deleteTicket = (req, res) => {
  res.send(`Delete ticket with ID ${req.params.ticketId}`);
};

export { createNewTicket, getAllTickets, updateTicket, deleteTicket };
