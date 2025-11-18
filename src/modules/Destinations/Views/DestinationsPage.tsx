'use client';

import { useState } from 'react';
import { MapPin, List, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DestinationForm } from './DestinationForm';
import { DestinationList } from './DestinationList';
import GoogleMapsProvider from './GoogleMapsProvider';
import DestinationProvider from '../DestinationContext';
import DestinationDialog from './DestinationDialog';

export default function DestinationsPage() {
    const [activeTab, setActiveTab] = useState('create');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSuccess = () => {
        // Cambiar a la pestaña de lista y refrescar
        setActiveTab('list');
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7F5FB] to-[#e8e4f5] py-8 px-4">
            <GoogleMapsProvider>  {/* ← AGREGAR */}
                <DestinationProvider>
                    <div className="max-w-6xl mx-auto">
                        <DestinationDialog/>
                        
                        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-[#256EFF]/20">
                            <h2 className="text-2xl font-bold text-[#102542] mb-6">
                                Destinos registrados
                            </h2>
                            <DestinationList refreshTrigger={refreshTrigger} />
                        </div>


                    </div>
                </DestinationProvider>
            </GoogleMapsProvider>  {/* ← AGREGAR */}
        </div>
    );
}

{/* Header 
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#256EFF] rounded-full mb-4">
                            <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-[#102542] mb-2">
                            Gestión de Destinos
                        </h1>
                        <p className="text-[#102542]/60 text-lg">
                            Crea y administra destinos turísticos
                        </p>
                    </div>

                    {/* Tabs *

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 bg-white border border-[#256EFF]/20">
                            <TabsTrigger
                                value="create"
                                className="data-[state=active]:bg-[#256EFF] data-[state=active]:text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Crear destino
                            </TabsTrigger>
                            <TabsTrigger
                                value="list"
                                className="data-[state=active]:bg-[#256EFF] data-[state=active]:text-white"
                            >
                                <List className="w-4 h-4 mr-2" />
                                Ver destinos
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="create" className="mt-0">
                            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-[#256EFF]/20">
                                <DestinationForm onSuccess={handleSuccess} />
                            </div>
                        </TabsContent>

                        <TabsContent value="list" className="mt-0">
                            </div>
                        </TabsContent>
                    </Tabs>*/}