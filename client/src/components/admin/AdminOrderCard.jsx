import { Card } from "@/components/ui/Card";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { apiAsset, currency } from "@/lib/utils";

export function AdminOrderCard({
  order,
  onStatusChange,
  onPaymentChange,
  onPrescriptionChange,
}) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-brand-600">
            {order.userId?.name || "User"} · {order.userId?.email || "N/A"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Order #{order._id.slice(-6).toUpperCase()} · {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <p className="text-xl font-extrabold">{currency(order.amount)}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Order Status</p>
          <div className="flex gap-2">
            <Select defaultValue={order.orderStatus} onChange={(event) => onStatusChange(order._id, event.target.value)}>
              {["Processing", "Shipped", "Delivered", "Cancelled"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </Select>
          </div>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Payment</p>
          <Select defaultValue={order.paymentStatus} onChange={(event) => onPaymentChange(order._id, event.target.value)}>
            {["Pending", "Pending Verification", "Verified", "Rejected"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Prescription</p>
          <Select
            defaultValue={order.prescriptionStatus}
            onChange={(event) => onPrescriptionChange(order._id, event.target.value)}
          >
            {["Not Required", "Pending", "Approved", "Rejected"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
      </div>
      {order.paymentMethod === "UPI" && (
        <p className="text-sm text-slate-500 dark:text-slate-400">Transaction ID: {order.transactionId || "Not provided"}</p>
      )}
      {order.prescriptionImage && (
        <a href={apiAsset(order.prescriptionImage)} target="_blank" rel="noreferrer">
          <Button variant="secondary">View Prescription</Button>
        </a>
      )}
      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.medicineId} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800/70">
            <img src={apiAsset(item.image)} alt={item.name} className="h-12 w-12 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Qty {item.quantity} · {currency(item.unitPrice)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
