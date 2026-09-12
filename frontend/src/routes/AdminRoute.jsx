import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = () => {
  const { user, loading } = useAuth();

  // Auth check hone tak wait
  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
      </div>
    );
  }

  // Login nahi hai
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin nahi hai
  if (user.role !== "admin") {
    return <Navigate to="/student" replace />;
  }

  // Admin hai
  return <Outlet />;
};

export default AdminRoute;