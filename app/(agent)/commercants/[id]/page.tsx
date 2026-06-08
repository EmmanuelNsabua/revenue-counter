import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, MapPin, Phone, CreditCard, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RecentPaiements } from "@/components/dashboard/recent-paiements"; // Reusing for history

// For next 16+ page props
type Params = Promise<{ id: string }>;

export default async function CommercantDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  
  // Mock data for specific commercant
  const commercant = {
    id: id,
    nom: "Mama Bea Mutombo",
    activite: "Alimentation",
    stand: "B-12",
    telephone: "+243 81 234 5678",
    statut: "Actif",
    zone: "Allée B",
    historiqueTotal: "124 500 FC",
    dernierPaiement: "07/06/2026",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/commercants">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h2 className="text-xl font-semibold tracking-tight">Détail du commerçant</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Store size={24} className="text-primary" />
            </div>
            <CardTitle>{commercant.nom}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-2">
              <Badge variant={commercant.statut === "Actif" ? "default" : "destructive"}>
                {commercant.statut}
              </Badge>
              <span className="font-mono text-xs">{commercant.id}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-muted-foreground" />
              <div>
                <p className="font-medium">Zone {commercant.zone}</p>
                <p className="text-muted-foreground">Stand {commercant.stand}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-muted-foreground" />
              <p>{commercant.telephone}</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Store size={16} className="text-muted-foreground" />
              <p>{commercant.activite}</p>
            </div>
            
            <div className="pt-4 border-t border-border space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Total payé (ce mois)</p>
                <p className="text-lg font-bold text-foreground">{commercant.historiqueTotal}</p>
              </div>
              <Link href={`/paiements/nouveau?commercantId=${commercant.id}`} className="block w-full">
                <Button className="w-full gap-2">
                  <Plus size={16} />
                  Nouveau paiement
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <div className="md:col-span-2">
          <RecentPaiements />
        </div>
      </div>
    </div>
  );
}
