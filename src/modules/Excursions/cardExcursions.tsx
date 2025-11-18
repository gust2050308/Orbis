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
import { getExcursions } from './shared/service'

export default async function cardExcursions() {

     const excursions = await getExcursions();

    if (!excursions || excursions.length === 0) {
        return <div>No hay excursiones disponibles.</div>
    }

    return (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {excursions.map((exc) => (
                <Card key={exc.id}
                    className='p-3 h-fit flex flex-col'>
                    <CardHeader className='py-2 px-3 space-y-0.5 flex-shrink-0'>
                        <CardTitle className='text-sm font-semibold line-clamp-1'>{exc.title}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground line-clamp-1">{exc.description ?? '—'}</CardDescription>
                    </CardHeader>
                    <CardContent className='px-3 py-2 text-xs space-y-1 flex-1'>
                        <div className='flex justify-between'>
                            <span>Precio:</span>
                            <span className='font-semibold'>${Number(exc.price ?? 0).toFixed(2)}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Depósito:</span>
                            <span>${Number(exc.min_deposit ?? 0).toFixed(2)}</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Duración:</span>
                            <span>{exc.duration_days ?? '—'} días</span>
                        </div>
                        <div className='flex justify-between'>
                            <span>Asientos:</span>
                            <span>{exc.available_seats ?? 0}</span>
                        </div>
                    </CardContent>
                    <CardFooter className='px-3 py-2 text-xs text-muted-foreground border-t'>
                        {exc.start_dates ?? '—'} a {exc.end_dates ?? '—'}
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
