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
    const newTicket = await Ticket.create([{ user, subject, status: "open" }], {
      session,
    });
    console.log("New Ticket:", newTicket);
    await TicketMessage.create(
      [
        {
          ticket: newTicket[0]._id,
          message: message.trim(),
          sender: user,
          attachments: [],
        },
      ],
      { session }
    );
    session.commitTransaction();
    session.endSession();
    return res.status(201).json({ success: true, ticket: newTicket[0] });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    res.status(500).json({
      message: "Server error",
      success: false,
      message: error.message,
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

const getTicketDetails = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
        success: false,
      });
    }
    const messages = await TicketMessage.find({ ticket: ticketId })
      .sort({ createdAt: 1 })
      .populate("sender", "name email role");

    res.status(200).json({ success: true, messages, status: ticket.status });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const updateTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { message } = req.body;
  const user = req.userId;
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
    if (!ticketId || !message || !req.userId) {
      return res.status(400).json({
        success: false,
        message: "ticketId, message or userId missing",
      });
    }
    const newMessage = await TicketMessage.create(
      [
        {
          ticket: ticketId,
          message: message.trim(),
          sender: req.userId,
          attachments: [],
        },
      ],
      { session }
    );

    const ticket = await Ticket.findById(ticketId).session(session);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.status = "open";
    await ticket.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      newMessage: newMessage[0],
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const deleteTicket = (req, res) => {
  res.send(`Delete ticket with ID ${req.params.ticketId}`);
};

const closeTicket = async (req, res) => {
  const { ticketId } = req.params;
  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found",
        success: false,
      });
    }
    ticket.status = "closed";
    await ticket.save();
    res
      .status(200)
      .json({ success: true, message: "Ticket closed successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export {
  createNewTicket,
  getAllTickets,
  updateTicket,
  deleteTicket,
  getTicketDetails,
  closeTicket,
};
