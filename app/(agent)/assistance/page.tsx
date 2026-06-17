"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/action-button";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSendSupportMessage } from "@/hooks/use-support";
import { LifeBuoy, Send, Phone, Mail, MapPin, Info } from "lucide-react";

export default function AssistancePage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const sendSupport = useSendSupportMessage();

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    sendSupport.mutate(
      { subject, message },
      {
        onSuccess: () => {
          setSubject("");
          setMessage("");
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 md:pb-0">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight uppercase flex items-center gap-3">
          <LifeBuoy className="h-8 w-8 text-primary" />
          Assistance & Support
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Obtenez de l&apos;aide, consultez la FAQ ou contactez l&apos;administration centrale de la Mairie.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle>Questions Fréquentes (FAQ)</CardTitle>
              <CardDescription>Solutions rapides aux problèmes courants rencontrés sur le terrain.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion multiple={false} className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-semibold">Comment enregistrer un paiement ?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Rendez-vous dans la section "Nouveau Paiement", recherchez le commerçant par son ID, nom ou scannez son QR Code. Sélectionnez ensuite la taxe concernée, entrez le montant et validez. Un reçu numérique sera généré.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-semibold">Que faire si un commerçant n&apos;apparaît pas ?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Si le commerçant n&apos;est pas dans le système, vous pouvez l&apos;ajouter via le bouton "Nouveau Commerçant" dans la section Commerçants, à condition d&apos;avoir les droits nécessaires. Sinon, signalez-le à votre superviseur de zone.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-semibold">Comment corriger une erreur de saisie ?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Une fois un paiement validé, seul un Administrateur de zone ou un SuperAdmin peut l&apos;annuler ou le modifier. Contactez immédiatement votre chef de bureau avec le numéro de reçu (ex: TXN-45).
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left font-semibold">L&apos;application fonctionne-t-elle sans internet ?</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    Oui, l&apos;application peut enregistrer vos opérations en mode hors-ligne. Elles seront automatiquement synchronisées avec les serveurs de la Mairie dès que vous retrouverez une connexion stable. Ne vous déconnectez pas si vous avez des données non synchronisées !
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Formulaire de Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contacter l&apos;administration</CardTitle>
              <CardDescription>Envoyez un message direct au support technique ou à votre superviseur.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendTicket} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Sujet de la demande</Label>
                  <Input 
                    id="subject" 
                    placeholder="Ex: Problème d'accès, Commerçant doublon..." 
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Votre message</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Décrivez votre problème en détail..." 
                    className="min-h-[120px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={sendSupport.isPending || !subject.trim() || !message.trim()}
                  className="gap-2"
                >
                  <Send size={16} />
                  {sendSupport.isPending ? "Envoi en cours..." : "Envoyer le message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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

          {/* Bloc Version */}
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-muted rounded-full">
                <Info className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-bold text-sm">Revenue Counter</p>
                <p className="text-xs text-muted-foreground">Version 1.0.0 (Build 2026)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
