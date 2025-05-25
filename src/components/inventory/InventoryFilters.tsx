
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Base } from "@/contexts/asset/types";

interface InventoryFiltersProps {
  bases: Base[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedBase: string | null;
  setSelectedBase: (baseId: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  resetFilters: () => void;
}

const InventoryFilters = ({
  bases,
  searchQuery,
  setSearchQuery,
  selectedBase,
  setSelectedBase,
  selectedCategory,
  setSelectedCategory,
  resetFilters,
}: InventoryFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-center md:w-2/3">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedBase || "all"} onValueChange={(value) => setSelectedBase(value === "all" ? null : value)}>
          <SelectTrigger className="w-full md:w-1/3">
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
        <Select value={selectedCategory || "all"} onValueChange={(value) => setSelectedCategory(value === "all" ? null : value)}>
          <SelectTrigger className="w-full md:w-1/3">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="weapon">Weapons</SelectItem>
            <SelectItem value="vehicle">Vehicles</SelectItem>
            <SelectItem value="ammunition">Ammunition</SelectItem>
            <SelectItem value="other">Other Equipment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={resetFilters} className="whitespace-nowrap">
        Reset Filters
      </Button>
    </div>
  );
};

export default InventoryFilters;
