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