import express from "express";
import { body } from "express-validator";
import {
  createCustomer,
  deleteAdminOrder,
  deleteCustomer,
  getAdminOrders,
  getCustomers,
  updateAdminOrderStatus,
  updateCustomer,
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/orders", getAdminOrders);
router.delete("/order/:id", deleteAdminOrder);
router.put("/order/status/:id", updateAdminOrderStatus);

router.get("/customers", getCustomers);
router.post(
  "/customer",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    validate,
  ],
  createCustomer
);
router.put("/customer/:id", updateCustomer);
router.delete("/customer/:id", deleteCustomer);

export default router;
