import clsx from "clsx";

export const cn = (...inputs) => clsx(inputs);

export const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const apiAsset = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
  return `${baseUrl}${url}`;
};
