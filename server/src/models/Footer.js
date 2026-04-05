import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const footerSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "default" },
    brandName: { type: String, required: true, default: "MediMart" },
    description: {
      type: String,
      default: "Advanced online pharmacy for everyday medicines, wellness essentials, and health devices.",
    },
    tagline: {
      type: String,
      default: "Your trusted platform for medicine delivery, prescription care, and fast checkout.",
    },
    quickLinks: { type: [linkSchema], default: [] },
    featureLinks: { type: [linkSchema], default: [] },
    supportLinks: { type: [linkSchema], default: [] },
    contact: {
      email: { type: String, default: "support@medimart.com" },
      phone: { type: String, default: "+91 99735 45985" },
      location: { type: String, default: "Patna, Bihar, India" },
    },
    socialLinks: {
      instagram: { type: String, default: "https://instagram.com" },
      facebook: { type: String, default: "https://facebook.com" },
      twitter: { type: String, default: "https://twitter.com" },
      linkedin: { type: String, default: "https://linkedin.com" },
    },
    newsletter: {
      title: { type: String, default: "Get weekly health savings" },
      subtitle: {
        type: String,
        default: "Subscribe for medicine restock alerts, wellness tips, and exclusive offers.",
      },
      placeholder: { type: String, default: "Enter your email" },
      buttonText: { type: String, default: "Subscribe" },
    },
    offerHighlight: {
      title: { type: String, default: "Save 12% on wellness bundles" },
      description: { type: String, default: "Use code MEDICARE12 on eligible everyday essentials." },
    },
    paymentMethods: {
      type: [String],
      default: ["UPI", "Visa", "MasterCard", "COD"],
    },
    languageOptions: {
      type: [String],
      default: ["English", "Hindi"],
    },
    bottomBar: {
      copyright: { type: String, default: "© 2026 MediMart. All rights reserved." },
      developerCredit: { type: String, default: "Crafted for modern pharmacy commerce." },
      smallLinks: { type: [linkSchema], default: [] },
    },
  },
  { timestamps: true }
);

export const Footer = mongoose.model("Footer", footerSchema);
