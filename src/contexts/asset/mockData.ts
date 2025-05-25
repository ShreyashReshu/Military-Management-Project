
import { Base, EquipmentType, Purchase, Transfer, Assignment, Expenditure, Personnel } from './types';

// Sample bases
export const mockBases: Base[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Fort Liberty',
    location: 'North Carolina, USA'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Camp Pendleton',
    location: 'California, USA'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Joint Base Lewis-McChord',
    location: 'Washington, USA'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    name: 'Fort Bragg',
    location: 'North Carolina, USA'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    name: 'Naval Station Norfolk',
    location: 'Virginia, USA'
  }
];

// Sample equipment types
export const mockEquipmentTypes: EquipmentType[] = [
  {
    id: '650e8400-e29b-41d4-a716-446655440001',
    name: 'M4A1 Carbine',
    type: 'weapon',
    category: 'weapon',
    description: 'Standard issue assault rifle'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440002',
    name: 'Humvee',
    type: 'vehicle',
    category: 'vehicle',
    description: 'High Mobility Multipurpose Wheeled Vehicle'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440003',
    name: '5.56mm Ammunition',
    type: 'ammunition',
    category: 'ammunition',
    description: 'Standard rifle ammunition (rounds)'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440004',
    name: 'Night Vision Goggles',
    type: 'other',
    category: 'other',
    description: 'AN/PVS-14 Night Vision Monocular'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440005',
    name: 'Bradley Fighting Vehicle',
    type: 'vehicle',
    category: 'vehicle',
    description: 'Infantry Fighting Vehicle'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440006',
    name: 'M249 SAW',
    type: 'weapon',
    category: 'weapon',
    description: 'Squad Automatic Weapon'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440007',
    name: 'Medical Kit',
    type: 'medical',
    category: 'medical',
    description: 'Field Medical Supply Kit'
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440008',
    name: 'Radio Set',
    type: 'communication',
    category: 'communication',
    description: 'PRC-152 Multiband Handheld Radio'
  }
];

// Sample purchases
export const mockPurchases: Purchase[] = [
  {
    id: 'p1',
    baseId: '550e8400-e29b-41d4-a716-446655440001',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440001',
    quantity: 150,
    date: '2024-01-15',
    purchaseOrderNumber: 'PO-2024-001'
  },
  {
    id: 'p2',
    baseId: '550e8400-e29b-41d4-a716-446655440001',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440002',
    quantity: 25,
    date: '2024-01-20',
    purchaseOrderNumber: 'PO-2024-002'
  },
  {
    id: 'p3',
    baseId: '550e8400-e29b-41d4-a716-446655440002',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440001',
    quantity: 100,
    date: '2024-01-25',
    purchaseOrderNumber: 'PO-2024-003'
  },
  {
    id: 'p4',
    baseId: '550e8400-e29b-41d4-a716-446655440002',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440003',
    quantity: 10000,
    date: '2024-02-01',
    purchaseOrderNumber: 'PO-2024-004'
  },
  {
    id: 'p5',
    baseId: '550e8400-e29b-41d4-a716-446655440003',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440004',
    quantity: 50,
    date: '2024-02-05',
    purchaseOrderNumber: 'PO-2024-005'
  },
  {
    id: 'p6',
    baseId: '550e8400-e29b-41d4-a716-446655440001',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440006',
    quantity: 30,
    date: '2024-02-10',
    purchaseOrderNumber: 'PO-2024-006'
  },
  {
    id: 'p7',
    baseId: '550e8400-e29b-41d4-a716-446655440003',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440007',
    quantity: 75,
    date: '2024-02-15',
    purchaseOrderNumber: 'PO-2024-007'
  },
  {
    id: 'p8',
    baseId: '550e8400-e29b-41d4-a716-446655440002',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440008',
    quantity: 40,
    date: '2024-02-20',
    purchaseOrderNumber: 'PO-2024-008'
  }
];

// Sample transfers
export const mockTransfers: Transfer[] = [
  {
    id: 't1',
    fromBaseId: '550e8400-e29b-41d4-a716-446655440001',
    toBaseId: '550e8400-e29b-41d4-a716-446655440002',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440001',
    quantity: 25,
    date: '2024-02-10',
    status: 'completed',
    transferOrderNumber: 'TO-2024-001',
    notes: 'Transfer for training exercise'
  },
  {
    id: 't2',
    fromBaseId: '550e8400-e29b-41d4-a716-446655440002',
    toBaseId: '550e8400-e29b-41d4-a716-446655440003',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440004',
    quantity: 10,
    date: '2024-02-15',
    status: 'completed',
    transferOrderNumber: 'TO-2024-002',
    notes: 'Night operations requirement'
  },
  {
    id: 't3',
    fromBaseId: '550e8400-e29b-41d4-a716-446655440001',
    toBaseId: '550e8400-e29b-41d4-a716-446655440003',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440002',
    quantity: 5,
    date: '2024-02-20',
    status: 'in-transit',
    transferOrderNumber: 'TO-2024-003',
    notes: 'Equipment redistribution'
  },
  {
    id: 't4',
    fromBaseId: '550e8400-e29b-41d4-a716-446655440003',
    toBaseId: '550e8400-e29b-41d4-a716-446655440001',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440007',
    quantity: 15,
    date: '2024-02-25',
    status: 'completed',
    transferOrderNumber: 'TO-2024-004',
    notes: 'Medical supply redistribution'
  }
];

