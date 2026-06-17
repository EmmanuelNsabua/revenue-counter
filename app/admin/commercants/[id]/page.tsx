"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Store, Tag, MapPin, Phone, History, CreditCard, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function AdminCommercantDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = React.use(params);
  const commercantId = id || "COM-001";
  
  const mockHistorique = [
    { date: "Hier à 14:20", agent: "Agent 001", amount: "5 000 FC", status: "Payé" },
    { date: "Il y a 2 jours", agent: "Agent 004", amount: "5 000 FC", status: "Payé" },
    { date: "Il y a 3 jours", agent: "Agent 001", amount: "0 FC", status: "Non Payé" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 md:pb-0">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={() => router.back()}
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Détails du Commerçant</h1>
          <p className="text-sm text-muted-foreground">Fiche complète et historique</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-t-4 border-t-primary h-fit">
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center text-primary">
                <Store size={24} />
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 uppercase tracking-wider text-[10px]">
                Actif
              </Badge>
            </div>
            <CardTitle className="text-xl">Boutique Mama Nene</CardTitle>
            <CardDescription className="font-mono text-xs">{commercantId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Tag size={16} className="text-muted-foreground flex-shrink-0" />
              <span>Alimentation & Vivres</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
              <span>Allée A (Marché Kenya)</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-muted-foreground flex-shrink-0" />
              <span>+243 99 123 4567</span>
            </div>
            
            <div className="pt-4 mt-4 border-t border-border">
              <Button variant="outline" className="w-full">Modifier les informations</Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-border mb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard size={18} className="text-primary" />
                Taxes Assignées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-foreground">Taxe Journalière Marché</p>
                  <p className="text-xs text-muted-foreground mt-1">Prélèvement quotidien</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">5 000 FC</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-border mb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <History size={18} className="text-primary" />
                Historique des Paiements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHistorique.map((hist, i) => (
                  <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${hist.status === "Payé" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                        {hist.status === "Payé" ? <CreditCard size={14} /> : <AlertCircle size={14} />}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{hist.date}</p>
                        <p className="text-xs text-muted-foreground">Collecté par {hist.agent}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{hist.amount}</p>
                      <Badge variant="outline" className={hist.status === "Payé" ? "bg-primary/10 text-primary border-transparent mt-1 text-[10px]" : "bg-destructive/10 text-destructive border-transparent mt-1 text-[10px]"}>
                        {hist.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-xs mt-2">Voir l&apos;historique complet</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
