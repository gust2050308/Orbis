'use server'
import { createClient } from "@/lib/Supabase/server"

export async function getAllDestinations() {
    const supabase = await createClient();
    const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

    if (error) {
        console.error("Error fetching destinations:", error);
        return [];
    }
    return data || [];
}

export async function getDestinationById(id:number) {
    const supabase = await createClient();
    const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single();

    if (error) {
        console.error("Error fetching destination by id:", error);
        return null;
    }
    return data || null;
}