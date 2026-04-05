import { useEffect } from "react";
import { ArrowRight, ShieldPlus, Truck, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMedicines } from "@/features/medicine/medicineSlice";
import { MedicineCard } from "@/components/medicine/MedicineCard";
import { MedicineFilters } from "@/components/medicine/MedicineFilters";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  const dispatch = useDispatch();
  const { items, filters } = useSelector((state) => state.medicine);

  useEffect(() => {
    dispatch(
      fetchMedicines({
        ...filters,
        prescriptionRequired: filters.prescriptionRequired === "all" ? undefined : filters.prescriptionRequired,
      })
    );
  }, [dispatch, filters]);

  return (
    <div className="space-y-12">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[36px] bg-slate-950 p-8 text-white shadow-panel dark:bg-slate-900">
          <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.3em] text-brand-300">
            Full-stack pharmacy experience
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
            Order medicines, upload prescriptions, and check out with COD or verified UPI.
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-300">
            Clean discovery, responsive checkout, profile management, and a back office built for payment and prescription verification.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/medicines">
              <Button className="gap-2">
                Shop now
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="secondary">Track my orders</Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          {[
            [ShieldPlus, "Prescription workflow", "Require uploads only when needed and let admins review each case."],
            [WalletCards, "Manual UPI verification", "Collect transaction IDs and approve payments inside the admin console."],
            [Truck, "Order tracking", "Customers can monitor payment and delivery status from their dashboard."],
          ].map(([Icon, title, description]) => (
            <div key={title} className="rounded-[30px] border border-white/60 bg-white/85 p-6 shadow-panel dark:border-slate-800 dark:bg-slate-900/85">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-200">
                <Icon />
              </div>
              <h3 className="text-lg font-extrabold">{title}</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-bold uppercase tracking-[0.35em] text-brand-600">Search & filter</p>
          <h2 className="text-3xl font-black">Browse our medicine catalog</h2>
        </div>
        <MedicineFilters />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {items.slice(0, 6).map((medicine) => (
            <MedicineCard key={medicine._id} medicine={medicine} />
          ))}
        </div>
      </section>
    </div>
  );
}
