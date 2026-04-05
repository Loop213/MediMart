import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { currency } from "@/lib/utils";

export default function CartPage() {
  const items = useSelector((state) => state.cart.items);
  const total = items.reduce((sum, item) => sum + item.medicineId.price * item.quantity, 0);
  const requiresPrescription = items.some((item) => item.medicineId.prescriptionRequired);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <h1 className="text-3xl font-black">Your cart</h1>
        {items.length ? (
          items.map((item) => <CartItemRow key={item.medicineId._id} item={item} />)
        ) : (
          <Card>
            <p className="text-slate-500 dark:text-slate-400">Your cart is empty. Add medicines to continue.</p>
          </Card>
        )}
      </div>
      <Card className="h-fit space-y-4">
        <h2 className="text-xl font-extrabold">Order summary</h2>
        <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>Items</span>
          <span>{items.length}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{currency(total)}</span>
        </div>
        {requiresPrescription && (
          <p className="rounded-2xl bg-amber-100 px-4 py-3 text-sm font-semibold text-amber-800 dark:bg-amber-950 dark:text-amber-200">
            Prescription upload will be required during checkout.
          </p>
        )}
        <Link to="/checkout" className="block">
          <Button className="w-full" disabled={!items.length}>
            Proceed to checkout
          </Button>
        </Link>
      </Card>
    </div>
  );
}
