// Tipos para el sistema de reservas y pagos

export type PurchaseStatus =
    | 'pending'      // Creada pero sin pagar
    | 'reserved'     // Reservada (depósito pagado)
    | 'paid'         // Pagada completamente
    | 'cancelled'    // Cancelada
    | 'refunded'     // Reembolsada
    | 'expired'      // Expirada (pasó el tiempo límite)
    | 'refund_required'; // Requiere reembolso

export type RefundStatus =
    | 'none'             // Sin reembolso
    | 'required'         // Requiere reembolso
    | 'pending_refund'   // Reembolso en proceso
    | 'refunded';        // Reembolsado

export type PaymentType =
    | 'deposit'    // Pago de depósito
    | 'remaining'  // Pago del resto
    | 'full';      // Pago completo

export interface Purchase {
    id: number;
    user_id: string;
    excursion_id: number;
    total_amount: number;
    amount_paid: number;
    remaining_amount: number;
    currency: string;
    payment_type: PaymentType;
    status: PurchaseStatus;
    refund_status: RefundStatus;
    stripe_session_id: string | null;
    stripe_payment_id: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface Payment {
    id: number;
    purchase_id: number;
    amount: number;
    payment_type: PaymentType;
    status: 'pending' | 'succeeded' | 'failed' | 'refunded';
    stripe_payment_id: string | null;
    created_at: string;
    updated_at: string;
}

// Tipo para crear una nueva reserva
export interface CreatePurchaseData {
    excursion_id: number;
    payment_type: PaymentType;
    total_amount: number;
    amount_to_pay: number;
}

// Tipo para la respuesta del checkout
export interface CheckoutResponse {
    sessionId: string;
    url: string;
    purchaseId: number;
}
