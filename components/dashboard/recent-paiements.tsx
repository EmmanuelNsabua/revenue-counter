"use client";

import { CreditCard, AlertCircle, ReceiptText } from "lucide-react";
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
    <Card className="border-border/50">
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
            <p className="text-xs text-muted-foreground/60 mt-1">
              {commercantId ? "Ce commerçant n'a pas encore de paiements enregistrés." : "Aucune transaction n'a été trouvée."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Commerçant</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Date & Heure</TableHead>
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
  );
}
