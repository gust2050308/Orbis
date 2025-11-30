import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

// Cliente de Stripe para el frontend
export const getStripe = () => {
    if (!stripePromise) {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

        if (!publishableKey) {
            throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no está configurada');
        }

        stripePromise = loadStripe(publishableKey);
    }

    return stripePromise;
};
