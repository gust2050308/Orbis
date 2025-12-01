import { createClient } from '@/lib/Supabase/server';
import type {
    AdminPurchase,
    UpdatePurchaseData,
    CreateManualPaymentData
} from '../types';

/**
 * Get all purchases with user and excursion data (admin only)
 */
export async function getAllPurchases(): Promise<AdminPurchase[]> {
    const supabase = await createClient();

    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('No autenticado');
    }

    // Check admin role
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        throw new Error('No autorizado - Se requiere rol de administrador');
    }

    const { data, error } = await supabase
        .from('purchases')
        .select(`
            *,
            user:user_profiles!user_id (
                id,
                name,
                last_name,
                phone,
                country,
                city
            ),
            excursion:excursions (
                id,
                title,
                description,
                price,
                start_date,
                end_date
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching purchases:', error);
        throw new Error('Error al obtener las compras');
    }

    // Get user emails from auth.users
    const purchasesWithEmails = await Promise.all(
        (data || []).map(async (purchase) => {
            const { data: authUser } = await supabase.auth.admin.getUserById(purchase.user_id);
            return {
                ...purchase,
                user: {
                    ...purchase.user,
                    email: authUser?.user?.email || '',
                }
            };
        })
    );

    return purchasesWithEmails as AdminPurchase[];
}

/**
 * Get single purchase by ID with all details
 */
export async function getPurchaseById(purchaseId: number): Promise<AdminPurchase | null> {
    const supabase = await createClient();

    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('No autenticado');
    }

    const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        throw new Error('No autorizado');
    }

    const { data, error } = await supabase
        .from('purchases')
        .select(`
            *,
            user:user_profiles!user_id (
                id,
                name,
                last_name,
                phone,
                country,
                city
            ),
            excursion:excursions (
                id,
                title,
                description,
                price,
                start_date,
                end_date
            )
        `)
        .eq('id', purchaseId)
        .single();

    if (error) {
        console.error('Error fetching purchase:', error);
        return null;
    }

    // Get email
    const { data: authUser } = await supabase.auth.admin.getUserById(data.user_id);

    return {
        ...data,
        user: {
            ...data.user,
            email: authUser?.user?.email || '',
        }
    } as AdminPurchase;
}

/**
 * Update purchase (status, refund_status, expires_at)
 */
export async function updatePurchase(
    purchaseId: number,
    updates: UpdatePurchaseData
): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('purchases')
        .update(updates)
        .eq('id', purchaseId);

    if (error) {
        console.error('Error updating purchase:', error);
        return false;
    }

    return true;
}

/**
 * Delete purchase (only if no payments exist)
 */
export async function deletePurchase(purchaseId: number): Promise<boolean> {
    const supabase = await createClient();

    // Check if payments exist
    const { data: payments } = await supabase
        .from('payments')
        .select('id')
        .eq('purchase_id', purchaseId);

    if (payments && payments.length > 0) {
        throw new Error('No se puede eliminar una compra con pagos asociados');
    }

    const { error } = await supabase
        .from('purchases')
        .delete()
        .eq('id', purchaseId);

    if (error) {
        console.error('Error deleting purchase:', error);
        return false;
    }

    return true;
}

/**
 * Extend expiration date
 */
export async function extendExpiration(
    purchaseId: number,
    newExpiresAt: string
): Promise<boolean> {
    return updatePurchase(purchaseId, { expires_at: newExpiresAt });
}

/**
 * Mark purchase as refunded
 */
export async function markAsRefunded(purchaseId: number): Promise<boolean> {
    return updatePurchase(purchaseId, {
        status: 'refunded',
        refund_status: 'refunded'
    });
}

/**
 * Mark purchase as cancelled
 */
export async function markAsCancelled(purchaseId: number): Promise<boolean> {
    return updatePurchase(purchaseId, { status: 'cancelled' });
}
