"use client";

import { useState } from "react";
import { ActionButton } from "@/components/ui/action-button";
import { Plus, Building2, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useStructures } from "@/hooks/use-structures";
import { CardGridSkeleton } from "@/components/ui/skeletons";
import { EmptyState } from "@/components/ui/empty-state";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function SuperAdminStructuresPage() {
  const { data: structures = [], isLoading } = useStructures();
  const [selectedMapUrl, setSelectedMapUrl] = useState<string | null>(null);

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight uppercase">Structures</h1>
            <p className="text-sm text-muted-foreground mt-1">Gestion des entités administratives de la ville.</p>
          </div>
          <Link href="/superadmin/structures/create" className="w-full sm:w-auto">
            <Button className="gap-2 w-full h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus size={18} />
              Ajouter une Structure
            </Button>
          </Link>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        {isLoading ? (
          <CardGridSkeleton count={3} cols={3} />
        ) : structures.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Aucune structure enregistrée"
            description="Aucune entité administrative n'a encore été créée dans le système."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {structures.map((structure: any, index: number) => (
              <BlurFade key={structure.id} delay={0.2 + index * 0.05}>
                <Card className="flex flex-col h-full">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="default" className="uppercase text-[10px] tracking-wider">
                        Actif
                      </Badge>
                      <span className="text-xs font-bold text-muted-foreground">ID-{structure.id}</span>
                    </div>
                    <CardTitle className="text-xl font-bold flex items-start gap-2">
                      <Building2 size={24} className="text-primary flex-shrink-0 mt-0.5" />
                      {structure.nom}
                    </CardTitle>
                    <CardDescription 
                      className="flex items-center gap-1 mt-1 text-sm text-blue-500 hover:underline cursor-pointer"
                      onClick={() => structure.localisation && setSelectedMapUrl(structure.localisation)}
                    >
                      <MapPin size={14} /> Localisation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="bg-muted/50 rounded-lg p-4 grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Admins</p>
                        <p className="text-2xl font-black text-foreground">{structure.admins_count || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Agents</p>
                        <p className="text-2xl font-black text-foreground">{structure.agents_count || 0}</p>
                      </div>
                    </div>
                    <Link href={`/superadmin/structures/${structure.id}`} className="w-full">
                      <Button variant="outline" className="w-full gap-2">
                        Gérer la structure <ExternalLink size={14} />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </BlurFade>
            ))}
          </div>
        )}
      </BlurFade>

      <Dialog open={!!selectedMapUrl} onOpenChange={(open) => !open && setSelectedMapUrl(null)}>
        <DialogContent className="sm:max-w-[800px] w-[90vw] p-0 overflow-hidden rounded-xl border-0">
          <DialogHeader className="p-4 border-b bg-card absolute top-0 w-full z-10 opacity-95">
            <DialogTitle>Localisation de la Structure</DialogTitle>
            <DialogDescription className="sr-only">Carte Google Maps de la structure</DialogDescription>
          </DialogHeader>
          <div className="w-full h-[60vh] sm:h-[70vh] bg-muted mt-[60px]">
            {selectedMapUrl && (
              <iframe
                src={selectedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
