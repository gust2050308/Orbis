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
    const metadata = session.metadata;
    const paymentType = metadata?.payment_type;
    const userId = metadata?.user_id;
    const excursionId = metadata?.excursion_id;
    const totalAmount = metadata?.total_amount;
    const amountToPay = metadata?.amount_to_pay;
    const numberOfPeople = metadata?.number_of_people;
    const currency = metadata?.currency;
    const expiresAt = metadata?.expires_at;

    // Validar que tenemos todos los datos necesarios
    if (!userId || !excursionId || !totalAmount || !amountToPay) {
        console.error('Missing required metadata in session:', session.id);
        return;
    }

    // Calcular el monto pagado
    const amountPaid = session.amount_total ? session.amount_total / 100 : 0;
    const totalAmountNum = parseFloat(totalAmount);
    const numberOfPeopleNum = parseInt(numberOfPeople || '1');

    // Si es un pago "remaining", buscar la compra existente para actualizarla
    if (paymentType === 'remaining') {
        // Buscar la compra existente del usuario para esta excursión
        const { data: existingPurchase, error: fetchError } = await supabase
            .from('purchases')
            .select('*')
            .eq('user_id', userId)
            .eq('excursion_id', parseInt(excursionId))
            .in('status', ['reserved', 'pending'])
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (fetchError || !existingPurchase) {
            console.error('Existing purchase not found for remaining payment:', session.id);
            return;
        }

        // Actualizar la compra existente
        const newAmountPaid = existingPurchase.amount_paid + amountPaid;
        const newStatus = newAmountPaid >= totalAmountNum ? 'paid' : 'pending';

        await supabase
            .from('purchases')
            .update({
                status: newStatus,
                amount_paid: newAmountPaid,
            })
            .eq('id', existingPurchase.id);

        // Crear registro de pago adicional
        await supabase
            .from('payments')
            .insert({
                purchase_id: existingPurchase.id,
                amount: amountPaid,
                payment_type: 'remaining',
                status: 'succeeded',
                stripe_payment_id: session.payment_intent as string,
            });

        console.log(`Purchase ${existingPurchase.id} updated with remaining payment. New status: ${newStatus}`);
        return;
    }

    // Para pagos completos o depósitos, crear nueva compra
    // Determinar estado:
    // - 'paid': Si es pago completo o si ya se pagó todo
    // - 'pending': Si es depósito (falta completar el pago)
    const newStatus = paymentType === 'full' || amountPaid >= totalAmountNum
        ? 'paid'
        : 'pending';

    // CREAR la compra (no actualizar)
    const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
            user_id: userId,
            excursion_id: parseInt(excursionId),
            total_amount: totalAmountNum,
            amount_paid: amountPaid,
            number_of_people: numberOfPeopleNum,
            currency: currency || 'mxn',
            payment_type: paymentType || 'full',
            status: newStatus,
            refund_status: 'none',
            stripe_session_id: session.id,
            stripe_payment_id: session.payment_intent as string,
            expires_at: expiresAt,
        })
        .select()
        .single();

    if (purchaseError || !purchase) {
        console.error('Error creating purchase from webhook:', purchaseError);
        return;
    }

    // Crear registro de pago
    await supabase
        .from('payments')
        .insert({
            purchase_id: purchase.id,
            amount: amountPaid,
            payment_type: paymentType || 'full',
            status: 'succeeded',
            stripe_payment_id: session.payment_intent as string,
        });

    // Reducir lugares disponibles
    const { data: excursion } = await supabase
        .from('excursions')
        .select('available_seats')
        .eq('id', parseInt(excursionId))
        .single();

    if (excursion && excursion.available_seats > 0) {
        await supabase
            .from('excursions')
            .update({ available_seats: excursion.available_seats - 1 })
            .eq('id', parseInt(excursionId));
    }

    console.log(`Purchase ${purchase.id} created with status ${newStatus}`);
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
