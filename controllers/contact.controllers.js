import { Contact } from "../models/contact.model.js";

const CreateContact = async (req, res) => {
  const { name, email, subject, message, phone } = req.body;
  try {
    const newContact = await Contact.create({
      name,
      email,
      subject,
      message,
      phone,
    });
    console.log("hamed", newContact);
    res.status(201).json({ success: true, contact: newContact });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};

const getAllContacts = async (req, res) => {
  try {
    const { filter } = req.query;
    const allowedFilters = [
      "product-question",
      "order-support",
      "complaint",
      "suggestion",
      "collaboration",
      "other",
    ];
    const query = allowedFilters.includes(filter) ? { subject: filter } : {};

    const contacts = await Contact.find(query).sort({ createdAt: -1 });
    res
      .status(200)
      .json({ success: true, contacts: contacts.map((c) => c.toJSON()) });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, error: err.message || "server error" });
  }
};

export { CreateContact, getAllContacts };
