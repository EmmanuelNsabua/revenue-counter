"use client";

import { useState } from "react";
import {
  TrendingUp, Store, CreditCard, AlertCircle,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockKpiStats } from "@/mocks/agent";
import { KpiSkeleton } from "@/components/ui/skeletons";

const iconMap = {
  TrendingUp, Store, CreditCard, AlertCircle,
};

const colorMap = {
  primary: "text-primary bg-primary/10",
  yellow: "text-yellow-700 bg-rdc-yellow/20",
  red: "text-rdc-red bg-rdc-red/10",
};

export function KpiCards() {
  // isLoading simulé — sera remplacé par useQuery en Phase 4
  const [isLoading] = useState(false);
  const stats = mockKpiStats;

  if (isLoading) {
    return <KpiSkeleton count={4} cols={4} />;
  }

  if (!stats.length) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        Aucune statistique disponible pour aujourd'hui.
      </div>
    );
  }

  const iconComponents = [TrendingUp, Store, CreditCard, AlertCircle];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat, i) => {
        const Icon = iconComponents[i];
        const color = colorMap[stat.colorKey as keyof typeof colorMap] ?? colorMap.primary;
        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className={`p-1.5 sm:p-2 rounded-lg ${color}`}>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-medium ${stat.trend === "up" ? "text-primary" : "text-rdc-red"}`}>
                {stat.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg sm:text-2xl font-bold mb-1 truncate">
                {stat.value}
              </CardTitle>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                {stat.label}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
