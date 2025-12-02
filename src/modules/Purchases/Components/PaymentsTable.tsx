    'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2 } from 'lucide-react';
import type { AdminPayment, PaymentStatus } from '../types';

const statusColors: Record<PaymentStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    succeeded: 'bg-green-100 text-green-800 border-green-300',
    failed: 'bg-red-100 text-red-800 border-red-300',
    refunded: 'bg-purple-100 text-purple-800 border-purple-300',
};

const statusLabels: Record<PaymentStatus, string> = {
    pending: 'Pendiente',
    succeeded: 'Exitoso',
    failed: 'Fallido',
    refunded: 'Reembolsado',
};

interface PaymentsTableProps {
    payments: AdminPayment[];
    onApprove: (paymentId: number) => void;
    onMarkRefunded: (paymentId: number) => void;
    onDelete: (paymentId: number) => void;
}

export function PaymentsTable({
    payments,
    onApprove,
    onMarkRefunded,
    onDelete,
}: PaymentsTableProps) {
    if (payments.length === 0) {
        return (
            <div className="text-center py-8 text-[#102542]/60">
                No hay pagos registrados
            </div>
        );
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Monto</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Stripe ID</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {payments.map((payment) => (
                        <TableRow key={payment.id}>
                            <TableCell className="font-mono text-xs">
                                #{payment.id}
                            </TableCell>
                            <TableCell className="font-semibold">
                                ${payment.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell className="capitalize text-sm">
                                {payment.payment_type}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={`${statusColors[payment.status]} text-xs`}
                                >
                                    {statusLabels[payment.status]}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-[#102542]/60">
                                {new Date(payment.created_at).toLocaleDateString('es-MX', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </TableCell>
                            <TableCell className="font-mono text-xs text-[#102542]/60">
                                {payment.stripe_payment_id ? (
                                    <a
                                        href={`https://dashboard.stripe.com/test/payments/${payment.stripe_payment_id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-[#256EFF] underline"
                                    >
                                        {payment.stripe_payment_id.slice(0, 20)}...
                                    </a>
                                ) : (
                                    <span className="text-gray-400">Manual</span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                    {payment.status === 'pending' && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onApprove(payment.id)}
                                                title="Aprobar"
                                            >
                                                <Check className="h-4 w-4 text-green-600" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onDelete(payment.id)}
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4 text-red-600" />
                                            </Button>
                                        </>
                                    )}
                                    {payment.status === 'succeeded' && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onMarkRefunded(payment.id)}
                                            title="Marcar como reembolsado"
                                        >
                                            <X className="h-4 w-4 text-purple-600" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
