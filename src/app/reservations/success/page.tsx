'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, XCircle, ArrowRight } from 'lucide-react'

export default function ReservationSuccessPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const sessionId = searchParams.get('session_id')

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // Simular verificación del pago
        const timer = setTimeout(() => {
            setLoading(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [sessionId])

    if (loading) {
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

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md w-full border-red-200">
                    <CardContent className="p-12 text-center">
                        <XCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-[#102542] mb-2">
                            Error al procesar
                        </h2>
                        <p className="text-[#102542]/60 mb-6">
                            {error}
                        </p>
                        <Button
                            onClick={() => router.push('/Views/Excursions')}
                            variant="outline"
                            className="w-full"
                        >
                            Volver a excursiones
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-md w-full border-green-200">
                <CardContent className="p-12 text-center">
                    {/* Icono de éxito */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                        <CheckCircle2 className="w-20 h-20 mx-auto text-green-500 relative" />
                    </div>

                    {/* Título */}
                    <h1 className="text-3xl font-bold text-[#102542] mb-2">
                        ¡Reserva Exitosa!
                    </h1>
                    <p className="text-[#102542]/60 mb-8">
                        Tu pago ha sido procesado correctamente
                    </p>

                    {/* Información */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
                        <p className="text-sm text-green-800 mb-2">
                            <strong>✓</strong> Recibirás un email de confirmación
                        </p>
                        <p className="text-sm text-green-800 mb-2">
                            <strong>✓</strong> Tu reserva ha sido registrada
                        </p>
                        <p className="text-sm text-green-800">
                            <strong>✓</strong> Puedes ver los detalles en "Mis Reservas"
                        </p>
                    </div>

                    {/* ID de sesión (para debug) */}
                    {sessionId && (
                        <p className="text-xs text-[#102542]/40 mb-6 font-mono">
                            ID: {sessionId.slice(0, 20)}...
                        </p>
                    )}

                    {/* Botones */}
                    <div className="space-y-3">
                        <Button
                            onClick={() => router.push('/Views/Excursions')}
                            className="w-full bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:opacity-90 text-white"
                        >
                            Ver más excursiones
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                        <Button
                            onClick={() => router.push('/')}
                            variant="outline"
                            className="w-full"
                        >
                            Volver al inicio
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
