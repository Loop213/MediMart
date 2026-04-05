import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { fetchCart } from "@/features/cart/cartSlice";

export function Layout({ children }) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  return (
    <div className="min-h-screen bg-mist bg-grid [background-size:24px_24px] text-slate-900 transition-colors dark:bg-ink dark:text-slate-100">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_58%)] dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_48%)]" />
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">{children || <Outlet />}</main>
      <Footer />
    </div>
  );
}
