
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { 
  AssetContextType, 
  Base, 
  EquipmentType, 
  Purchase, 
  Transfer, 
  Assignment, 
  Expenditure, 
  Personnel 
} from './types';
import { 
  mockBases, 
  mockEquipmentTypes, 
  mockPurchases, 
  mockTransfers, 
  mockAssignments, 
  mockExpenditures, 
  mockPersonnel 
} from './mockData';
import { calculateAvailableQuantity as calcAvailableQty, getMetrics as calculateMetrics } from './assetUtils';

// Create the context
const AssetContext = createContext<AssetContextType | undefined>(undefined);

// Provider component
export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for our assets - initialize with mock data
  const [bases, setBases] = useState<Base[]>(mockBases);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>(mockEquipmentTypes);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments);
  const [expenditures, setExpenditures] = useState<Expenditure[]>(mockExpenditures);
  const [personnel, setPersonnel] = useState<Personnel[]>(mockPersonnel);

  // Sync data with Supabase and populate if empty
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Check if Supabase has data, if not populate it
        const { data: supabaseBases, error: basesError } = await supabase
          .from('bases')
          .select('*');
        
        if (basesError) {
          console.log('Using mock data - Supabase error:', basesError.message);
          return;
        }

        // If Supabase is empty, populate it with mock data
        if (!supabaseBases || supabaseBases.length === 0) {
          console.log('Populating Supabase with initial data...');
          
          // Insert bases
          const { error: insertBasesError } = await supabase
            .from('bases')
            .insert(mockBases);
          
          if (insertBasesError) {
            console.error('Error inserting bases:', insertBasesError);
          }

          // Insert equipment
          const { error: insertEquipmentError } = await supabase
            .from('equipment')
            .insert(mockEquipmentTypes.map(eq => ({
              id: eq.id,
              name: eq.name,
              type: eq.type,
              description: eq.description
            })));
          
          if (insertEquipmentError) {
            console.error('Error inserting equipment:', insertEquipmentError);
          }

          // Insert personnel with proper field mapping
          const personnelForSupabase = mockPersonnel.map(person => ({
            id: person.id,
            name: person.name,
            rank: person.rank,
            base_id: person.baseId  // Map baseId to base_id
          }));

          const { error: insertPersonnelError } = await supabase
            .from('personnel')
            .insert(personnelForSupabase);
          
          if (insertPersonnelError) {
            console.error('Error inserting personnel:', insertPersonnelError);
          }

          console.log('Initial data populated successfully');
        } else {
          // Use Supabase data if available
          setBases(supabaseBases as Base[]);
          
          // Fetch equipment
          const { data: equipmentData } = await supabase
            .from('equipment')
            .select('*');
          
          if (equipmentData && equipmentData.length > 0) {
            const formattedEquipment: EquipmentType[] = equipmentData.map(item => ({
              id: item.id,
              name: item.name,
              type: item.type,
              category: item.type,
              description: item.description || undefined
            }));
            setEquipmentTypes(formattedEquipment);
          }

          // Fetch personnel and map base_id to baseId
          const { data: personnelData } = await supabase
            .from('personnel')
            .select('*');
          
          if (personnelData && personnelData.length > 0) {
            const formattedPersonnel: Personnel[] = personnelData.map(person => ({
              id: person.id,
              name: person.name,
              rank: person.rank,
              baseId: person.base_id  // Map base_id to baseId
            }));
            setPersonnel(formattedPersonnel);
          }
        }
      } catch (error) {
        console.error('Error initializing data:', error);
        // Continue with mock data if Supabase fails
      }
    };

    initializeData();
  }, []);

  // CRUD operations
  const addBase = async (base: Omit<Base, 'id'>) => {
    const newBase = { ...base, id: uuidv4() };
    setBases([...bases, newBase]);
    
    // Sync with Supabase
    try {
      await supabase.from('bases').insert(newBase);
    } catch (error) {
      console.error('Error adding base to Supabase:', error);
    }
  };

  const addEquipmentType = async (equipmentType: Omit<EquipmentType, 'id'>) => {
    const newEquipmentType = { ...equipmentType, id: uuidv4() };
    setEquipmentTypes([...equipmentTypes, newEquipmentType]);
    
    // Sync with Supabase
    try {
      await supabase.from('equipment').insert({
        id: newEquipmentType.id,
        name: newEquipmentType.name,
        type: newEquipmentType.type,
        description: newEquipmentType.description
      });
    } catch (error) {
      console.error('Error adding equipment to Supabase:', error);
    }
  };

  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase = { ...purchase, id: uuidv4() };
    setPurchases([...purchases, newPurchase]);
  };

  const addTransfer = (transfer: Omit<Transfer, 'id'>) => {
    const newTransfer = { ...transfer, id: uuidv4() };
    setTransfers([...transfers, newTransfer]);
  };

  const addAssignment = (assignment: Omit<Assignment, 'id'>) => {
    const newAssignment = { ...assignment, id: uuidv4() };
    setAssignments([...assignments, newAssignment]);
  };

  const addExpenditure = (expenditure: Omit<Expenditure, 'id'>) => {
    const newExpenditure = { ...expenditure, id: uuidv4() };
    setExpenditures([...expenditures, newExpenditure]);
  };

  const addPersonnel = async (person: Omit<Personnel, 'id'>) => {
    const newPersonnel = { ...person, id: uuidv4() };
    setPersonnel([...personnel, newPersonnel]);
    
    // Sync with Supabase with proper field mapping
    try {
      await supabase.from('personnel').insert({
        id: newPersonnel.id,
        name: newPersonnel.name,
        rank: newPersonnel.rank,
        base_id: newPersonnel.baseId  // Map baseId to base_id
      });
    } catch (error) {
      console.error('Error adding personnel to Supabase:', error);
    }
  };

  const updateTransferStatus = (id: string, status: Transfer['status']) => {
    setTransfers(
      transfers.map(transfer => 
        transfer.id === id ? { ...transfer, status } : transfer
      )
    );
  };

  const completeAssignment = (id: string, dateReturned: string) => {
    setAssignments(
      assignments.map(assignment => 
        assignment.id === id 
          ? { ...assignment, dateReturned, status: 'returned' } 
          : assignment
      )
    );
  };

  // Wrapper functions for the utility functions
  const calculateAvailableQuantity = (baseId: string, equipmentTypeId: string): number => {
    return calcAvailableQty(baseId, equipmentTypeId, purchases, transfers, assignments, expenditures);
  };

  const getMetrics = (
    baseId?: string, 
    equipmentTypeId?: string, 
    startDate?: string, 
    endDate?: string
  ) => {
    return calculateMetrics(purchases, transfers, assignments, expenditures, baseId, equipmentTypeId, startDate, endDate);
  };

  // Create context value object
  const contextValue: AssetContextType = {
    bases,
    equipmentTypes,
    purchases,
    transfers,
    assignments,
    expenditures,
    personnel,
    
    addBase,
    addEquipmentType,
    addPurchase,
    addTransfer,
    addAssignment,
    addExpenditure,
    addPersonnel,
    
    updateTransferStatus,
    completeAssignment,
    
    getMetrics,
    calculateAvailableQuantity,
  };

  return (
    <AssetContext.Provider value={contextValue}>
      {children}
    </AssetContext.Provider>
  );
};

// Hook to use the asset context
export const useAsset = () => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAsset must be used within an AssetProvider');
  }
  return context;
};
