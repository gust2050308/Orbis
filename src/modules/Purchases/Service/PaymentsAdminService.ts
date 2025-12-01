import { createClient } from '@/lib/Supabase/server';
import type {
    AdminPayment,
    UpdatePaymentData,
    CreateManualPaymentData
} from '../types';

/**
 * Get all payments for a purchase
 */
export async function getPaymentsByPurchaseId(purchaseId: number): Promise<AdminPayment[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('purchase_id', purchaseId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching payments:', error);
        throw new Error('Error al obtener los pagos');
    }

    return (data || []) as AdminPayment[];
}

/**
 * Create manual payment and update purchase
 */
export async function createManualPayment(data: CreateManualPaymentData): Promise<AdminPayment | null> {
    const supabase = await createClient();

    // Create payment record
    const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
            purchase_id: data.purchase_id,
            amount: data.amount,
            payment_type: data.payment_type,
            status: 'succeeded', // Manual payments are auto-approved
        })
        .select()
        .single();

    if (paymentError || !payment) {
        console.error('Error creating payment:', paymentError);
        return null;
    }

    // Get current purchase
    const { data: purchase } = await supabase
        .from('purchases')
        .select('total_amount, amount_paid')
        .eq('id', data.purchase_id)
        .single();

    if (purchase) {
        const newAmountPaid = (purchase.amount_paid || 0) + data.amount;
        const isPaid = newAmountPaid >= purchase.total_amount;

        // Update purchase
        await supabase
            .from('purchases')
            .update({
                amount_paid: newAmountPaid,
                status: isPaid ? 'paid' : 'reserved'
            })
            .eq('id', data.purchase_id);
    }

    return payment as AdminPayment;
}

/**
 * Update payment status
 */
export async function updatePayment(
    paymentId: number,
    updates: UpdatePaymentData
): Promise<boolean> {
    const supabase = await createClient();

    const { error } = await supabase
        .from('payments')
        .update(updates)
        .eq('id', paymentId);

    if (error) {
        console.error('Error updating payment:', error);
        return false;
    }

    return true;
}

/**
 * Delete payment (only if pending)
 */
export async function deletePayment(paymentId: number): Promise<boolean> {
    const supabase = await createClient();

    // Check if payment is pending
    const { data: payment } = await supabase
        .from('payments')
        .select('status, amount, purchase_id')
        .eq('id', paymentId)
        .single();

    if (payment?.status !== 'pending') {
        throw new Error('Solo se pueden eliminar pagos pendientes');
    }

    // Delete payment
    const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId);

    if (error) {
        console.error('Error deleting payment:', error);
        return false;
    }

    return true;
}

/**
 * Approve pending payment and update purchase
 */
export async function approvePayment(paymentId: number): Promise<boolean> {
    const supabase = await createClient();

    // Get payment
    const { data: payment } = await supabase
        .from('payments')
        .select('amount, purchase_id')
        .eq('id', paymentId)
        .single();

    if (!payment) return false;

    // Update payment status
    await updatePayment(paymentId, { status: 'succeeded' });

    // Update purchase amount_paid
    const { data: purchase } = await supabase
        .from('purchases')
        .select('total_amount, amount_paid')
        .eq('id', payment.purchase_id)
        .single();

    if (purchase) {
        const newAmountPaid = (purchase.amount_paid || 0) + payment.amount;
        const isPaid = newAmountPaid >= purchase.total_amount;

        await supabase
            .from('purchases')
            .update({
                amount_paid: newAmountPaid,
                status: isPaid ? 'paid' : 'reserved'
            })
            .eq('id', payment.purchase_id);
    }

    return true;
}

/**
 * Mark payment as refunded
 */
export async function markPaymentAsRefunded(paymentId: number): Promise<boolean> {
    return updatePayment(paymentId, { status: 'refunded' });
}
