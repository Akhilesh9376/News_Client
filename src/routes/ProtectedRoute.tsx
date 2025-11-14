// src/routes/ProtectedRoute.tsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { RootState } from "@/store";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();

  if (isLoading) {
    // You can also return a spinner component here
    return <p className="text-center mt-10">Checking authentication...</p>;
  }
  // console.log("User Is :- ",user);

  if (!isAuthenticated) {
    return <Navigate to="/employee/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
