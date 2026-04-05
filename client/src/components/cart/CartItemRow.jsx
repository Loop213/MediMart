import { Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/Button";
import { apiAsset, currency } from "@/lib/utils";
import { removeCartItem, updateCartItem } from "@/features/cart/cartSlice";

export function CartItemRow({ item }) {
  const dispatch = useDispatch();
  const medicine = item.medicineId;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 p-4 dark:border-slate-800 sm:flex-row sm:items-center">
      <img src={apiAsset(medicine.image)} alt={medicine.name} className="h-24 w-24 rounded-2xl object-cover" />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">{medicine.name}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{medicine.category}</p>
          </div>
          <p className="text-lg font-extrabold">{currency(medicine.price * item.quantity)}</p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1 dark:border-slate-700">
            <button onClick={() => dispatch(updateCartItem({ medicineId: medicine._id, quantity: item.quantity - 1 }))}>
              <Minus size={16} />
            </button>
            <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
            <button onClick={() => dispatch(updateCartItem({ medicineId: medicine._id, quantity: item.quantity + 1 }))}>
              <Plus size={16} />
            </button>
          </div>
          <Button variant="ghost" className="text-rose-600" onClick={() => dispatch(removeCartItem(medicine._id))}>
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
