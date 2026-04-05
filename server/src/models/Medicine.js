import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Tablets", "Syrups", "Capsules", "Personal Care", "Health Devices"],
    },
    image: { type: mongoose.Schema.Types.Mixed, required: true },
    description: { type: String, required: true, trim: true },
    prescriptionRequired: { type: Boolean, default: false },
    stock: { type: Number, required: true, min: 0 },
    featured: { type: Boolean, default: false },
    popularScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Medicine = mongoose.model("Medicine", medicineSchema);
