"use client";

import { CheckCircle, Search, Calendar, MapPin, ReceiptText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import type { Paiement } from "@/types/paiement";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface PaiementTableProps {
  paiements: Paiement[];
}

export function PaiementTable({ paiements }: PaiementTableProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-card p-4 rounded-xl border border-border">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Référence (ex: TXN-0091)" className="pl-9" />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
          <Select defaultValue="aujourdhui">
            <SelectTrigger className="w-full sm:w-[180px]">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aujourdhui">Aujourd'hui</SelectItem>
              <SelectItem value="hier">Hier</SelectItem>
              <SelectItem value="semaine">Cette semaine</SelectItem>
              <SelectItem value="mois">Ce mois</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="toutes">
            <SelectTrigger className="w-full sm:w-[180px]">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Zone" />
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

      {paiements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl border border-border">
          <ReceiptText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">Aucun paiement trouvé</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Modifiez vos filtres ou enregistrez une nouvelle transaction.
          </p>
        </div>
      ) : (
        <>
          {/* Vue Mobile (Cards) */}
          <div className="md:hidden space-y-4">
            {paiements.map((p) => {
              return (
                <Card 
                  key={p.id} 
                  className="cursor-pointer hover:border-primary/50 transition-colors active:scale-[0.98]"
                  onClick={() => router.push(`/paiements/${p.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold text-foreground">
                          {p.commercant?.nom || `Commerçant #${p.commercant_id}`}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">TXN-{p.id} — {p.commercant?.emplacement || "N/A"}</p>
                      </div>
                      <Badge className="gap-1 flex-shrink-0">
                        <CheckCircle size={12} />
                        <span>Payé</span>
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-end border-t border-border pt-3 mt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {p.taxe?.libelle || `Taxe #${p.taxe_id}`}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDateTime(p.created_at)}</p>
                      </div>
                      <p className="text-xl font-bold text-foreground">{formatCurrency(p.montant)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Vue Desktop (Table) */}
          <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Réf.</TableHead>
                  <TableHead>Commerçant</TableHead>
                  <TableHead>Taxe</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date & Heure</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paiements.map((p) => {
                  return (
                    <TableRow 
                      key={p.id} 
                      className="cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => router.push(`/paiements/${p.id}`)}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        TXN-{p.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {p.commercant?.nom || `Commerçant #${p.commercant_id}`}
                          </span>
                          <span className="text-xs text-muted-foreground">{p.commercant?.emplacement || "Emplacement N/A"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {p.taxe?.libelle || `Taxe #${p.taxe_id}`}
                      </TableCell>
                      <TableCell className="font-semibold text-base">{formatCurrency(p.montant)}</TableCell>
                      <TableCell>
                        <span className="text-sm">{formatDateTime(p.created_at)}</span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm uppercase">
                        {p.mode_paiement}
                      </TableCell>
                      <TableCell>
                        <Badge className="gap-1">
                          <CheckCircle size={12} />
                          Payé
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
