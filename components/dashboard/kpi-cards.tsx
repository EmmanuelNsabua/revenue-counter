import {
  TrendingUp,
  Store,
  CreditCard,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCards() {
  const stats = [
    {
      label: "Total collecté aujourd'hui",
      value: "487 500 FC",
      change: "+12.4%",
      trend: "up",
      icon: TrendingUp,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Commerçants actifs",
      value: "342",
      change: "+3",
      trend: "up",
      icon: Store,
      color: "text-yellow-700 bg-rdc-yellow/20",
    },
    {
      label: "Paiements",
      value: "128",
      change: "+8.7%",
      trend: "up",
      icon: CreditCard,
      color: "text-primary bg-primary/10",
    },
    {
      label: "Impayés en attente",
      value: "47",
      change: "-5.2%",
      trend: "down",
      icon: AlertCircle,
      color: "text-rdc-red bg-rdc-red/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className={`p-1.5 sm:p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span
              className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-medium ${
                stat.trend === "up" ? "text-primary" : "text-rdc-red"
              }`}
            >
              {stat.trend === "up" ? (
                <ArrowUpRight size={12} className="sm:w-[14px] sm:h-[14px]" />
              ) : (
                <ArrowDownRight size={12} className="sm:w-[14px] sm:h-[14px]" />
              )}
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
      ))}
    </div>
  );
}
