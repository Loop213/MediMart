import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedicines } from "@/features/medicine/medicineSlice";
import { MedicineFilters } from "@/components/medicine/MedicineFilters";
import { MedicineCard } from "@/components/medicine/MedicineCard";

export default function MedicinesPage() {
  const dispatch = useDispatch();
  const { items, filters, loading } = useSelector((state) => state.medicine);

  useEffect(() => {
    dispatch(
      fetchMedicines({
        ...filters,
        prescriptionRequired: filters.prescriptionRequired === "all" ? undefined : filters.prescriptionRequired,
      })
    );
  }, [dispatch, filters]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-brand-600">Medicine catalog</p>
        <h1 className="text-3xl font-black">Find treatments, wellness products, and devices</h1>
      </div>
      <MedicineFilters />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-[360px] animate-pulse rounded-[28px] bg-slate-200 dark:bg-slate-800" />
            ))
          : items.map((medicine) => <MedicineCard key={medicine._id} medicine={medicine} />)}
      </div>
    </div>
  );
}
