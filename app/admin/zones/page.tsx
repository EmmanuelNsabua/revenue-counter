import { Button } from "@/components/ui/button";
import { Plus, Users, Map as MapIcon, ArrowRight, ShieldAlert, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminZonesPage() {
  const zones = [
    { id: "Z-1", name: "Allée A (Alimentation)", agentsCount: 4, shopsCount: 120, collectRate: "92%" },
    { id: "Z-2", name: "Allée B (Vêtements)", agentsCount: 6, shopsCount: 200, collectRate: "78%" },
    { id: "Z-3", name: "Allée C (Électronique)", agentsCount: 3, shopsCount: 85, collectRate: "85%" },
    { id: "Z-4", name: "Zone Extérieure Nord", agentsCount: 2, shopsCount: 50, collectRate: "60%" },
  ];

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Zones</h1>
          <p className="text-sm text-muted-foreground">Gestion du découpage territorial de votre secteur.</p>
        </div>
        <Button className="gap-2 w-full sm:w-auto">
          <Plus size={16} />
          Nouvelle Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-2 w-full bg-primary" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapIcon size={18} className="text-primary" />
                {zone.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 my-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{zone.agentsCount}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1 mt-1">
                    <Users size={12} /> Agents
                  </p>
                </div>
                <div className="text-center border-l border-r border-border">
                  <p className="text-2xl font-bold text-foreground">{zone.shopsCount}</p>
                  <p className="text-xs text-muted-foreground mt-1">Commerçants</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{zone.collectRate}</p>
                  <p className="text-xs text-muted-foreground mt-1">Taux Recouv.</p>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger className="inline-flex items-center justify-between whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full mt-2">
                  <span>Gérer les attributions</span>
                  <ArrowRight size={16} className="text-muted-foreground" />
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Attributions - {zone.name}</DialogTitle>
                    <DialogDescription>Gérez les agents autorisés à recouvrer dans cette zone.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold flex items-center justify-between">
                        Agents assignés (Actuels)
                        <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">{zone.agentsCount}</span>
                      </h4>
                      <div className="border border-border rounded-lg divide-y divide-border">
                        <div className="flex items-center justify-between p-3 bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                              <Users size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Agent 001</p>
                              <p className="text-xs text-muted-foreground">ID: AG-001</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 text-xs">Retirer</Button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                              <Users size={14} />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Agent 004</p>
                              <p className="text-xs text-muted-foreground">ID: AG-004</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive h-8 text-xs">Retirer</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border">
                      <Button className="w-full gap-2">
                        <Plus size={16} /> Ajouter un agent
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
