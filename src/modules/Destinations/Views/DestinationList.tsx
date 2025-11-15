'use client';

import { useEffect, useState } from 'react';
import { MapPin, Trash2, Globe, Calendar, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { destinationService } from '../Services/destinationService';
import { Destination } from '../types/TypesDestinations';
import { Badge } from '@/components/ui/badge';
import { destinationImagesService } from '../Services/destinationImagesService';
import { DestinationImage } from '../types/TypesImages';
import { toast } from 'sonner';

type DestinationListProps = {
  refreshTrigger?: number;
};

export function DestinationList({ refreshTrigger }: DestinationListProps) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [imagesCount, setImagesCount] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);

  const loadDestinations = async () => {
    setLoading(true);
    try {
      const data = await destinationService.getAll();
      setDestinations(data);

      // Cargar conteo de imágenes para cada destino
      const counts: Record<number, number> = {};
      await Promise.all(
        data.map(async (dest) => {
          const count = await destinationImagesService.getImageCount(dest.id);
          counts[dest.id] = count;
        })
      );
      setImagesCount(counts);
    } catch (error) {
      console.error('Error al cargar destinos:', error);
      toast.error('No se pudieron cargar los destinos')
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, [refreshTrigger]);

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await destinationService.toggleActive(id, !currentStatus);
      setDestinations((prev) =>
        prev.map((dest) =>
          dest.id === id ? { ...dest, is_active: !currentStatus } : dest
        )
      );
      toast.success(`El destino ahora está ${!currentStatus ? 'activo' : 'inactivo'}`)
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('No se pudo actualizar el estado')
    }
  };

  const handleDelete = async (id: number, name: string) => {
    try {
      // Primero eliminar todas las imágenes
      await destinationImagesService.deleteAllImagesFromDestination(id);
      
      // Luego eliminar el destino
      await destinationService.delete(id);
      
      setDestinations((prev) => prev.filter((dest) => dest.id !== id));
      toast.success(`${name} y sus imágenes han sido eliminados correctamente`)
    } catch (error) {
      console.error('Error al eliminar destino:', error);
      toast.error('No se pudo eliminar el destino')
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-[#102542]/60">Cargando destinos...</div>
      </div>
    );
  }

  if (destinations.length === 0) {
    return (
      <div className="text-center py-12 bg-[#F7F5FB] rounded-lg border border-[#256EFF]/10">
        <MapPin className="w-12 h-12 mx-auto text-[#256EFF]/40 mb-3" />
        <p className="text-[#102542]/60">No hay destinos registrados aún</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {destinations.map((destination) => (
        <Card
          key={destination.id}
          className="border-[#256EFF]/20 hover:shadow-lg transition-shadow"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-[#102542] text-lg">
                  {destination.name}
                </CardTitle>
                {destination.country && (
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Globe className="w-3 h-3" />
                    {destination.country}
                  </CardDescription>
                )}
              </div>
              <Badge
                variant={destination.is_active ? 'default' : 'secondary'}
                className={
                  destination.is_active
                    ? 'bg-[#07BEB8] hover:bg-[#07BEB8]/90'
                    : ''
                }
              >
                {destination.is_active ? 'Activo' : 'Inactivo'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {destination.short_description && (
              <p className="text-sm text-[#102542]/70 line-clamp-2">
                {destination.short_description}
              </p>
            )}

            <div className="flex items-center gap-2 text-xs text-[#102542]/60">
              <MapPin className="w-3 h-3" />
              <span>
                {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#102542]/60">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(destination.created_at).toLocaleDateString('es-MX')}
              </span>
            </div>

            {/* Contador de imágenes */}
            <div className="flex items-center gap-2 text-xs text-[#102542]/60">
              <ImageIcon className="w-3 h-3" />
              <span>
                {imagesCount[destination.id] || 0} imagen(es)
              </span>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#256EFF]/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#102542]/60">Estado:</span>
                <Switch
                  checked={destination.is_active}
                  onCheckedChange={() =>
                    handleToggleActive(destination.id, destination.is_active)
                  }
                  className="data-[state=checked]:bg-[#07BEB8]"
                />
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar destino?</AlertDialogTitle>
                    <AlertDialogDescription>
                      ¿Estás seguro de que deseas eliminar "{destination.name}"?
                      Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(destination.id, destination.name)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}