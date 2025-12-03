'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import type { TopExcursion } from "../types/dashboard";

interface TopExcursionsTableProps {
    data: TopExcursion[];
}

export function TopExcursionsTable({ data }: TopExcursionsTableProps) {
    const getOccupancyBadge = (occupancy: number) => {
        if (occupancy >= 80) {
            return <Badge className="bg-green-500/10 text-green-700 hover:bg-green-500/20">{occupancy}%</Badge>;
        } else if (occupancy >= 50) {
            return <Badge className="bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20">{occupancy}%</Badge>;
        } else {
            return <Badge variant="secondary">{occupancy}%</Badge>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#07BEB8]" />
                    <CardTitle className="text-lg font-bold text-[#102542]">Top 5 Excursiones</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">Más vendidas</p>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-2 text-sm font-semibold text-[#102542]">Excursión</th>
                                <th className="text-center py-3 px-2 text-sm font-semibold text-[#102542]">Ventas</th>
                                <th className="text-right py-3 px-2 text-sm font-semibold text-[#102542]">Ingresos</th>
                                <th className="text-center py-3 px-2 text-sm font-semibold text-[#102542]">Ocupación</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No hay datos disponibles
                                    </td>
                                </tr>
                            ) : (
                                data.map((excursion) => (
                                    <tr key={excursion.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-2 text-sm font-medium text-[#102542] truncate max-w-[200px]">
                                            {excursion.title}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-center text-[#256EFF] font-semibold">
                                            {excursion.sales}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-right font-semibold text-green-600">
                                            ${excursion.revenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="py-3 px-2 text-sm text-center">
                                            {getOccupancyBadge(excursion.occupancy)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
