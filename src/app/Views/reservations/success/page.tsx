'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function ReservationSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')

    useEffect(() => {
        // Redirigir a la página de reservaciones con el parámetro de éxito
        const timer = setTimeout(() => {
            router.push(`/Views/reservations?success=true${sessionId ? `&session_id=${sessionId}` : ''}`);
        }, 1500);

        return () => clearTimeout(timer);
    }, [router, sessionId]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full">
                <CardContent className="p-12 text-center">
                    <Loader2 className="w-16 h-16 mx-auto text-[#256EFF] animate-spin mb-4" />
                    <h2 className="text-xl font-semibold text-[#102542] mb-2">
                        Procesando tu reserva...
                    </h2>
                    <p className="text-[#102542]/60">
                        Estamos confirmando tu pago
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
