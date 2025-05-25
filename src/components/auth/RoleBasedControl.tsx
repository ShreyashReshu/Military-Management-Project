
import { useAuth } from "@/contexts/AuthContext";

interface RoleBasedControlProps {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'baseCommander' | 'logisticsOfficer'>;
  fallback?: React.ReactNode;
}

const RoleBasedControl = ({ 
  children, 
  allowedRoles, 
  fallback = null 
}: RoleBasedControlProps) => {
  const { user } = useAuth();
  
  // If no user or role doesn't match allowed roles, show fallback
  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }
  
  // User has permission, show the children
  return <>{children}</>;
};

export default RoleBasedControl;
