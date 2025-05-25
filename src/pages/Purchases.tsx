
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
import { Package } from "lucide-react";

const Purchases = () => {
  const { purchases, bases, equipmentTypes, addPurchase } = useAsset();
  const [showDialog, setShowDialog] = useState(false);

  // New purchase form state
  const [formData, setFormData] = useState({
    baseId: "",
    equipmentTypeId: "",
    quantity: 1,
    date: getCurrentDate(),
    purchaseOrderNumber: `PO-${new Date().getFullYear()}-${String(purchases.length + 1).padStart(3, '0')}`,
  });

  // Form input handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPurchase({
      baseId: formData.baseId,
      equipmentTypeId: formData.equipmentTypeId,
      quantity: Number(formData.quantity),
      date: formData.date,
      purchaseOrderNumber: formData.purchaseOrderNumber,
    });
    setShowDialog(false);
    // Reset form
    setFormData({
      baseId: "",
      equipmentTypeId: "",
      quantity: 1,
      date: getCurrentDate(),
      purchaseOrderNumber: `PO-${new Date().getFullYear()}-${String(purchases.length + 2).padStart(3, '0')}`,
    });
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-military-navy mb-2">Purchases</h2>
          <p className="text-muted-foreground">
            Record and manage asset purchases
          </p>
        </div>
        <Button 
          onClick={() => setShowDialog(true)}
          className="bg-military-green hover:bg-military-green/90"
        >
          <Package className="mr-2 h-4 w-4" /> Record Purchase
        </Button>
      </div>

      {/* Purchase history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Purchase History</CardTitle>
          <CardDescription>
            Recent asset acquisitions across all bases
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left font-medium">Date</th>
                    <th className="py-3 px-4 text-left font-medium">Base</th>
                    <th className="py-3 px-4 text-left font-medium">Equipment</th>
                    <th className="py-3 px-4 text-right font-medium">Quantity</th>
                    <th className="py-3 px-4 text-left font-medium">Order #</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="h-24 text-center">
                        No purchase records found
                      </td>
                    </tr>
                  ) : (
                    purchases
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((purchase) => (
                        <tr key={purchase.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{formatDate(purchase.date)}</td>
                          <td className="py-3 px-4">{getBaseName(purchase.baseId)}</td>
                          <td className="py-3 px-4">{getEquipmentName(purchase.equipmentTypeId)}</td>
                          <td className="py-3 px-4 text-right font-medium">{purchase.quantity}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{purchase.purchaseOrderNumber}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Purchase Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record New Purchase</DialogTitle>
            <DialogDescription>
              Add newly acquired assets to inventory
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="base">Base Location</Label>
                <Select
                  value={formData.baseId}
                  onValueChange={(value) => handleSelectChange("baseId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Base" />
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
                <Label htmlFor="equipment">Equipment Type</Label>
                <Select
                  value={formData.equipmentTypeId}
                  onValueChange={(value) => handleSelectChange("equipmentTypeId", value)}
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
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Purchase Date</Label>
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
                <Label htmlFor="purchaseOrderNumber">Purchase Order Number</Label>
                <Input
                  id="purchaseOrderNumber"
                  name="purchaseOrderNumber"
                  type="text"
                  value={formData.purchaseOrderNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Purchase</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Purchases;
