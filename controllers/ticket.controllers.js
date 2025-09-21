const createNewTicket = (req, res) => {
  res.send("Create a new ticket");
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
