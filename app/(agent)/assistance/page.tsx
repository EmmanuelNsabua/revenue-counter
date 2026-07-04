"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTickets, useCreateTicket, useTicket, useAddTicketMessage } from "@/hooks/use-support";
import { LifeBuoy, Send, Phone, Mail, MapPin, Info, Loader2, Plus, MessageSquare } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { RippleButton } from "@/components/magicui/ripple-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

function TicketChat({ ticketId }: { ticketId: number }) {
  const { data: ticket, isLoading } = useTicket(ticketId);
  const sendMessage = useAddTicketMessage();
  const [message, setMessage] = useState("");

  if (isLoading) return <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!ticket) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage.mutate({ id: ticket.id, data: { message } }, {
      onSuccess: () => setMessage("")
    });
  };

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="mb-4">
        <h4 className="font-semibold">{ticket.sujet}</h4>
        <p className="text-sm text-muted-foreground">{ticket.description}</p>
        <div className="flex gap-2 mt-2">
          <Badge variant={ticket.statut === "Résolu" || ticket.statut === "Fermé" ? "secondary" : "default"}>
            {ticket.statut}
          </Badge>
          <Badge variant="outline">{ticket.categorie}</Badge>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-4 border rounded-md p-4 mb-4 bg-muted/20">
        <div className="space-y-4">
          {ticket.messages?.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.user_id === ticket.requester_id ? 'items-end' : 'items-start'}`}>
              <div className={`px-3 py-2 rounded-lg max-w-[80%] ${msg.user_id === ticket.requester_id ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                <p className="text-sm font-semibold mb-1">{msg.user?.nom}</p>
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
      <form onSubmit={handleSend} className="flex gap-2">
        <Input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Taper votre réponse..." 
          disabled={ticket.statut === 'Fermé'}
        />
        <Button type="submit" disabled={!message.trim() || sendMessage.isPending || ticket.statut === 'Fermé'}>
          {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
}

export default function AssistancePage() {
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  
  const [sujet, setSujet] = useState("");
  const [categorie, setCategorie] = useState("");
  const [description, setDescription] = useState("");
  
  const { data: tickets, isLoading: isTicketsLoading } = useTickets();
  const createTicket = useCreateTicket();

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sujet.trim() || !description.trim() || !categorie) return;

    createTicket.mutate(
      { sujet, description, categorie, priorite: "Normale" },
      {
        onSuccess: () => {
          setSujet("");
          setDescription("");
          setCategorie("");
          setIsNewTicketOpen(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
            <LifeBuoy className="h-8 w-8 text-primary" />
            Assistance & Support
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez vos tickets, obtenez de l&apos;aide ou consultez la FAQ.
          </p>
        </div>
      </BlurFade>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <BlurFade delay={0.2}>
            {/* Tickets Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Mes Tickets</CardTitle>
                  <CardDescription>Suivi de vos demandes d&apos;assistance.</CardDescription>
                </div>
                <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
                  <DialogTrigger 
                    render={<Button size="sm" className="gap-2" />}
                  >
                    <Plus className="h-4 w-4" /> Nouveau Ticket
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Ouvrir un nouveau ticket</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSendTicket} className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="sujet">Sujet</Label>
                        <Input id="sujet" value={sujet} onChange={(e) => setSujet(e.target.value)} required />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="categorie">Catégorie</Label>
                        <Select value={categorie} onValueChange={(val) => setCategorie(val as string)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Technique">Technique</SelectItem>
                            <SelectItem value="Matériel">Matériel</SelectItem>
                            <SelectItem value="Facturation">Facturation</SelectItem>
                            <SelectItem value="Autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="description">Description détaillée</Label>
                        <Textarea id="description" className="min-h-[100px]" value={description} onChange={(e) => setDescription(e.target.value)} required />
                      </div>
                      <RippleButton type="submit" className="w-full justify-center" disabled={createTicket.isPending}>
                        {createTicket.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Envoyer"}
                      </RippleButton>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {isTicketsLoading ? (
                  <div className="py-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : tickets?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Vous n&apos;avez aucun ticket ouvert.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tickets?.map(ticket => (
                      <Dialog key={ticket.id} open={selectedTicketId === ticket.id} onOpenChange={(open) => setSelectedTicketId(open ? ticket.id : null)}>
                        <DialogTrigger 
                          render={<div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors flex items-start justify-between" />}
                        >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{ticket.reference}</span>
                                <Badge variant="outline" className="text-[10px]">{ticket.categorie}</Badge>
                                <Badge variant={ticket.statut === "Ouvert" ? "default" : ticket.statut === "En cours" ? "secondary" : "outline"} className="text-[10px]">
                                  {ticket.statut}
                                </Badge>
                              </div>
                              <h4 className="font-medium">{ticket.sujet}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2 text-xs text-muted-foreground">
                              <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                              {ticket.messages_count !== undefined && ticket.messages_count > 0 && (
                                <span className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  <MessageSquare className="h-3 w-3" /> {ticket.messages_count}
                                </span>
                              )}
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Ticket {ticket.reference}</DialogTitle>
                          </DialogHeader>
                          {selectedTicketId === ticket.id && <TicketChat ticketId={ticket.id} />}
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </BlurFade>

          <BlurFade delay={0.3}>
            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Questions Fréquentes (FAQ)</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left font-semibold">Comment enregistrer un paiement ?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Rendez-vous dans la section "Nouveau Paiement", recherchez le commerçant par son ID, nom ou scannez son QR Code. Sélectionnez ensuite la taxe concernée, entrez le montant et validez. Un reçu numérique sera généré.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left font-semibold">L&apos;application fonctionne-t-elle sans internet ?</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Oui, l&apos;application peut enregistrer vos opérations en mode hors-ligne. Elles seront automatiquement synchronisées avec les serveurs dès que vous retrouverez une connexion stable.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </BlurFade>
        </div>

        <div className="space-y-6">
          <BlurFade delay={0.4}>
            {/* Bloc Infos Utiles */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Informations utiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="font-bold text-foreground">Mairie de Lubumbashi</p>
                    <p className="text-muted-foreground">Hôtel de Ville, Lubumbashi<br />Haut-Katanga, RDC</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <p className="font-medium">+243 99 00 00 000</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <p className="font-medium">support@mairie-lubumbashi.cd</p>
                </div>
              </CardContent>
            </Card>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
