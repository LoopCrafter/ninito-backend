import { User } from "../models/user.model.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -role");
    res.status(200).json({ users, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  if (id !== req.userId) {
    return res.status(403).json({ message: "Access denied", success: false });
  }
  try {
    const user = await User.findById(id).select("-password -role");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({ user, success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "خطای داخلی سرور",
    });
  }
};

const getProfile = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "کاربر یافت نشد", success: false });
    }

    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        password: undefined,
        role: undefined,
        resetPasswordExpiresAt: undefined,
        resetPasswordToken: undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "خطای داخلی سرور",
    });
  }
  res.json({ id: userId });
};
export { getAllUsers, getUserById, getProfile };
