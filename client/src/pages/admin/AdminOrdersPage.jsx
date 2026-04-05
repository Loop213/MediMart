import { useEffect, useMemo, useState } from "react";
import { Eye, Search, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  deleteAdminOrder,
  fetchAdminOrders,
  reviewAdminPrescription,
  updateAdminOrderStatus,
  verifyAdminPayment,
} from "@/features/admin/adminSlice";
import { currency } from "@/lib/utils";

export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch(fetchAdminOrders({ page, limit: 10, search, status }));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [dispatch, page, search, status]);

  const orderRows = useMemo(() => orders.items || [], [orders.items]);

  return (
    <AdminShell
      title="Orders Management"
      description="Track every order, inspect details, update shipping state, and manage payment verification."
    >
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-5 dark:border-slate-800">
          <div className="flex flex-1 flex-wrap gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                className="pl-11"
                placeholder="Search order ID or customer name"
              />
            </div>
            <Select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option>All</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
              <tr>
                {["Order ID", "Customer", "Products", "Total", "Payment", "Status", "Date", "Actions"].map((header) => (
                  <th key={header} className="px-5 py-4 font-bold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderRows.map((order) => (
                <tr key={order._id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="px-5 py-4 font-semibold">#{order._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <p className="font-semibold">{order.userId?.name || order.address?.fullName}</p>
                    <p className="text-xs text-slate-500">{order.userId?.email}</p>
                    <p className="text-xs text-slate-500">{order.userId?.phone || order.address?.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="max-w-xs space-y-1">
                      {order.items.slice(0, 2).map((item) => (
                        <p key={item.medicineId} className="truncate">
                          {item.name} x{item.quantity}
                        </p>
                      ))}
                      {order.items.length > 2 ? <p className="text-xs text-slate-500">+{order.items.length - 2} more</p> : null}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-semibold">{currency(order.amount)}</td>
                  <td className="px-5 py-4">
                    <p>{order.paymentMethod}</p>
                    <p className="text-xs text-slate-500">{order.paymentStatus}</p>
                  </td>
                  <td className="px-5 py-4">
                    <Select
                      value={order.orderStatus}
                      onChange={(event) =>
                        dispatch(updateAdminOrderStatus({ id: order._id, orderStatus: event.target.value }))
                      }
                    >
                      {["Processing", "Shipped", "Delivered", "Cancelled"].map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-5 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="secondary" className="gap-2" onClick={() => setSelectedOrder(order)}>
                        <Eye size={14} />
                        View
                      </Button>
                      <Button variant="danger" className="gap-2" onClick={() => setDeleteTarget(order)}>
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={orders.page} pages={orders.pages} total={orders.total} onChange={setPage} />
      </Card>

      {selectedOrder ? (
        <OrderDetailPanel
          order={selectedOrder}
          loading={loading}
          onClose={() => setSelectedOrder(null)}
          onPaymentChange={(paymentStatus) =>
            dispatch(verifyAdminPayment({ id: selectedOrder._id, paymentStatus })).then(() =>
              dispatch(fetchAdminOrders({ page, limit: 10, search, status }))
            )
          }
          onPrescriptionChange={(prescriptionStatus) =>
            dispatch(reviewAdminPrescription({ id: selectedOrder._id, prescriptionStatus })).then(() =>
              dispatch(fetchAdminOrders({ page, limit: 10, search, status }))
            )
          }
        />
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete order?"
        description="This permanently removes the order from admin records."
        confirmText="Delete order"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await dispatch(deleteAdminOrder(deleteTarget._id)).unwrap();
          toast.success("Order deleted");
          setDeleteTarget(null);
          dispatch(fetchAdminOrders({ page, limit: 10, search, status }));
        }}
      />
    </AdminShell>
  );
}

function OrderDetailPanel({ order, onClose, onPaymentChange, onPrescriptionChange, loading }) {
  return (
    <Card className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black">Order details</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">#{order._id}</p>
        </div>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <InfoCard label="Customer" value={`${order.userId?.name || order.address?.fullName}\n${order.userId?.email || ""}`} />
        <InfoCard label="Address" value={[order.address?.line1, order.address?.city, order.address?.state].filter(Boolean).join(", ")} />
        <InfoCard label="Payment" value={`${order.paymentMethod} · ${order.paymentStatus}`} />
      </div>

      <div className="space-y-3">
        {order.items.map((item) => (
          <div key={item.medicineId} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Qty {item.quantity}</p>
            </div>
            <p className="font-bold">{currency(item.unitPrice * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-bold">Payment verification</p>
          <Select defaultValue={order.paymentStatus} onChange={(event) => onPaymentChange(event.target.value)} disabled={loading}>
            {["Pending", "Pending Verification", "Verified", "Rejected"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
        <div>
          <p className="mb-2 text-sm font-bold">Prescription review</p>
          <Select defaultValue={order.prescriptionStatus} onChange={(event) => onPrescriptionChange(event.target.value)} disabled={loading}>
            {["Not Required", "Pending", "Approved", "Rejected"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>
      </div>
    </Card>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 whitespace-pre-line text-sm font-semibold">{value || "N/A"}</p>
    </div>
  );
}

function Pagination({ page, pages, total, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-5 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing page {page} of {pages} · {total} orders
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" disabled={page >= pages} onClick={() => onChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
