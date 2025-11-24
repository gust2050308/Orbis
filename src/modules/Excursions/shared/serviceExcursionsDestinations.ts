'use server'

import { createClient } from "@/lib/Supabase/server"

export type ExcursionDestination = {
    id: number
    excursion_id: number
    destination_id: number
    order_index?: number | null
}

/**
 * Agrega múltiples destinos a una excursión
 */
export async function addDestinationsToExcursion(
    excursionId: number,
    destinationIds: number[]
) {
    try {
        const supabase = await createClient()

        // Validaciones
        if (!excursionId || typeof excursionId !== 'number' || excursionId <= 0) {
            throw new Error(`ID de excursión inválido: ${excursionId}`)
        }

        if (!Array.isArray(destinationIds) || destinationIds.length === 0) {
            throw new Error('destinationIds debe ser un array no vacío')
        }

        // Validar que todos los IDs sean válidos
        for (const id of destinationIds) {
            if (typeof id !== 'number' || id <= 0) {
                throw new Error(`ID de destino inválido: ${id}`)
            }
        }

        // Preparar datos
        const destinationsData = destinationIds.map((destId, index) => ({
            excursion_id: excursionId,
            destination_id: destId,
            order_index: index,
        }))

        const { data, error } = await supabase
            .from('excursion_destinations')
            .insert(destinationsData)
            .select()

        if (error) {
            throw new Error(`Error al insertar en Supabase: ${error.message}`)
        }

        return data

    } catch (error) {
        throw error
    }
}

/**
 * Agrega un único destino a una excursión
 */
export async function addDestinationToExcursion(
    excursionId: number,
    destinationId: number,
    orderIndex: number = 0
) {
    try {
        const supabase = await createClient()

        if (!excursionId || !destinationId) {
            throw new Error('excursionId y destinationId son requeridos')
        }

        const { data, error } = await supabase
            .from('excursion_destinations')
            .insert([{
                excursion_id: excursionId,
                destination_id: destinationId,
                order_index: orderIndex,
            }])
            .select()
            .single()

        if (error) {
            throw new Error(`Error: ${error.message}`)
        }

        return data

    } catch (error) {
        throw error
    }
}

/**
 * Obtiene todos los destinos de una excursión
 */
export async function getExcursionDestinations(excursionId: number) {
    try {
        const supabase = await createClient()

        if (!excursionId) {
            throw new Error('excursionId es requerido')
        }

        const { data, error } = await supabase
            .from('excursion_destinations')
            .select(`
                id,
                excursion_id,
                destination_id,
                order_index,
                destinations (
                    id,
                    name,
                    country,
                    description,
                    short_description,
                    latitude,
                    longitude,
                    is_active
                )
            `)
            .eq('excursion_id', excursionId)
            .order('order_index', { ascending: true })

        if (error) {
            console.error('Error fetching excursion destinations:', error)
            throw error
        }

        return data || []

    } catch (error) {
        console.error('Error:', error)
        throw error
    }
}