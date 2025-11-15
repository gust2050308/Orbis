import { MapPin, Globe, ArrowRight } from 'lucide-react';
import type { Destination } from '../types/TypesDestinations';
import { DestinationCard } from './DestinationCard';

export default function DestinationGallery({ destinations }: { destinations: Destination[] }) {
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