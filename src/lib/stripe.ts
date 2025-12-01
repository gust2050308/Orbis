import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY no está configurada en las variables de entorno');
}

// Cliente de Stripe para el backend
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-10-29.clover',
    typescript: true,
});

// Configuración de la app
export const STRIPE_CONFIG = {
    currency: 'mxn',
    paymentMethodTypes: ['card'] as const,
    mode: 'payment' as const,
};

// URLs de éxito y cancelación
export const getCheckoutUrls = (excursionId: number) => ({
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/Views/reservations/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/Views/Excursions/${excursionId}`,
});

