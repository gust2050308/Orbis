'use client'
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, Users, Clock, MapPin, Info } from 'lucide-react'
import type { Excursion } from './shared/dtoExcursion'

interface ModalExcursionViewProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    excursion: Excursion | null
    onEdit?: (excursion: Excursion) => void
}
export default function modalExcursionView({open, onOpenChange, excursion, onEdit}: ModalExcursionViewProps) {

    if (!excursion) {
        return null
    }

    const statusColors: Record<string, string> = {
        'Disponible': 'bg-green-100 text-green-800',
        'Agotado': 'bg-red-100 text-red-800',
        'Próximamente': 'bg-yellow-100 text-yellow-800',
    }
    const statusLabel: Record<string, string> = {
        'Disponible': 'Activa',
        'Agotado': 'Desactivada',
        'Próximamente': 'Pendiente',
    }

    const status = excursion.status || 'active'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <DialogTitle className="text-2xl">
                                {excursion.title}
                            </DialogTitle>
                            <DialogDescription className="mt-2">
                                {excursion.description || 'Sin descripción disponible'}
                            </DialogDescription>
                        </div>
                        <Badge className={statusColors[status]}>
                            {statusLabel[status]}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Información de precios */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-5 w-5 text-blue-600" />
                                <span className="font-semibold text-sm text-gray-600">Precio por Persona</span>
                            </div>
                            <p className="text-2xl font-bold text-blue-600">
                                ${Number(excursion.price ?? 0).toFixed(2)}
                            </p>
                        </div>

                        <div className="bg-amber-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="h-5 w-5 text-amber-600" />
                                <span className="font-semibold text-sm text-gray-600">Depósito Mínimo</span>
                            </div>
                            <p className="text-2xl font-bold text-amber-600">
                                ${Number(excursion.min_deposit ?? 0).toFixed(2)}
                            </p>
                        </div>
                    </div>

                    {/* Información de duración y disponibilidad */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className="h-5 w-5 text-purple-600" />
                                <span className="font-semibold text-sm text-gray-600">Duración</span>
                            </div>
                            <p className="text-lg font-semibold">
                                {excursion.duration_days ?? '—'} {excursion.duration_days === 1 ? 'día' : 'días'}
                            </p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-5 w-5 text-green-600" />
                                <span className="font-semibold text-sm text-gray-600">Asientos</span>
                            </div>
                            <p className="text-lg font-semibold">
                                {excursion.available_seats ?? 0} disponibles
                            </p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Info className="h-5 w-5 text-indigo-600" />
                                <span className="font-semibold text-sm text-gray-600">Estado</span>
                            </div>
                            <p className="text-lg font-semibold capitalize">
                                {statusLabel[status]}
                            </p>
                        </div>
                    </div>

                    {/* Fechas */}
                    <div className="border-t pt-4">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="h-5 w-5 text-red-600" />
                            <span className="font-semibold text-gray-700">Fechas de la Excursión</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-600 mb-1">Fecha de Inicio</p>
                                <p className="font-semibold text-gray-900">
                                    {excursion.start_date ? new Date(excursion.start_date).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : '—'}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                                <p className="text-xs text-gray-600 mb-1">Fecha de Fin</p>
                                <p className="font-semibold text-gray-900">
                                    {excursion.end_date ? new Date(excursion.end_date).toLocaleDateString('es-ES', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : '—'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Información de auditoría */}
                    <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
                        <p>Creado: {excursion.created_at ? new Date(excursion.created_at).toLocaleString('es-ES') : '—'}</p>
                        <p>Actualizado: {excursion.updated_at ? new Date(excursion.updated_at).toLocaleString('es-ES') : '—'}</p>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cerrar
                    </Button>
                    <Button
                        type="button"
                        onClick={() => {
                            onEdit?.(excursion)
                            onOpenChange(false)
                        }}
                    >
                        Editar Excursión
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
  )
}
