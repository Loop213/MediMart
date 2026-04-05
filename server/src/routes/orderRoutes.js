import express from "express";
import {
  getAdminStats,
  getAllOrders,
  getUserOrders,
  placeOrder,
  reviewPrescription,
  updateOrderStatus,
  uploadPrescription,
  verifyPayment,
} from "../controllers/orderController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/place", protect, upload.single("prescriptionImage"), placeOrder);
router.get("/user", protect, getUserOrders);
router.post("/upload-prescription/:id", protect, upload.single("prescriptionImage"), uploadPrescription);
router.get("/all", protect, adminOnly, getAllOrders);
router.get("/stats", protect, adminOnly, getAdminStats);
router.put("/update-status/:id", protect, adminOnly, updateOrderStatus);
router.put("/verify-payment/:id", protect, adminOnly, verifyPayment);
router.put("/review-prescription/:id", protect, adminOnly, reviewPrescription);

export default router;
