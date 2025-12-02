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
import { AlertTriangle, Undo2, Loader2 } from 'lucide-react';

interface RefundPurchaseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseId: number | null;
    userName?: string;
    amountPaid?: number;
    onConfirm: (purchaseId: number) => Promise<void>;
}

export function RefundPurchaseDialog({
    open,
    onOpenChange,
    purchaseId,
    userName,
    amountPaid,
    onConfirm,
}: RefundPurchaseDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!purchaseId) return;

        try {
            setLoading(true);
            await onConfirm(purchaseId);
            onOpenChange(false);
        } catch (error) {
            console.error('Error refunding purchase:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!loading) {
            onOpenChange(open);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                            <Undo2 className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl text-[#102542]">
                                Reembolsar Compra
                            </DialogTitle>
                            <DialogDescription>
                                Compra #{purchaseId}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Warning */}
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-purple-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-purple-900">
                                    Confirmar reembolso
                                </p>
                                <p className="text-sm text-purple-700 mt-1">
                                    Esta acción cambiará el estado a "Reembolsado" y marcará el estado de reembolso como procesado.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Refund Details */}
                    <div className="space-y-3 p-4 bg-gradient-to-r from-purple-50/50 to-purple-100/30 rounded-lg border border-purple-200">
                        <div className="text-sm">
                            <span className="font-medium text-[#102542]/70">ID de Compra:</span>{' '}
                            <span className="font-mono text-[#102542]">#{purchaseId}</span>
                        </div>
                        {userName && (
                            <div className="text-sm">
                                <span className="font-medium text-[#102542]/70">Cliente:</span>{' '}
                                <span className="text-[#102542]">{userName}</span>
                            </div>
                        )}
                        {amountPaid !== undefined && amountPaid > 0 && (
                            <div className="text-sm pt-2 border-t border-purple-200">
                                <span className="font-medium text-[#102542]/70">Monto a reembolsar:</span>{' '}
                                <span className="text-lg font-bold text-purple-700">
                                    ${amountPaid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-[#102542]/60 bg-gray-50 p-3 rounded border border-gray-200">
                        <strong>Nota:</strong> Asegúrate de procesar el reembolso real a través de tu proveedor de pagos (Stripe, etc.) antes o después de marcar esto.
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 hover:opacity-90 text-white"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            <>
                                <Undo2 className="mr-2 h-4 w-4" />
                                Confirmar Reembolso
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
