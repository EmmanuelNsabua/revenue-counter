"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Store, Tag, MapPin, Phone, Building2, ShieldAlert, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useCommercant } from "@/hooks/use-commercants";
import { usePaiements } from "@/hooks/use-paiements";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function SuperAdminCommercantDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  
  const { data: commercant, isLoading: isLoadingCommercant } = useCommercant(id);
  const { data: paiements = [], isLoading: isLoadingPaiements } = usePaiements({ commercant_id: id });

  if (isLoadingCommercant) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!commercant) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <Store size={48} className="text-muted-foreground opacity-50" />
        <h2 className="text-xl font-bold">Commerçant introuvable</h2>
        <Button onClick={() => router.back()} variant="outline">Retour</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 md:pb-0">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={() => router.back()}
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Audit Commerçant</h1>
            <p className="text-sm text-muted-foreground mt-1">Inspection détaillée : {commercant.numero_document || `COM-${commercant.id}`}</p>
          </div>
        </div>
        <Button variant="destructive" className="gap-2">
          <ShieldAlert size={16} /> Suspendre
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-t-4 border-t-primary shadow-sm h-fit">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Store size={32} />
              </div>
            </div>
            <CardTitle className="text-2xl">{commercant.nom}</CardTitle>
            <CardDescription className="flex items-center gap-1.5 font-bold mt-2 text-foreground">
              <Building2 size={16} className="text-primary" /> {commercant.zone?.nom || "Zone non assignée"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Tag size={16} className="text-muted-foreground flex-shrink-0" />
              <span>{commercant.type_activite || "Non spécifié"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
              <span>{commercant.emplacement || "Non spécifié"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-muted-foreground flex-shrink-0" />
              <span>Non renseigné</span>
            </div>
            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Statut</span>
              <Badge variant={commercant.actif ? "default" : "destructive"} className="uppercase text-[10px] tracking-wider">
                {commercant.actif ? "Actif" : "Inactif"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b border-border mb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Journal d&apos;Audit & Modifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPaiements ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="animate-spin text-primary" size={24} />
                </div>
              ) : paiements.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground text-sm">
                  Aucune activité enregistrée pour ce commerçant.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Fake creation log based on commercant creation date if available */}
                  {commercant.created_at && (
                    <div className="flex justify-between items-start pb-4 border-b border-border last:border-0 last:pb-0">
                      <div>
                        <p className="font-bold text-sm text-foreground">Création Fiche</p>
                        <p className="text-xs text-muted-foreground mt-1">Système — Enregistrement initial</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                          {format(new Date(commercant.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                        </p>
                      </div>
                    </div>
                  )}

                  {paiements.map((paiement: any) => (
                    <div key={paiement.id} className="flex justify-between items-start pb-4 border-b border-border last:border-0 last:pb-0">
                      <div>
                        <p className="font-bold text-sm text-foreground flex items-center gap-2">
                          Paiement {paiement.montant} FC
                          <Badge variant="outline" className="text-[10px] h-5">{paiement.mode_paiement}</Badge>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Par : {paiement.agent?.user?.nom_complet || `Agent ${paiement.agent_id}`} — 
                          <span className={paiement.statut === "valide" ? "text-green-600 font-medium ml-1" : "text-amber-600 font-medium ml-1"}>
                            Transaction {paiement.statut}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                          {format(new Date(paiement.date_paiement || paiement.created_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
