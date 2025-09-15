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
  if (id !== req.userId) {
    return res.status(403).json({ message: "Access denied", success: false });
  }
  const user = User.findById(id).select("-password -role");
  if (!user) {
    return res.status(404).json({ message: "User not found", success: false });
  }
  res.status(200).json({ user, success: true });
};

export { getAllUsers, getUserById };
