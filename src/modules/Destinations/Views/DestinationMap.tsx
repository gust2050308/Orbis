'use client';

import React, { useCallback } from 'react';
import { GoogleMap, MarkerF } from '@react-google-maps/api';


const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '0.5rem',
};

type DestinationMapProps = {
    center: google.maps.LatLngLiteral;
    onLocationChange: (lat: number, lng: number) => void;
};

export const DestinationMap = React.memo(({ center, onLocationChange }: DestinationMapProps) => {
    const handleMapClick = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                onLocationChange(e.latLng.lat(), e.latLng.lng());
            }
        },
        [onLocationChange]
    );

    const handleMarkerDragEnd = useCallback(
        (e: google.maps.MapMouseEvent) => {
            if (e.latLng) {
                onLocationChange(e.latLng.lat(), e.latLng.lng());
            }
        },
        [onLocationChange]
    );

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={10}
            onClick={handleMapClick}
            options={{}}
        >
            <MarkerF position={center} draggable onDragEnd={handleMarkerDragEnd} />
        </GoogleMap>
    );
});

DestinationMap.displayName = 'DestinationMap';