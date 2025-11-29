'use client';

import { useState } from 'react';
import { MapPin, List, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DestinationForm } from './DestinationForm';
import { DestinationList } from './DestinationList';
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
            <DestinationProvider>
                <div className="max-w-6xl mx-auto">
                    <DestinationDialog />

                    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 border border-[#256EFF]/20">
                        <h2 className="text-2xl font-bold text-[#102542] mb-6">
                            Destinos registrados
                        </h2>
                        <DestinationList refreshTrigger={refreshTrigger} />
                    </div>
                </div>
            </DestinationProvider>
        </div>
    );
}