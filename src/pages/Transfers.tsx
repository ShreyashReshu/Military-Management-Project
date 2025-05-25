
import { useState } from "react";
import { useAsset } from "@/contexts/AssetContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { formatDate, getCurrentDate } from "@/lib/dateUtils";
import { ArrowRight, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Transfers = () => {
  const { transfers, bases, equipmentTypes, addTransfer, calculateAvailableQuantity } = useAsset();
  const [showDialog, setShowDialog] = useState(false);

  // New transfer form state
  const [formData, setFormData] = useState({
    fromBaseId: "",
    toBaseId: "",
    equipmentTypeId: "",
    quantity: 1,
    date: getCurrentDate(),
    transferOrderNumber: `TO-${new Date().getFullYear()}-${String(transfers.length + 1).padStart(3, '0')}`,
  });

  // Available quantity for the selected equipment at the source base
  const [availableQuantity, setAvailableQuantity] = useState<number | null>(null);

  // Form input handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Update available quantity when from base or equipment type changes
    if ((name === 'fromBaseId' || name === 'equipmentTypeId') && newFormData.fromBaseId && newFormData.equipmentTypeId) {
      const quantity = calculateAvailableQuantity(newFormData.fromBaseId, newFormData.equipmentTypeId);
      setAvailableQuantity(quantity);
    }
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransfer({
      fromBaseId: formData.fromBaseId,
      toBaseId: formData.toBaseId,
      equipmentTypeId: formData.equipmentTypeId,
      quantity: Number(formData.quantity),
      date: formData.date,
      transferOrderNumber: formData.transferOrderNumber,
      status: 'pending', // Add the missing status property
    });
    setShowDialog(false);
    // Reset form
    setFormData({
      fromBaseId: "",
      toBaseId: "",
      equipmentTypeId: "",
      quantity: 1,
      date: getCurrentDate(),
      transferOrderNumber: `TO-${new Date().getFullYear()}-${String(transfers.length + 2).padStart(3, '0')}`,
    });
    setAvailableQuantity(null);
  };

  // Get equipment name from id
  const getEquipmentName = (id: string) => {
    const equipment = equipmentTypes.find((eq) => eq.id === id);
    return equipment ? equipment.name : 'Unknown Equipment';
  };

  // Get base name from id
  const getBaseName = (id: string) => {
    const base = bases.find((b) => b.id === id);
    return base ? base.name : 'Unknown Base';
  };

  // Get available bases for transfer destination (excluding source base)
  const getAvailableDestinationBases = () => {
    return bases.filter(base => base.id !== formData.fromBaseId);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-military-navy mb-2">Transfers</h2>
          <p className="text-muted-foreground">
            Track and manage asset movements between bases
          </p>
        </div>
        <Button 
          onClick={() => setShowDialog(true)}
          className="bg-military-navy hover:bg-military-highlight"
        >
          <Truck className="mr-2 h-4 w-4" /> New Transfer
        </Button>
      </div>

      {/* Transfer history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transfer History</CardTitle>
          <CardDescription>
            Asset movements between military bases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Date</th>
                    <th className="py-3 px-4 text-left font-medium">From</th>
                    <th className="py-3 px-4 text-center font-medium"></th>
                    <th className="py-3 px-4 text-left font-medium">To</th>
                    <th className="py-3 px-4 text-left font-medium">Equipment</th>
                    <th className="py-3 px-4 text-right font-medium">Quantity</th>
                    <th className="py-3 px-4 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transfers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="h-24 text-center">
                        No transfer records found
                      </td>
                    </tr>
                  ) : (
                    transfers
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((transfer) => (
                        <tr key={transfer.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{formatDate(transfer.date)}</td>
                          <td className="py-3 px-4">{getBaseName(transfer.fromBaseId)}</td>
                          <td className="py-3 px-0 text-center">
                            <ArrowRight className="mx-auto h-4 w-4 text-muted-foreground" />
                          </td>
                          <td className="py-3 px-4">{getBaseName(transfer.toBaseId)}</td>
                          <td className="py-3 px-4">{getEquipmentName(transfer.equipmentTypeId)}</td>
                          <td className="py-3 px-4 text-right font-medium">{transfer.quantity}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(transfer.status)} variant="outline">
                              {transfer.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Transfer Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Transfer</DialogTitle>
            <DialogDescription>
              Transfer assets between military bases
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fromBase">From Base</Label>
                <Select
                  value={formData.fromBaseId}
                  onValueChange={(value) => handleSelectChange("fromBaseId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Source Base" />
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

              <div className="grid gap-2">
                <Label htmlFor="toBase">To Base</Label>
                <Select
                  value={formData.toBaseId}
                  onValueChange={(value) => handleSelectChange("toBaseId", value)}
                  disabled={!formData.fromBaseId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Destination Base" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDestinationBases().map((base) => (
                      <SelectItem key={base.id} value={base.id}>
                        {base.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="equipment">Equipment Type</Label>
                <Select
                  value={formData.equipmentTypeId}
                  onValueChange={(value) => handleSelectChange("equipmentTypeId", value)}
                  disabled={!formData.fromBaseId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map((equipment) => (
                      <SelectItem key={equipment.id} value={equipment.id}>
                        {equipment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableQuantity !== null && (
                  <p className="text-xs text-muted-foreground">
                    Available: {availableQuantity} units
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max={availableQuantity !== null ? availableQuantity : undefined}
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  disabled={!formData.equipmentTypeId || availableQuantity === 0}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Transfer Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="transferOrderNumber">Transfer Order Number</Label>
                <Input
                  id="transferOrderNumber"
                  name="transferOrderNumber"
                  type="text"
                  value={formData.transferOrderNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={
                  !formData.fromBaseId || 
                  !formData.toBaseId || 
                  !formData.equipmentTypeId ||
                  formData.fromBaseId === formData.toBaseId ||
                  availableQuantity === 0
                }
              >
                Create Transfer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transfers;
