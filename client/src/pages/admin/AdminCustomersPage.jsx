import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, ShieldBan, Trash2, UserRoundCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AdminShell } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomers,
  updateCustomer,
} from "@/features/admin/adminSlice";

const initialForm = {
  name: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  status: "Active",
};

export default function AdminCustomersPage() {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector((state) => state.admin);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch(fetchCustomers({ page, limit: 10, search, status }));
    }, 300);
    return () => window.clearTimeout(timer);
  }, [dispatch, page, search, status]);

  const submitLabel = useMemo(() => (editingCustomer ? "Update customer" : "Add customer"), [editingCustomer]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editingCustomer) {
      await dispatch(updateCustomer({ id: editingCustomer._id, payload: form })).unwrap();
      toast.success("Customer updated");
    } else {
      await dispatch(createCustomer(form)).unwrap();
      toast.success("Customer added");
    }

    setForm(initialForm);
    setEditingCustomer(null);
    dispatch(fetchCustomers({ page, limit: 10, search, status }));
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setForm({
      name: customer.name || "",
      email: customer.email || "",
      password: "",
      phone: customer.phone || "",
      address: customer.addressText || "",
      status: customer.status || "Active",
    });
  };

  const toggleBlock = async (customer) => {
    await dispatch(
      updateCustomer({
        id: customer._id,
        payload: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          address: customer.addressText,
          status: customer.status === "Blocked" ? "Active" : "Blocked",
        },
      })
    ).unwrap();
    toast.success(customer.status === "Blocked" ? "Customer unblocked" : "Customer blocked");
    dispatch(fetchCustomers({ page, limit: 10, search, status }));
  };

  return (
    <AdminShell
      title="Customer Management"
      description="Create, edit, block, and review customers with searchable records and account controls."
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
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
                  placeholder="Search by name, email, phone"
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
                <option>Active</option>
                <option>Blocked</option>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
                <tr>
                  {["Name", "Email", "Phone", "Address", "Orders", "Status", "Actions"].map((header) => (
                    <th key={header} className="px-5 py-4 font-bold">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {customers.items.map((customer) => (
                  <tr key={customer._id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="px-5 py-4 font-semibold">{customer.name}</td>
                    <td className="px-5 py-4">{customer.email}</td>
                    <td className="px-5 py-4">{customer.phone || "N/A"}</td>
                    <td className="px-5 py-4">{customer.addressText || "No address"}</td>
                    <td className="px-5 py-4">{customer.totalOrders}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          customer.status === "Blocked"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-200"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200"
                        }`}
                      >
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button variant="secondary" className="gap-2" onClick={() => handleEdit(customer)}>
                          <Pencil size={14} />
                          Edit
                        </Button>
                        <Button variant="ghost" className="gap-2" onClick={() => toggleBlock(customer)}>
                          {customer.status === "Blocked" ? <UserRoundCheck size={14} /> : <ShieldBan size={14} />}
                          {customer.status === "Blocked" ? "Unblock" : "Block"}
                        </Button>
                        <Button variant="danger" className="gap-2" onClick={() => setDeleteTarget(customer)}>
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

          <Pagination
            page={customers.page}
            pages={customers.pages}
            total={customers.total}
            onChange={setPage}
          />
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-2">
            <Plus size={18} className="text-brand-600" />
            <h2 className="text-xl font-black">{editingCustomer ? "Edit Customer" : "Add Customer"}</h2>
          </div>
          <form className="space-y-3" onSubmit={handleSubmit}>
            {["name", "email", "phone", "address"].map((key) => (
              <Input
                key={key}
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={form[key]}
                onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                required={key !== "phone" && key !== "address"}
              />
            ))}
            {!editingCustomer ? (
              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
            ) : null}
            <Select
              value={form.status}
              onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
            >
              <option>Active</option>
              <option>Blocked</option>
            </Select>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={loading}>
                {submitLabel}
              </Button>
              {editingCustomer ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingCustomer(null);
                    setForm(initialForm);
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete customer?"
        description="This will remove the customer and their order history from the admin records."
        confirmText="Delete customer"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await dispatch(deleteCustomer(deleteTarget._id)).unwrap();
          toast.success("Customer deleted");
          setDeleteTarget(null);
          dispatch(fetchCustomers({ page, limit: 10, search, status }));
        }}
      />
    </AdminShell>
  );
}

function Pagination({ page, pages, total, onChange }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-5 dark:border-slate-800">
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Showing page {page} of {pages} · {total} customers
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
