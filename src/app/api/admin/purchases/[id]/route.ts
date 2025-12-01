import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/Supabase/server';

export async function GET(
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

        // Fetch purchase with joins
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

        if (error || !data) {
            return NextResponse.json({ error: 'Compra no encontrada' }, { status: 404 });
        }

        // Get email
        const { data: authUser } = await supabase.auth.admin.getUserById(data.user_id);

        const purchase = {
            ...data,
            user: {
                ...data.user,
                email: authUser?.user?.email || '',
            }
        };

        return NextResponse.json({ purchase });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function PATCH(
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

        const updates = await request.json();

        const { error } = await supabase
            .from('purchases')
            .update(updates)
            .eq('id', purchaseId);

        if (error) {
            return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
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

        // Check for payments
        const { data: payments } = await supabase
            .from('payments')
            .select('id')
            .eq('purchase_id', purchaseId);

        if (payments && payments.length > 0) {
            return NextResponse.json(
                { error: 'No se puede eliminar una compra con pagos' },
                { status: 400 }
            );
        }

        const { error } = await supabase
            .from('purchases')
            .delete()
            .eq('id', purchaseId);

        if (error) {
            return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
