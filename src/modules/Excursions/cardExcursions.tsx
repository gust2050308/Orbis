'use client'
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import DropdownMenuExcursion from './dropdownMenuExcursion'
import type { Excursion } from './shared/dtoExcursion'

interface CardExcursionsProps {
  excursions: Excursion[]
  onRefresh?: () => void
}

export default function CardExcursions({ excursions, onRefresh }: CardExcursionsProps) {
  const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(null)

  const activeExcursions = excursions.filter(exc => exc.status !== 'deleted');
  
  const handleView = (exc: Excursion) => {
    setSelectedExcursion(exc)
    console.log('Ver detalles:', exc)
    // Aquí puedes abrir un modal con los detalles
  }

  const handleEdit = (exc: Excursion) => {
    console.log('Editar:', exc)
    // Aquí puedes abrir un modal de edición
  }

  const handleDelete = async (id: number) => {
    try {
      // Importar y llamar la acción
      const { deleteExcursion } = await import('./shared/actions')
      await deleteExcursion(id)
      console.log('Excursión eliminada')
      onRefresh?.()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (!activeExcursions || excursions.length === 0) {
    return <div className='text-center pt-8 text-muted-foreground'>No hay excursiones disponibles.</div>
  }


  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {activeExcursions.map((exc) => (
        <Card 
          key={exc.id}
          className='p-3 h-fit flex flex-col relative'
        >
          {/* Botón dropdown en la esquina superior derecha */}
          <div className="absolute top-2 right-2">
            <DropdownMenuExcursion
              excursion={exc}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          <CardHeader className='py-2 px-3 space-y-0.5 flex-shrink-0 pr-10'>
            <CardTitle className='text-sm font-semibold line-clamp-1'>
              {exc.title}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground line-clamp-1">
              {exc.description ?? '—'}
            </CardDescription>
          </CardHeader>

          <CardContent className='px-3 py-2 text-xs space-y-1 flex-1'>
            <div className='flex justify-between'>
              <span>Precio:</span>
              <span className='font-semibold'>
                ${Number(exc.price ?? 0).toFixed(2)}
              </span>
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
            {exc.start_date ?? '—'} a {exc.end_date ?? '—'}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
