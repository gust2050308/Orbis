'use client'

import { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, MapPin, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { PaymentsTable } from './PaymentsTable';
import type { AdminPurchase, AdminPayment, PurchaseStatus, RefundStatus } from '../types';

const statusColors: Record<PurchaseStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    reserved: 'bg-blue-100 text-blue-800 border-blue-300',
    paid: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    refunded: 'bg-purple-100 text-purple-800 border-purple-300',
    expired: 'bg-red-100 text-red-800 border-red-300',
    refund_required: 'bg-orange-100 text-orange-800 border-orange-300',
};

const statusLabels: Record<PurchaseStatus, string> = {
    pending: 'Pendiente',
    reserved: 'Reservado',
    paid: 'Pagado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
    expired: 'Expirado',
    refund_required: 'Requiere Reembolso',
};

interface PurchaseDetailSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseId: number | null;
    onApprovePayment: (paymentId: number) => void;
    onMarkPaymentRefunded: (paymentId: number) => void;
    onDeletePayment: (paymentId: number) => void;
}

export function PurchaseDetailSheet({
    open,
    onOpenChange,
    purchaseId,
    onApprovePayment,
    onMarkPaymentRefunded,
    onDeletePayment,
}: PurchaseDetailSheetProps) {
    const [loading, setLoading] = useState(false);
    const [purchase, setPurchase] = useState<AdminPurchase | null>(null);
    const [payments, setPayments] = useState<AdminPayment[]>([]);

    useEffect(() => {
        if (open && purchaseId) {
            fetchDetails();
        }
    }, [open, purchaseId]);

    const fetchDetails = async () => {
        if (!purchaseId) return;

        setLoading(true);
        try {
            // Fetch purchase details
            const purRes = await fetch(`/api/admin/purchases/${purchaseId}`);
            if (purRes.ok) {
                const data = await purRes.json();
                setPurchase(data.purchase);
            }

            // Fetch payments
            const payRes = await fetch(`/api/admin/purchases/${purchaseId}/payments`);
            if (payRes.ok) {
                const data = await payRes.json();
                setPayments(data.payments || []);
            }
        } catch (error) {
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!purchase && loading) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 animate-spin text-[#256EFF]" />
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    if (!purchase) return null;

    const expiresAt = purchase.expires_at ? new Date(purchase.expires_at) : null;
    const isExpired = expiresAt && new Date() > expiresAt;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-2xl">Compra #{purchase.id}</SheetTitle>
                    <SheetDescription>
                        Creada el {new Date(purchase.created_at).toLocaleDateString('es-MX', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6 mt-6">
                    {/* Status & Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-sm text-[#102542]/60 mb-1">Estado</div>
                            <Badge variant="outline" className={`${statusColors[purchase.status]}`}>
                                {statusLabels[purchase.status]}
                            </Badge>
                        </div>
                        <div>
                            <div className="text-sm text-[#102542]/60 mb-1">Reembolso</div>
                            <Badge variant="outline" className="capitalize">
                                {purchase.refund_status}
                            </Badge>
                        </div>
                    </div>

                    {/* Amounts */}
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-[#102542]/60">Total:</span>
                            <span className="font-semibold">${purchase.total_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-[#102542]/60">Pagado:</span>
                            <span className="font-semibold text-green-600">${purchase.amount_paid.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t pt-2">
                            <span className="text-[#102542]/60">Restante:</span>
                            <span className="font-bold text-orange-600">${purchase.remaining_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-[#102542]/50">
                            <span>Personas:</span>
                            <span>{purchase.number_of_people}</span>
                        </div>
                    </div>

                    {/* Expiration */}
                    {expiresAt && (
                        <div className={`p-3 rounded-lg ${isExpired ? 'bg-red-50' : 'bg-blue-50'}`}>
                            <div className="text-sm font-medium">
                                {isExpired ? '⚠️ Expirado' : 'Expira'}
                            </div>
                            <div className="text-xs text-[#102542]/60">
                                {expiresAt.toLocaleDateString('es-MX', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* User Info */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <User className="w-5 h-5 text-[#256EFF]" />
                            Usuario
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-[#102542]/60">Nombre: </span>
                                <span className="font-medium">{purchase.user.name} {purchase.user.last_name}</span>
                            </div>
                            <div>
                                <span className="text-[#102542]/60">Email: </span>
                                <span className="font-medium">{purchase.user.email}</span>
                            </div>
                            {purchase.user.phone && (
                                <div>
                                    <span className="text-[#102542]/60">Teléfono: </span>
                                    <span className="font-medium">{purchase.user.phone}</span>
                                </div>
                            )}
                            {purchase.user.country && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4 text-[#07BEB8]" />
                                    <span className="font-medium">{purchase.user.city}, {purchase.user.country}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Excursion Info */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-[#07BEB8]" />
                            Excursión
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="font-semibold text-base">{purchase.excursion.title}</div>
                            <div className="text-[#102542]/60">{purchase.excursion.description}</div>
                            <div className="flex items-center gap-2 text-xs">
                                <Calendar className="w-4 h-4" />
                                <span>
                                    {new Date(purchase.excursion.start_date).toLocaleDateString('es-MX')} -
                                    {new Date(purchase.excursion.end_date).toLocaleDateString('es-MX')}
                                </span>
                            </div>
                            <div className="text-xs">
                                <span className="text-[#102542]/60">Precio: </span>
                                <span className="font-semibold">${purchase.excursion.price.toFixed(2)}</span>
                            </div>
                            <Button
                                variant="link"
                                size="sm"
                                className="p-0 h-auto"
                                onClick={() => window.open(`/Views/Excursions/${purchase.excursion_id}`, '_blank')}
                            >
                                Ver excursión <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {/* Stripe Info */}
                    {purchase.stripe_session_id && (
                        <div className="text-xs text-[#102542]/60">
                            <div className="mb-1">Stripe Session:</div>
                            <a
                                href={`https://dashboard.stripe.com/test/checkout/sessions/${purchase.stripe_session_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-[#256EFF] hover:underline break-all"
                            >
                                {purchase.stripe_session_id}
                            </a>
                        </div>
                    )}

                    <Separator />

                    {/* Payments */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            Pagos ({payments.length})
                        </h3>
                        <PaymentsTable
                            payments={payments}
                            onApprove={onApprovePayment}
                            onMarkRefunded={onMarkPaymentRefunded}
                            onDelete={onDeletePayment}
                        />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
