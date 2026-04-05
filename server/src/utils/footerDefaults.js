export const footerDefaults = {
  key: "default",
  brandName: "MediMart",
  description: "Advanced online pharmacy for everyday medicines, wellness essentials, and health devices.",
  tagline: "Your trusted platform for medicine delivery, prescription care, and fast checkout.",
  quickLinks: [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Products", path: "/medicines" },
    { label: "Contact", path: "/contact" },
    { label: "FAQ", path: "/faq" },
  ],
  featureLinks: [
    { label: "General Medicines", path: "/search?q=medicine" },
    { label: "Tablets", path: "/search?category=Tablets" },
    { label: "Syrups", path: "/search?category=Syrups" },
    { label: "Health Devices", path: "/search?category=Health%20Devices" },
    { label: "Wellness Essentials", path: "/search?q=wellness" },
  ],
  supportLinks: [
    { label: "Help Center", path: "/help" },
    { label: "Privacy Policy", path: "/privacy" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Refund Policy", path: "/refund" },
  ],
  contact: {
    email: "support@medimart.com",
    phone: "+91 99735 45985",
    location: "Patna, Bihar, India",
  },
  socialLinks: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
  },
  newsletter: {
    title: "Get weekly health savings",
    subtitle: "Subscribe for medicine restock alerts, wellness tips, and exclusive offers.",
    placeholder: "Enter your email",
    buttonText: "Subscribe",
  },
  offerHighlight: {
    title: "Save 12% on wellness bundles",
    description: "Use code MEDICARE12 on eligible everyday essentials.",
  },
  paymentMethods: ["UPI", "Visa", "MasterCard", "COD"],
  languageOptions: ["English", "Hindi"],
  bottomBar: {
    copyright: "© 2026 MediMart. All rights reserved.",
    developerCredit: "Crafted for modern pharmacy commerce.",
    smallLinks: [
      { label: "Privacy", path: "/privacy" },
      { label: "Terms", path: "/terms" },
    ],
  },
};
