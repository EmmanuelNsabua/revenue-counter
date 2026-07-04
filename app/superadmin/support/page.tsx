"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useTickets, useTicket, useAddTicketMessage, useUpdateTicketStatus } from "@/hooks/use-support";
import { Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { Ticket } from "@/services/support";

function SuperAdminTicketModal({ ticketId, onClose }: { ticketId: number, onClose: () => void }) {
  const { data: ticket, isLoading } = useTicket(ticketId);
  const sendMessage = useAddTicketMessage();
  const updateStatus = useUpdateTicketStatus();
  const [message, setMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!ticket) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage.mutate({ id: ticket.id, data: { message, is_internal: isInternal } }, {
      onSuccess: () => {
        setMessage("");
        setIsInternal(false);
      }
    });
  };

  const handleStatusChange = (newStatus: string) => {
    updateStatus.mutate({ id: ticket.id, data: { statut: newStatus } });
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="mb-4 flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h4 className="font-semibold text-lg">{ticket.sujet}</h4>
          <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{ticket.categorie}</Badge>
            <Badge variant="outline">Priorité: {ticket.priorite}</Badge>
            <p className="text-xs text-muted-foreground ml-2 mt-0.5">Par: {ticket.requester?.nom} ({ticket.requester?.email})</p>
          </div>
        </div>
        <div className="w-48 shrink-0">
          <Label className="text-xs mb-1 block">Statut du ticket</Label>
          <Select value={ticket.statut} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Ouvert">Ouvert</SelectItem>
              <SelectItem value="En cours">En cours</SelectItem>
              <SelectItem value="Résolu">Résolu</SelectItem>
              <SelectItem value="Fermé">Fermé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border rounded-md p-4 mb-4 bg-muted/10">
        <div className="space-y-4">
          {ticket.messages?.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.user_id !== ticket.requester_id ? 'items-end' : 'items-start'}`}>
              <div className={`px-3 py-2 rounded-lg max-w-[80%] ${
                msg.is_internal 
                  ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                  : msg.user_id !== ticket.requester_id 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold">{msg.user?.nom}</p>
                  {msg.is_internal && <Badge variant="outline" className="text-[10px] bg-amber-50 h-4 px-1">Note Interne</Badge>}
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1">
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
          ))}
          {ticket.messages?.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">Aucun message pour le moment.</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSend} className="space-y-3">
        <div className="flex items-center space-x-2 bg-muted/30 p-2 rounded-md border">
          <Switch id="internal-note-sa" checked={isInternal} onCheckedChange={setIsInternal} />
          <Label htmlFor="internal-note-sa" className="text-xs font-medium cursor-pointer flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-amber-500" />
            Note interne (invisible pour l&apos;agent)
          </Label>
        </div>
        <div className="flex gap-2">
          <Textarea 
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Taper votre réponse..." 
            className="min-h-[80px]"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>Fermer</Button>
          <Button type="submit" disabled={!message.trim() || sendMessage.isPending}>
            {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Envoyer
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function SuperAdminSupportPage() {
  const { data: tickets, isLoading } = useTickets();
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const renderTicketCard = (ticket: Ticket) => (
    <Card key={ticket.id} className="mb-3 cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedTicketId(ticket.id)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className="text-xs">{ticket.reference}</Badge>
          {ticket.priorite === 'Urgente' && <Badge variant="destructive" className="text-[10px]">Urgent</Badge>}
        </div>
        <h4 className="font-semibold text-sm mb-1 line-clamp-1">{ticket.sujet}</h4>
        <p className="text-xs text-muted-foreground mb-3">De: {ticket.requester?.nom} ({ticket.categorie})</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
          {ticket.messages_count ? (
            <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" /> {ticket.messages_count}</span>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <div className="flex items-center justify-center h-[50vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const columns = [
    { title: "Nouveaux / Ouverts", status: "Ouvert", color: "bg-blue-50/50" },
    { title: "En cours", status: "En cours", color: "bg-amber-50/50" },
    { title: "Résolus / Fermés", status: ["Résolu", "Fermé"], color: "bg-emerald-50/50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Support Helpdesk (SuperAdmin)</h1>
        <p className="text-muted-foreground">Supervision globale de tous les tickets d&apos;assistance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {columns.map(col => {
          const colTickets = tickets?.filter(t => Array.isArray(col.status) ? col.status.includes(t.statut) : t.statut === col.status) || [];
          return (
            <div key={col.title} className={`rounded-xl border ${col.color} p-4 min-h-[60vh]`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">{col.title}</h3>
                <Badge variant="secondary">{colTickets.length}</Badge>
              </div>
              <div className="space-y-3">
                {colTickets.map(renderTicketCard)}
                {colTickets.length === 0 && (
                  <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                    Aucun ticket
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={selectedTicketId !== null} onOpenChange={(open) => !open && setSelectedTicketId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails du Ticket</DialogTitle>
          </DialogHeader>
          {selectedTicketId && <SuperAdminTicketModal ticketId={selectedTicketId} onClose={() => setSelectedTicketId(null)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
