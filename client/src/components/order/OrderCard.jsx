import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { apiAsset, currency } from "@/lib/utils";
import { uploadOrderPrescription } from "@/features/order/orderSlice";

export function OrderCard({ order }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("prescriptionImage", file);
    dispatch(uploadOrderPrescription({ id: order._id, formData }));
  };

  return (
    <Card className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-600">Order #{order._id.slice(-6).toUpperCase()}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">{order.orderStatus}</span>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-brand-700 dark:bg-brand-950 dark:text-brand-200">
            {order.paymentMethod} · {order.paymentStatus}
          </span>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-700 dark:bg-amber-950 dark:text-amber-200">
            Prescription: {order.prescriptionStatus}
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.medicineId} className="flex items-center gap-3">
            <img src={apiAsset(item.image)} alt={item.name} className="h-14 w-14 rounded-2xl object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Qty {item.quantity} · {currency(item.unitPrice)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
        <div className="space-y-1 text-sm">
          <p className="font-semibold">
            Deliver to: {order.address.fullName}, {order.address.fullAddress}, {order.address.city}, {order.address.state} -{" "}
            {order.address.pincode}
          </p>
          <p className="text-slate-500 dark:text-slate-400">Contact: {order.address.phone}</p>
        </div>
        <p className="font-bold">Total: {currency(order.amount)}</p>
        {order.discountAmount > 0 ? (
          <p className="font-semibold text-emerald-600 dark:text-emerald-300">
            Discount: -{currency(order.discountAmount)} {order.coupon?.code ? `(${order.coupon.code})` : ""}
          </p>
        ) : null}
        <p className="font-bold text-lg">Final price: {currency(order.finalPrice || order.amount)}</p>
        {order.prescriptionStatus !== "Approved" && !order.prescriptionImage && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
            <Button onClick={handleUpload}>Upload prescription</Button>
          </div>
        )}
      </div>
    </Card>
  );
}
