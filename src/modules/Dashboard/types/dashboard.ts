// Types for Dashboard
export type DashboardKPIs = {
    activeExcursions: number;
    upcomingExcursions: number;
    nearlyFullExcursions: number;
    monthRevenue: number;
    monthDeposits: number;
    monthReservations: number;
}

export type MonthlyRevenue = {
    month: string;  // Ej: "Ene 2024"
    revenue: number;
}

export type TopDestination = {
    id: number;
    name: string;
    reservations: number;
}

export type TopExcursion = {
    id: number;
    title: string;
    sales: number;
    revenue: number;
    occupancy: number;  // Porcentaje
}

export type UpcomingExcursion = {
    id: number;
    date: string;
    title: string;
    availableSeats: number;
    totalSeats: number;
    status: string;
    reservations: number;
}
