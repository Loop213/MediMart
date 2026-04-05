import asyncHandler from "express-async-handler";
import { Coupon } from "../models/Coupon.js";

const calculateDiscount = (coupon, amount) => {
  if (coupon.discountType === "percentage") {
    return Math.min(amount, Math.round((amount * coupon.discountValue) / 100));
  }
  return Math.min(amount, coupon.discountValue);
};

export const validateCouponForUser = (coupon, userId, amount) => {
  if (!coupon) {
    throw new Error("Coupon not found");
  }
  if (coupon.expiryDate < new Date()) {
    throw new Error("Coupon has expired");
  }
  if (amount < coupon.minOrderAmount) {
    throw new Error(`Minimum order amount is ${coupon.minOrderAmount}`);
  }
  if (coupon.usedBy.some((id) => id.toString() === userId.toString())) {
    throw new Error("Coupon already used by this user");
  }
  if (coupon.usedBy.length >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  const discountAmount = calculateDiscount(coupon, amount);
  return {
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    finalPrice: Math.max(0, amount - discountAmount),
  };
};

export const applyCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findOne({ code: String(req.body.code || "").trim().toUpperCase() });
  const result = validateCouponForUser(coupon, req.user._id, Number(req.body.amount) || 0);
  res.json(result);
});

export const listCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(coupons);
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({
    ...req.body,
    code: String(req.body.code || "").trim().toUpperCase(),
  });
  res.status(201).json(coupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }

  await coupon.deleteOne();
  res.json({ message: "Coupon deleted", id: req.params.id });
});
