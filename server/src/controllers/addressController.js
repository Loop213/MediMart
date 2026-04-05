import asyncHandler from "express-async-handler";
import { User } from "../models/User.js";

const setDefaultAddressState = (user, nextIsDefault, excludeId = "") => {
  if (nextIsDefault || !user.addresses.some((item) => item.isDefault && item._id.toString() !== excludeId)) {
    user.addresses.forEach((item) => {
      if (item._id.toString() !== excludeId) {
        item.isDefault = false;
      }
    });
    return true;
  }
  return false;
};

export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("addresses");
  res.json(user.addresses);
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = {
    ...req.body,
    isDefault: setDefaultAddressState(user, req.body.isDefault === true || req.body.isDefault === "true"),
  };

  user.addresses.push(address);
  await user.save();
  res.status(201).json(user.addresses);
});

export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  Object.assign(address, req.body);
  address.isDefault = setDefaultAddressState(
    user,
    req.body.isDefault === true || req.body.isDefault === "true",
    address._id.toString()
  );

  await user.save();
  res.json(user.addresses);
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.id);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  const wasDefault = address.isDefault;
  user.addresses.pull(req.params.id);

  if (wasDefault && user.addresses.length) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  res.json(user.addresses);
});
