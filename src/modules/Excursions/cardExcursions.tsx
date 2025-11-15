import React from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import{getExcursions, Excursion} from './service'

export default async function cardExcursions() {

     const excursions: Excursion[] = await getExcursions();

    if (!excursions || excursions.length === 0) {
        return <div>No hay excursiones disponibles.</div>
    }

    return (
        <div className="space-y-3">
            {excursions.map((exc) => (
                <Card key={exc.id}
                    className='p-2 sm:p-3 max0h-40 overflow-hidden'>
                    <CardHeader className='py-1 space-y-0.5'>
                        <CardTitle className='text-sm font-medium'>{exc.title}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground line-clamp-2">{exc.description ?? '—'}</CardDescription>
                        <CardAction>{exc.status ?? '—'}</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p>Precio: ${Number(exc.price ?? 0).toFixed(2)}</p>
                        <p>Depósito mínimo: ${Number(exc.min_deposit ?? 0).toFixed(2)}</p>
                        <p>Duración: {exc.duration_days ?? '—'} días</p>
                        <p>Fechas: {exc.start_dates ?? '—'} — {exc.end_dates ?? '—'}</p>
                        <p>Asientos disponibles: {exc.available_seats ?? 0}</p>
                    </CardContent>
                    <CardFooter>
                        <p>ID: {exc.id}</p>
                    </CardFooter>
                </Card>
            ))}
        </div>

    )
}
