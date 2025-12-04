'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ReservationsDataTable } from '@/modules/User/MyExcursions/Components/ReservationsDataTable';
import { SuccessDialog } from '@/modules/User/MyExcursions/Components/SuccessDialog';
import type { ReservationWithExcursion, ReservationTableRow } from '@/modules/User/MyExcursions/types';

export default function ReservationsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const successParam = searchParams.get('success');
    const sessionId = searchParams.get('session_id');

    const [loading, setLoading] = useState(true);
    const [reservations, setReservations] = useState<ReservationTableRow[]>([]);
    const [showSuccess, setShowSuccess] = useState(successParam === 'true');

    useEffect(() => {
        fetchReservations();
    }, []);

    useEffect(() => {
        if (successParam === 'true') {
            setShowSuccess(true);
            // Limpiar query params después de mostrar
            const timer = setTimeout(() => {
                router.replace('/Views/MyJourneys', { scroll: false });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [successParam, router]);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/reservations');

            if (!response.ok) {
                throw new Error('Error al cargar reservas');
            }

            const data = await response.json();

            // Transformar datos para la tabla
            const tableData: ReservationTableRow[] = (data.reservations || []).map((res: ReservationWithExcursion) => {
                // Extraer la primera imagen del primer destino
                const firstImage = res.excursion?.excursion_destinations?.[0]?.destination?.destination_images?.[0]?.image_url;

                return {
                    id: res.id,
                    excursionTitle: res.excursion?.title || 'Sin título',
                    excursionId: res.excursion_id,
                    startDate: res.excursion?.start_date || '',
                    endDate: res.excursion?.end_date || '',
                    numberOfPeople: res.number_of_people || 1,
                    totalAmount: res.total_amount,
                    amountPaid: res.amount_paid,
                    status: res.status,
                    paymentType: res.payment_type,
                    expiresAt: res.expires_at,
                    image: firstImage,
                };
            });

            setReservations(tableData);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompletePayment = async (reservationId: number) => {
        try {
            // Encontrar la reserva
            const reservation = reservations.find(r => r.id === reservationId);
            if (!reservation) return;

            // Calcular el monto restante
            const remainingAmount = reservation.totalAmount - reservation.amountPaid;

            // Crear sesión de checkout para completar el pago
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    excursion_id: reservation.excursionId,
                    payment_type: 'remaining',
                    total_amount: reservation.totalAmount,
                    amount_to_pay: remainingAmount,
                    number_of_people: reservation.numberOfPeople,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear la sesión de pago');
            }

            const { url } = await response.json();

            // Redirigir a Stripe Checkout
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Error completing payment:', error);
            alert('Error al procesar el pago. Por favor intenta de nuevo.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto text-[#256EFF] animate-spin mb-4" />
                    <p className="text-[#102542]/60">Cargando reservaciones...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-[#256EFF]/10 to-[#07BEB8]/10 rounded-lg">
                            <ShoppingBag className="w-6 h-6 text-[#256EFF]" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl text-[#102542]">
                                Mis Reservaciones
                            </CardTitle>
                            <CardDescription>
                                Administra tus excursiones y pagos
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ReservationsDataTable
                        data={reservations}
                        onCompletePayment={handleCompletePayment}
                    />
                </CardContent>
            </Card>

            {/* Success Dialog */}
            <SuccessDialog
                open={showSuccess}
                onOpenChange={setShowSuccess}
                sessionId={sessionId}
            />
        </div>
    );
}
