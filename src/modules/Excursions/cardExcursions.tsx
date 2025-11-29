'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import DropdownMenuExcursion from './dropdownMenuExcursion'
import type { Excursion } from './shared/dtoExcursion'
import ModalExcursionDetails from './modalExcursionView'
import ModalExcursionUpdate from './modalExcursionUpdate'
import { getExcursionDestinations } from './shared/serviceExcursionsDestinations'
import { destinationImagesService } from '@/modules/Destinations/Services/destinationImagesService'
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react'
import Image from 'next/image'

interface CardExcursionsProps {
  excursions: Excursion[]
  onRefresh?: () => void
}

export default function CardExcursions({ excursions, onRefresh }: CardExcursionsProps) {
  const router = useRouter()
  const [selectedExcursion, setSelectedExcursion] = useState<Excursion | null>(null)
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [openEditModal, setOpenEditModal] = useState(false)
  const [excursionImages, setExcursionImages] = useState<Record<number, string>>({})

  const activeExcursions = excursions.filter(exc => exc.status !== 'deleted');

  // Cargar imágenes de las excursiones
  useEffect(() => {
    const loadImages = async () => {
      const imageMap: Record<number, string> = {}

      for (const exc of activeExcursions) {
        try {
          // Obtener destinos de la excursión
          const destinations = await getExcursionDestinations(exc.id)

          if (destinations && destinations.length > 0) {
            // Obtener la primera imagen del primer destino
            const firstDestination = destinations[0]
            if (firstDestination.destination_id) {
              const images = await destinationImagesService.getImagesByDestination(
                firstDestination.destination_id
              )

              if (images && images.length > 0) {
                imageMap[exc.id] = images[0].image_url
              }
            }
          }
        } catch (error) {
          console.error(`Error loading image for excursion ${exc.id}:`, error)
        }
      }

      setExcursionImages(imageMap)
    }

    if (activeExcursions.length > 0) {
      loadImages()
    }
  }, [excursions])

  const handleView = (exc: Excursion) => {
    setSelectedExcursion(exc)
    setOpenDetailsModal(true)
  }

  const handleEdit = (exc: Excursion) => {
    setSelectedExcursion(exc)
    setOpenEditModal(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const { deleteExcursion } = await import('./shared/actions')
      await deleteExcursion(id)
      console.log('Excursión eliminada')
      onRefresh?.()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleCardClick = (excId: number) => {
    router.push(`/Views/Excursiones/${excId}`)
  }

  if (!activeExcursions || excursions.length === 0) {
    return <div className='text-center pt-8 text-muted-foreground'>No hay excursiones disponibles.</div>
  }

  return (
    <>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {activeExcursions.map((exc) => (
          <Card
            key={exc.id}
            className='group overflow-hidden hover:shadow-2xl transition-all duration-300 border-[#256EFF]/20 hover:border-[#256EFF]/40'
          >
            {/* Imagen de la excursión */}
            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-[#256EFF]/10 to-[#07BEB8]/10">
              {excursionImages[exc.id] ? (
                <Image
                  src={excursionImages[exc.id]}
                  alt={exc.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <MapPin className="w-16 h-16 text-[#256EFF]/30" />
                </div>
              )}

              {/* Overlay con gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Dropdown menu en la esquina */}
              <div className="absolute top-3 right-3 z-10">
                <DropdownMenuExcursion
                  excursion={exc}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>

              {/* Precio destacado */}
              <div className="absolute bottom-3 left-3 z-10">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                  <p className="text-xs text-white font-medium">Desde</p>
                  <p className="text-2xl font-bold text-blue-500">
                    ${Number(exc.price ?? 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <CardHeader className='pb-3'>
              <CardTitle
                className='text-lg font-bold line-clamp-2 cursor-pointer hover:text-[#256EFF] transition-colors'
                onClick={() => handleCardClick(exc.id)}
              >
                {exc.title}
              </CardTitle>
              <CardDescription className="text-sm line-clamp-2 mt-1">
                {exc.description ?? 'Descubre esta increíble experiencia'}
              </CardDescription>
            </CardHeader>

            <CardContent className='pb-3 space-y-3'>
              {/* Badges informativos */}
              <div className='flex flex-wrap gap-2'>
                {exc.duration_days && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {exc.duration_days} días
                  </Badge>
                )}
                {exc.available_seats !== null && exc.available_seats !== undefined && (
                  <Badge
                    variant={Number(exc.available_seats) > 0 ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    <Users className="w-3 h-3" />
                    {exc.available_seats} lugares
                  </Badge>
                )}
              </div>

              {/* Información adicional */}
              <div className='space-y-2 text-sm text-[#102542]/70'>
                {exc.min_deposit && Number(exc.min_deposit) > 0 && (
                  <div className='flex items-center gap-2'>
                    <DollarSign className="w-4 h-4 text-[#07BEB8]" />
                    <span>Depósito desde ${Number(exc.min_deposit).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className='pt-3 border-t border-[#256EFF]/10 text-xs text-muted-foreground flex items-center gap-2'>
              <Calendar className="w-3 h-3" />
              {exc.start_date ? new Date(exc.start_date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short'
              }) : '—'}
              {' - '}
              {exc.end_date ? new Date(exc.end_date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }) : '—'}
            </CardFooter>
          </Card>
        ))}
      </div>

      <ModalExcursionDetails
        open={openDetailsModal}
        onOpenChange={setOpenDetailsModal}
        excursion={selectedExcursion}
        onEdit={handleEdit}
      />

      <ModalExcursionUpdate
        open={openEditModal}
        onOpenChange={setOpenEditModal}
        excursion={selectedExcursion}
      />
    </>
  )
}
