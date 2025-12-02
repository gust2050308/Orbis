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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw } from 'lucide-react';
import type { PurchaseStatus } from '../types';

interface ChangeStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseId: number | null;
    currentStatus: PurchaseStatus | null;
    onConfirm: (purchaseId: number, newStatus: PurchaseStatus) => Promise<void>;
}

const statusOptions: { value: PurchaseStatus; label: string; color: string }[] = [
    { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'reserved', label: 'Reservado', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { value: 'paid', label: 'Pagado', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'cancelled', label: 'Cancelado', color: 'bg-gray-100 text-gray-800 border-gray-300' },
    { value: 'refunded', label: 'Reembolsado', color: 'bg-purple-100 text-purple-800 border-purple-300' },
    { value: 'expired', label: 'Expirado', color: 'bg-red-100 text-red-800 border-red-300' },
    { value: 'refund_required', label: 'Requiere Reembolso', color: 'bg-orange-100 text-orange-800 border-orange-300' },
];

export function ChangeStatusDialog({
    open,
    onOpenChange,
    purchaseId,
    currentStatus,
    onConfirm,
}: ChangeStatusDialogProps) {
    const [newStatus, setNewStatus] = useState<PurchaseStatus | ''>('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!purchaseId || !newStatus) return;

        try {
            setLoading(true);
            await onConfirm(purchaseId, newStatus as PurchaseStatus);
            onOpenChange(false);
            setNewStatus('');
        } catch (error) {
            console.error('Error changing status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!loading) {
            onOpenChange(open);
            if (!open) setNewStatus('');
        }
    };

    const currentStatusOption = statusOptions.find(opt => opt.value === currentStatus);
    const newStatusOption = statusOptions.find(opt => opt.value === newStatus);

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-[#256EFF]/10 to-[#07BEB8]/10 rounded-lg">
                            <RefreshCw className="w-6 h-6 text-[#256EFF]" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Cambiar Estado</DialogTitle>
                            <DialogDescription>
                                Compra #{purchaseId}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Current Status */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-[#102542]/70">
                            Estado Actual
                        </Label>
                        {currentStatusOption && (
                            <Badge
                                variant="outline"
                                className={`${currentStatusOption.color} font-medium text-sm px-3 py-1.5`}
                            >
                                {currentStatusOption.label}
                            </Badge>
                        )}
                    </div>

                    {/* New Status Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-sm font-medium text-[#102542]">
                            Nuevo Estado <span className="text-red-500">*</span>
                        </Label>
                        <Select
                            value={newStatus}
                            onValueChange={(value) => setNewStatus(value as PurchaseStatus)}
                        >
                            <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Seleccionar nuevo estado..." />
                            </SelectTrigger>
                            <SelectContent>
                                {statusOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                        disabled={option.value === currentStatus}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{option.label}</span>
                                            {option.value === currentStatus && (
                                                <span className="text-xs text-gray-400">(actual)</span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Preview New Status */}
                        {newStatusOption && (
                            <div className="mt-3 p-3 bg-gradient-to-r from-[#256EFF]/5 to-[#07BEB8]/5 rounded-lg border border-[#256EFF]/10">
                                <p className="text-xs text-[#102542]/60 mb-1">Vista previa:</p>
                                <Badge
                                    variant="outline"
                                    className={`${newStatusOption.color} font-medium`}
                                >
                                    {newStatusOption.label}
                                </Badge>
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
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!newStatus || loading}
                        className="bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:opacity-90"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Cambiar Estado
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
