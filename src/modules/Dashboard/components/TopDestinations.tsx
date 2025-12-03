'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { TopDestination } from "../types/dashboard";

interface TopDestinationsProps {
    data: TopDestination[];
}

export function TopDestinations({ data }: TopDestinationsProps) {
    const maxReservations = Math.max(...data.map(d => d.reservations), 1);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[#256EFF]" />
                    <CardTitle className="text-lg font-bold text-[#102542]">Top 5 Destinos</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">Más reservados</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.length === 0 ? (
                        <p className="text-center text-muted-foreground py-4">No hay datos disponibles</p>
                    ) : (
                        data.map((destination, index) => (
                            <div key={destination.id} className="relative">
                                {/* Barra de fondo */}
                                <div
                                    className="absolute inset-0 bg-gradient-to-r from-[#256EFF]/10 to-transparent rounded"
                                    style={{
                                        width: `${(destination.reservations / maxReservations) * 100}%`
                                    }}
                                />

                                {/* Contenido */}
                                <div className="relative flex items-center justify-between p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#256EFF] to-[#07BEB8] flex items-center justify-center text-white font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <span className="font-medium text-[#102542]">{destination.name}</span>
                                    </div>
                                    <span className="font-bold text-[#256EFF]">
                                        {destination.reservations}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
