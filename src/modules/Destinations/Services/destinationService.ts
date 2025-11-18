// Agregar al archivo destination-service.ts

import { createClient } from '@/lib/Supabase/supabaseClient';
import { Destination, DestinationFormData } from '../types/TypesDestinations';

export const supabase = createClient();

export const destinationService = {

  async create(data: DestinationFormData) {
    const { data: destination, error } = await supabase
      .from('destinations')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return destination as Destination;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Destination[];
  },

  async getById(id: number) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Destination;
  },

  async update(id: number, data: Partial<DestinationFormData>) {
    const { data: destination, error } = await supabase
      .from('destinations')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return destination as Destination;
  },

  async delete(id: number) {
    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleActive(id: number, isActive: boolean) {
    return this.update(id, { is_active: isActive });
  },

  async search(query: string) {
    const searchTerm = `%${query}%`;
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .or(`name.ilike.${searchTerm},country.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Destination[];
  },

  /**
   * Obtener solo destinos activos
   */
  async getActive() {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Destination[];
  },

  /**
   * Obtener destinos por país
   */
  async getByCountry(country: string) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .ilike('country', country)
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) throw error;
    return data as Destination[];
  },

  /**
   * Obtener destinos cercanos a unas coordenadas
   * (búsqueda simple por rango, no usa funciones geoespaciales)
   */
  async getNearby(lat: number, lng: number, range: number = 0.5) {
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .gte('latitude', lat - range)
      .lte('latitude', lat + range)
      .gte('longitude', lng - range)
      .lte('longitude', lng + range)
      .eq('is_active', true);

    if (error) throw error;
    return data as Destination[];
  },

  /**
   * Obtener estadísticas
   */
  async getStats() {
    const { data, error } = await supabase
      .from('destinations')
      .select('is_active, country');

    if (error) throw error;

    const total = data.length;
    const active = data.filter((d) => d.is_active).length;
    const inactive = total - active;

    // Contar por países
    const byCountry = data.reduce((acc, dest) => {
      const country = dest.country || 'Sin país';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      active,
      inactive,
      byCountry,
    };
  },

  /**
   * Duplicar un destino (útil para variaciones)
   */
  async duplicate(id: number, newName: string) {
    const original = await this.getById(id);

    const { data, error } = await supabase
      .from('destinations')
      .insert([{
        name: newName,
        country: original.country,
        description: original.description,
        short_description: original.short_description,
        latitude: original.latitude,
        longitude: original.longitude,
        is_active: false, // Por defecto inactivo
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Destination;
  },

  /**
   * Actualizar múltiples destinos a la vez
   */
  async bulkUpdate(ids: number[], updates: Partial<DestinationFormData>) {
    const { data, error } = await supabase
      .from('destinations')
      .update(updates)
      .in('id', ids)
      .select();

    if (error) throw error;
    return data as Destination[];
  },

  async filter(filters: {
    name?: string;
    country?: string;
    is_active?: boolean;
    minLatitude?: number;
    maxLatitude?: number;
    minLongitude?: number;
    maxLongitude?: number;
  }) {
    let query = supabase.from("destinations").select("*");

    // Filtro por nombre (LIKE)
    if (filters.name) {
      const term = `%${filters.name}%`;
      query = query.ilike("name", term);
    }

    // Filtro por país (LIKE)
    if (filters.country) {
      const term = `%${filters.country}%`;
      query = query.ilike("country", term);
    }

    // Filtro por estado activo
    if (typeof filters.is_active === "boolean") {
      query = query.eq("is_active", filters.is_active);
    }

    // Filtro por latitud
    if (typeof filters.minLatitude === "number") {
      query = query.gte("latitude", filters.minLatitude);
    }
    if (typeof filters.maxLatitude === "number") {
      query = query.lte("latitude", filters.maxLatitude);
    }

    // Filtro por longitud
    if (typeof filters.minLongitude === "number") {
      query = query.gte("longitude", filters.minLongitude);
    }
    if (typeof filters.maxLongitude === "number") {
      query = query.lte("longitude", filters.maxLongitude);
    }

    // Ordenar por nombre ascendente
    query = query.order("name", { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    return data as Destination[];
  },

  async getPaginated({
    page = 1,
    limit = 10,
    search = "",
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("destinations")
      .select("*", { count: "exact" }) // ← importante
      .order("created_at", { ascending: false })
      .range(from, to);

    if (search.trim() !== "") {
      const term = `%${search}%`;
      query = query.or(
        `name.ilike.${term},country.ilike.${term},description.ilike.${term}`
      );
    }

    const { data, count, error } = await query;

    if (error) throw error;

    return {
      data: data as Destination[],
      totalItems: count || 0,
      totalPages: Math.ceil((count || 0) / limit),
      currentPage: page,
    };
  }


};