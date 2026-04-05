import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function AdminRoute({ children }) {
  const { user, token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
