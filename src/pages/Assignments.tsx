
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { formatDate, getCurrentDate } from "@/lib/dateUtils";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Assignments = () => {
  const { assignments, expenditures, bases, equipmentTypes, addAssignment, addExpenditure, calculateAvailableQuantity } = useAsset();
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [showExpenditureDialog, setShowExpenditureDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("assignments");

  // New assignment form state
  const [assignmentData, setAssignmentData] = useState({
    baseId: "",
    equipmentTypeId: "",
    quantity: 1,
    assignedTo: "",
    dateAssigned: getCurrentDate(), // Changed from assignedDate to dateAssigned
  });

  // New expenditure form state
  const [expenditureData, setExpenditureData] = useState({
    baseId: "",
    equipmentTypeId: "",
    quantity: 1,
    reason: "",
    date: getCurrentDate(),
    authorizedBy: "",
  });

  // Available quantity states
  const [assignmentAvailableQuantity, setAssignmentAvailableQuantity] = useState<number | null>(null);
  const [expenditureAvailableQuantity, setExpenditureAvailableQuantity] = useState<number | null>(null);

  // Assignment form handlers
  const handleAssignmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAssignmentData({ ...assignmentData, [name]: value });
  };

  const handleAssignmentSelectChange = (name: string, value: string) => {
    const newData = { ...assignmentData, [name]: value };
    setAssignmentData(newData);
    
    // Update available quantity when base or equipment type changes
    if ((name === 'baseId' || name === 'equipmentTypeId') && newData.baseId && newData.equipmentTypeId) {
      const quantity = calculateAvailableQuantity(newData.baseId, newData.equipmentTypeId);
      setAssignmentAvailableQuantity(quantity);
    }
  };

  // Expenditure form handlers
  const handleExpenditureChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpenditureData({ ...expenditureData, [name]: value });
  };

  const handleExpenditureSelectChange = (name: string, value: string) => {
    const newData = { ...expenditureData, [name]: value };
    setExpenditureData(newData);
    
    // Update available quantity when base or equipment type changes
    if ((name === 'baseId' || name === 'equipmentTypeId') && newData.baseId && newData.equipmentTypeId) {
      const quantity = calculateAvailableQuantity(newData.baseId, newData.equipmentTypeId);
      setExpenditureAvailableQuantity(quantity);
    }
  };

  // Form submit handlers
  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAssignment({
      baseId: assignmentData.baseId,
      equipmentTypeId: assignmentData.equipmentTypeId,
      quantity: Number(assignmentData.quantity),
      assignedTo: assignmentData.assignedTo,
      dateAssigned: assignmentData.dateAssigned, // Changed from assignedDate to dateAssigned
      personnelId: "", // Add missing required property
      status: "active", // Add missing required property
    });
    setShowAssignmentDialog(false);
    // Reset form
    setAssignmentData({
      baseId: "",
      equipmentTypeId: "",
      quantity: 1,
      assignedTo: "",
      dateAssigned: getCurrentDate(), // Changed from assignedDate to dateAssigned
    });
    setAssignmentAvailableQuantity(null);
  };

  const handleExpenditureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpenditure({
      baseId: expenditureData.baseId,
      equipmentTypeId: expenditureData.equipmentTypeId,
      quantity: Number(expenditureData.quantity),
      date: expenditureData.date,
      reason: expenditureData.reason,
      authorizedBy: expenditureData.authorizedBy,
    });
    setShowExpenditureDialog(false);
    // Reset form
    setExpenditureData({
      baseId: "",
      equipmentTypeId: "",
      quantity: 1,
      reason: "",
      date: getCurrentDate(),
      authorizedBy: "",
    });
    setExpenditureAvailableQuantity(null);
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

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'returned':
        return 'bg-blue-100 text-blue-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-military-navy mb-2">Assignments & Expenditures</h2>
          <p className="text-muted-foreground">
            Track asset assignments to personnel and record expenditures
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowAssignmentDialog(true)}
            className="bg-military-navy hover:bg-military-highlight"
          >
            <Users className="mr-2 h-4 w-4" /> New Assignment
          </Button>
          <Button 
            onClick={() => setShowExpenditureDialog(true)}
            variant="outline"
          >
            Record Expenditure
          </Button>
        </div>
      </div>

      {/* Tabs for Assignments and Expenditures */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="expenditures">Expenditures</TabsTrigger>
        </TabsList>
        
        {/* Assignments Tab Content */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assignment History</CardTitle>
              <CardDescription>
                Track equipment assigned to personnel
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
                        <th className="py-3 px-4 text-left font-medium">Assigned To</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {assignments.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="h-24 text-center">
                            No assignment records found
                          </td>
                        </tr>
                      ) : (
                        assignments
                          .sort((a, b) => new Date(b.dateAssigned).getTime() - new Date(a.dateAssigned).getTime()) // Changed from assignedDate to dateAssigned
                          .map((assignment) => (
                            <tr key={assignment.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">{formatDate(assignment.dateAssigned)}</td> {/* Changed from assignedDate to dateAssigned */}
                              <td className="py-3 px-4">{getBaseName(assignment.baseId)}</td>
                              <td className="py-3 px-4">{getEquipmentName(assignment.equipmentTypeId)}</td>
                              <td className="py-3 px-4 text-right font-medium">{assignment.quantity}</td>
                              <td className="py-3 px-4">{assignment.assignedTo}</td>
                              <td className="py-3 px-4">
                                <Badge className={getStatusColor(assignment.status)} variant="outline">
                                  {assignment.status}
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
        </TabsContent>
        
        {/* Expenditures Tab Content */}
        <TabsContent value="expenditures">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expenditure Records</CardTitle>
              <CardDescription>
                Track consumed or expended equipment
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
                        <th className="py-3 px-4 text-left font-medium">Reason</th>
                        <th className="py-3 px-4 text-left font-medium">Authorized By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expenditures.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="h-24 text-center">
                            No expenditure records found
                          </td>
                        </tr>
                      ) : (
                        expenditures
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((expenditure) => (
                            <tr key={expenditure.id} className="border-b hover:bg-muted/50">
                              <td className="py-3 px-4">{formatDate(expenditure.date)}</td>
                              <td className="py-3 px-4">{getBaseName(expenditure.baseId)}</td>
                              <td className="py-3 px-4">{getEquipmentName(expenditure.equipmentTypeId)}</td>
                              <td className="py-3 px-4 text-right font-medium">{expenditure.quantity}</td>
                              <td className="py-3 px-4">{expenditure.reason}</td>
                              <td className="py-3 px-4">{expenditure.authorizedBy}</td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assignment Dialog */}
      <Dialog open={showAssignmentDialog} onOpenChange={setShowAssignmentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Assign equipment to personnel or units
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAssignmentSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="baseId">Base</Label>
                <Select
                  value={assignmentData.baseId}
                  onValueChange={(value) => handleAssignmentSelectChange("baseId", value)}
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
                <Label htmlFor="equipmentTypeId">Equipment Type</Label>
                <Select
                  value={assignmentData.equipmentTypeId}
                  onValueChange={(value) => handleAssignmentSelectChange("equipmentTypeId", value)}
                  disabled={!assignmentData.baseId}
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
                {assignmentAvailableQuantity !== null && (
                  <p className="text-xs text-muted-foreground">
                    Available: {assignmentAvailableQuantity} units
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
                  max={assignmentAvailableQuantity !== null ? assignmentAvailableQuantity : undefined}
                  value={assignmentData.quantity}
                  onChange={handleAssignmentChange}
                  required
                  disabled={!assignmentData.equipmentTypeId || assignmentAvailableQuantity === 0}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assignedTo">Assigned To</Label>
                <Input
                  id="assignedTo"
                  name="assignedTo"
                  type="text"
                  value={assignmentData.assignedTo}
                  onChange={handleAssignmentChange}
                  placeholder="Person or unit name"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dateAssigned">Assignment Date</Label> {/* Changed from assignedDate to dateAssigned */}
                <Input
                  id="dateAssigned"
                  name="dateAssigned"
                  type="date"
                  value={assignmentData.dateAssigned} // Changed from assignedDate to dateAssigned
                  onChange={handleAssignmentChange}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAssignmentDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={
                  !assignmentData.baseId || 
                  !assignmentData.equipmentTypeId ||
                  !assignmentData.assignedTo ||
                  assignmentAvailableQuantity === 0
                }
              >
                Create Assignment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Expenditure Dialog */}
      <Dialog open={showExpenditureDialog} onOpenChange={setShowExpenditureDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Expenditure</DialogTitle>
            <DialogDescription>
              Record consumed or expended equipment
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExpenditureSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="baseId">Base</Label>
                <Select
                  value={expenditureData.baseId}
                  onValueChange={(value) => handleExpenditureSelectChange("baseId", value)}
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
                <Label htmlFor="equipmentTypeId">Equipment Type</Label>
                <Select
                  value={expenditureData.equipmentTypeId}
                  onValueChange={(value) => handleExpenditureSelectChange("equipmentTypeId", value)}
                  disabled={!expenditureData.baseId}
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
                {expenditureAvailableQuantity !== null && (
                  <p className="text-xs text-muted-foreground">
                    Available: {expenditureAvailableQuantity} units
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
                  max={expenditureAvailableQuantity !== null ? expenditureAvailableQuantity : undefined}
                  value={expenditureData.quantity}
                  onChange={handleExpenditureChange}
                  required
                  disabled={!expenditureData.equipmentTypeId || expenditureAvailableQuantity === 0}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="reason">Reason for Expenditure</Label>
                <Input
                  id="reason"
                  name="reason"
                  type="text"
                  value={expenditureData.reason}
                  onChange={handleExpenditureChange}
                  placeholder="e.g., Training exercise, Combat operation"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={expenditureData.date}
                  onChange={handleExpenditureChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="authorizedBy">Authorized By</Label>
                <Input
                  id="authorizedBy"
                  name="authorizedBy"
                  type="text"
                  value={expenditureData.authorizedBy}
                  onChange={handleExpenditureChange}
                  placeholder="Officer's name and rank"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowExpenditureDialog(false)}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={
                  !expenditureData.baseId || 
                  !expenditureData.equipmentTypeId ||
                  !expenditureData.reason ||
                  !expenditureData.authorizedBy ||
                  expenditureAvailableQuantity === 0
                }
              >
                Record Expenditure
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Assignments;
