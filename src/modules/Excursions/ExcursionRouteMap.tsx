'use client'

import React, { useCallback } from 'react';
import { GoogleMap, MarkerF, PolylineF } from '@react-google-maps/api';

const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '0.75rem',
};

type Destination = {
    id: number
    name: string
    latitude: number | null
    longitude: number | null
}

type ExcursionRouteMapProps = {
    destinations: Destination[]
}

export const ExcursionRouteMap = ({ destinations }: ExcursionRouteMapProps) => {
    // Filtrar destinos con coordenadas válidas
    const validDestinations = destinations.filter(
        dest => dest.latitude !== null && dest.longitude !== null
    )

    if (validDestinations.length === 0) {
        return (
            <div className="w-full h-[500px] rounded-xl bg-gradient-to-br from-[#F7F5FB] to-[#E8F4F8] flex items-center justify-center">
                <p className="text-[#102542]/60">No hay coordenadas disponibles para mostrar el mapa</p>
            </div>
        )
    }

    // Calcular el centro del mapa (promedio de todas las coordenadas)
    const center = {
        lat: validDestinations.reduce((sum, dest) => sum + (dest.latitude || 0), 0) / validDestinations.length,
        lng: validDestinations.reduce((sum, dest) => sum + (dest.longitude || 0), 0) / validDestinations.length,
    }

    // Crear path para la polilínea
    const path = validDestinations.map(dest => ({
        lat: dest.latitude!,
        lng: dest.longitude!,
    }))

    // Opciones para la polilínea (línea de ruta)
    const polylineOptions = {
        strokeColor: '#256EFF',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        icons: [{
            icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 3,
            },
            offset: '0',
            repeat: '20px',
        }],
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={6}
            options={{
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'off' }],
                    },
                ],
            }}
        >
            {/* Línea de ruta */}
            {path.length > 1 && (
                <PolylineF
                    path={path}
                    options={polylineOptions}
                />
            )}

            {/* Marcadores para cada destino */}
            {validDestinations.map((dest, index) => (
                <MarkerF
                    key={dest.id}
                    position={{
                        lat: dest.latitude!,
                        lng: dest.longitude!,
                    }}
                    label={{
                        text: `${index + 1}`,
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }}
                    title={dest.name}
                    icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 20,
                        fillColor: index === 0 ? '#07BEB8' : index === validDestinations.length - 1 ? '#FF6B6B' : '#256EFF',
                        fillOpacity: 1,
                        strokeColor: 'white',
                        strokeWeight: 3,
                    }}
                />
            ))}
        </GoogleMap>
    );
};
