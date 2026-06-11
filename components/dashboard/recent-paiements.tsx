"use client";

import { CreditCard, AlertCircle } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { usePaiements } from "@/hooks/use-paiements";
import { TableSkeleton } from "@/components/ui/skeletons";
import { EmptyPaiements } from "@/components/ui/empty-state";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export function RecentPaiements() {
  const router = useRouter();
  const { data: paiements, isLoading, isError } = usePaiements();

  if (isError) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-3 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <div>
            <p className="text-sm font-semibold text-destructive">Historique indisponible</p>
            <p className="text-xs text-destructive/80 max-w-[200px]">Impossible de charger vos dernières transactions.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // On n'affiche que les 5 dernières transactions sur le dashboard
  const recentTransactions = Array.isArray(paiements) ? paiements.slice(0, 5) : [];

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Transactions récentes</CardTitle>
          <CardDescription>Derniers paiements enregistrés</CardDescription>
        </div>
        <CreditCard size={16} className="text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : recentTransactions.length === 0 ? (
          <EmptyPaiements />
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
              {recentTransactions.map((tx) => (
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
