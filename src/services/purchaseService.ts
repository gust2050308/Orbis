import { createClient } from '@/lib/Supabase/supabaseClient';
import type { Purchase, CreatePurchaseData, CheckoutResponse } from '@/types/purchases';

const supabase = createClient();

export const purchaseService = {
    // Crear checkout session
    async createCheckout(data: CreatePurchaseData): Promise<CheckoutResponse> {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al crear checkout');
        }

        return response.json();
    },

    // Obtener reservas del usuario actual
    async getUserPurchases(): Promise<Purchase[]> {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('Usuario no autenticado');
        }

        const { data, error } = await supabase
            .from('purchases')
            .select(`
        *,
        excursions (
          id,
          title,
          description,
          start_date,
          end_date,
          duration_days
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data || [];
    },

    // Obtener una reserva específica
    async getPurchaseById(id: number): Promise<Purchase | null> {
        const { data, error } = await supabase
            .from('purchases')
            .select(`
        *,
        excursions (
          id,
          title,
          description,
          start_date,
          end_date,
          duration_days,
          price
        ),
        payments (
          id,
          amount,
          payment_type,
          status,
          created_at
        )
      `)
            .eq('id', id)
            .single();

        if (error) {
            throw error;
        }

        return data;
    },

    // Cancelar una reserva (solo si está pending)
    async cancelPurchase(id: number): Promise<void> {
        const { data: purchase } = await supabase
            .from('purchases')
            .select('status')
            .eq('id', id)
            .single();

        if (!purchase) {
            throw new Error('Reserva no encontrada');
        }

        if (purchase.status !== 'pending') {
            throw new Error('Solo se pueden cancelar reservas pendientes');
        }

        const { error } = await supabase
            .from('purchases')
            .update({ status: 'cancelled' })
            .eq('id', id);

        if (error) {
            throw error;
        }
    },

    // Verificar si una reserva está expirada
    isExpired(purchase: Purchase): boolean {
        if (!purchase.expires_at) return false;
        return new Date(purchase.expires_at) < new Date();
    },

    // Obtener días restantes hasta la expiración
    getDaysUntilExpiration(purchase: Purchase): number | null {
        if (!purchase.expires_at) return null;

        const now = new Date();
        const expiresAt = new Date(purchase.expires_at);
        const diffTime = expiresAt.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 0;
    },

    // Calcular el monto restante a pagar
    getRemainingAmount(purchase: Purchase): number {
        return purchase.total_amount - purchase.amount_paid;
    },

    // Verificar si la reserva está completamente pagada
    isFullyPaid(purchase: Purchase): boolean {
        return purchase.amount_paid >= purchase.total_amount;
    },
};
