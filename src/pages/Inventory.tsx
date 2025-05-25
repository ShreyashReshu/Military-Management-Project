
import { useState, useEffect } from "react";
import { useAsset } from "@/contexts/AssetContext";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import InventoryTable from "@/components/inventory/InventoryTable";

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

const Inventory = () => {
  const { bases, equipmentTypes, purchases, transfers, assignments, expenditures } = useAsset();
  const [selectedBase, setSelectedBase] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  // Calculate inventory whenever data changes
  useEffect(() => {
    calculateInventory();
  }, [purchases, transfers, assignments, expenditures, selectedBase, selectedCategory, searchQuery]);

  // Calculate inventory data
  const calculateInventory = () => {
    const inventory: InventoryItem[] = [];

    // Process for each base and equipment type
    bases.forEach(base => {
      if (selectedBase && base.id !== selectedBase) return;

      equipmentTypes.forEach(equipment => {
        if (selectedCategory && equipment.category !== selectedCategory) return;
        
        // Skip if doesn't match search query
        if (searchQuery && !equipment.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

        // Calculate purchases for this base and equipment
        const totalPurchased = purchases
          .filter(p => p.baseId === base.id && p.equipmentTypeId === equipment.id)
          .reduce((sum, p) => sum + p.quantity, 0);
        
        // Calculate transfers in
        const transfersIn = transfers
          .filter(t => t.toBaseId === base.id && t.equipmentTypeId === equipment.id && t.status === 'completed')
          .reduce((sum, t) => sum + t.quantity, 0);
        
        // Calculate transfers out
        const transfersOut = transfers
          .filter(t => t.fromBaseId === base.id && t.equipmentTypeId === equipment.id && (t.status === 'completed' || t.status === 'in-transit'))
          .reduce((sum, t) => sum + t.quantity, 0);
        
        // Calculate assigned (active assignments)
        const assignedOut = assignments
          .filter(a => a.baseId === base.id && a.equipmentTypeId === equipment.id && a.status === 'active')
          .reduce((sum, a) => sum + a.quantity, 0);
        
        // Calculate expended
        const expendedOut = expenditures
          .filter(e => e.baseId === base.id && e.equipmentTypeId === equipment.id)
          .reduce((sum, e) => sum + e.quantity, 0);
        
        // Calculate total and available quantity
        const totalQuantity = totalPurchased + transfersIn - transfersOut - expendedOut;
        const availableQuantity = totalQuantity - assignedOut;
        
        // Only add to inventory if there's any history for this base/equipment
        if (totalPurchased > 0 || transfersIn > 0) {
          inventory.push({
            baseId: base.id,
            baseName: base.name,
            equipmentTypeId: equipment.id,
            equipmentName: equipment.name,
            category: equipment.category,
            availableQuantity: Math.max(0, availableQuantity),
            assignedQuantity: assignedOut,
            totalQuantity: Math.max(0, totalQuantity),
          });
        }
      });
    });

    setInventoryItems(inventory.sort((a, b) => a.baseName.localeCompare(b.baseName)));
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedBase(null);
    setSelectedCategory(null);
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-military-navy mb-2">Inventory</h2>
        <p className="text-muted-foreground">
          View current inventory status across all bases
        </p>
      </div>

      <InventoryFilters
        bases={bases}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedBase={selectedBase}
        setSelectedBase={setSelectedBase}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        resetFilters={resetFilters}
      />

      <InventoryTable
        inventoryItems={inventoryItems}
        selectedBase={selectedBase}
        selectedCategory={selectedCategory}
        bases={bases}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default Inventory;
