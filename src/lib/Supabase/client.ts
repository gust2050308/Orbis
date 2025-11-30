import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Cliente de Supabase para el cliente (browser)
export function createClientComponentClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

// Alias para compatibilidad
export const createClient = createClientComponentClient;
