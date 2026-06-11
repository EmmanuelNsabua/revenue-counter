import { Search, Activity, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CommercantFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function CommercantFilters({ search, onSearchChange }: CommercantFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <div className="relative w-full sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          autoFocus 
          placeholder="Rechercher par nom, code ou emplacement..." 
          className="pl-9" 
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
        <Select defaultValue="tous">
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Statut" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous les statuts</SelectItem>
            <SelectItem value="Actif">Actif</SelectItem>
            <SelectItem value="Suspendu">Suspendu</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="toutes">
          <SelectTrigger className="w-full sm:w-[180px]">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Zone" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toutes">Toutes les zones</SelectItem>
            <SelectItem value="A">Allée A</SelectItem>
            <SelectItem value="B">Allée B</SelectItem>
            <SelectItem value="C">Allée C</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
