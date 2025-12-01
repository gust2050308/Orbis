export type PaymentStatus = 'pending' | 'paid' | 'partially_paid' | 'expired' | 'cancelled';
export type RefundStatus = 'none' | 'requested' | 'partial' | 'full';
export type PaymentType = 'full' | 'deposit';

export interface Reservation {
    id: number;
    user_id: string;
    excursion_id: number;
    total_amount: number;
    amount_paid: number;
    number_of_people: number;
    currency: string;
    payment_type: PaymentType;
    status: PaymentStatus;
    refund_status: RefundStatus;
    stripe_session_id: string | null;
    stripe_payment_intent_id: string | null;
    expires_at: string;
    created_at: string;
    updated_at: string;
}

export interface ReservationWithExcursion extends Reservation {
    excursion: {
        id: number;
        title: string;
        description: string;
        start_date: string;
        end_date: string;
        price: number;
        available_seats: number;
        excursion_destinations: Array<{
            destination: {
                destination_images: Array<{
                    image_url: string;
                }>;
            };
        }>;
    };
}

export interface ReservationTableRow {
    id: number;
    excursionTitle: string;
    excursionId: number;
    startDate: string;
    endDate: string;
    numberOfPeople: number;
    totalAmount: number;
    amountPaid: number;
    status: PaymentStatus;
    paymentType: PaymentType;
    expiresAt: string;
    image?: string;
}
