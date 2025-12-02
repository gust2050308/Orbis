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
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

interface DeletePurchaseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseId: number | null;
    userName?: string;
    excursionTitle?: string;
    onConfirm: (purchaseId: number) => Promise<void>;
}

export function DeletePurchaseDialog({
    open,
    onOpenChange,
    purchaseId,
    userName,
    excursionTitle,
    onConfirm,
}: DeletePurchaseDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!purchaseId) return;

        try {
            setLoading(true);
            await onConfirm(purchaseId);
            onOpenChange(false);
        } catch (error) {
            console.error('Error deleting purchase:', error);
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
                        <div className="p-3 bg-red-100 rounded-lg">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl text-red-900">
                                Eliminar Compra
                            </DialogTitle>
                            <DialogDescription className="text-red-600">
                                ¡Advertencia! Esta acción es irreversible
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Strong Warning */}
                    <div className="p-4 bg-red-100 border-2 border-red-300 rounded-lg space-y-3">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-red-900">
                                    ¡PELIGRO! Esta acción eliminará permanentemente la compra
                                </p>
                                <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
                                    <li>No se puede deshacer</li>
                                    <li>Solo es posible si NO tiene pagos asociados</li>
                                    <li>Todos los datos se perderán</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Purchase Details */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-300">
                        <p className="text-xs font-semibold text-[#102542]/70 uppercase tracking-wide">
                            Detalles de la compra a eliminar:
                        </p>
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-[#102542]/70">ID:</span>{' '}
                                <span className="font-mono font-bold text-red-700">#{purchaseId}</span>
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

                    <div className="text-xs text-[#102542]/60 bg-yellow-50 p-3 rounded border border-yellow-200">
                        <strong>Nota:</strong> Si esta compra tiene pagos asociados, la eliminación fallará. Usa "Cancelar" en su lugar.
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        disabled={loading}
                    >
                        No, cancelar
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
                                Eliminando...
                            </>
                        ) : (
                            <>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Sí, eliminar permanentemente
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
