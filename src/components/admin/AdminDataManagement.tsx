
import { useState } from "react";
import { useAsset } from "@/contexts/AssetContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Building, Package, Users } from "lucide-react";
import { toast } from "sonner";

const AdminDataManagement = () => {
  const { addBase, addEquipmentType, addPersonnel, bases } = useAsset();
  const [showBaseDialog, setShowBaseDialog] = useState(false);
  const [showEquipmentDialog, setShowEquipmentDialog] = useState(false);
  const [showPersonnelDialog, setShowPersonnelDialog] = useState(false);

  // Base form state
  const [baseForm, setBaseForm] = useState({
    name: "",
    location: "",
  });

  // Equipment form state
  const [equipmentForm, setEquipmentForm] = useState({
    name: "",
    type: "",
    description: "",
  });

  // Personnel form state
  const [personnelForm, setPersonnelForm] = useState({
    name: "",
    rank: "",
    baseId: "",
  });

  // Handle base form submission
  const handleAddBase = (e: React.FormEvent) => {
    e.preventDefault();
    addBase(baseForm);
    setBaseForm({ name: "", location: "" });
    setShowBaseDialog(false);
    toast.success("Base added successfully");
  };

  // Handle equipment form submission
  const handleAddEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    addEquipmentType({
      name: equipmentForm.name,
      type: equipmentForm.type as 'weapon' | 'vehicle' | 'ammunition' | 'other',
      category: equipmentForm.type as 'weapon' | 'vehicle' | 'ammunition' | 'other',
      description: equipmentForm.description || undefined,
    });
    setEquipmentForm({ name: "", type: "", description: "" });
    setShowEquipmentDialog(false);
    toast.success("Equipment type added successfully");
  };

  // Handle personnel form submission
  const handleAddPersonnel = (e: React.FormEvent) => {
    e.preventDefault();
    addPersonnel(personnelForm);
    setPersonnelForm({ name: "", rank: "", baseId: "" });
    setShowPersonnelDialog(false);
    toast.success("Personnel added successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-military-navy mb-2">Data Management</h3>
        <p className="text-muted-foreground">
          Add new bases, equipment types, and personnel to the system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Add Base Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowBaseDialog(true)}>
          <CardHeader className="text-center">
            <Building className="h-8 w-8 mx-auto text-military-navy" />
            <CardTitle className="text-lg">Add Base</CardTitle>
            <CardDescription>Create a new military base</CardDescription>
          </CardHeader>
        </Card>

        {/* Add Equipment Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowEquipmentDialog(true)}>
          <CardHeader className="text-center">
            <Package className="h-8 w-8 mx-auto text-military-navy" />
            <CardTitle className="text-lg">Add Equipment</CardTitle>
            <CardDescription>Define new equipment types</CardDescription>
          </CardHeader>
        </Card>

        {/* Add Personnel Card */}
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowPersonnelDialog(true)}>
          <CardHeader className="text-center">
            <Users className="h-8 w-8 mx-auto text-military-navy" />
            <CardTitle className="text-lg">Add Personnel</CardTitle>
            <CardDescription>Register new personnel</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Add Base Dialog */}
      <Dialog open={showBaseDialog} onOpenChange={setShowBaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Base</DialogTitle>
            <DialogDescription>
              Create a new military base in the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddBase}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="baseName">Base Name</Label>
                <Input
                  id="baseName"
                  value={baseForm.name}
                  onChange={(e) => setBaseForm({ ...baseForm, name: e.target.value })}
                  placeholder="e.g., Fort Liberty"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="baseLocation">Location</Label>
                <Input
                  id="baseLocation"
                  value={baseForm.location}
                  onChange={(e) => setBaseForm({ ...baseForm, location: e.target.value })}
                  placeholder="e.g., North Carolina, USA"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowBaseDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Base</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Equipment Dialog */}
      <Dialog open={showEquipmentDialog} onOpenChange={setShowEquipmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Equipment Type</DialogTitle>
            <DialogDescription>
              Define a new type of equipment for tracking
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEquipment}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="equipmentName">Equipment Name</Label>
                <Input
                  id="equipmentName"
                  value={equipmentForm.name}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, name: e.target.value })}
                  placeholder="e.g., M4A1 Carbine"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="equipmentType">Category</Label>
                <Select
                  value={equipmentForm.type}
                  onValueChange={(value) => setEquipmentForm({ ...equipmentForm, type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weapon">Weapon</SelectItem>
                    <SelectItem value="vehicle">Vehicle</SelectItem>
                    <SelectItem value="ammunition">Ammunition</SelectItem>
                    <SelectItem value="other">Other Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="equipmentDescription">Description</Label>
                <Textarea
                  id="equipmentDescription"
                  value={equipmentForm.description}
                  onChange={(e) => setEquipmentForm({ ...equipmentForm, description: e.target.value })}
                  placeholder="Brief description of the equipment"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEquipmentDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Equipment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Personnel Dialog */}
      <Dialog open={showPersonnelDialog} onOpenChange={setShowPersonnelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Personnel</DialogTitle>
            <DialogDescription>
              Register new military personnel in the system
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddPersonnel}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="personnelName">Full Name</Label>
                <Input
                  id="personnelName"
                  value={personnelForm.name}
                  onChange={(e) => setPersonnelForm({ ...personnelForm, name: e.target.value })}
                  placeholder="e.g., Sgt. Williams"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="personnelRank">Rank</Label>
                <Input
                  id="personnelRank"
                  value={personnelForm.rank}
                  onChange={(e) => setPersonnelForm({ ...personnelForm, rank: e.target.value })}
                  placeholder="e.g., Sergeant"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="personnelBase">Assigned Base</Label>
                <Select
                  value={personnelForm.baseId}
                  onValueChange={(value) => setPersonnelForm({ ...personnelForm, baseId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select base" />
                  </SelectTrigger>
                  <SelectContent>
                    {bases.map((base) => (
                      <SelectItem key={base.id} value={base.id}>
                        {base.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowPersonnelDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Personnel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDataManagement;
