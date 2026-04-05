import express from "express";
import { body } from "express-validator";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../controllers/addressController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.use(protect);

router.get("/", getAddresses);
router.post(
  "/add",
  [
    body("fullName").notEmpty(),
    body("phone").notEmpty(),
    body("pincode").notEmpty(),
    body("city").notEmpty(),
    body("state").notEmpty(),
    body("fullAddress").notEmpty(),
    validate,
  ],
  addAddress
);
router.put("/update/:id", updateAddress);
router.delete("/delete/:id", deleteAddress);

export default router;
