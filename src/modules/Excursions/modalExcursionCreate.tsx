'use client'
import React, { useState, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createExcurtions } from './shared/service'
import { getAllDestinations } from './shared/serviceDestinations'
import { addDestinationsToExcursion } from './shared/serviceExcursionsDestinations'
import type { Excursion } from './shared/dtoExcursion'
import type { Destination } from './shared/serviceDestinations'
import { useRouter } from 'next/navigation'
import DatatableExcursionDestinations from './datatableExcrusionDestinations'

export default function ModalExcursionCreate() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loadingDestinations, setLoadingDestinations] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [destinations, setDestinations] = useState<Destination[]>([])
    const [selectedDestinations, setSelectedDestinations] = useState<number[]>([])

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

    useEffect(() => {
        if (open) {
            loadDestinations()
        }
    }, [open])

    const loadDestinations = async () => {
        setLoadingDestinations(true)
        try {
            const data = await getAllDestinations()
            setDestinations(data || [])
            setSelectedDestinations([])
        } catch (err) {
            console.error('Error loading destinations:', err)
            setDestinations([])
        } finally {
            setLoadingDestinations(false)
        }
    }

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

        if (selectedDestinations.length === 0) {
            setError('Debes seleccionar al menos un destino')
            return
        }

        setLoading(true)
        try {
            // 1. Crear la excursión
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

            const excursion = await createExcurtions(excursionData)
            
            if (!excursion?.id) {
                throw new Error('No se obtuvo ID de la excursión')
            }

            // 2. Agregar destinos
            await addDestinationsToExcursion(
                excursion.id,
                selectedDestinations
            )

            setSuccess(true)

            // Limpiar
            setFormData({
                title: '',
                description: '',
                price: '',
                min_deposit: '',
                duration_days: '',
                start_date: '',
                end_date: '',
                available_seats: '',
            })
            setSelectedDestinations([])

            setTimeout(() => {
                setOpen(false)
                setSuccess(false)
                router.refresh()
            }, 1500)

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
            setError(`Error: ${errorMsg}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Crear Excursión</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-hidden">
                <div className='max-h-[90vh] overflow-y-auto no-scrollbar'>
                    {/* Mover DialogHeader dentro del contenedor con scroll */}
                    <DialogHeader className="px-1">
                        <DialogTitle>Crear Nueva Excursión</DialogTitle>
                        <DialogDescription>
                            Rellena los campos para registrar una nueva excursión
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        {/* Información básica */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg">Información Básica</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            </div>

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
                        </div>

                        {/* Destinos */}
                        <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-semibold text-lg">Destinos de la Excursión *</h3>
                                    <p className="text-sm text-gray-600">
                                        {selectedDestinations.length} destino(s) seleccionado(s)
                                    </p>
                                </div>
                            </div>
                            <DatatableExcursionDestinations 
                                destinations={destinations}
                                loading={loadingDestinations}
                                onSelectionChange={setSelectedDestinations}
                            />
                        </div>

                        {/* Información adicional */}
                        <div className="space-y-4 border-t pt-6">
                            <h3 className="font-semibold text-lg">Información Adicional</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            </div>
                        </div>

                        {/* Mensajes */}
                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded text-sm border border-red-300">
                                ❌ {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 bg-green-100 text-green-700 rounded text-sm border border-green-300">
                                ✓ Excursión creada exitosamente con {selectedDestinations.length} destino(s)
                            </div>
                        )}

                        {/* Botones */}
                        <div className="flex justify-end gap-2 pt-6 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={loading || selectedDestinations.length === 0}
                            >
                                {loading ? 'Guardando...' : 'Guardar Excursión'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}