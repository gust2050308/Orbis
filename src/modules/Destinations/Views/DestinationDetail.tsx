'use client';

import { useEffect, useState } from 'react';
import { MapPin, Globe, Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Destination } from '../types/TypesDestinations';
import { DestinationImage } from '../types/TypesImages';
import { destinationImagesService } from '../Services/destinationImagesService';

type DestinationDetailProps = {
  destination: Destination;
  onClose?: () => void;
};

/**
 * Vista detallada de un destino con galería de imágenes
 * Incluye lightbox para ver imágenes en grande
 */
export function DestinationDetail({ destination, onClose }: DestinationDetailProps) {
  const [images, setImages] = useState<DestinationImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadImages();
  }, [destination.id]);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await destinationImagesService.getImagesByDestination(destination.id);
      setImages(data);
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#256EFF] to-[#07BEB8] text-white p-8 relative">
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          )}
          <h1 className="text-4xl font-bold mb-3">{destination.name}</h1>
          <div className="flex items-center gap-4 text-white/90">
            {destination.country && (
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                <span>{destination.country}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{new Date(destination.created_at).toLocaleDateString('es-MX')}</span>
            </div>
            <Badge
              variant={destination.is_active ? 'default' : 'secondary'}
              className={destination.is_active ? 'bg-white/20' : ''}
            >
              {destination.is_active ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Descripción corta */}
          {destination.short_description && (
            <div>
              <p className="text-xl text-[#102542] font-medium">
                {destination.short_description}
              </p>
            </div>
          )}

          {/* Galería de imágenes */}
          {images.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#102542] mb-4">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    onClick={() => openLightbox(index)}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-[#256EFF]/20 hover:border-[#256EFF]"
                  >
                    <img
                      src={image.image_url}
                      alt={`${destination.name} - imagen ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Descripción completa */}
          {destination.description && (
            <div>
              <h2 className="text-2xl font-bold text-[#102542] mb-3">Descripción</h2>
              <p className="text-[#102542]/80 leading-relaxed whitespace-pre-wrap">
                {destination.description}
              </p>
            </div>
          )}

          {/* Ubicación */}
          <div>
            <h2 className="text-2xl font-bold text-[#102542] mb-3">Ubicación</h2>
            <div className="flex items-center gap-2 text-[#102542]/70 bg-[#F7F5FB] p-4 rounded-lg">
              <MapPin className="w-5 h-5 text-[#07BEB8]" />
              <div>
                <div className="font-medium">Coordenadas</div>
                <div className="text-sm">
                  Lat: {destination.latitude.toFixed(6)}, Lng: {destination.longitude.toFixed(6)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <Button
            onClick={() => setLightboxOpen(false)}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
          >
            <X className="h-8 w-8" />
          </Button>

          {images.length > 1 && (
            <>
              <Button
                onClick={prevImage}
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white hover:bg-white/20 z-10"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                onClick={nextImage}
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white hover:bg-white/20 z-10"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          <img
            src={images[currentImageIndex].image_url}
            alt={`${destination.name} - imagen ${currentImageIndex + 1}`}
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}

/**
 * EJEMPLO DE USO:
 * 
 * import { DestinationDetail } from './DestinationDetail';
 * import { useState } from 'react';
 * 
 * function MyComponent() {
 *   const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
 * 
 *   return (
 *     <>
 *       {selectedDestination && (
 *         <DestinationDetail
 *           destination={selectedDestination}
 *           onClose={() => setSelectedDestination(null)}
 *         />
 *       )}
 *     </>
 *   );
 * }
 */