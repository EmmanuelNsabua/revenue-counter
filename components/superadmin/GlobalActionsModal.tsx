"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, BellRing, ShieldAlert, PowerOff } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface GlobalActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalActionsModal({ isOpen, onClose }: GlobalActionsModalProps) {
  const [activeTab, setActiveTab] = useState("notification");
  
  // Notification State
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState("admin");
  const [isSending, setIsSending] = useState(false);

  // Maintenance State
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [isTogglingMaintenance, setIsTogglingMaintenance] = useState(false);

  const handleSendNotification = async () => {
    if (!message.trim()) {
      toast.error("Veuillez saisir un message.");
      return;
    }

    try {
      setIsSending(true);
      const response = await api.post("/superadmin/actions/notify", {
        message,
        target_role: targetRole
      });
      
      toast.success(response.data.message || "Notification diffusée avec succès.");
      setMessage("");
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur lors de l'envoi de la notification.");
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleMaintenance = async (checked: boolean) => {
    try {
      setIsTogglingMaintenance(true);
      const response = await api.post("/superadmin/actions/maintenance", {
        enabled: checked
      });
      
      setIsMaintenanceMode(checked);
      toast.success(response.data.message || `Mode maintenance ${checked ? 'activé' : 'désactivé'}.`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Erreur lors du changement d'état.");
    } finally {
      setIsTogglingMaintenance(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <ShieldAlert className="text-primary" />
            Actions Globales
          </DialogTitle>
          <DialogDescription>
            Exécutez des opérations de masse ou modifiez l'état global du système.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="notification" className="gap-2">
              <BellRing size={16} />
              Diffusion
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="gap-2 data-[state=active]:text-destructive data-[state=active]:bg-destructive/10">
              <PowerOff size={16} />
              Système
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notification" className="space-y-4">
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label>Cible</Label>
                <select 
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option value="admin">Tous les Administrateurs</option>
                  <option value="agent">Tous les Agents</option>
                  <option value="all">Tous les utilisateurs</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Message à diffuser</Label>
                <Textarea 
                  placeholder="Saisissez le message système..." 
                  className="min-h-[120px] resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <Button 
                className="w-full gap-2" 
                onClick={handleSendNotification}
                disabled={isSending}
              >
                {isSending ? (
                  <>Envoi en cours...</>
                ) : (
                  <>
                    <BellRing size={16} />
                    Diffuser l'annonce
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4">
            <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg space-y-4 mt-2">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-destructive shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-destructive">Mode Maintenance (Collecte Différée)</h4>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                    Lorsqu'il est activé, le système passe en "Mode Offline" forcé. Les agents pourront toujours enregistrer des paiements localement sur leur appareil (Collecte Différée), mais ne pourront plus les synchroniser vers le serveur central tant que la maintenance n'est pas terminée.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-destructive/10">
                <div className="space-y-0.5">
                  <Label className="text-base font-semibold">Statut du système</Label>
                  <p className="text-sm text-muted-foreground">
                    {isMaintenanceMode ? "Maintenance activée" : "Système en ligne"}
                  </p>
                </div>
                <Switch 
                  checked={isMaintenanceMode}
                  onCheckedChange={handleToggleMaintenance}
                  disabled={isTogglingMaintenance}
                  className="data-[state=checked]:bg-destructive"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
