'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { ExcursionRouteMap } from '@/modules/Excursions/ExcursionRouteMap'
import { getExcursionDestinations } from '@/modules/Excursions/shared/serviceExcursionsDestinations'
import { destinationImagesService } from '@/modules/Destinations/Services/destinationImagesService'
import type { Excursion } from '@/modules/Excursions/shared/dtoExcursion'
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Users,
    DollarSign,
    Clock,
    CreditCard,
    CheckCircle2
} from 'lucide-react'

type DestinationWithImages = {
    id: number
    name: string
    country: string | null
    description: string | null
    short_description: string | null
    latitude: number | null
    longitude: number | null
    images: string[]
}

interface ExcursionDetailClientProps {
    excursion: Excursion
}

export default function ExcursionDetailClient({ excursion }: ExcursionDetailClientProps) {
    const router = useRouter()
    const [destinations, setDestinations] = useState<DestinationWithImages[]>([])
    const [allImages, setAllImages] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const minDeposit = excursion.min_deposit !== null && excursion.min_deposit !== undefined
        ? Number(excursion.min_deposit)
        : null

    useEffect(() => {
        const loadDestinationsAndImages = async () => {
            try {
                // Obtener destinos de la excursión
                const excursionDests = await getExcursionDestinations(excursion.id)

                const destsWithImages: DestinationWithImages[] = []
                const imagesList: string[] = []

                for (const excDest of excursionDests) {
                    if (excDest.destinations) {
                        // Handle destinations as either an array or single object
                        const dest = Array.isArray(excDest.destinations)
                            ? excDest.destinations[0]
                            : excDest.destinations

                        // Skip if no valid destination
                        if (!dest) continue

                        // Obtener imágenes del destino
                        const images = await destinationImagesService.getImagesByDestination(dest.id)
                        const imageUrls = images.map(img => img.image_url)

                        destsWithImages.push({
                            id: dest.id,
                            name: dest.name,
                            country: dest.country,
                            description: dest.description,
                            short_description: dest.short_description,
                            latitude: dest.latitude,
                            longitude: dest.longitude,
                            images: imageUrls,
                        })

                        // Agregar todas las imágenes a la lista general
                        imagesList.push(...imageUrls)
                    }
                }

                setDestinations(destsWithImages)
                setAllImages(imagesList)
            } catch (error) {
                console.error('Error loading destinations:', error)
            } finally {
                setLoading(false)
            }
        }

        loadDestinationsAndImages()
    }, [excursion.id])

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7F5FB] via-white to-[#E8F4F8]">
            {/* Header con botón de regreso */}
            <div className="bg-white border-b border-[#256EFF]/10 sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className="flex items-center gap-2 hover:bg-[#256EFF]/10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver a excursiones
                    </Button>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Carrusel de imágenes */}
                <div className="mb-8">
                    {allImages.length > 0 ? (
                        <Carousel className="w-full">
                            <CarouselContent>
                                {allImages.map((imageUrl, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative h-[500px] w-full rounded-2xl overflow-hidden">
                                            <Image
                                                src={imageUrl}
                                                alt={`Imagen ${index + 1} de ${excursion.title}`}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 1200px) 100vw, 1200px"
                                                priority={index === 0}
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-4" />
                            <CarouselNext className="right-4" />
                        </Carousel>
                    ) : (
                        <div className="h-[500px] w-full rounded-2xl bg-gradient-to-br from-[#256EFF]/10 to-[#07BEB8]/10 flex items-center justify-center">
                            <MapPin className="w-24 h-24 text-[#256EFF]/30" />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna principal - Información */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Título y descripción */}
                        <div>
                            <h1 className="text-4xl font-bold text-[#102542] mb-4">
                                {excursion.title}
                            </h1>
                            <p className="text-lg text-[#102542]/70 leading-relaxed">
                                {excursion.description || 'Descubre esta increíble experiencia de viaje'}
                            </p>
                        </div>

                        {/* Badges informativos */}
                        <div className="flex flex-wrap gap-3">
                            {excursion.duration_days && (
                                <Badge variant="secondary" className="px-4 py-2 text-sm flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    {excursion.duration_days} días
                                </Badge>
                            )}
                            {excursion.available_seats !== null && excursion.available_seats !== undefined && (
                                <Badge
                                    variant={Number(excursion.available_seats) > 0 ? "default" : "destructive"}
                                    className="px-4 py-2 text-sm flex items-center gap-2"
                                >
                                    <Users className="w-4 h-4" />
                                    {excursion.available_seats} lugares disponibles
                                </Badge>
                            )}
                            {excursion.start_date && excursion.end_date && (
                                <Badge variant="outline" className="px-4 py-2 text-sm flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(excursion.start_date).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long'
                                    })} - {new Date(excursion.end_date).toLocaleDateString('es-ES', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </Badge>
                            )}
                        </div>

                        {/* Destinos incluidos */}
                        <div>
                            <h2 className="text-2xl font-bold text-[#102542] mb-4 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-[#256EFF]" />
                                Destinos Incluidos
                            </h2>
                            <div className="space-y-4">
                                {destinations.map((dest, index) => (
                                    <Card key={dest.id} className="border-[#256EFF]/20">
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-[#256EFF] to-[#07BEB8] flex items-center justify-center text-white font-bold">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-[#102542]">{dest.name}</h3>
                                                    {dest.country && (
                                                        <p className="text-sm text-[#102542]/60">{dest.country}</p>
                                                    )}
                                                    {dest.short_description && (
                                                        <p className="text-sm text-[#102542]/70 mt-2">{dest.short_description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Mapa de ruta  Number(excursion.available_seats)*/}
                        <div>
                            <h2 className="text-2xl font-bold text-[#102542] mb-4">Ruta del Viaje</h2>
                            <ExcursionRouteMap destinations={destinations} />
                        </div>
                    </div>

                    {/* Columna lateral - Reserva */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card className="border-[#256EFF]/20 shadow-xl">
                                <CardContent className="p-6 space-y-6">
                                    {/* Precio */}
                                    <div>
                                        <p className="text-sm text-[#102542]/60 mb-1">Precio por persona</p>
                                        <p className="text-4xl font-bold text-[#256EFF]">
                                            ${Number(excursion.price ?? 0).toFixed(2)}
                                        </p>
                                        {minDeposit !== null && minDeposit > 0 && (
                                            <p className="text-sm text-[#102542]/60 mt-2 flex items-center gap-2">
                                                <DollarSign className="w-4 h-4" />
                                                Depósito desde ${minDeposit.toFixed(2)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Botón de reserva */}
                                    <Button
                                        className="w-full bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:from-[#1557d8] hover:to-[#06a89a] text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                                        disabled
                                    >
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Reservar Ahora
                                    </Button>
                                    <p className="text-xs text-center text-[#102542]/50">
                                        *Función de pago próximamente
                                    </p>

                                    {/* Características incluidas */}
                                    <div className="pt-6 border-t border-[#256EFF]/10">
                                        <h3 className="font-semibold text-[#102542] mb-3">Incluye:</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-start gap-2 text-sm text-[#102542]/70">
                                                <CheckCircle2 className="w-4 h-4 text-[#07BEB8] flex-shrink-0 mt-0.5" />
                                                <span>Visita a {destinations.length} destinos increíbles</span>
                                            </li>
                                            {excursion.duration_days && (
                                                <li className="flex items-start gap-2 text-sm text-[#102542]/70">
                                                    <CheckCircle2 className="w-4 h-4 text-[#07BEB8] flex-shrink-0 mt-0.5" />
                                                    <span>{excursion.duration_days} días de aventura</span>
                                                </li>
                                            )}
                                            <li className="flex items-start gap-2 text-sm text-[#102542]/70">
                                                <CheckCircle2 className="w-4 h-4 text-[#07BEB8] flex-shrink-0 mt-0.5" />
                                                <span>Guía profesional</span>
                                            </li>
                                            <li className="flex items-start gap-2 text-sm text-[#102542]/70">
                                                <CheckCircle2 className="w-4 h-4 text-[#07BEB8] flex-shrink-0 mt-0.5" />
                                                <span>Transporte incluido</span>
                                            </li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
