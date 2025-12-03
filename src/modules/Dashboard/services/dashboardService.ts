'use server'

import { createClient } from "@/lib/Supabase/server";
import type {
    DashboardKPIs,
    MonthlyRevenue,
    TopDestination,
    TopExcursion,
    UpcomingExcursion
} from "../types/dashboard";

/**
 * Obtiene los KPIs principales del dashboard
 */
export async function getDashboardKPIs(): Promise<DashboardKPIs> {
    const supabase = await createClient();

    // Fecha actual y hace 30 días
    const now = new Date();
    const in30Days = new Date(now);
    in30Days.setDate(now.getDate() + 30);

    // Primer día del mes
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    try {
        // 1. Excursiones activas
        const { count: activeCount } = await supabase
            .from('excursions')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'active');

        // 2. Excursiones próximas (30 días)
        const { count: upcomingCount } = await supabase
            .from('excursions')
            .select('*', { count: 'exact', head: true })
            .gte('start_date', now.toISOString())
            .lte('start_date', in30Days.toISOString());

        // 3. Excursiones casi llenas (available_seats <= 5)
        const { count: nearlyFullCount } = await supabase
            .from('excursions')
            .select('*', { count: 'exact', head: true })
            .lte('available_seats', 5)
            .gt('available_seats', 0);

        // 4. Ingresos del mes (payments completados)
        const { data: paymentsData } = await supabase
            .from('payments')
            .select('amount')
            .eq('status', 'succeeded')
            .gte('created_at', firstDayOfMonth.toISOString());

        const monthRevenue = paymentsData?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

        // 5. Apartados del mes (sum de amount_paid de purchases del mes donde payment_type = 'deposit')
        const { data: depositsData } = await supabase
            .from('purchases')
            .select('amount_paid')
            .eq('payment_type', 'deposit')
            .gte('created_at', firstDayOfMonth.toISOString());

        const monthDeposits = depositsData?.reduce((sum, p) => sum + (p.amount_paid || 0), 0) || 0;

        // 6. Reservas del mes
        const { count: monthReservations } = await supabase
            .from('purchases')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', firstDayOfMonth.toISOString());

        return {
            activeExcursions: activeCount || 0,
            upcomingExcursions: upcomingCount || 0,
            nearlyFullExcursions: nearlyFullCount || 0,
            monthRevenue: monthRevenue,
            monthDeposits: monthDeposits,
            monthReservations: monthReservations || 0,
        };
    } catch (error) {
        console.error('Error fetching dashboard KPIs:', error);
        return {
            activeExcursions: 0,
            upcomingExcursions: 0,
            nearlyFullExcursions: 0,
            monthRevenue: 0,
            monthDeposits: 0,
            monthReservations: 0,
        };
    }
}

/**
 * Obtiene los ingresos mensuales de los últimos N meses
 */
export async function getMonthlyRevenue(months: number = 4): Promise<MonthlyRevenue[]> {
    const supabase = await createClient();

    try {
        const { data: paymentsData, error } = await supabase
            .from('payments')
            .select('amount, created_at')
            .eq('status', 'succeeded')
            .gte('created_at', new Date(new Date().setMonth(new Date().getMonth() - months)).toISOString())
            .order('created_at', { ascending: true });

        if (error) throw error;

        // Agrupar por mes
        const revenueByMonth = new Map<string, number>();

        paymentsData?.forEach(payment => {
            const date = new Date(payment.created_at);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            const currentRevenue = revenueByMonth.get(monthKey) || 0;
            revenueByMonth.set(monthKey, currentRevenue + (payment.amount || 0));
        });

        // Convertir a array y asegurar que tengamos los últimos N meses
        const result: MonthlyRevenue[] = [];
        const now = new Date();

        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
            result.push({
                month: monthKey,
                revenue: revenueByMonth.get(monthKey) || 0,
            });
        }

        return result;
    } catch (error) {
        console.error('Error fetching monthly revenue:', error);
        return [];
    }
}

/**
 * Obtiene los top N destinos más reservados
 */
export async function getTopDestinations(limit: number = 5): Promise<TopDestination[]> {
    const supabase = await createClient();

    try {
        // Obtener destinos con sus excursiones y contar purchases
        const { data, error } = await supabase
            .from('destinations')
            .select(`
        id,
        name,
        excursions_destinations!inner(
          excursion:excursions!inner(
            purchases(count)
          )
        )
      `);

        if (error) throw error;

        // Procesar y agrupar resultados
        const destinationMap = new Map<number, { id: number; name: string; reservations: number }>();

        data?.forEach((dest: any) => {
            const reservations = dest.excursions_destinations?.reduce((total: number, ed: any) => {
                return total + (ed.excursion?.purchases?.[0]?.count || 0);
            }, 0) || 0;

            destinationMap.set(dest.id, {
                id: dest.id,
                name: dest.name,
                reservations,
            });
        });

        // Convertir a array, ordenar y limitar
        return Array.from(destinationMap.values())
            .sort((a, b) => b.reservations - a.reservations)
            .slice(0, limit);
    } catch (error) {
        console.error('Error fetching top destinations:', error);
        return [];
    }
}

/**
 * Obtiene las top N excursiones más vendidas
 */
export async function getTopExcursions(limit: number = 5): Promise<TopExcursion[]> {
    const supabase = await createClient();

    try {
        const { data: excursionsData, error } = await supabase
            .from('excursions')
            .select(`
        id,
        title,
        max_seats,
        available_seats,
        purchases(
          id,
          amount_paid
        )
      `)
            .limit(100); // Obtener más para luego filtrar los top

        if (error) throw error;

        const result: TopExcursion[] = excursionsData?.map((exc: any) => {
            const sales = exc.purchases?.length || 0;
            const revenue = exc.purchases?.reduce((sum: number, p: any) => sum + (p.amount_paid || 0), 0) || 0;
            const occupancy = exc.max_seats > 0
                ? Math.round(((exc.max_seats - exc.available_seats) / exc.max_seats) * 100)
                : 0;

            return {
                id: exc.id,
                title: exc.title,
                sales,
                revenue,
                occupancy,
            };
        }) || [];

        // Ordenar por ventas y limitar
        return result.sort((a, b) => b.sales - a.sales).slice(0, limit);
    } catch (error) {
        console.error('Error fetching top excursions:', error);
        return [];
    }
}

/**
 * Obtiene las próximas excursiones
 */
export async function getUpcomingExcursions(): Promise<UpcomingExcursion[]> {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase
            .from('excursions')
            .select(`
        id,
        start_date,
        title,
        available_seats,
        max_seats,
        status,
        purchases(count)
      `)
            .gte('start_date', new Date().toISOString())
            .order('start_date', { ascending: true })
            .limit(10);

        if (error) throw error;

        return data?.map((exc: any) => ({
            id: exc.id,
            date: exc.start_date,
            title: exc.title,
            availableSeats: exc.available_seats || 0,
            totalSeats: exc.max_seats || 0,
            status: exc.status,
            reservations: exc.purchases?.[0]?.count || 0,
        })) || [];
    } catch (error) {
        console.error('Error fetching upcoming excursions:', error);
        return [];
    }
}
