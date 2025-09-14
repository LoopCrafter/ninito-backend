import { Address } from "../models/address.model.js";

const createNewAddress = async (req, res) => {
  try {
    const {
      title,
      address,
      city,
      province,
      postalCode,
      location,
      description,
    } = req.body;

    const newAddress = await Address.create({
      title,
      address,
      city,
      province,
      postalCode,
      location,
      description,
      userId: req.userId,
    });

    if (!newAddress) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to create address" });
    }
    res.status(201).json({ address: newAddress, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.userId });
    if (!addresses) {
      return res
        .status(404)
        .json({ success: false, message: "No addresses found" });
    }
    return res.status(200).json({ addresses, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAddressDetails = async (req, res) => {
  const { addressId } = req.params;
  try {
    const address = await Address.findById(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    if (address.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.status(200).json({ address, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateAddress = async (req, res) => {
  const { addressId } = req.params;
  if (!addressId) {
    return res
      .status(400)
      .json({ success: false, message: "Address ID is required" });
  }

  try {
    const updateAddress = await Address.findByIdAndUpdate(
      { _id: addressId, userId: req.userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }

    return res.status(200).json({ address: updateAddress, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const deleteAddress = async (req, res) => {
  const { addressId } = req.params;
  try {
    const deletedAddress = await Address.findByIdAndDelete({
      _id: addressId,
      userId: req.userId,
    });
    if (!deletedAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    return res
      .status(200)
      .json({ message: "Address deleted successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export {
  createNewAddress,
  getAllAddresses,
  getAddressDetails,
  updateAddress,
  deleteAddress,
};
