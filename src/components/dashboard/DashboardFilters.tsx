
import React, { useState, useEffect } from 'react';
import { useAsset } from '@/contexts/AssetContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { getDateDaysAgo, getCurrentDate } from '@/lib/dateUtils';

interface FiltersProps {
  onApplyFilters: (filters: {
    baseId: string | null;
    equipmentTypeId: string | null;
    startDate: string | null;
    endDate: string | null;
  }) => void;
  initialBaseId?: string | null;
  disableBaseSelection?: boolean;
}

const DashboardFilters: React.FC<FiltersProps> = ({ 
  onApplyFilters,
  initialBaseId = null,
  disableBaseSelection = false
}) => {
  const { bases, equipmentTypes } = useAsset();
  
  const [baseId, setBaseId] = useState<string | null>(initialBaseId);
  const [equipmentTypeId, setEquipmentTypeId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  
  // Update filters if initialBaseId changes (e.g. when user logs in)
  useEffect(() => {
    if (initialBaseId !== undefined) {
      setBaseId(initialBaseId);
      
      // Also apply the filter if it changed
      if (initialBaseId !== baseId) {
        onApplyFilters({
          baseId: initialBaseId,
          equipmentTypeId,
          startDate,
          endDate,
        });
      }
    }
  }, [initialBaseId]);
  
  const handleApplyFilters = () => {
    onApplyFilters({
      baseId,
      equipmentTypeId,
      startDate,
      endDate,
    });
  };
  
  const handleReset = () => {
    // Don't reset baseId if it should be fixed based on user role
    if (!disableBaseSelection) {
      setBaseId(initialBaseId);
    }
    
    setEquipmentTypeId(null);
    setStartDate(null);
    setEndDate(null);
    
    onApplyFilters({
      baseId: disableBaseSelection ? baseId : initialBaseId,
      equipmentTypeId: null,
      startDate: null,
      endDate: null,
    });
  };
  
  const handleQuickFilter = (days: number) => {
    const end = getCurrentDate();
    const start = getDateDaysAgo(days);
    
    setStartDate(start);
    setEndDate(end);
    
    onApplyFilters({
      baseId,
      equipmentTypeId,
      startDate: start,
      endDate: end,
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Filter Options</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label htmlFor="base" className="text-sm text-muted-foreground">Base</label>
            <Select 
              value={baseId || 'all'} 
              onValueChange={(value) => setBaseId(value === 'all' ? null : value)}
              disabled={disableBaseSelection}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Bases" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bases</SelectItem>
                {bases.map((base) => (
                  <SelectItem key={base.id} value={base.id}>
                    {base.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="equipmentType" className="text-sm text-muted-foreground">Equipment Type</label>
            <Select value={equipmentTypeId || 'all'} onValueChange={(value) => setEquipmentTypeId(value === 'all' ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Equipment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Equipment</SelectItem>
                {equipmentTypes.map((equip) => (
                  <SelectItem key={equip.id} value={equip.id}>
                    {equip.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="startDate" className="text-sm text-muted-foreground">Start Date</label>
            <Input 
              id="startDate"
              type="date"
              value={startDate || ''}
              onChange={(e) => setStartDate(e.target.value || null)}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="endDate" className="text-sm text-muted-foreground">End Date</label>
            <Input 
              id="endDate"
              type="date"
              value={endDate || ''}
              onChange={(e) => setEndDate(e.target.value || null)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => handleQuickFilter(7)}>Last 7 Days</Button>
          <Button size="sm" variant="outline" onClick={() => handleQuickFilter(30)}>Last 30 Days</Button>
          <Button size="sm" variant="outline" onClick={() => handleQuickFilter(90)}>Last Quarter</Button>
          <Button size="sm" variant="outline" onClick={() => handleQuickFilter(365)}>Last Year</Button>
        </div>
        
        <div className="flex justify-between pt-2">
          <Button variant="outline" onClick={handleReset}>Reset</Button>
          <Button onClick={handleApplyFilters}>Apply Filters</Button>
        </div>
      </div>
    </Card>
  );
};

export default DashboardFilters;
