import asyncHandler from "express-async-handler";
import { Order } from "../models/Order.js";
import { User } from "../models/User.js";

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  pages: Math.max(1, Math.ceil(total / limit)),
});

const formatAddress = (user) => {
  const address = user.addresses?.find((item) => item.isDefault) || user.addresses?.[0];
  if (!address) return "";
  return [address.line1, address.city, address.state, address.postalCode].filter(Boolean).join(", ");
};

export const getAdminOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
  const search = String(req.query.search || "").trim();
  const status = String(req.query.status || "").trim();

  const query = {};
  if (status && status !== "All") {
    query.orderStatus = status;
  }

  let orders = await Order.find(query).populate("userId", "name email phone status addresses").sort({ createdAt: -1 });

  if (search) {
    const lower = search.toLowerCase();
    orders = orders.filter((order) => {
      const user = order.userId;
      return (
        order._id.toString().toLowerCase().includes(lower) ||
        user?.name?.toLowerCase().includes(lower) ||
        user?.email?.toLowerCase().includes(lower)
      );
    });
  }

  const total = orders.length;
  const paginated = orders.slice((page - 1) * limit, page * limit);

  res.json({
    items: paginated,
    ...buildPagination(page, limit, total),
  });
});

export const updateAdminOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("userId", "name email phone status addresses");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.orderStatus = req.body.orderStatus;
  await order.save();
  await order.populate("userId", "name email phone status addresses");
  res.json(order);
});

export const deleteAdminOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  await order.deleteOne();
  res.json({ message: "Order deleted", id: req.params.id });
});

export const getCustomers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));
  const search = String(req.query.search || "").trim();
  const status = String(req.query.status || "").trim();

  const query = { role: "user" };
  if (status && status !== "All") {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
    ];
  }

  const total = await User.countDocuments(query);
  const customers = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  const orderCounts = await Order.aggregate([
    { $match: { userId: { $in: customers.map((customer) => customer._id) } } },
    { $group: { _id: "$userId", count: { $sum: 1 } } },
  ]);

  const orderCountMap = new Map(orderCounts.map((item) => [item._id.toString(), item.count]));

  res.json({
    items: customers.map((customer) => ({
      ...customer.toObject(),
      addressText: formatAddress(customer),
      totalOrders: orderCountMap.get(customer._id.toString()) || 0,
    })),
    ...buildPagination(page, limit, total),
  });
});

export const createCustomer = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address, status = "Active" } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error("Customer email already exists");
  }

  const addresses = address
    ? [
        {
          label: "Home",
          fullName: name,
          phone,
          line1: address,
          city: "N/A",
          state: "N/A",
          postalCode: "000000",
          isDefault: true,
        },
      ]
    : [];

  const customer = await User.create({
    name,
    email,
    password,
    phone,
    status,
    role: "user",
    addresses,
  });

  res.status(201).json({
    ...customer.toObject(),
    password: undefined,
    addressText: formatAddress(customer),
    totalOrders: 0,
  });
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: "user" });
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const { name, email, phone, address, status } = req.body;
  if (email && email !== customer.email) {
    const existing = await User.findOne({ email, _id: { $ne: customer._id } });
    if (existing) {
      res.status(400);
      throw new Error("Email already in use");
    }
  }

  customer.name = name ?? customer.name;
  customer.email = email ?? customer.email;
  customer.phone = phone ?? customer.phone;
  customer.status = status ?? customer.status;

  if (address !== undefined) {
    if (address) {
      customer.addresses = [
        {
          label: "Home",
          fullName: customer.name,
          phone: customer.phone,
          line1: address,
          city: "N/A",
          state: "N/A",
          postalCode: "000000",
          isDefault: true,
        },
      ];
    } else {
      customer.addresses = [];
    }
  }

  await customer.save();
  const orderCount = await Order.countDocuments({ userId: customer._id });

  res.json({
    ...customer.toObject(),
    password: undefined,
    addressText: formatAddress(customer),
    totalOrders: orderCount,
  });
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await User.findOne({ _id: req.params.id, role: "user" });
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  await Order.deleteMany({ userId: customer._id });
  await customer.deleteOne();
  res.json({ message: "Customer deleted", id: req.params.id });
});
