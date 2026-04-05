import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { api } from "@/services/api";

const initialForm = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  minOrderAmount: "",
  expiryDate: "",
  usageLimit: "",
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(initialForm);

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/coupon");
      setCoupons(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    await api.post("/coupon/create", form);
    toast.success("Coupon created");
    setForm(initialForm);
    loadCoupons();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    await api.delete(`/coupon/delete/${id}`);
    toast.success("Coupon deleted");
    setCoupons((current) => current.filter((coupon) => coupon._id !== id));
  };

  return (
    <AdminShell title="Coupon Management" description="Create discount campaigns and remove expired offers from the checkout flow.">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="space-y-4">
          <h2 className="text-2xl font-black">Create coupon</h2>
          <form className="space-y-3" onSubmit={handleCreate}>
            <Input
              placeholder="Coupon code"
              value={form.code}
              onChange={(event) => setForm((current) => ({ ...current, code: event.target.value.toUpperCase() }))}
            />
            <Select
              value={form.discountType}
              onChange={(event) => setForm((current) => ({ ...current, discountType: event.target.value }))}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed amount</option>
            </Select>
            <Input
              type="number"
              min="0"
              placeholder="Discount value"
              value={form.discountValue}
              onChange={(event) => setForm((current) => ({ ...current, discountValue: event.target.value }))}
            />
            <Input
              type="number"
              min="0"
              placeholder="Minimum order amount"
              value={form.minOrderAmount}
              onChange={(event) => setForm((current) => ({ ...current, minOrderAmount: event.target.value }))}
            />
            <Input
              type="datetime-local"
              value={form.expiryDate}
              onChange={(event) => setForm((current) => ({ ...current, expiryDate: event.target.value }))}
            />
            <Input
              type="number"
              min="1"
              placeholder="Usage limit"
              value={form.usageLimit}
              onChange={(event) => setForm((current) => ({ ...current, usageLimit: event.target.value }))}
            />
            <Button type="submit" className="w-full">
              Save coupon
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-black">Active coupons</h2>
          {loading ? (
            <Card>
              <p className="text-slate-500 dark:text-slate-400">Loading coupons...</p>
            </Card>
          ) : coupons.length ? (
            coupons.map((coupon) => (
              <Card key={coupon._id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-extrabold">{coupon.code}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% off`
                      : `Rs ${coupon.discountValue} off`}{" "}
                    · Min order Rs {coupon.minOrderAmount}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Expires {new Date(coupon.expiryDate).toLocaleString()} · Used {coupon.usedBy.length}/{coupon.usageLimit}
                  </p>
                </div>
                <Button variant="danger" onClick={() => handleDelete(coupon._id)}>
                  Delete
                </Button>
              </Card>
            ))
          ) : (
            <Card>
              <p className="text-slate-500 dark:text-slate-400">No coupons created yet.</p>
            </Card>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
