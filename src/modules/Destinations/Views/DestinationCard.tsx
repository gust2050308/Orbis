'use client';

import { MapPin, Globe, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Destination } from '../types/TypesDestinations';

type DestinationCardProps = {
  destination: Destination;
  onViewDetails?: (id: number) => void;
};

/**
 * Componente para mostrar un destino en la vista pública
 * Diseño más visual y atractivo para usuarios finales
 */
export function DestinationCard({ destination, onViewDetails }: DestinationCardProps) {
  return (
    <Card className="group overflow-hidden border-[#256EFF]/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Header con gradiente */}
      <CardHeader className="bg-gradient-to-br from-[#256EFF] to-[#07BEB8] text-white p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2 drop-shadow-md">
            {destination.name}
          </h3>
          {destination.country && (
            <div className="flex items-center gap-2 text-white/90">
              <Globe className="w-4 h-4" />
              <span className="text-sm font-medium">{destination.country}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Descripción corta */}
        {destination.short_description && (
          <p className="text-[#102542]/80 leading-relaxed line-clamp-3">
            {destination.short_description}
          </p>
        )}

        {/* Ubicación */}
        <div className="flex items-start gap-2 text-sm text-[#102542]/60 bg-[#F7F5FB] p-3 rounded-lg">
          <MapPin className="w-4 h-4 text-[#07BEB8] mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-medium text-[#102542]">Coordenadas</div>
            <div className="text-xs">
              {destination.latitude.toFixed(4)}°, {destination.longitude.toFixed(4)}°
            </div>
          </div>
        </div>

        {/* Badge de estado */}
        {!destination.is_active && (
          <Badge variant="secondary" className="bg-[#102542]/10 text-[#102542]">
            No disponible temporalmente
          </Badge>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button
          onClick={() => onViewDetails?.(destination.id)}
          className="w-full bg-[#256EFF] hover:bg-[#1a5ce6] text-white group-hover:bg-[#07BEB8] transition-colors"
        >
          Ver detalles
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * COMPONENTE DE GALERÍA PÚBLICA
 * Ejemplo de cómo mostrar múltiples destinos
 */
export function DestinationGallery({ destinations }: { destinations: Destination[] }) {
  const activeDestinations = destinations.filter((d) => d.is_active);

  if (activeDestinations.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-[#F7F5FB] to-[#e8e4f5] rounded-xl">
        <MapPin className="w-16 h-16 mx-auto text-[#256EFF]/30 mb-4" />
        <h3 className="text-xl font-semibold text-[#102542] mb-2">
          Próximamente nuevos destinos
        </h3>
        <p className="text-[#102542]/60">
          Estamos preparando increíbles lugares para ti
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-[#102542] mb-3">
          Descubre Destinos Increíbles
        </h2>
        <p className="text-[#102542]/70 text-lg">
          Explora {activeDestinations.length} destinos únicos
        </p>
      </div>

      {/* Grid de destinos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeDestinations.map((destination) => (
          <DestinationCard
            key={destination.id}
            destination={destination}
            onViewDetails={(id) => console.log('Ver destino:', id)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * EJEMPLO DE USO EN UNA PÁGINA PÚBLICA:
 * 
 * import { DestinationGallery } from './DestinationCard';
 * import { destinationService } from './destination-service';
 * 
 * export default async function PublicDestinationsPage() {
 *   const destinations = await destinationService.getAll();
 * 
 *   return (
 *     <div className="container mx-auto py-12 px-4">
 *       <DestinationGallery destinations={destinations} />
 *     </div>
 *   );
 * }
 */