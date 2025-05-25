
import { useState } from "react";
import { useAsset } from "@/contexts/AssetContext";
import { useAuth } from "@/contexts/AuthContext";
import MetricCard from "@/components/dashboard/MetricCard";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import MovementsDialog from "@/components/dashboard/MovementsDialog";
import { Card } from "@/components/ui/card";
import RoleBasedControl from "@/components/auth/RoleBasedControl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Dashboard = () => {
  const { getMetrics, bases, equipmentTypes } = useAsset();
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    baseId: user?.role !== 'admin' ? user?.baseId || null : null,
    equipmentTypeId: null as string | null,
    startDate: null as string | null,
    endDate: null as string | null,
  });
  const [showMovementsDialog, setShowMovementsDialog] = useState(false);

  // Get metrics based on current filters
  const metrics = getMetrics(
    filters.baseId || undefined,
    filters.equipmentTypeId || undefined,
    filters.startDate || undefined,
    filters.endDate || undefined
  );

  // Get base name for display
  const getBaseName = () => {
    if (!filters.baseId) return "All Bases";
    const base = bases.find(b => b.id === filters.baseId);
    return base ? base.name : "Unknown Base";
  };

  // Get equipment type name for display
  const getEquipmentName = () => {
    if (!filters.equipmentTypeId) return "All Equipment";
    const equipment = equipmentTypes.find(e => e.id === filters.equipmentTypeId);
    return equipment ? equipment.name : "Unknown Equipment";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-military-navy mb-2">Dashboard</h2>
        <p className="text-muted-foreground">
          Monitor and track military assets across bases
        </p>
        
        {/* Role-specific welcome message */}
        <RoleBasedControl allowedRoles={['admin']}>
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Administrator Access</AlertTitle>
            <AlertDescription>
              You have full access to all system features and data across all bases.
            </AlertDescription>
          </Alert>
        </RoleBasedControl>
        
        <RoleBasedControl allowedRoles={['baseCommander']}>
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Base Commander Access</AlertTitle>
            <AlertDescription>
              You have full access to manage your base's assets and personnel.
            </AlertDescription>
          </Alert>
        </RoleBasedControl>
        
        <RoleBasedControl allowedRoles={['logisticsOfficer']}>
          <Alert className="mt-4">
            <Info className="h-4 w-4" />
            <AlertTitle>Logistics Officer Access</AlertTitle>
            <AlertDescription>
              You can view inventory and manage purchases and transfers for your base.
            </AlertDescription>
          </Alert>
        </RoleBasedControl>
      </div>

      <DashboardFilters 
        onApplyFilters={setFilters} 
        initialBaseId={user?.role !== 'admin' ? user?.baseId : null}
        disableBaseSelection={user?.role !== 'admin'}
      />

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-military-navy">Asset Overview</h3>
          <p className="text-sm text-muted-foreground">
            {getBaseName()} • {getEquipmentName()} • 
            {filters.startDate ? ` From ${filters.startDate}` : " All time"}
            {filters.endDate ? ` to ${filters.endDate}` : ""}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Opening Balance"
            value={metrics.openingBalance}
            description="Beginning inventory count"
          />
          <MetricCard
            title="Net Movement"
            value={metrics.purchases + metrics.transferIn - metrics.transferOut}
            description="Purchases + Transfers In - Transfers Out"
            className="border-military-green border-2"
            onClick={() => setShowMovementsDialog(true)}
          />
          <MetricCard
            title="Currently Assigned"
            value={metrics.assigned}
            description="Equipment assigned to personnel"
          />
          <MetricCard
            title="Closing Balance"
            value={metrics.closingBalance}
            description="Current available inventory"
            className="bg-military-navy text-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Purchases</h4>
            <div className="text-2xl font-bold text-green-600">+{metrics.purchases}</div>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Transfers In</h4>
            <div className="text-2xl font-bold text-blue-600">+{metrics.transferIn}</div>
          </Card>
          <Card className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Transfers Out</h4>
            <div className="text-2xl font-bold text-orange-600">-{metrics.transferOut}</div>
          </Card>
        </div>
      </div>

      {/* Movement details dialog */}
      <MovementsDialog
        isOpen={showMovementsDialog}
        onClose={() => setShowMovementsDialog(false)}
        baseId={filters.baseId || undefined}
        equipmentTypeId={filters.equipmentTypeId || undefined}
        startDate={filters.startDate || undefined}
        endDate={filters.endDate || undefined}
      />
    </div>
  );
};

export default Dashboard;
