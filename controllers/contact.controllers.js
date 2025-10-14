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

export { CreateContact };
