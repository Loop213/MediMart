import asyncHandler from "express-async-handler";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";
import { Medicine } from "../models/Medicine.js";

const requiresPrescription = (items) => items.some((item) => item.prescriptionRequired);

export const placeOrder = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("cartData.medicineId");

  if (!user.cartData.length) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const { address, paymentMethod, transactionId } = req.body;
  const items = user.cartData.map((item) => ({
    medicineId: item.medicineId._id,
    name: item.medicineId.name,
    image: item.medicineId.image,
    quantity: item.quantity,
    unitPrice: item.medicineId.price,
    prescriptionRequired: item.medicineId.prescriptionRequired,
  }));

  const prescriptionNeeded = requiresPrescription(items);
  const prescriptionImage = req.file ? `/uploads/${req.file.filename}` : "";

  if (prescriptionNeeded && !prescriptionImage) {
    res.status(400);
    throw new Error("Prescription is required for one or more medicines");
  }

  if (paymentMethod === "UPI" && !transactionId) {
    res.status(400);
    throw new Error("Transaction ID is required for UPI payments");
  }

  for (const item of items) {
    const medicine = await Medicine.findById(item.medicineId);
    if (!medicine || medicine.stock < item.quantity) {
      res.status(400);
      throw new Error(`${item.name} is out of stock`);
    }
    medicine.stock -= item.quantity;
    medicine.popularScore += item.quantity;
    await medicine.save();
  }

  const amount = items.reduce((total, item) => total + item.quantity * item.unitPrice, 0);
  const order = await Order.create({
    userId: req.user._id,
    items,
    amount,
    address: JSON.parse(address),
    prescriptionImage,
    prescriptionStatus: prescriptionNeeded ? "Pending" : "Not Required",
    paymentMethod,
    transactionId: transactionId || "",
    paymentStatus: paymentMethod === "UPI" ? "Pending Verification" : "Pending",
  });

  user.cartData = [];
  await user.save();

  res.status(201).json(order);
});

export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export const uploadPrescription = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!req.file) {
    res.status(400);
    throw new Error("Prescription image is required");
  }

  order.prescriptionImage = `/uploads/${req.file.filename}`;
  order.prescriptionStatus = "Pending";
  await order.save();

  res.json(order);
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("userId", "name email phone")
    .sort({ createdAt: -1 });

  res.json(orders);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = req.body.orderStatus;
  await order.save();
  res.json(order);
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.paymentStatus = req.body.paymentStatus;
  await order.save();
  res.json(order);
});

export const reviewPrescription = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.prescriptionStatus = req.body.prescriptionStatus;
  await order.save();
  res.json(order);
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const [usersCount, orders, pendingPrescriptions, pendingPayments] = await Promise.all([
    User.countDocuments(),
    Order.find(),
    Order.countDocuments({ prescriptionStatus: "Pending" }),
    Order.countDocuments({ paymentStatus: "Pending Verification" }),
  ]);

  const revenue = orders
    .filter((order) => order.paymentStatus === "Verified" || order.paymentMethod === "COD")
    .reduce((sum, order) => sum + order.amount, 0);

  res.json({
    totalUsers: usersCount,
    totalOrders: orders.length,
    revenue,
    pendingPrescriptions,
    pendingPayments,
  });
});
