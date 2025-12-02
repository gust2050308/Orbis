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
import { AlertTriangle, Ban, Loader2 } from 'lucide-react';

interface CancelPurchaseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseId: number | null;
    userName?: string;
    excursionTitle?: string;
    onConfirm: (purchaseId: number) => Promise<void>;
}

export function CancelPurchaseDialog({
    open,
    onOpenChange,
    purchaseId,
    userName,
    excursionTitle,
    onConfirm,
}: CancelPurchaseDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!purchaseId) return;

        try {
            setLoading(true);
            await onConfirm(purchaseId);
            onOpenChange(false);
        } catch (error) {
            console.error('Error cancelling purchase:', error);
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
                        <div className="p-3 bg-red-50 rounded-lg">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl text-red-900">
                                Cancelar Compra
                            </DialogTitle>
                            <DialogDescription>
                                Esta acción no se puede deshacer
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
                        <p className="text-sm font-medium text-red-900">
                            ¿Estás seguro de que deseas cancelar esta compra?
                        </p>
                        <p className="text-sm text-red-700">
                            El estado cambiará a "Cancelado" y el cliente será notificado.
                        </p>
                    </div>

                    {/* Purchase Details */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
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
                        {excursionTitle && (
                            <div className="text-sm">
                                <span className="font-medium text-[#102542]/70">Excursión:</span>{' '}
                                <span className="text-[#102542]">{excursionTitle}</span>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={loading}
                    >
                        No, mantener
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelando...
                            </>
                        ) : (
                            <>
                                <Ban className="mr-2 h-4 w-4" />
                                Sí, cancelar compra
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
