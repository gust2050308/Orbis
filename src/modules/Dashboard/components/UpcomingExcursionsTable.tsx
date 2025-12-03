'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import type { UpcomingExcursion } from "../types/dashboard";

interface UpcomingExcursionsTableProps {
    data: UpcomingExcursion[];
}

export function UpcomingExcursionsTable({ data }: UpcomingExcursionsTableProps) {
    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, { label: string; className: string }> = {
            active: { label: 'Activa', className: 'bg-green-500/10 text-green-700' },
            inactive: { label: 'Inactiva', className: 'bg-gray-500/10 text-gray-700' },
            completed: { label: 'Completada', className: 'bg-blue-500/10 text-blue-700' },
            cancelled: { label: 'Cancelada', className: 'bg-red-500/10 text-red-700' },
        };

        const config = statusMap[status] || { label: status, className: 'bg-gray-500/10 text-gray-700' };
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const getSeatsBadge = (available: number) => {
        if (available < 5) {
            return <span className="text-red-600 font-semibold">{available}</span>;
        } else if (available < 10) {
            return <span className="text-yellow-600 font-semibold">{available}</span>;
        } else {
            return <span className="text-green-600 font-semibold">{available}</span>;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <Card className="col-span-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#256EFF]" />
                    <CardTitle className="text-xl font-bold text-[#102542]">Próximas Excursiones</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">Ordenadas por fecha</p>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="text-left py-3 px-3 text-sm font-semibold text-[#102542]">Fecha</th>
                                <th className="text-left py-3 px-3 text-sm font-semibold text-[#102542]">Excursión</th>
                                <th className="text-center py-3 px-3 text-sm font-semibold text-[#102542]">Cupo Disponible</th>
                                <th className="text-center py-3 px-3 text-sm font-semibold text-[#102542]">Estado</th>
                                <th className="text-center py-3 px-3 text-sm font-semibold text-[#102542]">Reservas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                                        No hay excursiones próximas
                                    </td>
                                </tr>
                            ) : (
                                data.map((excursion) => (
                                    <tr key={excursion.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-3 text-sm font-medium text-[#102542]">
                                            {formatDate(excursion.date)}
                                        </td>
                                        <td className="py-3 px-3 text-sm font-medium text-[#102542] max-w-[300px] truncate">
                                            {excursion.title}
                                        </td>
                                        <td className="py-3 px-3 text-sm text-center">
                                            {getSeatsBadge(excursion.availableSeats)} / {excursion.totalSeats}
                                        </td>
                                        <td className="py-3 px-3 text-sm text-center">
                                            {getStatusBadge(excursion.status)}
                                        </td>
                                        <td className="py-3 px-3 text-sm text-center font-semibold text-[#256EFF]">
                                            {excursion.reservations}
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
