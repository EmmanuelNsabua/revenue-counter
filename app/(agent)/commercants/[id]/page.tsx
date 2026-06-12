"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, MapPin, Phone, Plus, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { RecentPaiements } from "@/components/dashboard/recent-paiements";
import { useCommercant } from "@/hooks/use-commercants";
import React from "react";

export default function CommercantDetailPage({ params }: { params: any }) {
  const { id } = React.use(params) as { id: string };
  const { data: commercant, isLoading, isError } = useCommercant(id);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-muted-foreground mt-4">Chargement du profil...</p>
      </div>
    );
  }

  if (isError || !commercant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Profil introuvable</h3>
          <p className="text-muted-foreground">Ce commerçant n'existe pas ou a été supprimé.</p>
        </div>
        <Link href="/commercants">
          <Button variant="outline">Retour à la liste</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16 md:pb-0">
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
              <Badge variant={commercant.actif ? "default" : "destructive"}>
                {commercant.actif ? "Actif" : "Suspendu"}
              </Badge>
              <span className="font-mono text-xs">{commercant.numero_document}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-muted-foreground" />
              <div>
                <p className="font-medium">{commercant.emplacement}</p>
                <p className="text-muted-foreground">Marché Kenya</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-muted-foreground" />
              <p>{commercant.telephone || "Non renseigné"}</p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Store size={16} className="text-muted-foreground" />
              <p>{commercant.activite || "Activités diverses"}</p>
            </div>
            
            <div className="pt-4 border-t border-border space-y-3">
              <Link href={`/paiements/nouveau?commercantDoc=${commercant.numero_document}`} className="block w-full">
                <Button className="w-full gap-2">
                  <Plus size={16} />
                  Enregistrer un paiement
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* History Table */}
        <div className="md:col-span-2">
          <RecentPaiements 
            commercantId={commercant.id} 
            title="Historique des paiements"
            description={`Dernières transactions de ${commercant.nom}`}
          />
        </div>
      </div>
    </div>
  );
}
