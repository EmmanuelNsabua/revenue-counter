"use client";

import { useState } from "react";
import { Clock, CreditCard } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { mockRecentTransactions } from "@/mocks/agent";
import { TableSkeleton } from "@/components/ui/skeletons";
import { EmptyPaiements } from "@/components/ui/empty-state";

export function RecentPaiements() {
  const router = useRouter();
  // isLoading simulé — sera remplacé par useQuery en Phase 4
  const [isLoading] = useState(false);
  const recentTransactions = mockRecentTransactions;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Transactions récentes</CardTitle>
          <CardDescription>Derniers paiements enregistrés aujourd&apos;hui</CardDescription>
        </div>
        <Clock size={16} className="text-muted-foreground" />
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
                <TableHead>Heure</TableHead>
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
                        <p className="font-medium text-foreground">{tx.commercant}</p>
                        <p className="text-xs text-muted-foreground">{tx.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{tx.montant}</TableCell>
                  <TableCell className="text-muted-foreground">{tx.heure}</TableCell>
                  <TableCell>
                    <Badge variant={tx.statut === "Payé" ? "default" : "secondary"}>
                      {tx.statut}
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
