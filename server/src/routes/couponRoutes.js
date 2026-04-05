import express from "express";
import { body } from "express-validator";
import { applyCoupon, createCoupon, deleteCoupon, listCoupons } from "../controllers/couponController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post("/apply", protect, [body("code").notEmpty(), body("amount").isFloat({ min: 0 }), validate], applyCoupon);
router.get("/", protect, adminOnly, listCoupons);
router.post(
  "/create",
  protect,
  adminOnly,
  [
    body("code").notEmpty(),
    body("discountType").isIn(["percentage", "fixed"]),
    body("discountValue").isFloat({ min: 0 }),
    body("minOrderAmount").isFloat({ min: 0 }),
    body("expiryDate").notEmpty(),
    body("usageLimit").isInt({ min: 1 }),
    validate,
  ],
  createCoupon
);
router.delete("/delete/:id", protect, adminOnly, deleteCoupon);

export default router;
