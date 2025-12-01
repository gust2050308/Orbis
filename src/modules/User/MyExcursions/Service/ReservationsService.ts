import { createClient } from '@/lib/Supabase/client';
import type { ReservationWithExcursion, Reservation } from '../types';

/**
 * Fetch all reservations for the current user with excursion details
 */
export async function getUserReservations(): Promise<ReservationWithExcursion[]> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
        .from('purchases')
        .select(`
            *,
            excursion:excursions (
                id,
                title,
                description,
                start_date,
                end_date,
                price,
                available_seats,
                excursion_destinations (
                    destination:destinations (
                        destination_images (
                            image_url
                        )
                    )
                )
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reservations:', error);
        throw new Error('Error al obtener las reservas');
    }

    return (data || []) as ReservationWithExcursion[];
}

/**
 * Get a single purchase by ID
 */
export async function getPurchaseById(purchaseId: number): Promise<ReservationWithExcursion | null> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error('Usuario no autenticado');
    }

    const { data, error } = await supabase
        .from('purchases')
        .select(`
            *,
            excursion:excursions (
                id,
                title,
                description,
                start_date,
                end_date,
                price,
                available_seats,
                excursion_destinations (
                    destination:destinations (
                        destination_images (
                            image_url
                        )
                    )
                )
            )
        `)
        .eq('id', purchaseId)
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error('Error fetching purchase:', error);
        return null;
    }

    return data as ReservationWithExcursion;
}

/**
 * Check if user has already purchased a specific excursion
 */
export async function checkUserPurchase(excursionId: number): Promise<Reservation | null> {
    const supabase = createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return null;
    }

    const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .eq('user_id', user.id)
        .eq('excursion_id', excursionId)
        .in('status', ['paid', 'partially_paid', 'pending'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) {
        console.error('Error checking purchase:', error);
        return null;
    }

    return data as Reservation | null;
}

/**
 * Calculate remaining amount to pay
 */
export function getRemainingAmount(reservation: Reservation): number {
    return Math.max(0, reservation.total_amount - reservation.amount_paid);
}

/**
 * Check if reservation is expired
 */
export function isReservationExpired(reservation: Reservation): boolean {
    const expiryDate = new Date(reservation.expires_at);
    const now = new Date();
    return now > expiryDate && reservation.status !== 'paid';
}
