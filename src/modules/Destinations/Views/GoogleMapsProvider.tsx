// app/destinations/GoogleMapsProvider.tsx
'use client';

import { LoadScript, Libraries } from '@react-google-maps/api';
import { ReactNode } from 'react';

const libraries: Libraries = ['places'];

export default function GoogleMapsProvider({ children }: { children: ReactNode }) {
  return (
    <LoadScript 
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} 
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
}