'use client';

import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PlacesAutocompleteProps = {
  onPlaceSelected: (place: {
    name: string;
    country: string;
    lat: number;
    lng: number;
  }) => void;
};

/**
 * Componente opcional que agrega búsqueda de lugares con Google Places API
 * Puedes agregarlo al formulario para facilitar la selección de ubicaciones
 */
export function PlacesAutocomplete({ onPlaceSelected }: PlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'], // Buscar solo ciudades
      fields: ['name', 'geometry', 'address_components'],
    });

    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      
      if (!place.geometry?.location) {
        console.warn('No se encontró la ubicación del lugar');
        return;
      }

      // Extraer país del resultado
      const country = place.address_components?.find((component) =>
        component.types.includes('country')
      )?.long_name || '';

      onPlaceSelected({
        name: place.name || '',
        country,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });

      // Limpiar input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    });

    setAutocomplete(ac);

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="place-search" className="text-[#102542] flex items-center gap-2">
        <Search className="w-4 h-4 text-[#07BEB8]" />
        Buscar lugar
      </Label>
      <Input
        id="place-search"
        ref={inputRef}
        type="text"
        placeholder="Busca una ciudad o lugar..."
        className="border-[#256EFF]/20 focus:border-[#256EFF]"
      />
      <p className="text-xs text-[#102542]/60">
        Busca y selecciona un lugar para autocompletar el formulario
      </p>
    </div>
  );
}

/**
 * CÓMO USARLO EN EL FORMULARIO:
 * 
 * 1. Importa el componente en DestinationForm.tsx:
 *    import { PlacesAutocomplete } from './PlacesAutocomplete';
 * 
 * 2. Agrega la función handler antes del return:
 * 
 *    const handlePlaceSelected = (place: {
 *      name: string;
 *      country: string;
 *      lat: number;
 *      lng: number;
 *    }) => {
 *      form.setValue('name', place.name);
 *      form.setValue('country', place.country);
 *      form.setValue('latitude', place.lat);
 *      form.setValue('longitude', place.lng);
 *    };
 * 
 * 3. Agrega el componente en el formulario después del primer div.grid:
 * 
 *    <PlacesAutocomplete onPlaceSelected={handlePlaceSelected} />
 * 
 * 4. Asegúrate de que 'places' esté en las librerías de Google Maps
 *    (ya está incluido en DestinationMap.tsx)
 */