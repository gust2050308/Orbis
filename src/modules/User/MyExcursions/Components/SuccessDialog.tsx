'use client'

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface SuccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    sessionId?: string | null;
}

export function SuccessDialog({ open, onOpenChange, sessionId }: SuccessDialogProps) {
    const [autoCloseIn, setAutoCloseIn] = useState(5);

    useEffect(() => {
        if (!open) {
            setAutoCloseIn(5);
            return;
        }

        const timer = setInterval(() => {
            setAutoCloseIn((prev) => {
                if (prev <= 1) {
                    onOpenChange(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [open, onOpenChange]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                            <CheckCircle2 className="w-16 h-16 text-green-500 relative" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl">
                        ¡Pago Exitoso!
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Tu pago ha sido procesado correctamente
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Información de confirmación */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="space-y-2 text-sm text-green-800">
                            <p><strong>✓</strong> Recibirás un email de confirmación</p>
                            <p><strong>✓</strong> Tu reserva ha sido registrada</p>
                            <p><strong>✓</strong> Puedes ver los detalles abajo</p>
                        </div>
                    </div>

                    {/* ID de sesión para debug */}
                    {sessionId && (
                        <p className="text-xs text-center text-muted-foreground font-mono">
                            ID: {sessionId.slice(0, 20)}...
                        </p>
                    )}

                    {/* Auto-close timer */}
                    <p className="text-xs text-center text-muted-foreground">
                        Este mensaje se cerrará automáticamente en {autoCloseIn}s
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
