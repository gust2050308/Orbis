import { NextRequest, NextResponse } from 'next/server';
import { stripe, getCheckoutUrls, STRIPE_CONFIG } from '@/lib/stripe';
import { createClient } from '@/lib/Supabase/server';
import type { CreatePurchaseData } from '@/types/purchases';

export async function POST(request: NextRequest) {
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

        // Obtener datos del body
        const body: CreatePurchaseData = await request.json();
        const { excursion_id, payment_type, total_amount, amount_to_pay, number_of_people = 1 } = body;

        // Validar datos
        if (!excursion_id || !payment_type || !total_amount || !amount_to_pay) {
            return NextResponse.json(
                { error: 'Datos incompletos' },
                { status: 400 }
            );
        }

        // Obtener información de la excursión
        const { data: excursion, error: excError } = await supabase
            .from('excursions')
            .select('*')
            .eq('id', excursion_id)
            .single();

        if (excError || !excursion) {
            return NextResponse.json(
                { error: 'Excursión no encontrada' },
                { status: 404 }
            );
        }

        // Verificar disponibilidad
        if (excursion.available_seats <= 0) {
            return NextResponse.json(
                { error: 'No hay lugares disponibles' },
                { status: 400 }
            );
        }

        // Calcular fecha de expiración (10 días antes del evento)
        const startDate = new Date(excursion.start_date);
        const expiresAt = new Date(startDate);
        expiresAt.setDate(expiresAt.getDate() - 10);

        // Verificar que no esté muy cerca de la fecha
        const now = new Date();
        if (now >= expiresAt) {
            return NextResponse.json(
                { error: 'La excursión está muy próxima para reservar' },
                { status: 400 }
            );
        }

        // Crear sesión de Stripe Checkout con toda la información necesaria en metadata
        // La compra se creará en el webhook cuando el pago sea exitoso
        const session = await stripe.checkout.sessions.create({
            payment_method_types: [...STRIPE_CONFIG.paymentMethodTypes],
            mode: STRIPE_CONFIG.mode,
            line_items: [
                {
                    price_data: {
                        currency: STRIPE_CONFIG.currency,
                        product_data: {
                            name: `${excursion.title} (${number_of_people} ${number_of_people === 1 ? 'persona' : 'personas'})`,
                            description: `${payment_type === 'deposit' ? 'Depósito' : 'Pago completo'} - ${excursion.description || ''}`,
                            images: [],
                        },
                        unit_amount: Math.round(amount_to_pay * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                user_id: user.id,
                excursion_id: excursion_id.toString(),
                payment_type,
                total_amount: total_amount.toString(),
                amount_to_pay: amount_to_pay.toString(),
                number_of_people: number_of_people.toString(),
                currency: STRIPE_CONFIG.currency,
                expires_at: expiresAt.toISOString(),
            },
            ...getCheckoutUrls(excursion_id),
        });

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        });

    } catch (error) {
        console.error('Error in checkout:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}
