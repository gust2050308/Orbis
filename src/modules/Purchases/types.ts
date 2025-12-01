// Admin-specific types for purchases management

export type PurchaseStatus =
    | 'pending'
    | 'reserved'
    | 'paid'
    | 'cancelled'
    | 'refunded'
    | 'expired'
    | 'refund_required';

export type RefundStatus =
    | 'none'
    | 'required'
    | 'pending_refund'
    | 'refunded';

export type PaymentStatus =
    | 'pending'
    | 'succeeded'
    | 'failed'
    | 'refunded';

export type PaymentType =
    | 'deposit'
    | 'remaining'
    | 'full';

// Purchase with joined user and excursion data
export interface AdminPurchase {
    id: number;
    user_id: string;
    excursion_id: number;
    total_amount: number;
    amount_paid: number;
    remaining_amount: number;
    number_of_people: number;
    currency: string;
    payment_type: PaymentType;
    status: PurchaseStatus;
    refund_status: RefundStatus;
    stripe_session_id: string | null;
    stripe_payment_id: string | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;

    // Joined data
    user: {
        id: string;
        name: string;
        last_name: string;
        phone: string;
        email: string;
        country: string;
        city: string;
    };

    excursion: {
        id: number;
        title: string;
        description: string;
        price: number;
        start_date: string;
        end_date: string;
    };
}

// Payment record
export interface AdminPayment {
    id: number;
    purchase_id: number;
    amount: number;
    payment_type: PaymentType;
    status: PaymentStatus;
    stripe_payment_id: string | null;
    created_at: string;
    updated_at: string;
}

// For DataTable display
export interface PurchaseTableRow {
    id: number;
    userName: string;
    userEmail: string;
    excursionTitle: string;
    totalAmount: number;
    amountPaid: number;
    remainingAmount: number;
    numberOfPeople: number;
    status: PurchaseStatus;
    refundStatus: RefundStatus;
    expiresAt: string | null;
    createdAt: string;
}

// For manual payment creation
export interface CreateManualPaymentData {
    purchase_id: number;
    amount: number;
    payment_type: PaymentType;
    notes?: string;
}

// For updating purchase
export interface UpdatePurchaseData {
    status?: PurchaseStatus;
    refund_status?: RefundStatus;
    expires_at?: string;
}

// For updating payment
export interface UpdatePaymentData {
    status?: PaymentStatus;
}
