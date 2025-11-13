'use client'

import { loadStripe } from "@stripe/stripe-js";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined");
}

const stripePromise = loadStripe(publishableKey);

export default function CheckoutButton() {
  const handleClick = async () => {
    const res = await fetch("/api/checkout_sessions", { method: "POST" });
    const { url } = await res.json();
    window.location.href = url;
  };

  return <button onClick={handleClick}>Comprar paquete</button>;
}
