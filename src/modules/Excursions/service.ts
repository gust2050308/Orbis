import { createClient } from "@/lib/Supabase/server";

export async function createExcurtions() {
    
}

export type Excursion={
    id: number;
    title: string;
    description?: string;
    price: string|number;
    min_deposit?: string|number|null;
    duration_days?: number|null|string;
    start_dates?: string|null|number;
    end_dates?: string|null|number;
    available_seats?: number|null|string;
    status?: string|null;
    created_at?: string|null;
    updated_at?: string|null;
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

