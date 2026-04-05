import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";
import { Medicine } from "../models/Medicine.js";

const loadCart = async (userId) =>
  User.findById(userId).select("cartData").populate("cartData.medicineId");

export const getCart = asyncHandler(async (req, res) => {
  const user = await loadCart(req.user._id);
  res.json(user.cartData);
});

export const addToCart = asyncHandler(async (req, res) => {
  const { medicineId, quantity = 1 } = req.body;
  const medicine = await Medicine.findById(medicineId);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  const user = await User.findById(req.user._id);
  const existingItem = user.cartData.find((item) => item.medicineId.toString() === medicineId);

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    user.cartData.push({ medicineId, quantity });
  }

  await user.save();
  const updated = await loadCart(req.user._id);
  res.json(updated.cartData);
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { medicineId } = req.body;
  const user = await User.findById(req.user._id);
  user.cartData = user.cartData.filter((item) => item.medicineId.toString() !== medicineId);
  await user.save();
  const updated = await loadCart(req.user._id);
  res.json(updated.cartData);
});

export const updateCartQuantity = asyncHandler(async (req, res) => {
  const { medicineId, quantity } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cartData.find((entry) => entry.medicineId.toString() === medicineId);

  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  item.quantity = Number(quantity);
  if (item.quantity <= 0) {
    user.cartData = user.cartData.filter((entry) => entry.medicineId.toString() !== medicineId);
  }

  await user.save();
  const updated = await loadCart(req.user._id);
  res.json(updated.cartData);
});