// Sample personnel
export const mockPersonnel: Personnel[] = [
  {
    id: '750e8400-e29b-41d4-a716-446655440001',
    name: 'Sgt. Williams',
    rank: 'Sergeant',
    baseId: '550e8400-e29b-41d4-a716-446655440001'
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440002',
    name: 'Cpl. Davis',
    rank: 'Corporal',
    baseId: '550e8400-e29b-41d4-a716-446655440002'
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440003',
    name: 'Lt. Brown',
    rank: 'Lieutenant',
    baseId: '550e8400-e29b-41d4-a716-446655440003'
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440004',
    name: 'Capt. Johnson',
    rank: 'Captain',
    baseId: '550e8400-e29b-41d4-a716-446655440001'
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440005',
    name: 'Sgt. Miller',
    rank: 'Sergeant',
    baseId: '550e8400-e29b-41d4-a716-446655440002'
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440006',
    name: 'Pvt. Wilson',
    rank: 'Private',
    baseId: '550e8400-e29b-41d4-a716-446655440003'
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440007',
    name: 'Col. Anderson',
    rank: 'Colonel',
    baseId: '550e8400-e29b-41d4-a716-446655440001'
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440008',
    name: 'Maj. Thompson',
    rank: 'Major',
    baseId: '550e8400-e29b-41d4-a716-446655440002'
  }
];

// Sample assignments
export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    baseId: '550e8400-e29b-41d4-a716-446655440001',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440001',
    personnelId: '750e8400-e29b-41d4-a716-446655440001',
    quantity: 2,
    dateAssigned: '2024-02-12',
    status: 'active',
    assignedTo: 'Sgt. Williams',
    notes: 'Assigned for patrol duty'
  },
  {
    id: 'a2',
    baseId: '550e8400-e29b-41d4-a716-446655440002',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440001',
    personnelId: '750e8400-e29b-41d4-a716-446655440002',
    quantity: 1,
    dateAssigned: '2024-02-14',
    status: 'active',
    assignedTo: 'Cpl. Davis',
    notes: 'Training assignment'
  },
  {
    id: 'a3',
    baseId: '550e8400-e29b-41d4-a716-446655440003',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440004',
    personnelId: '750e8400-e29b-41d4-a716-446655440003',
    quantity: 1,
    dateAssigned: '2024-02-16',
    status: 'active',
    assignedTo: 'Lt. Brown',
    notes: 'Night operations'
  },
  {
    id: 'a4',
    baseId: '550e8400-e29b-41d4-a716-446655440001',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440006',
    personnelId: '750e8400-e29b-41d4-a716-446655440004',
    quantity: 1,
    dateAssigned: '2024-02-18',
    status: 'active',
    assignedTo: 'Capt. Johnson',
    notes: 'Squad support weapon'
  },
  {
    id: 'a5',
    baseId: '550e8400-e29b-41d4-a716-446655440001',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440001',
    personnelId: '750e8400-e29b-41d4-a716-446655440007',
    quantity: 1,
    dateAssigned: '2024-01-20',
    dateReturned: '2024-02-01',
    status: 'returned',
    assignedTo: 'Col. Anderson',
    notes: 'Temporary assignment for inspection'
  }
];

// Sample expenditures
export const mockExpenditures: Expenditure[] = [
  {
    id: 'e1',
    baseId: '550e8400-e29b-41d4-a716-446655440002',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440003',
    quantity: 2500,
    date: '2024-02-25',
    reason: 'Training exercise consumption',
    authorizedBy: 'Maj. Thompson',
    notes: 'Live fire exercise'
  },
  {
    id: 'e2',
    baseId: '550e8400-e29b-41d4-a716-446655440001',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440007',
    quantity: 10,
    date: '2024-02-28',
    reason: 'Medical supplies used',
    authorizedBy: 'Col. Anderson',
    notes: 'Field medical training'
  },
  {
    id: 'e3',
    baseId: '550e8400-e29b-41d4-a716-446655440003',
    equipmentTypeId: '650e8400-e29b-41d4-a716-446655440008',
    quantity: 5,
    date: '2024-03-01',
    reason: 'Equipment damaged during exercise',
    authorizedBy: 'Lt. Brown',
    notes: 'Water damage during field training'
  }
];
