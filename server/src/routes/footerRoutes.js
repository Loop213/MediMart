import express from "express";
import { body } from "express-validator";
import {
  getFooterContent,
  getNewsletterSubscribers,
  subscribeNewsletter,
  updateFooterContent,
} from "../controllers/footerController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/", getFooterContent);
router.post("/newsletter", [body("email").isEmail(), validate], subscribeNewsletter);
router.get("/subscribers", protect, adminOnly, getNewsletterSubscribers);
router.put("/", protect, adminOnly, updateFooterContent);

export default router;
