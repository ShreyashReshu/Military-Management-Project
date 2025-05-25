
// Define types for our asset management system

export interface Base {
  id: string;
  name: string;
  location: string;
}

export interface EquipmentType {
  id: string;
  name: string;
  type: 'weapon' | 'vehicle' | 'ammunition' | 'communication' | 'medical' | 'other';
  category: string; // For display purposes
  description?: string;
}

export interface Purchase {
  id: string;
  baseId: string;
  equipmentTypeId: string;
  quantity: number;
  date: string;
  purchaseOrderNumber: string;
}

export interface Transfer {
  id: string;
  fromBaseId: string;
  toBaseId: string;
  equipmentTypeId: string;
  quantity: number;
  date: string;
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled';
  notes?: string;
  transferOrderNumber?: string;
}

export interface Assignment {
  id: string;
  baseId: string;
  equipmentTypeId: string;
  personnelId: string;
  quantity: number;
  dateAssigned: string;
  dateReturned?: string;
  status: 'active' | 'returned' | 'lost';
  notes?: string;
  assignedTo?: string;
}

export interface Expenditure {
  id: string;
  baseId: string;
  equipmentTypeId: string;
  quantity: number;
  date: string;
  reason: string;
  notes?: string;
  authorizedBy?: string;
}

export interface Personnel {
  id: string;
  name: string;
  rank: string;
  baseId: string;
}

export interface Metrics {
  openingBalance: number;
  purchases: number;
  transferIn: number;
  transferOut: number;
  assigned: number;
  expended: number;
  closingBalance: number;
}

export interface AssetContextType {
  bases: Base[];
  equipmentTypes: EquipmentType[];
  purchases: Purchase[];
  transfers: Transfer[];
  assignments: Assignment[];
  expenditures: Expenditure[];
  personnel: Personnel[];
  
  // CRUD operations
  addBase: (base: Omit<Base, 'id'>) => void;
  addEquipmentType: (equipmentType: Omit<EquipmentType, 'id'>) => void;
  addPurchase: (purchase: Omit<Purchase, 'id'>) => void;
  addTransfer: (transfer: Omit<Transfer, 'id'>) => void;
  addAssignment: (assignment: Omit<Assignment, 'id'>) => void;
  addExpenditure: (expenditure: Omit<Expenditure, 'id'>) => void;
  addPersonnel: (personnel: Omit<Personnel, 'id'>) => void;
  
  updateTransferStatus: (id: string, status: Transfer['status']) => void;
  completeAssignment: (id: string, dateReturned: string) => void;
  
  // Calculations
  getMetrics: (
    baseId?: string,
    equipmentTypeId?: string,
    startDate?: string,
    endDate?: string
  ) => Metrics;
  calculateAvailableQuantity: (baseId: string, equipmentTypeId: string) => number;
}
