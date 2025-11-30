import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/Supabase/server';
import Stripe from 'stripe';

// Configuración para recibir el body raw
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'No signature provided' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        // Verificar que el evento viene de Stripe
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    const supabase = await createClient();

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutCompleted(session, supabase);
                break;
            }

            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object as Stripe.PaymentIntent;
                await handlePaymentSucceeded(paymentIntent, supabase);
                break;
            }

            case 'charge.refunded': {
                const charge = event.data.object as Stripe.Charge;
                await handleChargeRefunded(charge, supabase);
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json(
            { error: 'Webhook processing failed' },
            { status: 500 }
        );
    }
}

// Handler para cuando se completa el checkout
async function handleCheckoutCompleted(
    session: Stripe.Checkout.Session,
    supabase: any
) {
    const purchaseId = session.metadata?.purchase_id;
    const paymentType = session.metadata?.payment_type;

    if (!purchaseId) {
        console.error('No purchase_id in session metadata');
        return;
    }

    // Obtener la reserva
    const { data: purchase, error: fetchError } = await supabase
        .from('purchases')
        .select('*')
        .eq('id', purchaseId)
        .single();

    if (fetchError || !purchase) {
        console.error('Purchase not found:', purchaseId);
        return;
    }

    // Calcular el monto pagado
    const amountPaid = session.amount_total ? session.amount_total / 100 : 0;

    // Actualizar la reserva
    const newStatus = paymentType === 'full' || amountPaid >= purchase.total_amount
        ? 'paid'
        : 'reserved';

    await supabase
        .from('purchases')
        .update({
            status: newStatus,
            amount_paid: purchase.amount_paid + amountPaid,
            stripe_payment_id: session.payment_intent as string,
        })
        .eq('id', purchaseId);

    // Crear registro de pago
    await supabase
        .from('payments')
        .insert({
            purchase_id: purchaseId,
            amount: amountPaid,
            payment_type: paymentType || 'full',
            status: 'succeeded',
            stripe_payment_id: session.payment_intent as string,
        });

    // Reducir lugares disponibles si es el primer pago
    if (purchase.amount_paid === 0) {
        const { data: excursion } = await supabase
            .from('excursions')
            .select('available_seats')
            .eq('id', purchase.excursion_id)
            .single();

        if (excursion && excursion.available_seats > 0) {
            await supabase
                .from('excursions')
                .update({ available_seats: excursion.available_seats - 1 })
                .eq('id', purchase.excursion_id);
        }
    }

    console.log(`Purchase ${purchaseId} updated to ${newStatus}`);
}

// Handler para cuando el pago es exitoso
async function handlePaymentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
    supabase: any
) {
    // Buscar la reserva por payment_intent
    const { data: purchase } = await supabase
        .from('purchases')
        .select('*')
        .eq('stripe_payment_id', paymentIntent.id)
        .single();

    if (!purchase) {
        console.log('No purchase found for payment intent:', paymentIntent.id);
        return;
    }

    console.log(`Payment succeeded for purchase ${purchase.id}`);
}

// Handler para cuando se hace un reembolso
async function handleChargeRefunded(
    charge: Stripe.Charge,
    supabase: any
) {
    // Buscar la reserva
    const { data: purchase } = await supabase
        .from('purchases')
        .select('*')
        .eq('stripe_payment_id', charge.payment_intent)
        .single();

    if (!purchase) {
        console.log('No purchase found for charge:', charge.id);
        return;
    }

    // Actualizar estado de reembolso
    await supabase
        .from('purchases')
        .update({
            status: 'refunded',
            refund_status: 'refunded',
        })
        .eq('id', purchase.id);

    // Devolver el lugar disponible
    const { data: excursion } = await supabase
        .from('excursions')
        .select('available_seats')
        .eq('id', purchase.excursion_id)
        .single();

    if (excursion) {
        await supabase
            .from('excursions')
            .update({ available_seats: excursion.available_seats + 1 })
            .eq('id', purchase.excursion_id);
    }

    console.log(`Purchase ${purchase.id} refunded`);
}
