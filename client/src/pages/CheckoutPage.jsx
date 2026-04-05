import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { placeOrder } from "@/features/order/orderSlice";
import { fetchCart } from "@/features/cart/cartSlice";
import { currency } from "@/lib/utils";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    paymentMethod: "COD",
    transactionId: "",
  });
  const [prescriptionImage, setPrescriptionImage] = useState(null);
  const items = useSelector((state) => state.cart.items);
  const total = items.reduce((sum, item) => sum + item.medicineId.price * item.quantity, 0);
  const requiresPrescription = items.some((item) => item.medicineId.prescriptionRequired);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append(
      "address",
      JSON.stringify({
        fullName: form.fullName,
        phone: form.phone,
        line1: form.line1,
        line2: form.line2,
        city: form.city,
        state: form.state,
        postalCode: form.postalCode,
      })
    );
    formData.append("paymentMethod", form.paymentMethod);
    if (form.paymentMethod === "UPI") {
      formData.append("transactionId", form.transactionId);
    }
    if (prescriptionImage) {
      formData.append("prescriptionImage", prescriptionImage);
    }

    await dispatch(placeOrder(formData)).unwrap();
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
    <form className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]" onSubmit={handleSubmit}>
      <Card className="space-y-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Delivery details</p>
          <h1 className="text-3xl font-black">Place your order</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["fullName", "Name"],
            ["phone", "Phone"],
            ["line1", "Address line 1"],
            ["line2", "Address line 2"],
            ["city", "City"],
            ["state", "State"],
            ["postalCode", "Postal code"],
          ].map(([key, label]) => (
            <Input
              key={key}
              placeholder={label}
              className={key === "line1" || key === "line2" ? "md:col-span-2" : ""}
              value={form[key]}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
              required={key !== "line2"}
            />
          ))}
        </div>

        {requiresPrescription && (
          <div className="space-y-3 rounded-[28px] bg-amber-50 p-5 dark:bg-amber-950/40">
            <p className="font-bold text-amber-700 dark:text-amber-200">Prescription required</p>
            <Input type="file" accept="image/*" onChange={(event) => setPrescriptionImage(event.target.files?.[0] || null)} />
          </div>
        )}

        <div className="space-y-4 rounded-[28px] bg-slate-50 p-5 dark:bg-slate-800/60">
          <p className="font-bold">Payment method</p>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <input
              type="radio"
              name="paymentMethod"
              checked={form.paymentMethod === "COD"}
              onChange={() => setForm((current) => ({ ...current, paymentMethod: "COD" }))}
            />
            <span>
              <span className="block font-semibold">Cash on Delivery</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">Place instantly. Payment status stays pending until delivery.</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <input
              type="radio"
              name="paymentMethod"
              checked={form.paymentMethod === "UPI"}
              onChange={() => setForm((current) => ({ ...current, paymentMethod: "UPI" }))}
            />
            <span className="w-full">
              <span className="block font-semibold">UPI payment</span>
              <span className="block text-sm text-slate-500 dark:text-slate-400">
                Pay via any UPI app to <strong>9973545985123@ybl</strong> and enter the transaction ID.
              </span>
              {form.paymentMethod === "UPI" && (
                <div className="mt-4 space-y-3">
                  <div className="rounded-2xl border border-dashed border-brand-300 p-4 text-sm text-slate-600 dark:border-brand-700 dark:text-slate-300">
                    Manual verification: your payment will be marked as <strong>Pending Verification</strong> until an admin verifies it.
                  </div>
                  <Input
                    placeholder="Enter UPI transaction ID"
                    value={form.transactionId}
                    onChange={(event) => setForm((current) => ({ ...current, transactionId: event.target.value }))}
                    required={form.paymentMethod === "UPI"}
                  />
                </div>
              )}
            </span>
          </label>
        </div>
      </Card>

      <Card className="h-fit space-y-4">
        <h2 className="text-xl font-extrabold">Order summary</h2>
        {items.map((item) => (
          <div key={item.medicineId._id} className="flex justify-between text-sm">
            <span>{item.medicineId.name} x{item.quantity}</span>
            <span>{currency(item.medicineId.price * item.quantity)}</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-black dark:border-slate-800">
          <span>Total</span>
          <span>{currency(total)}</span>
        </div>
        <Button type="submit" className="w-full">
          Confirm order
        </Button>
      </Card>
    </form>
  );
}
