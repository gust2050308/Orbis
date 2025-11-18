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

export async function deleteExcursion() {

}

