import { createClient } from "@/lib/Supabase/server";

export async function createExcurtions() {
    const supabase = await createClient();
    
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
    
}

export async function deleteExcursion() {

}

