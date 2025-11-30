'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2, CreditCard, Wallet, AlertCircle } from 'lucide-react'
import { purchaseService } from '@/services/purchaseService'
import type { Excursion } from '@/modules/Excursions/shared/dtoExcursion'
import type { PaymentType } from '@/types/purchases'

interface ReservationDialogProps {
    excursion: Excursion
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ReservationDialog({ excursion, open, onOpenChange }: ReservationDialogProps) {
    const [paymentType, setPaymentType] = useState<PaymentType>('deposit')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const price = Number(excursion.price ?? 0)
    const minDeposit = Number(excursion.min_deposit ?? 0)
    const amountToPay = paymentType === 'deposit' ? minDeposit : price

    const handleReserve = async () => {
        try {
            setLoading(true)
            setError(null)

            const availableSeats = Number(excursion.available_seats ?? 0)
            if (availableSeats <= 0) {
                setError('No hay lugares disponibles para esta excursión')
                return
            }

            const { url } = await purchaseService.createCheckout({
                excursion_id: excursion.id,
                payment_type: paymentType,
                total_amount: price,
                amount_to_pay: amountToPay,
            })

            if (url) {
                window.location.href = url
            } else {
                throw new Error('No se recibió URL de checkout')
            }
        } catch (err) {
            console.error('Error creating reservation:', err)
            setError(err instanceof Error ? err.message : 'Error al procesar la reserva')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#102542]">
                        Reservar Excursión
                    </DialogTitle>
                    <DialogDescription>
                        {excursion.title}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Opciones de pago */}
                    <div>
                        <Label className="text-base font-semibold text-[#102542] mb-3 block">
                            Selecciona tu opción de pago
                        </Label>
                        <div className="space-y-3">
                            {/* Opción de depósito */}
                            {minDeposit > 0 && (
                                <button
                                    onClick={() => setPaymentType('deposit')}
                                    className={`w-full flex items-start space-x-3 p-4 border-2 rounded-lg transition-colors text-left ${paymentType === 'deposit'
                                            ? 'border-[#256EFF] bg-[#256EFF]/5'
                                            : 'border-[#256EFF]/20 hover:border-[#256EFF]/40'
                                        }`}
                                >
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${paymentType === 'deposit' ? 'border-[#256EFF]' : 'border-gray-300'
                                        }`}>
                                        {paymentType === 'deposit' && (
                                            <div className="w-3 h-3 rounded-full bg-[#256EFF]" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Wallet className="w-4 h-4 text-[#256EFF]" />
                                            <span className="font-semibold text-[#102542]">Pagar Depósito</span>
                                        </div>
                                        <p className="text-sm text-[#102542]/60">
                                            Reserva con ${minDeposit.toFixed(2)} MXN ahora
                                        </p>
                                        <p className="text-xs text-[#102542]/40 mt-1">
                                            Paga el resto (${(price - minDeposit).toFixed(2)} MXN) después
                                        </p>
                                    </div>
                                </button>
                            )}

                            {/* Opción de pago completo */}
                            <button
                                onClick={() => setPaymentType('full')}
                                className={`w-full flex items-start space-x-3 p-4 border-2 rounded-lg transition-colors text-left ${paymentType === 'full'
                                        ? 'border-[#07BEB8] bg-[#07BEB8]/5'
                                        : 'border-[#256EFF]/20 hover:border-[#256EFF]/40'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${paymentType === 'full' ? 'border-[#07BEB8]' : 'border-gray-300'
                                    }`}>
                                    {paymentType === 'full' && (
                                        <div className="w-3 h-3 rounded-full bg-[#07BEB8]" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <CreditCard className="w-4 h-4 text-[#07BEB8]" />
                                        <span className="font-semibold text-[#102542]">Pago Completo</span>
                                    </div>
                                    <p className="text-sm text-[#102542]/60">
                                        Paga ${price.toFixed(2)} MXN ahora
                                    </p>
                                    {minDeposit > 0 && (
                                        <p className="text-xs text-green-600 mt-1 font-medium">
                                            ✓ Sin pagos pendientes
                                        </p>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Resumen */}
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#102542]/60">Precio total:</span>
                            <span className="font-semibold text-[#102542]">${price.toFixed(2)} MXN</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                            <span className="text-[#102542]">A pagar ahora:</span>
                            <span className="text-[#256EFF]">${amountToPay.toFixed(2)} MXN</span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Información importante */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                        <p className="font-semibold mb-1">📌 Importante:</p>
                        <ul className="space-y-1 ml-4 list-disc">
                            <li>Tu reserva expira 10 días antes de la fecha de inicio</li>
                            <li>Recibirás confirmación por email</li>
                            <li>El pago es seguro a través de Stripe</li>
                        </ul>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleReserve}
                            disabled={loading || Number(excursion.available_seats ?? 0) <= 0}
                            className="flex-1 bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:opacity-90 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-4 h-4 mr-2" />
                                    Continuar al pago
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
