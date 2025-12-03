'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CalendarClock, AlertCircle, DollarSign, Wallet, ShoppingCart } from "lucide-react";
import type { DashboardKPIs } from "../types/dashboard";

interface KPICardsProps {
    data: DashboardKPIs;
}

export function KPICards({ data }: KPICardsProps) {
    const kpis = [
        {
            title: "Excursiones Activas",
            value: data.activeExcursions,
            icon: Calendar,
            gradient: "from-blue-500 to-blue-600",
            description: "En operación"
        },
        {
            title: "Próximas Excursiones",
            value: data.upcomingExcursions,
            icon: CalendarClock,
            gradient: "from-purple-500 to-purple-600",
            description: "Siguientes 30 días"
        },
        {
            title: "Casi Llenas",
            value: data.nearlyFullExcursions,
            icon: AlertCircle,
            gradient: "from-orange-500 to-orange-600",
            description: "≤5 lugares disponibles"
        },
        {
            title: "Ingresos del Mes",
            value: `$${data.monthRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            gradient: "from-green-500 to-green-600",
            description: "MXN"
        },
        {
            title: "Apartados del Mes",
            value: `$${data.monthDeposits.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`,
            icon: Wallet,
            gradient: "from-teal-500 to-teal-600",
            description: "Depósitos recibidos"
        },
        {
            title: "Reservas del Mes",
            value: data.monthReservations,
            icon: ShoppingCart,
            gradient: "from-indigo-500 to-indigo-600",
            description: "Compras totales"
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {kpis.map((kpi, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className={`bg-gradient-to-r ${kpi.gradient} text-white pb-3`}>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                            <kpi.icon className="h-5 w-5 opacity-80" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="text-3xl font-bold text-[#102542]">{kpi.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
