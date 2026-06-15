"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Store, Tag, MapPin, Phone, Building2, ShieldAlert, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuperAdminCommercantDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const commercantId = params.id || "COM-001";
  
  const auditLogs = [
    { date: "Hier à 14:20", action: "Création Fiche", by: "Admin 001", details: "RAS" },
    { date: "Hier à 15:00", action: "Paiement 5000 FC", by: "Agent 004", details: "Transaction validée" },
  ];

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
            <p className="text-sm text-muted-foreground mt-1">Inspection détaillée {commercantId}</p>
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
            <CardTitle className="text-2xl">Boutique Mama Nene</CardTitle>
            <CardDescription className="flex items-center gap-1.5 font-bold mt-2 text-foreground">
              <Building2 size={16} className="text-primary" /> Marché Kenya
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Tag size={16} className="text-muted-foreground flex-shrink-0" />
              <span>Alimentation & Vivres</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-muted-foreground flex-shrink-0" />
              <span>Allée A</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-muted-foreground flex-shrink-0" />
              <span>+243 99 123 4567</span>
            </div>
            <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
              <span className="text-sm font-semibold text-muted-foreground">Statut</span>
              <Badge variant="default" className="uppercase text-[10px] tracking-wider">Actif</Badge>
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
              <div className="space-y-4">
                {auditLogs.map((log, i) => (
                  <div key={i} className="flex justify-between items-start pb-4 border-b border-border last:border-0 last:pb-0">
                    <div>
                      <p className="font-bold text-sm text-foreground">{log.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">Par : {log.by} — {log.details}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                        {log.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
