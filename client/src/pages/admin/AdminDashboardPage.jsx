import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminStats } from "@/features/admin/adminSlice";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { currency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const { stats } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
  }, [dispatch]);

  const cards = [
    ["Total users", stats?.totalUsers || 0],
    ["Total orders", stats?.totalOrders || 0],
    ["Revenue", currency(stats?.revenue || 0)],
    ["Pending prescriptions", stats?.pendingPrescriptions || 0],
    ["Pending UPI verifications", stats?.pendingPayments || 0],
  ];

  return (
    <AdminShell
      title="Operations Dashboard"
      description="Monitor core business metrics, jump into orders, customers, products, and footer settings."
      actions={
        <>
          <Link to="/admin/medicines">
            <Button variant="secondary">Manage medicines</Button>
          </Link>
          <Link to="/admin/orders">
            <Button>Manage orders</Button>
          </Link>
          <Link to="/admin/customers">
            <Button variant="secondary">Manage customers</Button>
          </Link>
          <Link to="/admin/footer">
            <Button variant="secondary">Edit footer</Button>
          </Link>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <Card key={label} className="space-y-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
            <p className="text-3xl font-black">{value}</p>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
