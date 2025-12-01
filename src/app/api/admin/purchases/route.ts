import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/Supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Check admin auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        // Check admin role
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json(
                { error: 'No autorizado - Se requiere rol de administrador' },
                { status: 403 }
            );
        }

        // Fetch all purchases with joins
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
            return NextResponse.json(
                { error: 'Error al obtener las compras' },
                { status: 500 }
            );
        }

        // Get emails from auth.users
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

        return NextResponse.json({ purchases: purchasesWithEmails });

    } catch (error) {
        console.error('Error in purchases API:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
