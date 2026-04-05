import asyncHandler from "express-async-handler";
import { Medicine } from "../models/Medicine.js";
import { slugify } from "../utils/slugify.js";

const normalizeCategory = (category) => {
  const map = {
    tablets: "Tablets",
    syrups: "Syrups",
    capsules: "Capsules",
    "personal-care": "Personal Care",
    personalcare: "Personal Care",
    devices: "Health Devices",
    "health-devices": "Health Devices",
  };

  return map[String(category || "").toLowerCase()] || category;
};

const buildMedicineFilter = (query) => {
  const {
    search = "",
    q = "",
    category,
    minPrice,
    maxPrice,
    prescriptionRequired,
    inStock,
  } = query;
  const filter = {};
  const searchTerm = search || q;

  if (searchTerm) {
    filter.$or = [
      { name: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
    ];
  }
  if (category && category !== "All") {
    filter.category = normalizeCategory(category);
  }
  if (prescriptionRequired === "true") {
    filter.prescriptionRequired = true;
  }
  if (prescriptionRequired === "false") {
    filter.prescriptionRequired = false;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  return filter;
};

const buildMedicineSort = (sort = "popular") => {
  const sortMap = {
    popular: { featured: -1, popularScore: -1, createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
  };

  return sortMap[sort] || sortMap.popular;
};

export const listMedicines = asyncHandler(async (req, res) => {
  const filter = buildMedicineFilter(req.query);
  const medicines = await Medicine.find(filter).sort(buildMedicineSort(req.query.sort));
  res.json(medicines);
});

export const searchMedicines = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(24, Math.max(1, Number(req.query.limit) || 9));
  const filter = buildMedicineFilter(req.query);
  const sort = buildMedicineSort(req.query.sort);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Medicine.find(filter).sort(sort).skip(skip).limit(limit),
    Medicine.countDocuments(filter),
  ]);

  res.json({
    items,
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
    query: req.query.q || req.query.search || "",
  });
});

export const getMedicineById = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }
  res.json(medicine);
});

export const addMedicine = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    slug: slugify(req.body.name),
    prescriptionRequired: req.body.prescriptionRequired === "true" || req.body.prescriptionRequired === true,
    featured: req.body.featured === "true" || req.body.featured === true,
    image: req.file ? `/uploads/${req.file.filename}` : req.body.image,
  };

  const medicine = await Medicine.create(payload);
  res.status(201).json(medicine);
});

export const updateMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  Object.assign(medicine, {
    ...req.body,
    slug: req.body.name ? slugify(req.body.name) : medicine.slug,
    prescriptionRequired:
      req.body.prescriptionRequired !== undefined
        ? req.body.prescriptionRequired === "true" || req.body.prescriptionRequired === true
        : medicine.prescriptionRequired,
    featured:
      req.body.featured !== undefined
        ? req.body.featured === "true" || req.body.featured === true
        : medicine.featured,
    image: req.file ? `/uploads/${req.file.filename}` : req.body.image || medicine.image,
  });

  await medicine.save();
  res.json(medicine);
});

export const deleteMedicine = asyncHandler(async (req, res) => {
  const medicine = await Medicine.findById(req.params.id);
  if (!medicine) {
    res.status(404);
    throw new Error("Medicine not found");
  }

  await medicine.deleteOne();
  res.json({ message: "Medicine deleted" });
});
