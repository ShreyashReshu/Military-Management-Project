
import { Purchase, Transfer, Assignment, Expenditure, Metrics } from './types';

// Calculate available quantity for a specific base and equipment type
export const calculateAvailableQuantity = (
  baseId: string, 
  equipmentTypeId: string,
  purchases: Purchase[],
  transfers: Transfer[],
  assignments: Assignment[],
  expenditures: Expenditure[]
): number => {
  // Calculate total purchases for this base and equipment type
  const totalPurchases = purchases
    .filter(p => p.baseId === baseId && p.equipmentTypeId === equipmentTypeId)
    .reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total transfers in
  const totalTransfersIn = transfers
    .filter(t => t.toBaseId === baseId && t.equipmentTypeId === equipmentTypeId && t.status === 'completed')
    .reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total transfers out
  const totalTransfersOut = transfers
    .filter(t => t.fromBaseId === baseId && t.equipmentTypeId === equipmentTypeId && (t.status === 'completed' || t.status === 'in-transit'))
    .reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total active assignments
  const totalAssigned = assignments
    .filter(a => a.baseId === baseId && a.equipmentTypeId === equipmentTypeId && a.status === 'active')
    .reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total expenditures
  const totalExpended = expenditures
    .filter(e => e.baseId === baseId && e.equipmentTypeId === equipmentTypeId)
    .reduce((sum, item) => sum + item.quantity, 0);

  // Calculate available quantity
  return totalPurchases + totalTransfersIn - totalTransfersOut - totalAssigned - totalExpended;
};

// Calculate metrics based on filters
export const getMetrics = (
  purchases: Purchase[],
  transfers: Transfer[],
  assignments: Assignment[],
  expenditures: Expenditure[],
  baseId?: string, 
  equipmentTypeId?: string, 
  startDate?: string, 
  endDate?: string
): Metrics => {
  // Filter purchases based on criteria
  const filteredPurchases = purchases.filter(purchase => {
    return (
      (!baseId || purchase.baseId === baseId) &&
      (!equipmentTypeId || purchase.equipmentTypeId === equipmentTypeId) &&
      (!startDate || purchase.date >= startDate) &&
      (!endDate || purchase.date <= endDate)
    );
  });

  // Filter transfers based on criteria
  const filteredTransfersIn = transfers.filter(transfer => {
    return (
      transfer.status === 'completed' &&
      (!baseId || transfer.toBaseId === baseId) &&
      (!equipmentTypeId || transfer.equipmentTypeId === equipmentTypeId) &&
      (!startDate || transfer.date >= startDate) &&
      (!endDate || transfer.date <= endDate)
    );
  });

  const filteredTransfersOut = transfers.filter(transfer => {
    return (
      (transfer.status === 'completed' || transfer.status === 'in-transit') &&
      (!baseId || transfer.fromBaseId === baseId) &&
      (!equipmentTypeId || transfer.equipmentTypeId === equipmentTypeId) &&
      (!startDate || transfer.date >= startDate) &&
      (!endDate || transfer.date <= endDate)
    );
  });

  // Filter assignments based on criteria
  const filteredAssignments = assignments.filter(assignment => {
    return (
      assignment.status === 'active' &&
      (!baseId || assignment.baseId === baseId) &&
      (!equipmentTypeId || assignment.equipmentTypeId === equipmentTypeId) &&
      (!startDate || assignment.dateAssigned >= startDate) &&
      (!endDate || !assignment.dateReturned || assignment.dateReturned <= endDate)
    );
  });

  // Filter expenditures based on criteria
  const filteredExpenditures = expenditures.filter(expenditure => {
    return (
      (!baseId || expenditure.baseId === baseId) &&
      (!equipmentTypeId || expenditure.equipmentTypeId === equipmentTypeId) &&
      (!startDate || expenditure.date >= startDate) &&
      (!endDate || expenditure.date <= endDate)
    );
  });

  // Calculate totals
  const totalPurchases = filteredPurchases.reduce((sum, item) => sum + item.quantity, 0);
  const totalTransfersIn = filteredTransfersIn.reduce((sum, item) => sum + item.quantity, 0);
  const totalTransfersOut = filteredTransfersOut.reduce((sum, item) => sum + item.quantity, 0);
  const totalAssigned = filteredAssignments.reduce((sum, item) => sum + item.quantity, 0);
  const totalExpended = filteredExpenditures.reduce((sum, item) => sum + item.quantity, 0);

  // Simplified calculation - in a real system you would need to calculate
  // the opening balance based on all transactions before the start date
  const openingBalance = 0;
  const closingBalance = openingBalance + totalPurchases + totalTransfersIn - totalTransfersOut - totalExpended;

  return {
    openingBalance,
    purchases: totalPurchases,
    transferIn: totalTransfersIn,
    transferOut: totalTransfersOut,
    assigned: totalAssigned,
    expended: totalExpended,
    closingBalance
  };
};
