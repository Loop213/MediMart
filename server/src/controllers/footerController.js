import asyncHandler from "express-async-handler";
import { Footer } from "../models/Footer.js";
import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";
import { footerDefaults } from "../utils/footerDefaults.js";

const getFooterDocument = async () => {
  let footer = await Footer.findOne({ key: "default" });
  if (!footer) {
    footer = await Footer.create(footerDefaults);
  }
  return footer;
};

export const getFooterContent = asyncHandler(async (req, res) => {
  const footer = await getFooterDocument();
  const subscribers = await NewsletterSubscriber.countDocuments();

  res.json({
    ...footer.toObject(),
    newsletterSubscriberCount: subscribers,
  });
});

export const updateFooterContent = asyncHandler(async (req, res) => {
  const footer = await getFooterDocument();
  Object.assign(footer, req.body, { key: "default" });
  await footer.save();

  const subscribers = await NewsletterSubscriber.countDocuments();
  res.json({
    ...footer.toObject(),
    newsletterSubscriberCount: subscribers,
  });
});

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();

  if (!email) {
    res.status(400);
    throw new Error("Email is required");
  }

  const existing = await NewsletterSubscriber.findOne({ email });
  if (!existing) {
    await NewsletterSubscriber.create({ email });
  }

  res.status(201).json({ message: "Subscribed successfully" });
});

export const getNewsletterSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).limit(100);
  res.json(subscribers);
});
