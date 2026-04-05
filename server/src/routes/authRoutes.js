import express from "express";
import { body } from "express-validator";
import {
  addAddress,
  changePassword,
  deleteAddress,
  getMe,
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    validate,
  ],
  registerUser
);
router.post("/login", [body("email").isEmail(), body("password").notEmpty(), validate], loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/address", protect, addAddress);
router.delete("/address/:id", protect, deleteAddress);

export default router;
