"use client";

import { Clock, CreditCard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function RecentPaiements() {
  const router = useRouter();
  
  const recentTransactions = [
    { id: "TXN-0091", commercant: "Mama Bea — Stand B12", montant: "3 500 FC", statut: "Payé", heure: "08:14" },
    { id: "TXN-0090", commercant: "Dépôt Weza — Allée C", montant: "7 000 FC", statut: "Payé", heure: "08:02" },
    { id: "TXN-0089", commercant: "Boucherie Kapolowe", montant: "5 500 FC", statut: "Payé", heure: "07:48" },
    { id: "TXN-0088", commercant: "Épicerie Lukusa", montant: "3 500 FC", statut: "En attente", heure: "07:30" },
    { id: "TXN-0087", commercant: "Salon Mbote", montant: "3 500 FC", statut: "Payé", heure: "07:15" },
  ];

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
      </CardContent>
    </Card>
  );
}
