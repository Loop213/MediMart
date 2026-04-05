import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "@/features/order/orderSlice";
import { OrderCard } from "@/components/order/OrderCard";
import { Card } from "@/components/ui/Card";

export default function OrdersPage() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">My orders</h1>
      {orders.length ? (
        orders.map((order) => <OrderCard key={order._id} order={order} />)
      ) : (
        <Card>
          <p className="text-slate-500 dark:text-slate-400">You have not placed any orders yet.</p>
        </Card>
      )}
    </div>
  );
}
