export type Excursion = {
    id: number;
    title: string;
    description?: string;
    price: string | number;
    min_deposit?: string | number | null;
    duration_days?: number | null | string;
    start_date?: string | null | number;  // Cambio: end_dates -> end_date
    end_date?: string | null | number;    // Cambio: end_dates -> end_date
    available_seats?: number | null | string;
    status?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
}