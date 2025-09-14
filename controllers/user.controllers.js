import { User } from "../models/user.model.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -role");
    res.status(200).json({ users, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getUserById = (req, res) => {
  const { id } = req.params;
  res.send(`Get user with ID: ${id}`);
};

export { getAllUsers, getUserById };
