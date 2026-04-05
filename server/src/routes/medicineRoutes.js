import express from "express";
import { body } from "express-validator";
import {
  addMedicine,
  deleteMedicine,
  getMedicineById,
  listMedicines,
  searchMedicines,
  updateMedicine,
} from "../controllers/medicineController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.get("/list", listMedicines);
router.get("/search", searchMedicines);
router.get("/:id", getMedicineById);
router.post(
  "/add",
  protect,
  adminOnly,
  upload.single("image"),
  [
    body("name").notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("category").notEmpty(),
    body("description").notEmpty(),
    body("stock").isInt({ min: 0 }),
    validate,
  ],
  addMedicine
);
router.put("/update/:id", protect, adminOnly, upload.single("image"), updateMedicine);
router.delete("/delete/:id", protect, adminOnly, deleteMedicine);

export default router;
