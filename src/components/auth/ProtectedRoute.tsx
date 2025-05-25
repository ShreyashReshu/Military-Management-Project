
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'baseCommander' | 'logisticsOfficer';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state if auth state is being determined
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    toast({
      title: "Authentication required",
      description: "Please login to access this page",
      variant: "destructive",
    });
    return <Navigate to="/login" replace />;
  }

  // Check for role-based access if requiredRole is specified
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    toast({
      title: "Access denied",
      description: `You need ${requiredRole} privileges to access this page`,
      variant: "destructive",
    });
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has appropriate role
  return <>{children}</>;
};

export default ProtectedRoute;
