import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { Plus, Building2, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SuperAdminStructuresPage() {
  const structures = [
    { id: "STR-001", name: "Marché Kenya", type: "Marché Central", admins: 2, agents: 16, status: "Opérationnel" },
    { id: "STR-002", name: "Marché Mzee Laurent Désiré Kabila", type: "Marché", admins: 1, agents: 8, status: "Opérationnel" },
    { id: "STR-003", name: "Commune de Kampemba", type: "Bureau Communal", admins: 3, agents: 24, status: "Maintenance" },
  ];

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase">Structures</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestion des entités administratives de la ville.</p>
        </div>
        <ActionButton className="gap-2 w-full sm:w-auto h-12 px-6" toastMessage="Interface de création de structure (En développement)">
          <Plus size={18} />
          Ajouter une Structure
        </ActionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {structures.map((struct, i) => (
          <Card key={i} className="flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant={struct.status === "Opérationnel" ? "default" : "destructive"} className="uppercase text-[10px] tracking-wider">
                  {struct.status}
                </Badge>
                <span className="text-xs font-bold text-muted-foreground">{struct.id}</span>
              </div>
              <CardTitle className="text-xl font-bold flex items-start gap-2">
                <Building2 size={24} className="text-primary flex-shrink-0 mt-0.5" />
                {struct.name}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 mt-1 text-sm">
                <MapPin size={14} /> {struct.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end">
              <div className="bg-muted/50 rounded-lg p-4 grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Admins</p>
                  <p className="text-2xl font-black text-foreground">{struct.admins}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Agents</p>
                  <p className="text-2xl font-black text-foreground">{struct.agents}</p>
                </div>
              </div>
              <ActionButton variant="outline" className="w-full gap-2" toastMessage="Accès aux paramètres locaux...">
                Gérer la structure <ExternalLink size={14} />
              </ActionButton>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
