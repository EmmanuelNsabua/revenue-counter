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
        <CardContent className="flex flex-col items-center justify-center py-10 space-y-3">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="text-sm font-medium text-destructive">Impossible de charger les transactions récentes.</p>
        </CardContent>
      </Card>
    );
  }

  // On n'affiche que les 5 dernières transactions sur le dashboard
  const recentTransactions = paiements?.slice(0, 5) || [];

  return (
    <Card>
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
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/paiements/${tx.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <CreditCard size={14} className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{tx.commercant?.nom || "Inconnu"}</p>
                        <p className="text-xs text-muted-foreground">TXN-{tx.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{formatCurrency(tx.montant)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{formatDateTime(tx.created_at)}</TableCell>
                  <TableCell>
                    <Badge>Payé</Badge>
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
