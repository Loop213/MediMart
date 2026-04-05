import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { AdminRoute } from "./components/common/AdminRoute";
import { ScreenLoader } from "./components/common/ScreenLoader";
import { initializeTheme } from "./features/theme/themeSlice";
import { loadStoredAuth, fetchMe } from "./features/auth/authSlice";

const HomePage = lazy(() => import("./pages/HomePage"));
const MedicinesPage = lazy(() => import("./pages/MedicinesPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OrdersPage = lazy(() => import("./pages/OrdersPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminMedicinesPage = lazy(() => import("./pages/admin/AdminMedicinesPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminFooterPage = lazy(() => import("./pages/admin/AdminFooterPage"));
const AdminCustomersPage = lazy(() => import("./pages/admin/AdminCustomersPage"));

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeTheme());
    const token = loadStoredAuth();
    if (token) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  return (
    <Layout>
      <Suspense fallback={<ScreenLoader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/medicines" element={<MedicinesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/medicines"
            element={
              <AdminRoute>
                <AdminMedicinesPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrdersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <AdminRoute>
                <AdminCustomersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/footer"
            element={
              <AdminRoute>
                <AdminFooterPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
