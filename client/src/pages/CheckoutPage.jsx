import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { fetchUserOrders, placeOrder } from "@/features/order/orderSlice";
import { fetchCart } from "@/features/cart/cartSlice";
import { addAddress, fetchAddresses } from "@/features/auth/authSlice";
import { api } from "@/services/api";
import { currency } from "@/lib/utils";

const newAddressTemplate = {
  fullName: "",
  phone: "",
  pincode: "",
  city: "",
  state: "",
  fullAddress: "",
  isDefault: false,
};

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [transactionId, setTransactionId] = useState("");
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState(newAddressTemplate);
  const [couponCode, setCouponCode] = useState("");
  const [couponState, setCouponState] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const items = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  useEffect(() => {
    const defaultAddress = user?.addresses?.find((item) => item.isDefault) || user?.addresses?.[0];
    if (defaultAddress && !selectedAddressId) {
      setSelectedAddressId(defaultAddress._id);
    }
  }, [selectedAddressId, user?.addresses]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.medicineId.price * item.quantity, 0),
    [items]
  );
  const requiresPrescription = items.some((item) => item.medicineId.prescriptionRequired);
  const finalPrice = total - (couponState?.discountAmount || 0);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await api.post("/coupon/apply", { code: couponCode.trim(), amount: total });
      setCouponState(data);
      toast.success(`Coupon ${data.code} applied`);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleAddAddress = async () => {
    const addresses = await dispatch(addAddress(newAddress)).unwrap();
    const latestAddress = addresses[addresses.length - 1];
    setSelectedAddressId(latestAddress?._id || "");
    setNewAddress(newAddressTemplate);
    setShowNewAddress(false);
    toast.success("Address added");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("addressId", selectedAddressId);
    formData.append("paymentMethod", paymentMethod);
    if (paymentMethod === "UPI") {
      formData.append("transactionId", transactionId);
    }
    if (couponState?.code) {
      formData.append("couponCode", couponState.code);
    }
    if (prescriptionImage) {
      formData.append("prescriptionImage", prescriptionImage);
    }

    await dispatch(placeOrder(formData)).unwrap();
    await dispatch(fetchUserOrders()).unwrap();
    toast.success("Order placed successfully");
    dispatch(fetchCart());
    navigate("/orders");
  };

  if (!items.length) {
    return (
      <Card>
        <p className="text-slate-500 dark:text-slate-400">Your cart is empty. Add products to place an order.</p>
      </Card>
    );
  }

  return (
    <form className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]" onSubmit={handleSubmit}>
      <div className="space-y-6">
        <Card className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Step 1</p>
              <h1 className="text-3xl font-black">Select delivery address</h1>
            </div>
            <Button type="button" variant="secondary" onClick={() => setShowNewAddress((value) => !value)}>
              {showNewAddress ? "Close" : "Add new address"}
            </Button>
          </div>

          <div className="space-y-3">
            {user?.addresses?.map((address) => (
              <label
                key={address._id}
                className={`block cursor-pointer rounded-[24px] border p-4 transition ${
                  selectedAddressId === address._id
                    ? "border-brand-500 bg-brand-50/60 dark:border-brand-500 dark:bg-brand-950/20"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex gap-3">
                  <input
                    type="radio"
                    checked={selectedAddressId === address._id}
                    onChange={() => setSelectedAddressId(address._id)}
                  />
                  <div>
                    <p className="font-bold">
                      {address.fullName} {address.isDefault ? "· Default" : ""}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {address.fullAddress}, {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{address.phone}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {showNewAddress ? (
            <div className="grid gap-3 md:grid-cols-2">
              {["fullName", "phone", "pincode", "city", "state"].map((key) => (
                <Input
                  key={key}
                  placeholder={key}
                  value={newAddress[key]}
                  onChange={(event) => setNewAddress((current) => ({ ...current, [key]: event.target.value }))}
                />
              ))}
              <Input
                className="md:col-span-2"
                placeholder="Full Address"
                value={newAddress.fullAddress}
                onChange={(event) => setNewAddress((current) => ({ ...current, fullAddress: event.target.value }))}
              />
              <label className="md:col-span-2 flex items-center gap-2 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(event) => setNewAddress((current) => ({ ...current, isDefault: event.target.checked }))}
                />
                Set as default
              </label>
              <div className="md:col-span-2">
                <Button type="button" onClick={handleAddAddress}>
                  Save address
                </Button>
              </div>
            </div>
          ) : null}
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Step 2</p>
            <h2 className="text-2xl font-black">Apply coupon</h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input value={couponCode} onChange={(event) => setCouponCode(event.target.value)} placeholder="Enter coupon code" />
            <Button type="button" onClick={applyCoupon} disabled={couponLoading}>
              Apply
            </Button>
          </div>
          {couponState ? (
            <div className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
              Coupon {couponState.code} applied. You saved {currency(couponState.discountAmount)}.
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400">Try demo coupons: `MEDI10`, `SAVE75`</p>
          )}
        </Card>

        <Card className="space-y-4">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Step 3</p>
          <h2 className="text-2xl font-black">Payment method</h2>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
            <span>
              <span className="block font-semibold">Cash on Delivery</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">Pay when the order reaches you.</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <input type="radio" checked={paymentMethod === "UPI"} onChange={() => setPaymentMethod("UPI")} />
            <span className="w-full">
              <span className="block font-semibold">UPI</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">Pay to 9973545985123@ybl and enter transaction ID.</span>
              {paymentMethod === "UPI" ? (
                <Input
                  className="mt-3"
                  placeholder="UPI transaction ID"
                  value={transactionId}
                  onChange={(event) => setTransactionId(event.target.value)}
                />
              ) : null}
            </span>
          </label>

          {requiresPrescription ? (
            <div className="rounded-2xl bg-amber-50 p-4 dark:bg-amber-950/30">
              <p className="mb-2 font-bold text-amber-700 dark:text-amber-200">Prescription required</p>
              <Input type="file" accept="image/*" onChange={(event) => setPrescriptionImage(event.target.files?.[0] || null)} />
            </div>
          ) : null}
        </Card>
      </div>

      <Card className="h-fit space-y-4 lg:sticky lg:top-24">
        <h2 className="text-xl font-extrabold">Order summary</h2>
        {items.map((item) => (
          <div key={item.medicineId._id} className="flex justify-between text-sm">
            <span>{item.medicineId.name} x{item.quantity}</span>
            <span>{currency(item.medicineId.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Total price</span>
          <span>{currency(total)}</span>
        </div>
        <div className="flex justify-between text-sm text-emerald-600 dark:text-emerald-300">
          <span>Discount</span>
          <span>- {currency(couponState?.discountAmount || 0)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-black dark:border-slate-800">
          <span>Final price</span>
          <span>{currency(finalPrice)}</span>
        </div>
        <Button type="submit" className="w-full" disabled={!selectedAddressId}>
          Place order
        </Button>
      </Card>
    </form>
  );
}
