'use client'

import { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Clock, Loader2, Calendar } from 'lucide-react';

interface ExtendExpirationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    purchaseId: number | null;
    currentExpiration: string | null;
    onConfirm: (purchaseId: number, newExpiration: string) => Promise<void>;
}

export function ExtendExpirationDialog({
    open,
    onOpenChange,
    purchaseId,
    currentExpiration,
    onConfirm,
}: ExtendExpirationDialogProps) {
    const [newDate, setNewDate] = useState('');
    const [newTime, setNewTime] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            // Set default to 7 days from now
            const future = new Date();
            future.setDate(future.getDate() + 7);

            const dateStr = future.toISOString().split('T')[0];
            const timeStr = future.toTimeString().slice(0, 5);

            setNewDate(dateStr);
            setNewTime(timeStr);
            setError('');
        }
    }, [open]);

    const handleConfirm = async () => {
        if (!purchaseId || !newDate || !newTime) {
            setError('Por favor completa todos los campos');
            return;
        }

        // Combine date and time
        const newExpiration = `${newDate} ${newTime}:00`;
        const newExpirationDate = new Date(newExpiration);
        const now = new Date();

        if (newExpirationDate <= now) {
            setError('La nueva fecha debe ser en el futuro');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await onConfirm(purchaseId, newExpiration);
            onOpenChange(false);
        } catch (error) {
            console.error('Error extending expiration:', error);
            setError('Error al extender la expiración');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!loading) {
            onOpenChange(open);
            if (!open) {
                setError('');
            }
        }
    };

    const formatCurrentExpiration = () => {
        if (!currentExpiration) return 'No establecida';
        const date = new Date(currentExpiration);
        return date.toLocaleString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-[#256EFF]/10 to-[#07BEB8]/10 rounded-lg">
                            <Clock className="w-6 h-6 text-[#256EFF]" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Extender Expiración</DialogTitle>
                            <DialogDescription>
                                Compra #{purchaseId}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Current Expiration */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <Label className="text-sm font-medium text-[#102542]/70">
                            Expiración Actual
                        </Label>
                        <p className="text-sm text-[#102542] mt-1 font-medium">
                            {formatCurrentExpiration()}
                        </p>
                    </div>

                    {/* New Expiration */}
                    <div className="space-y-4">
                        <Label className="text-sm font-medium text-[#102542]">
                            Nueva Fecha de Expiración <span className="text-red-500">*</span>
                        </Label>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-xs text-[#102542]/70">
                                    Fecha
                                </Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#102542]/40" />
                                    <Input
                                        id="date"
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time" className="text-xs text-[#102542]/70">
                                    Hora
                                </Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#102542]/40" />
                                    <Input
                                        id="time"
                                        type="time"
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        {newDate && newTime && (
                            <div className="p-3 bg-gradient-to-r from-[#256EFF]/5 to-[#07BEB8]/5 rounded-lg border border-[#256EFF]/10">
                                <p className="text-xs text-[#102542]/60 mb-1">Vista previa:</p>
                                <p className="text-sm font-medium text-[#102542]">
                                    {new Date(`${newDate} ${newTime}`).toLocaleString('es-MX', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
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
                        disabled={!newDate || !newTime || loading}
                        className="bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:opacity-90"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Extendiendo...
                            </>
                        ) : (
                            <>
                                <Clock className="mr-2 h-4 w-4" />
                                Extender Expiración
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
