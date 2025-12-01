import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/Supabase/server';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const paymentId = parseInt(params.id);

        // Check admin auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        const updates = await request.json();

        // Get payment info
        const { data: payment } = await supabase
            .from('payments')
            .select('amount, purchase_id, status')
            .eq('id', paymentId)
            .single();

        if (!payment) {
            return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
        }

        // Update payment
        const { error } = await supabase
            .from('payments')
            .update(updates)
            .eq('id', paymentId);

        if (error) {
            return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
        }

        // If approving payment, update purchase
        if (updates.status === 'succeeded' && payment.status === 'pending') {
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
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const paymentId = parseInt(params.id);

        // Check admin auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        // Check if payment is pending
        const { data: payment } = await supabase
            .from('payments')
            .select('status')
            .eq('id', paymentId)
            .single();

        if (payment?.status !== 'pending') {
            return NextResponse.json(
                { error: 'Solo se pueden eliminar pagos pendientes' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('payments')
            .delete()
            .eq('id', paymentId);

        if (error) {
            return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
