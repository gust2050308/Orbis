'use client'

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { PaymentType } from '../types';

interface ManualPaymentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseId: number | null;
    remainingAmount: number;
    onSuccess: () => void;
}

export function ManualPaymentDialog({
    open,
    onOpenChange,
    purchaseId,
    remainingAmount,
    onSuccess,
}: ManualPaymentDialogProps) {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [paymentType, setPaymentType] = useState<PaymentType>('remaining');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!purchaseId || !amount) return;

        setLoading(true);
        try {
            const response = await fetch(`/api/admin/purchases/${purchaseId}/payments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    payment_type: paymentType,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al crear el pago');
            }

            onSuccess();
            onOpenChange(false);
            setAmount('');
        } catch (error) {
            console.error('Error creating payment:', error);
            alert('Error al registrar el pago');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Registrar Pago Manual</DialogTitle>
                    <DialogDescription>
                        Registra un pago realizado fuera del sistema (efectivo, transferencia, etc.)
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="amount">Monto</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            max={remainingAmount}
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                        <div className="text-xs text-[#102542]/60 mt-1">
                            Restante: ${remainingAmount.toFixed(2)} MXN
                        </div>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <Label htmlFor="payment_type">Tipo de Pago</Label>
                        <Select value={paymentType} onValueChange={(v) => setPaymentType(v as PaymentType)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="deposit">Depósito</SelectItem>
                                <SelectItem value="remaining">Restante</SelectItem>
                                <SelectItem value="full">Completo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading || !amount}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Registrar Pago'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
