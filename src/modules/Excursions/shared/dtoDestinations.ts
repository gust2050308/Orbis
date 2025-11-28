export type Destinations = {
    id: number;
    name: string;
    country?: string | null;
    description?: string | null;
    short_description?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    is_active?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
}