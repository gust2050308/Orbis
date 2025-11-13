'use client';

import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import { MapComponent } from './MapComponent';

const containerStyle = {
    width: '100%',
    height: '400px',
};

const defaultCenter = {
    lat: 19.4326,
    lng: -99.1332,
};

export default function DestinationForm() {
    const [formData, setFormData] = useState({
        name: '',
        country: '',
        description: '',
        latitude: defaultCenter.lat,
        longitude: defaultCenter.lng,
    });

    const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);

    const handleMapLoad = (map: google.maps.Map) => {
        mapRef.current = map;

        // Crear el nuevo marcador avanzado
        const position = new google.maps.LatLng(formData.latitude, formData.longitude);
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position,
            map,
            gmpDraggable: true,
        });

        // Escuchar cuando se arrastra
        marker.addListener('dragend', (event: google.maps.MapMouseEvent) => {
            if (event.latLng) {
                const lat = event.latLng.lat();
                const lng = event.latLng.lng();
                setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
            }
        });

        markerRef.current = marker;
    };

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (!event.latLng) return;
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));

        // Mover el marcador
        if (markerRef.current) markerRef.current.position = { lat, lng };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Guardando destino:', formData);
    };

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-xl font-semibold">Crear destino</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    placeholder="Nombre"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border p-2 w-full"
                    required
                />
                <input
                    type="text"
                    placeholder="País"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="border p-2 w-full"
                />
                <textarea
                    placeholder="Descripción"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border p-2 w-full"
                />

                <div>
                    <p className="font-medium mb-1">Ubicación</p>
                    <MapComponent
                        center={{ lat: formData.latitude, lng: formData.longitude }}
                        onMapClick={handleMapClick}
                    />

                    <p className="text-sm mt-2 text-gray-600">
                        Latitud: {formData.latitude.toFixed(6)} | Longitud:{' '}
                        {formData.longitude.toFixed(6)}
                    </p>
                </div>

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                    Guardar destino
                </button>
            </form>
        </div>
    );
}
