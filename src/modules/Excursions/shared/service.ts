'use server';
import { createClient } from "@/lib/Supabase/server";
import type { Excursion } from "./dtoExcursion";

export async function createExcurtions(excursion: Partial<Excursion>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('excursions')
        .insert([excursion])
        .select()
        .single();

    if (error) {
        console.error("Error creating excursion:", error);
        throw error;
    }

    return data;
}

export async function getExcursions() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('excursions').select('*');

    if (error) {
        console.log("Error fetching excursions:", error);
        return [];
    }
    return data;
}

export async function getExcursionsById(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('excursions')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching excursion by id:', error);
        return null;
    }

    return data;
}

export async function deleteExcursion(id: number) {
    const supabase = await createClient();

    if (!id) {
        throw new Error('ID de excursion es requerido');
    }

    const { data, error } = await supabase
        .from('excursions')
        .update({ status: 'deleted' })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error al eliminar la excursion:', error);
        throw error;
    }

    console.log('Excursion eliminada (status actualizado):', data);
    return data;
}

export async function updateExcursion(id: number, excursion: Partial<Excursion>) {
    const supabase = await createClient();

    if (!id) {
        throw new Error('ID de excursion es requerido');
    }

    const { data, error } = await supabase
        .from('excursions')
        .update(excursion)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error al actualizar la excursion:', error);
        throw error;
    }

    console.log('Excursion actualizada:', data);
    return data;
}

// Acción para actualizar excursión (usado en Modal)
export async function updateExcursionAction(id: number, excursion: Partial<Excursion>) {
    try {
        const result = await updateExcursion(id, excursion)
        return { success: true, data: result }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error al actualizar'
        return { success: false, error: message }
    }
}

export type ExcursionFilters = {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    hasAvailability?: boolean;
    startDate?: string;
    endDate?: string;
    minDuration?: number;
    maxDuration?: number;
    destinationIds?: number[];
}

export type PaginationParams = {
    page?: number;      // Default: 1
    pageSize?: number;  // Default: 10
}

export type PaginatedResponse<T> = {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export async function getFilteredExcursions(
    filters: ExcursionFilters = {},
    pagination: PaginationParams = {}
): Promise<PaginatedResponse<Excursion>> {
    const supabase = await createClient();

    // Set defaults for pagination
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 10;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase.from('excursions').select('*', { count: 'exact' });

    // Text search filter (title and description)
    if (filters.search && filters.search.trim()) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Price range filter
    if (filters.minPrice !== undefined && filters.minPrice !== null) {
        query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        query = query.lte('price', filters.maxPrice);
    }

    // Availability filter (seats > 0)
    if (filters.hasAvailability) {
        query = query.gt('available_seats', 0);
    }

    // Date range filter
    if (filters.startDate) {
        query = query.gte('start_date', filters.startDate);
    }
    if (filters.endDate) {
        query = query.lte('end_date', filters.endDate);
    }

    // Duration filter
    if (filters.minDuration !== undefined && filters.minDuration !== null) {
        query = query.gte('duration_days', filters.minDuration);
    }
    if (filters.maxDuration !== undefined && filters.maxDuration !== null) {
        query = query.lte('duration_days', filters.maxDuration);
    }

    // Apply pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching filtered excursions:', error);
        return {
            data: [],
            total: 0,
            page,
            pageSize,
            totalPages: 0
        };
    }

    let filteredData = data || [];

    // Filter by destinations (many-to-many relationship)
    if (filters.destinationIds && filters.destinationIds.length > 0) {
        const excursionIds = new Set<number>();

        for (const destinationId of filters.destinationIds) {
            const { data: excursionDests, error: destError } = await supabase
                .from('excursion_destinations')
                .select('excursion_id')
                .eq('destination_id', destinationId);

            if (!destError && excursionDests) {
                excursionDests.forEach(ed => excursionIds.add(ed.excursion_id));
            }
        }

        // Filter excursions to only include those with selected destinations
        filteredData = filteredData.filter(exc => excursionIds.has(exc.id));
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
        data: filteredData,
        total,
        page,
        pageSize,
        totalPages
    };
}