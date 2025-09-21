import mongoose from "mongoose";

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
    return res.status(201).json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

const getAllTickets = (req, res) => {
  res.send("Get all tickets");
};

const updateTicket = (req, res) => {
  res.send(`Update ticket with ID ${req.params.ticketId}`);
};

const deleteTicket = (req, res) => {
  res.send(`Delete ticket with ID ${req.params.ticketId}`);
};

export { createNewTicket, getAllTickets, updateTicket, deleteTicket };
