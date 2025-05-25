
import React, { useMemo } from 'react';
import { useAsset } from '@/contexts/AssetContext';
import { formatDate } from '@/lib/dateUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';

interface MovementsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  baseId?: string;
  equipmentTypeId?: string;
  startDate?: string;
  endDate?: string;
}

const MovementsDialog: React.FC<MovementsDialogProps> = ({
  isOpen,
  onClose,
  baseId,
  equipmentTypeId,
  startDate,
  endDate,
}) => {
  const { purchases, transfers, bases, equipmentTypes } = useAsset();
  
  // Get base and equipment names for display
  const getBaseName = (id: string) => {
    const base = bases.find(b => b.id === id);
    return base ? base.name : 'Unknown Base';
  };
  
  const getEquipmentName = (id: string) => {
    const equipment = equipmentTypes.find(e => e.id === id);
    return equipment ? equipment.name : 'Unknown Equipment';
  };

  // Filter purchases based on criteria
  const filteredPurchases = useMemo(() => 
    purchases.filter(purchase => {
      return (
        (!baseId || purchase.baseId === baseId) &&
        (!equipmentTypeId || purchase.equipmentTypeId === equipmentTypeId) &&
        (!startDate || purchase.date >= startDate) &&
        (!endDate || purchase.date <= endDate)
      );
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [purchases, baseId, equipmentTypeId, startDate, endDate]);

  // Filter transfers based on criteria
  const filteredTransfersIn = useMemo(() => 
    transfers.filter(transfer => {
      return (
        transfer.status === 'completed' &&
        (!baseId || transfer.toBaseId === baseId) &&
        (!equipmentTypeId || transfer.equipmentTypeId === equipmentTypeId) &&
        (!startDate || transfer.date >= startDate) &&
        (!endDate || transfer.date <= endDate)
      );
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [transfers, baseId, equipmentTypeId, startDate, endDate]);

  const filteredTransfersOut = useMemo(() => 
    transfers.filter(transfer => {
      return (
        (transfer.status === 'completed' || transfer.status === 'in-transit') &&
        (!baseId || transfer.fromBaseId === baseId) &&
        (!equipmentTypeId || transfer.equipmentTypeId === equipmentTypeId) &&
        (!startDate || transfer.date >= startDate) &&
        (!endDate || transfer.date <= endDate)
      );
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
  [transfers, baseId, equipmentTypeId, startDate, endDate]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Asset Movement Details</DialogTitle>
          <DialogDescription>
            Detailed view of purchases and transfers
            {baseId ? ` for ${getBaseName(baseId)}` : ' across all bases'}
            {equipmentTypeId ? ` - ${getEquipmentName(equipmentTypeId)}` : ''}
            {startDate ? ` from ${formatDate(startDate)}` : ''}
            {endDate ? ` to ${formatDate(endDate)}` : ''}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 my-4">
          {/* Purchases Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Package className="mr-2 h-5 w-5 text-green-600" />
              Purchases
            </h3>
            
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Base</th>
                    <th className="p-2 text-left">Equipment</th>
                    <th className="p-2 text-right">Quantity</th>
                    <th className="p-2 text-left">Order #</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No purchases found for the selected criteria
                      </td>
                    </tr>
                  ) : (
                    filteredPurchases.map((purchase) => (
                      <tr key={purchase.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{formatDate(purchase.date)}</td>
                        <td className="p-2">{getBaseName(purchase.baseId)}</td>
                        <td className="p-2">{getEquipmentName(purchase.equipmentTypeId)}</td>
                        <td className="p-2 text-right font-medium">{purchase.quantity}</td>
                        <td className="p-2 text-muted-foreground">{purchase.purchaseOrderNumber}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Transfers In Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <ArrowDownRight className="mr-2 h-5 w-5 text-blue-600" />
              Transfers In
            </h3>
            
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">From Base</th>
                    <th className="p-2 text-left">To Base</th>
                    <th className="p-2 text-left">Equipment</th>
                    <th className="p-2 text-right">Quantity</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransfersIn.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No transfers in found for the selected criteria
                      </td>
                    </tr>
                  ) : (
                    filteredTransfersIn.map((transfer) => (
                      <tr key={transfer.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{formatDate(transfer.date)}</td>
                        <td className="p-2">{getBaseName(transfer.fromBaseId)}</td>
                        <td className="p-2">{getBaseName(transfer.toBaseId)}</td>
                        <td className="p-2">{getEquipmentName(transfer.equipmentTypeId)}</td>
                        <td className="p-2 text-right font-medium">{transfer.quantity}</td>
                        <td className="p-2">
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {transfer.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Transfers Out Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <ArrowUpRight className="mr-2 h-5 w-5 text-orange-600" />
              Transfers Out
            </h3>
            
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">From Base</th>
                    <th className="p-2 text-left">To Base</th>
                    <th className="p-2 text-left">Equipment</th>
                    <th className="p-2 text-right">Quantity</th>
                    <th className="p-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransfersOut.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        No transfers out found for the selected criteria
                      </td>
                    </tr>
                  ) : (
                    filteredTransfersOut.map((transfer) => (
                      <tr key={transfer.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">{formatDate(transfer.date)}</td>
                        <td className="p-2">{getBaseName(transfer.fromBaseId)}</td>
                        <td className="p-2">{getBaseName(transfer.toBaseId)}</td>
                        <td className="p-2">{getEquipmentName(transfer.equipmentTypeId)}</td>
                        <td className="p-2 text-right font-medium">{transfer.quantity}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transfer.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {transfer.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovementsDialog;
