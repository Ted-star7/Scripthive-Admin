import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();

  if (!user?.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
