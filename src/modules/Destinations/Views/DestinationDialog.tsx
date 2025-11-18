'use client';

import React, { useContext } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { DestinationContext } from '../DestinationContext';
import { DestinationForm } from './DestinationForm';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function DestinationDialog() {
    const { open, setOpen } = useContext(DestinationContext);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] overflow-y-auto p-0 no-scrollbar">
                {/* Header fijo */}
                <DialogHeader className="px-6 py-4">
                    <DialogTitle className="text-2xl font-bold text-[#102542]">
                        Crear Nuevo Destino
                    </DialogTitle>
                    <DialogDescription className="text-[#102542]/60">
                        Completa la información del destino turístico. Podrás agregar imágenes después de guardar.
                    </DialogDescription>
                </DialogHeader>

                {/* Contenido con scroll */}
                <ScrollArea className="flex-1 px-6 py-4">
                    <DestinationForm
                        onSuccess={() => {
                            setOpen(false);
                        }}
                    />
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}