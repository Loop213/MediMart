import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Medicine } from "../models/Medicine.js";
import { Footer } from "../models/Footer.js";
import { Coupon } from "../models/Coupon.js";
import { slugify } from "../utils/slugify.js";
import { footerDefaults } from "../utils/footerDefaults.js";

dotenv.config();

const medicines = [
  {
    name: "Paracetamol 650",
    price: 42,
    originalPrice: 55,
    category: "Tablets",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
    description: "Fast relief tablet for fever, body pain, and headaches.",
    prescriptionRequired: false,
    stock: 120,
    featured: true,
    popularScore: 90,
  },
  {
    name: "Cough Relief Syrup",
    price: 118,
    originalPrice: 145,
    category: "Syrups",
    image:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=900&q=80",
    description: "Soothing syrup formulated for dry cough and sore throat.",
    prescriptionRequired: false,
    stock: 80,
    featured: true,
    popularScore: 76,
  },
  {
    name: "Vitamin D3 Capsules",
    price: 210,
    originalPrice: 260,
    category: "Capsules",
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=900&q=80",
    description: "Immunity and bone health support capsules for daily wellness.",
    prescriptionRequired: false,
    stock: 64,
    featured: false,
    popularScore: 70,
  },
  {
    name: "Digital Thermometer",
    price: 299,
    originalPrice: 399,
    category: "Health Devices",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80",
    description: "Quick reading thermometer with clinically reliable accuracy.",
    prescriptionRequired: false,
    stock: 40,
    featured: true,
    popularScore: 54,
  },
  {
    name: "Antibiotic Care Pack",
    price: 520,
    originalPrice: 599,
    category: "Tablets",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=900&q=80",
    description: "Prescription-only antibiotic support pack under medical supervision.",
    prescriptionRequired: true,
    stock: 30,
    featured: false,
    popularScore: 48,
  },
  {
    name: "Skin Repair Lotion",
    price: 165,
    originalPrice: 189,
    category: "Personal Care",
    image:
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=900&q=80",
    description: "Daily barrier-repair lotion for sensitive and dry skin.",
    prescriptionRequired: false,
    stock: 95,
    featured: false,
    popularScore: 58,
  },
];

const seed = async () => {
  await connectDB();

  await Medicine.deleteMany();
  await User.deleteMany({ role: { $ne: "admin" } });
  await Footer.deleteMany();

  await Medicine.insertMany(
    medicines.map((medicine) => ({
      ...medicine,
      slug: slugify(medicine.name),
      image: { url: medicine.image, public_id: "" },
    }))
  );

  await Footer.create(footerDefaults);
  await Coupon.deleteMany();
  await Coupon.insertMany([
    {
      code: "MEDI10",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 200,
      expiryDate: new Date("2027-01-01"),
      usageLimit: 100,
      usedBy: [],
    },
    {
      code: "SAVE75",
      discountType: "fixed",
      discountValue: 75,
      minOrderAmount: 500,
      expiryDate: new Date("2027-01-01"),
      usageLimit: 100,
      usedBy: [],
    },
  ]);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@medimart.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "MediMart Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
      phone: "9999999999",
    });
  }

  console.log("Seed completed");
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
