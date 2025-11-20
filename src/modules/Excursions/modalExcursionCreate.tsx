'use client'
import React, { useState } from 'react'
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
import type { Excursion } from './shared/dtoExcursion'

export default function ModalExcursionCreate() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        min_deposit: '',
        duration_days: '',
        start_dates: '',
        end_dates: '',
        available_seats: '',
    })

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

        // Validación básica
        if (!formData.title.trim() || !formData.price) {
            setError('El título y el precio son requeridos')
            return
        }

        setLoading(true)
        try {
            // Preparar datos según el DTO
            const excursionData: Partial<Excursion> = {
                title: formData.title.trim(),
                description: formData.description.trim() || undefined,
                price: isNaN(Number(formData.price)) ? formData.price : Number(formData.price),
                min_deposit: formData.min_deposit ? Number(formData.min_deposit) : null,
                duration_days: formData.duration_days ? Number(formData.duration_days) : null,
                start_date: formData.start_dates || null,
                end_date: formData.end_dates || null,
                available_seats: formData.available_seats ? Number(formData.available_seats) : null,
            }

            // Llamar al service
            const result = await createExcurtions(excursionData)

            console.log('Excursión creada:', result)
            setSuccess(true)

            // Limpiar formulario
            setFormData({
                title: '',
                description: '',
                price: '',
                min_deposit: '',
                duration_days: '',
                start_dates: '',
                end_dates: '',
                available_seats: '',
            })

            // Cerrar modal después de 1.5 segundos
            setTimeout(() => {
                setOpen(false)
                setSuccess(false)
            }, 1500)

        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
            console.error('Error al crear excursión:', err)
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
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Crear Nueva Excursión</DialogTitle>
                    <DialogDescription>
                        Rellena los campos para registrar una nueva excursión
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

                    {/* Fechas */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                            <Label htmlFor="start_dates">Fecha Inicio</Label>
                            <Input
                                id="start_dates"
                                name="start_dates"
                                type="date"
                                value={formData.start_dates}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end_dates">Fecha Fin</Label>
                            <Input
                                id="end_dates"
                                name="end_dates"
                                type="date"
                                value={formData.end_dates}
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
                            ✓ Excursión creada exitosamente
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar Excursión'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
