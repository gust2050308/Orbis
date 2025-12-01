import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/Supabase/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const purchaseId = parseInt(params.id);

        const { data, error } = await supabase
            .from('payments')
            .select('*')
            .eq('purchase_id', purchaseId)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: 'Error al obtener pagos' }, { status: 500 });
        }

        return NextResponse.json({ payments: data || [] });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const purchaseId = parseInt(params.id);

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

        const body = await request.json();
        const { amount, payment_type } = body;

        // Create payment
        const { data: payment, error: paymentError } = await supabase
            .from('payments')
            .insert({
                purchase_id: purchaseId,
                amount,
                payment_type,
                status: 'succeeded', // Manual payments are auto-approved
            })
            .select()
            .single();

        if (paymentError) {
            return NextResponse.json({ error: 'Error al crear pago' }, { status: 500 });
        }

        // Update purchase amounts
        const { data: purchase } = await supabase
            .from('purchases')
            .select('total_amount, amount_paid')
            .eq('id', purchaseId)
            .single();

        if (purchase) {
            const newAmountPaid = (purchase.amount_paid || 0) + amount;
            const isPaid = newAmountPaid >= purchase.total_amount;

            await supabase
                .from('purchases')
                .update({
                    amount_paid: newAmountPaid,
                    status: isPaid ? 'paid' : 'reserved'
                })
                .eq('id', purchaseId);
        }

        return NextResponse.json({ payment });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
