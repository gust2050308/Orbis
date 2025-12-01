import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/Supabase/server';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Verificar autenticación
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            );
        }

        // Obtener reservas del usuario con sus excursiones
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
            return NextResponse.json(
                { error: 'Error al obtener las reservas' },
                { status: 500 }
            );
        }

        return NextResponse.json({ reservations: data || [] });

    } catch (error) {
        console.error('Error in reservations API:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
