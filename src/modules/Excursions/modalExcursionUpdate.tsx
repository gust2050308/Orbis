'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect, useRef } from 'react'
import { updateExcursion } from './shared/actions'
import { getExcursionDestination, updateExcursionDestinationsOrder, removeDestinationFromExcursion } from './shared/serviceExcursionsDestinations'
import type { Excursion } from './shared/dtoExcursion'
import DatatableExcursionDestinationsUpdate from './datatableExcrusionDestinationsUpdate'
import { MapPin } from 'lucide-react'

interface DatatableHandle {
    getChanges: () => { destinationOrders: Array<{ destinationId: number; orderIndex: number }>; deletedDestinations: number[] }
    resetChanges: () => void
}

interface DestinationRow {
    id: number
    name: string
    country?: string | null
    description?: string | null
    short_description?: string | null
    latitude?: number | null
    longitude?: number | null
    is_active?: boolean | null
    order_index?: number
    excursion_destination_id?: number
}

interface ModalExcursionUpdateProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    excursion: Excursion | null
    onSuccess?: () => void
}

export default function ModalExcursionUpdate({ 
    open, 
    onOpenChange, 
    excursion,
    onSuccess 
}: ModalExcursionUpdateProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [destinations, setDestinations] = useState<DestinationRow[]>([])
    const [loadingDestinations, setLoadingDestinations] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        min_deposit: '',
        duration_days: '',
        start_date: '',
        end_date: '',
        available_seats: '',
    })
    
    const datatableRef = useRef<DatatableHandle>(null)

    // Cargar destinos cuando se abre el modal
    useEffect(() => {
        if (open && excursion?.id) {
            const loadDestinations = async () => {
                try {
                    setLoadingDestinations(true)
                    const data = await getExcursionDestination(excursion.id)
                    
                    // Transformar datos: extraer destinos anidados
                    const destinationsList = data
                        .map((item) => ({
                            ...item.destinations,
                            order_index: item.order_index,
                            excursion_destination_id: item.id
                        }))
                        .filter((dest) => dest) as unknown as DestinationRow[]
                    
                    setDestinations(destinationsList)
                } catch (err) {
                    console.error('Error al cargar destinos:', err)
                    setDestinations([])
                } finally {
                    setLoadingDestinations(false)
                }
            }
            
            loadDestinations()
        }
    }, [open, excursion?.id])

    // Llenar el formulario cuando cambia la excursión seleccionada
    useEffect(() => {
        if (excursion) {
            setFormData({
                title: excursion.title || '',
                description: excursion.description || '',
                price: String(excursion.price || ''),
                min_deposit: String(excursion.min_deposit || ''),
                duration_days: String(excursion.duration_days || ''),
                start_date: String(excursion.start_date || ''),
                end_date: String(excursion.end_date || ''),
                available_seats: String(excursion.available_seats || ''),
            })
            setError(null)
            setSuccess(false)
        }
    }, [excursion, open])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        if (!formData.title.trim() || !formData.price) {
            setError('El título y el precio son requeridos')
            return
        }

        if (!excursion?.id) {
            setError('ID de excursión no encontrado')
            return
        }

        setLoading(true)
        try {
            const excursionData: Partial<Excursion> = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                price: isNaN(Number(formData.price)) ? formData.price : Number(formData.price),
                min_deposit: formData.min_deposit ? Number(formData.min_deposit) : null,
                duration_days: formData.duration_days ? Number(formData.duration_days) : null,
                start_date: formData.start_date || null,
                end_date: formData.end_date || null,
                available_seats: formData.available_seats ? Number(formData.available_seats) : null,
            }

            const result = await updateExcursion(excursion.id, excursionData)

            if (!result.success) {
                setError(result.error || 'Error al actualizar la excursión')
                return
            }

            // Obtener cambios del datatable
            const changes = datatableRef.current?.getChanges?.()
            
            // Aplicar cambios de destinos si existen
            if (changes) {
                // Actualizar orden de destinos reordenados
                if (changes.destinationOrders && changes.destinationOrders.length > 0) {
                    try {
                        await updateExcursionDestinationsOrder(
                            excursion.id,
                            changes.destinationOrders
                        )
                    } catch (err) {
                        throw new Error(`Error al actualizar orden de destinos: ${err instanceof Error ? err.message : 'Error desconocido'}`)
                    }
                }
                
                // Eliminar destinos deletados
                if (changes.deletedDestinations && changes.deletedDestinations.length > 0) {
                    for (const destinationId of changes.deletedDestinations) {
                        try {
                            await removeDestinationFromExcursion(
                                excursion.id,
                                destinationId
                            )
                        } catch (err) {
                            throw new Error(`Error al eliminar destino: ${err instanceof Error ? err.message : 'Error desconocido'}`)
                        }
                    }
                }
                
                // Resetear cambios en el datatable después de guardar
                datatableRef.current?.resetChanges?.()
            }

            console.log('Excursión actualizada:', result.data)
            setSuccess(true)

            setTimeout(() => {
                onOpenChange(false)
                setSuccess(false)
                onSuccess?.()
            }, 1500)

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
            console.error('Error al actualizar:', err)
            setError(`Error: ${errorMsg}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Excursión</DialogTitle>
                    <DialogDescription>
                        Actualiza los datos de la excursión
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Título */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            name="title"
                            placeholder="Ej: Tour por las montañas"
                            value={formData.title}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Describe la excursión..."
                            value={formData.description}
                            onChange={handleInputChange}
                            disabled={loading}
                            rows={3}
                        />
                    </div>

                    {/* Precio */}
                    <div className="space-y-2">
                        <Label htmlFor="price">Precio *</Label>
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.price}
                            onChange={handleInputChange}
                            disabled={loading}
                            required
                        />
                    </div>

                    {/* Depósito mínimo */}
                    <div className="space-y-2">
                        <Label htmlFor="min_deposit">Depósito Mínimo</Label>
                        <Input
                            id="min_deposit"
                            name="min_deposit"
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            value={formData.min_deposit}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                    </div>

                    {/* Duración */}
                    <div className="space-y-2">
                        <Label htmlFor="duration_days">Duración (días)</Label>
                        <Input
                            id="duration_days"
                            name="duration_days"
                            type="number"
                            placeholder="1"
                            value={formData.duration_days}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                    </div>

                    {/* Destinos de la Excursión */}
                    {excursion && (
                        <div className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="h-5 w-5 text-teal-600" />
                                <span className="font-semibold text-gray-700">Destinos de la Excursión</span>
                            </div>
                            <DatatableExcursionDestinationsUpdate 
                                ref={datatableRef}
                                excursionId={excursion.id} 
                                destinations={destinations}
                                loading={loadingDestinations}
                                onUpdate={() => {
                                    // Recargar destinos después de actualizar
                                    if (excursion?.id) {
                                        const loadDestinations = async () => {
                                            try {
                                                setLoadingDestinations(true)
                                                const data = await getExcursionDestination(excursion.id)
                                                const destinationsList = data
                                                    .map((item) => ({
                                                        ...item.destinations,
                                                        order_index: item.order_index,
                                                        excursion_destination_id: item.id
                                                    }))
                                                    .filter((dest) => dest) as unknown as DestinationRow[]
                                                setDestinations(destinationsList)
                                            } finally {
                                                setLoadingDestinations(false)
                                            }
                                        }
                                        loadDestinations()
                                    }
                                }}
                            />
                        </div>
                    )}


                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label htmlFor="start_date">Fecha Inicio</Label>
                            <Input
                                id="start_date"
                                name="start_date"
                                type="date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_date">Fecha Fin</Label>
                            <Input
                                id="end_date"
                                name="end_date"
                                type="date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Asientos disponibles */}
                    <div className="space-y-2">
                        <Label htmlFor="available_seats">Asientos Disponibles</Label>
                        <Input
                            id="available_seats"
                            name="available_seats"
                            type="number"
                            placeholder="10"
                            value={formData.available_seats}
                            onChange={handleInputChange}
                            disabled={loading}
                        />
                    </div>

                    {/* Mensajes de error/éxito */}
                    {error && (
                        <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 bg-green-100 text-green-700 rounded text-sm">
                            ✓ Excursión actualizada exitosamente
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
