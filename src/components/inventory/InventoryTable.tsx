
import { Package } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Base } from "@/contexts/asset/types";

interface InventoryItem {
  baseId: string;
  baseName: string;
  equipmentTypeId: string;
  equipmentName: string;
  category: string;
  availableQuantity: number;
  assignedQuantity: number;
  totalQuantity: number;
}

interface InventoryTableProps {
  inventoryItems: InventoryItem[];
  selectedBase: string | null;
  selectedCategory: string | null;
  bases: Base[];
  searchQuery: string;
}

const InventoryTable = ({
  inventoryItems,
  selectedBase,
  selectedCategory,
  bases,
  searchQuery,
}: InventoryTableProps) => {
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'weapon':
        return 'Weapons';
      case 'vehicle':
        return 'Vehicles';
      case 'ammunition':
        return 'Ammunition';
      case 'other':
        return 'Other Equipment';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Current Inventory</CardTitle>
        <CardDescription>
          {selectedBase 
            ? `Inventory for ${bases.find(b => b.id === selectedBase)?.name || "Unknown Base"}` 
            : "Inventory across all bases"}
          {selectedCategory ? ` - ${getCategoryName(selectedCategory)} only` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Base</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Assigned</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {searchQuery ? "No matching equipment found" : "No inventory data available"}
                  </TableCell>
                </TableRow>
              ) : (
                inventoryItems.map((item, index) => (
                  <TableRow key={`${item.baseId}-${item.equipmentTypeId}-${index}`}>
                    <TableCell>{item.baseName}</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      {item.equipmentName}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{item.category}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.availableQuantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.assignedQuantity > 0 ? (
                        <span className="text-blue-600">{item.assignedQuantity}</span>
                      ) : (
                        '0'
                      )}
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {item.totalQuantity}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryTable;
