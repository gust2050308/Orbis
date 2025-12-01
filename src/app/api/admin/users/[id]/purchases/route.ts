import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/Supabase/server';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient();
        const userId = params.id;

        // Fetch user purchases with excursions and payments
        const { data, error } = await supabase
            .from('purchases')
            .select(`
                *,
                excursion:excursions (
                    id,
                    title,
                    start_date,
                    end_date,
                    price
                ),
                payments (
                    id,
                    amount,
                    status,
                    payment_type,
                    created_at
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json(
                { error: 'Error al obtener compras' },
                { status: 500 }
            );
        }

        return NextResponse.json({ purchases: data || [] });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
