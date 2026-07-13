"use client";

import { useState } from "react";
import { useAuditLogs } from "@/hooks/use-audit";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/skeletons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, ChevronLeft, ChevronRight, Activity, PlusCircle, Pencil, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AuditPage() {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState("tous");
  const [modelFilter, setModelFilter] = useState("tous");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");

  const { data, isLoading } = useAuditLogs({
    page,
    per_page: 50,
    action: actionFilter !== "tous" ? actionFilter : undefined,
    model_type: modelFilter !== "tous" ? modelFilter : undefined,
    date_debut: dateDebut || undefined,
    date_fin: dateFin || undefined
  });

  const logs = data?.data || [];
  const meta = data?.meta;

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0 gap-1"><PlusCircle size={12}/> Création</Badge>;
      case 'update':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0 gap-1"><Pencil size={12}/> Modification</Badge>;
      case 'delete':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0 gap-1"><Trash2 size={12}/> Suppression</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  const formatModelType = (type: string) => {
    const parts = type.split('\\');
    return parts[parts.length - 1];
  };

  return (
    <div className="space-y-6 max-w-7xl pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="flex flex-col mb-8">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
            Journal d'Audit
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Traçabilité complète des actions effectuées sur le système.</p>
        </div>
      </BlurFade>

      <BlurFade delay={0.2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Select value={actionFilter} onValueChange={(v) => setActionFilter(v || "tous")}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Toutes les actions</SelectItem>
              <SelectItem value="create">Création</SelectItem>
              <SelectItem value="update">Modification</SelectItem>
              <SelectItem value="delete">Suppression</SelectItem>
            </SelectContent>
          </Select>

          <Select value={modelFilter} onValueChange={(v) => setModelFilter(v || "tous")}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Entité modifiée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Toutes les entités</SelectItem>
              <SelectItem value="User">Utilisateur</SelectItem>
              <SelectItem value="Paiement">Paiement</SelectItem>
              <SelectItem value="Commercant">Commerçant</SelectItem>
              <SelectItem value="Structure">Structure</SelectItem>
            </SelectContent>
          </Select>

          <Input 
            type="date"
            className="h-10" 
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
          />

          <Input 
            type="date"
            className="h-10" 
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>
      </BlurFade>

      <BlurFade delay={0.3}>
        {isLoading ? (
          <TableSkeleton rows={10} cols={6} />
        ) : (
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-primary/5 text-foreground text-xs uppercase font-bold tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5">Auteur</th>
                    <th className="px-6 py-5">Action</th>
                    <th className="px-6 py-5">Entité</th>
                    <th className="px-6 py-5">IP</th>
                    <th className="px-6 py-5 text-right">Détails</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {format(new Date(log.created_at), "dd/MM/yyyy HH:mm:ss")}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {log.user ? (
                          <div className="flex flex-col">
                            <span>{log.user.nom_complet}</span>
                            <span className="text-xs text-muted-foreground">{log.user.identifiant}</span>
                          </div>
                        ) : "Système"}
                      </td>
                      <td className="px-6 py-4">
                        {getActionBadge(log.action)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-primary">
                        {formatModelType(log.model_type)} #{log.model_id}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {log.ip_address}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Dialog>
                          <DialogTrigger render={<Button variant="ghost" size="sm" className="h-8 w-8 p-0" />}>
                            <Eye className="h-4 w-4" />
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Détails de l'action</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 bg-muted p-4 rounded-md overflow-x-auto">
                              <pre className="text-xs font-mono whitespace-pre-wrap">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        <FileText className="mx-auto h-8 w-8 opacity-20 mb-3" />
                        Aucun journal d'audit trouvé pour ces critères.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {meta && meta.last_page > 1 && (
              <div className="border-t border-border p-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Affichage {meta.current_page} sur {meta.last_page} ({meta.total} résultats)
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={meta.current_page === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Précédent
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPage(p => Math.min(meta.last_page, p + 1))}
                    disabled={meta.current_page === meta.last_page}
                  >
                    Suivant <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </BlurFade>
    </div>
  );
}
