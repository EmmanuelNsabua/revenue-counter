"use client";

import { CreditCard, AlertCircle, ReceiptText, CheckCircle2 } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { usePaiements } from "@/hooks/use-paiements";
import { TableSkeleton } from "@/components/ui/skeletons";
import { formatCurrency, formatDateTime } from "@/lib/utils";

interface RecentPaiementsProps {
  commercantId?: number | string;
  title?: string;
  description?: string;
}

export function RecentPaiements({ 
  commercantId, 
  title = "Transactions récentes", 
  description = "Derniers paiements enregistrés" 
}: RecentPaiementsProps) {
  const router = useRouter();
  const { data: paiements, isLoading, isError } = usePaiements();

  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-3 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-destructive">Historique indisponible</p>
            <p className="text-xs text-destructive/80 max-w-[200px]">Impossible de charger les transactions.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filtrage par commerçant si ID fourni, sinon les 5 derniers globaux
  let displayTransactions = Array.isArray(paiements) ? paiements : [];
  
  if (commercantId) {
    displayTransactions = displayTransactions.filter(
      tx => tx.commercant_id.toString() === commercantId.toString()
    );
  } else {
    displayTransactions = displayTransactions.slice(0, 5);
  }

  return (
    <>
      {/* ── VUE MOBILE : pas de Card englobante, titre en texte brut ── */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <CreditCard size={16} className="text-muted-foreground" />
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} cols={1} />
        ) : displayTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/5">
            <ReceiptText className="h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">Pas de transactions récentes</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              {commercantId ? "Ce commerçant n'a pas encore de paiements enregistrés." : "Aucune transaction n'a été trouvée."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayTransactions.map((tx) => (
              <Card
                key={tx.id}
                className="cursor-pointer hover:border-primary/50 transition-colors active:scale-[0.98]"
                onClick={() => router.push(`/paiements/${tx.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        {tx.commercant?.nom || `Commerçant #${tx.commercant_id}`}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        TXN-{tx.id} — {tx.commercant?.emplacement || "Emplacement N/A"}
                      </p>
                    </div>
                    <Badge className="gap-1 flex-shrink-0">
                      <CheckCircle2 size={12} />
                      <span>Payé</span>
                    </Badge>
                  </div>

                  <div className="flex justify-between items-end border-t border-border pt-3 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {tx.taxe?.libelle || "Taxe non spécifiée"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{formatDateTime(tx.created_at)}</p>
                    </div>
                    <p className="text-xl font-bold text-foreground">{formatCurrency(tx.montant)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ── VUE DESKTOP : Card englobante avec tableau ── */}
      <Card className="hidden md:block border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <CreditCard size={16} className="text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <TableSkeleton rows={5} cols={4} />
          ) : displayTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-xl bg-muted/5">
              <ReceiptText className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <p className="text-sm font-medium text-muted-foreground">Pas de transactions récentes</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Aucune transaction n&apos;a été trouvée.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commerçant</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Date &amp; Heure</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayTransactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/paiements/${tx.id}`)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <CreditCard size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground leading-none mb-1">
                            {tx.commercant?.nom || `Commerçant #${tx.commercant_id}`}
                          </p>
                          <p className="text-[10px] font-mono text-muted-foreground">REF-{tx.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-sm">{formatCurrency(tx.montant)}</TableCell>
                    <TableCell className="text-muted-foreground text-[11px]">{formatDateTime(tx.created_at)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] h-5 bg-green-50 text-green-700 border-green-200">
                        Payé
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );
}
