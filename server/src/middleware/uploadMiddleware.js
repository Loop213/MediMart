import fs from "fs";
import path from "path";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary, hasCloudinaryConfig } from "../config/cloudinary.js";

const uploadDir = path.resolve("server/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  },
});

const cloudinaryStorage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: async () => ({
        folder: "medimart",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
      }),
    })
  : null;

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG, or WEBP images are allowed"));
  }
  cb(null, true);
};

export const upload = multer({
  storage: cloudinaryStorage || diskStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
