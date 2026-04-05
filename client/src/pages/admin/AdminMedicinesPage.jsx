import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMedicine, deleteMedicine, fetchMedicines, updateMedicine } from "@/features/medicine/medicineSlice";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { apiAsset, currency } from "@/lib/utils";

export default function AdminMedicinesPage() {
  const dispatch = useDispatch();
  const medicines = useSelector((state) => state.medicine.items);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "Tablets",
    description: "",
    stock: "",
    image: "",
    prescriptionRequired: "false",
    featured: "false",
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    dispatch(fetchMedicines());
  }, [dispatch]);

  const handleAdd = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (imageFile) formData.append("image", imageFile);
    if (editingId) {
      await dispatch(updateMedicine({ id: editingId, formData })).unwrap();
    } else {
      await dispatch(addMedicine(formData)).unwrap();
    }
    setForm({
      name: "",
      price: "",
      originalPrice: "",
      category: "Tablets",
      description: "",
      stock: "",
      image: "",
      prescriptionRequired: "false",
      featured: "false",
    });
    setImageFile(null);
    setEditingId(null);
  };

  return (
    <AdminShell title="Products Management" description="Add, edit, and remove medicine listings with stock and prescription controls.">
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="space-y-4">
        <h1 className="text-2xl font-black">{editingId ? "Edit medicine" : "Add medicine"}</h1>
        <form className="space-y-3" onSubmit={handleAdd}>
          {["name", "price", "originalPrice", "description", "stock", "image"].map((key) => (
            <Input
              key={key}
              placeholder={key}
              value={form[key]}
              onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
            />
          ))}
          <Input type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
          <Select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
            {["Tablets", "Syrups", "Capsules", "Personal Care", "Health Devices"].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Select
            value={form.prescriptionRequired}
            onChange={(event) => setForm((current) => ({ ...current, prescriptionRequired: event.target.value }))}
          >
            <option value="false">No prescription</option>
            <option value="true">Prescription required</option>
          </Select>
          <Select value={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.value }))}>
            <option value="false">Standard</option>
            <option value="true">Featured</option>
          </Select>
          <Button type="submit" className="w-full">
            {editingId ? "Update medicine" : "Save medicine"}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => {
                setEditingId(null);
                setImageFile(null);
                setForm({
                  name: "",
                  price: "",
                  originalPrice: "",
                  category: "Tablets",
                  description: "",
                  stock: "",
                  image: "",
                  prescriptionRequired: "false",
                  featured: "false",
                });
              }}
            >
              Cancel edit
            </Button>
          )}
        </form>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-black">Current inventory</h2>
        {medicines.map((medicine) => (
          <Card key={medicine._id} className="flex flex-col gap-4 sm:flex-row">
            <img src={apiAsset(medicine.image)} alt={medicine.name} className="h-28 w-28 rounded-3xl object-cover" />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold">{medicine.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {medicine.category} · Stock {medicine.stock}
                  </p>
                </div>
                <p className="font-bold">{currency(medicine.price)}</p>
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{medicine.description}</p>
              <div className="mt-4">
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setEditingId(medicine._id);
                      setForm({
                        name: medicine.name,
                        price: medicine.price,
                        originalPrice: medicine.originalPrice || "",
                        category: medicine.category,
                        description: medicine.description,
                        stock: medicine.stock,
                        image: medicine.image.startsWith("http") ? medicine.image : "",
                        prescriptionRequired: String(medicine.prescriptionRequired),
                        featured: String(medicine.featured),
                      });
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="danger" onClick={() => dispatch(deleteMedicine(medicine._id))}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
    </AdminShell>
  );
}
