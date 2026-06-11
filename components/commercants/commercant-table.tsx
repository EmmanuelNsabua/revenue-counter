import { Store, MapPin, Phone, MoreHorizontal, Eye, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import type { Commercant } from "@/types/commercant";
import Link from "next/link";

interface CommercantTableProps {
  commercants: Commercant[];
}

export function CommercantTable({ commercants }: CommercantTableProps) {
  if (commercants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl border border-border">
        <Store className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground">Aucun commerçant trouvé</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Modifiez vos filtres ou ajoutez un nouveau commerçant.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Vue Mobile (Cards) */}
      <div className="md:hidden space-y-4">
        {commercants.map((c) => (
          <Card key={c.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Store size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-base leading-tight">{c.nom}</h3>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{c.numero_document}</p>
                  </div>
                </div>
                <Badge variant={c.actif ? "default" : "destructive"}>
                  {c.actif ? "Actif" : "Suspendu"}
                </Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin size={14} />
                  <span>{c.emplacement}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone size={14} />
                  <span>{c.telephone || "N/A"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href={`/commercants/${c.id}`} className="w-full">
                  <Button variant="outline" className="w-full gap-2">
                    <Eye size={16} />
                    Détail
                  </Button>
                </Link>
                <Link href={`/paiements/nouveau?commercantId=${c.id}`} className="w-full">
                  <Button className="w-full gap-2">
                    <Plus size={16} />
                    Payer
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vue Desktop (Table) */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Commerçant</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Emplacement</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commercants.map((c) => (
              <TableRow key={c.id} className="hover:bg-muted/40 group">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Store size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{c.nom}</p>
                      <p className="text-xs text-muted-foreground">{c.numero_document} — {c.activite || "Divers"}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Phone size={12} />
                    {c.telephone || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1.5 text-sm">
                      <MapPin size={12} className="text-muted-foreground" />
                      {c.emplacement}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={c.actif ? "default" : "destructive"}>
                    {c.actif ? "Actif" : "Suspendu"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/paiements/nouveau?commercantId=${c.id}`}>
                    <Button size="sm" className="gap-1">
                      <Plus size={14} /> Payer
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-muted text-muted-foreground transition-colors">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Link href={`/commercants/${c.id}`} className="cursor-pointer flex items-center w-full">
                          <Eye className="mr-2 h-4 w-4" />
                          Voir détail
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
