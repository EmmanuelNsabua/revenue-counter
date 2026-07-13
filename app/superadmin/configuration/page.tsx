"use client";

import { useState } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { Settings, Shield, ShieldCheck, Smartphone, Database } from "lucide-react";
import GeneralTab from "@/components/superadmin/config/GeneralTab";
import RbacTab from "@/components/superadmin/config/RbacTab";

export default function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "Général", icon: <Settings size={18} /> },
    { id: "security", label: "Sécurité", icon: <Shield size={18} /> },
    { id: "rbac", label: "Droits et Accès (RBAC)", icon: <ShieldCheck size={18} /> },
    { id: "mobile", label: "App Mobile", icon: <Smartphone size={18} /> },
    { id: "backup", label: "Sauvegardes", icon: <Database size={18} /> },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 md:pb-0">
      <BlurFade delay={0.1}>
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight uppercase">Configuration Globale</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Règles métier, sécurité et paramètres du système central.
          </p>
        </div>
      </BlurFade>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8 items-start">
        {/* Left Sidebar Menu */}
        <BlurFade delay={0.2}>
          <div className="flex flex-col space-y-1 bg-card border rounded-xl p-2 sticky top-24">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </BlurFade>

        {/* Right Content Area */}
        <div className="min-w-0">
          {activeTab === "general" && <GeneralTab />}
          {activeTab === "rbac" && <RbacTab />}
          
          {/* Placeholders for other tabs */}
          {["security", "mobile", "backup"].includes(activeTab) && (
            <BlurFade delay={0.1}>
              <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-muted/20">
                <p className="text-muted-foreground font-medium">Cet onglet est en cours de construction.</p>
              </div>
            </BlurFade>
          )}
        </div>
      </div>
    </div>
  );
}
