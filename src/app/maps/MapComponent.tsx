'use client';

import React from 'react';
import { GoogleMap, LoadScript, MarkerF, Libraries } from '@react-google-maps/api';

const libraries: Libraries = ['places'];

type MapComponentProps = {
  center: google.maps.LatLngLiteral;
  onMapClick?: (e: google.maps.MapMouseEvent) => void;
};

export const MapComponent = React.memo(({ onMapClick, center }: MapComponentProps) => (
  <LoadScript
    googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
    libraries={libraries}
  >
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '400px' }}
      center={center}
      zoom={10}
      onClick={onMapClick}
    >
      {/* Marcador estándar */}
      <MarkerF 
        position={center}
        draggable
        onDragEnd={onMapClick}
      />
    </GoogleMap>
  </LoadScript>
));
