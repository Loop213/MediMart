import { ShieldCheck, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { addCartItem } from "@/features/cart/cartSlice";
import { currency, apiAsset } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function MedicineCard({ medicine }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const discount = medicine.originalPrice
    ? Math.max(0, Math.round(((medicine.originalPrice - medicine.price) / medicine.originalPrice) * 100))
    : 0;

  const addToCart = () => {
    if (!token) {
      toast.info("Please log in to add items to cart");
      navigate("/login");
      return;
    }
    dispatch(addCartItem({ medicineId: medicine._id, quantity: 1 }));
  };

  return (
    <Card className="group flex h-full flex-col gap-4 p-4">
      <div className="relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
        <img
          src={apiAsset(medicine.image)}
          alt={medicine.name}
          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {medicine.prescriptionRequired && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-3 py-1 text-xs font-bold text-white">
            <ShieldCheck size={14} />
            Prescription
          </span>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">{medicine.category}</p>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-50">{medicine.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-500 dark:text-slate-400">{medicine.description}</p>
      </div>
      <div className="mt-auto flex items-end justify-between gap-3">
        <div>
          <p className="text-xl font-extrabold">{currency(medicine.price)}</p>
          {medicine.originalPrice > medicine.price && (
            <p className="text-sm text-slate-400">
              <span className="line-through">{currency(medicine.originalPrice)}</span> {discount}% off
            </p>
          )}
        </div>
        <Button className="gap-2" onClick={addToCart}>
          <ShoppingBag size={16} />
          Add
        </Button>
      </div>
    </Card>
  );
}
