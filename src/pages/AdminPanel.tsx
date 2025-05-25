
import { useAuth } from "@/contexts/AuthContext";
import AdminDataManagement from "@/components/admin/AdminDataManagement";
import RoleBasedControl from "@/components/auth/RoleBasedControl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

const AdminPanel = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You need administrator privileges to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-military-navy mb-2">Admin Panel</h2>
        <p className="text-muted-foreground">
          Manage system data and configuration
        </p>
      </div>

      <RoleBasedControl allowedRoles={['admin']}>
        <AdminDataManagement />
      </RoleBasedControl>
    </div>
  );
};

export default AdminPanel;
