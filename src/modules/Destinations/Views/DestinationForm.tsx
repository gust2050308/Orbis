'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Loader2, MapPin, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { destinationSchema, DestinationFormData } from '../types/TypesDestinations';
import { destinationService } from '../Services/destinationService';
import { DestinationMap } from './DestinationMap';
import { ImageUploader } from './Images/ImageUploader';
import { DestinationImage } from '../types/TypesImages';
import { destinationImagesService } from '../Services/destinationImagesService';
import { useContext } from 'react';
import { DestinationContext } from '../DestinationContext';
import { toast } from 'sonner';
import { Destination } from '../types/TypesDestinations';
import { set } from 'zod';

const defaultCenter = {
    lat: 19.4326,
    lng: -99.1332,
};

type DestinationFormProps = {
    onSuccess?: () => void;
    initialData?: DestinationFormData;
    destinationId?: number;
};

export function DestinationForm({ onSuccess, initialData, destinationId }: DestinationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<DestinationImage[]>([]);
    const [savedDestinationId, setSavedDestinationId] = useState<number | undefined>(destinationId);
    const { refreshData, idDestination, setOpen } = useContext(DestinationContext);
    const [isEditMode, setIsEditMode] = useState(false);

    const form = useForm<DestinationFormData>({
        resolver: zodResolver(destinationSchema),
        defaultValues: initialData || {
            name: '',
            country: '',
            short_description: '',
            description: '',
            latitude: defaultCenter.lat,
            longitude: defaultCenter.lng,
            is_active: true,
        },
    });

    // Cargar destino cuando idDestination cambia
    useEffect(() => {
        if (!idDestination) {
            // Resetear formulario para crear nuevo
            form.reset({
                name: '',
                country: '',
                short_description: '',
                description: '',
                latitude: defaultCenter.lat,
                longitude: defaultCenter.lng,
                is_active: true,
            });
            setSavedDestinationId(undefined);
            setImages([]);
            setIsEditMode(false);
            return;
        }

        // Cargar destino existente
        (async () => {
            try {
                const fetched = await destinationService.getById(idDestination);

                // IMPORTANTE: Usar reset con todos los campos
                form.reset({
                    name: fetched.name,
                    country: fetched.country || '',
                    short_description: fetched.short_description || '',
                    description: fetched.description || '',
                    latitude: fetched.latitude,
                    longitude: fetched.longitude,
                    is_active: fetched.is_active,
                });

                setSavedDestinationId(idDestination);
                setIsEditMode(true);

                const imgs = await destinationImagesService.getImagesByDestination(idDestination);
                setImages(imgs);

                console.log('Destino cargado para edición:', fetched);
            } catch (err) {
                toast.error("No se pudo cargar el destino.");
                console.error(err);
            }
        })();
    }, [idDestination]);

    const handleLocationChange = (lat: number, lng: number) => {
        form.setValue('latitude', lat);
        form.setValue('longitude', lng);
    };

    const onSubmit = async (data: DestinationFormData) => {
        setIsSubmitting(true);

        try {
            console.log('Enviando datos:', data);
            console.log('savedDestinationId:', savedDestinationId);
            console.log('isEditMode:', isEditMode);

            let dest: Destination;

            if (savedDestinationId && isEditMode) {
                // EDITAR
                console.log('Actualizando destino ID:', savedDestinationId);
                dest = await destinationService.update(savedDestinationId, data);
                toast.success("Destino actualizado correctamente.");
            } else {
                // CREAR
                console.log('Creando nuevo destino');
                dest = await destinationService.create(data);
                setSavedDestinationId(dest.id);
                setIsEditMode(true);
                toast.success("Destino creado correctamente. Ahora puedes agregar imágenes.");
            }

            console.log('Resultado:', dest);

        } catch (err) {
            toast.error("Error al guardar el destino.");
            console.error('Error completo:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleFinish = () => {
        form.reset({
            name: '',
            country: '',
            short_description: '',
            description: '',
            latitude: defaultCenter.lat,
            longitude: defaultCenter.lng,
            is_active: true,
        });
        setSavedDestinationId(undefined);
        setImages([]);
        setIsEditMode(false);
        refreshData();
        onSuccess?.();
        setOpen(false);
    };

    const latitude = form.watch('latitude');
    const longitude = form.watch('longitude');

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[#102542]">
                                    Nombre del destino <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ej: Teotihuacán"
                                        className="border-[#256EFF]/20 focus:border-[#256EFF]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[#102542]">País</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ej: México"
                                        className="border-[#256EFF]/20 focus:border-[#256EFF]"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[#102542]">Descripción corta</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Breve descripción para listados (máx. 200 caracteres)"
                                    className="border-[#256EFF]/20 focus:border-[#256EFF]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription className="text-[#102542]/60">
                                Aparecerá en las tarjetas de destinos
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[#102542]">Descripción completa</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Descripción detallada del destino..."
                                    className="min-h-[120px] border-[#256EFF]/20 focus:border-[#256EFF]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-[#07BEB8]" />
                        <FormLabel className="text-[#102542] text-base font-semibold">
                            Ubicación en el mapa
                        </FormLabel>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-[#256EFF]/20 shadow-sm">
                        <DestinationMap
                            center={{ lat: latitude, lng: longitude }}
                            onLocationChange={handleLocationChange}
                        />
                    </div>
                    <div className="flex gap-4 text-sm text-[#102542]/70 bg-[#F7F5FB] p-3 rounded-md">
                        <div>
                            <span className="font-medium">Lat:</span> {latitude.toFixed(6)}
                        </div>
                        <div>
                            <span className="font-medium">Lng:</span> {longitude.toFixed(6)}
                        </div>
                    </div>
                    <FormDescription className="text-[#102542]/60">
                        Haz clic en el mapa o arrastra el marcador para seleccionar la ubicación
                    </FormDescription>
                </div>

                <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-[#256EFF]/20 p-4 bg-[#F7F5FB]">
                            <div className="space-y-0.5">
                                <FormLabel className="text-[#102542] font-medium">Destino activo</FormLabel>
                                <FormDescription className="text-[#102542]/60">
                                    Los destinos activos son visibles para los usuarios
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-[#07BEB8]"
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Sección de imágenes */}
                {savedDestinationId && (
                    <div className="space-y-3 border-t border-[#256EFF]/20 pt-6">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-[#07BEB8]" />
                            <FormLabel className="text-[#102542] text-base font-semibold">
                                Imágenes del destino
                            </FormLabel>
                        </div>
                        <ImageUploader
                            destinationId={savedDestinationId}
                            existingImages={images}
                            onImagesChange={setImages}
                        />
                    </div>
                )}

                <div className="w-full flex justify-center gap-4 py-4">
                    <div className="flex w-full justify-center">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-[#256EFF] hover:bg-[#1a5ce6] text-white w-1/2"
                            onClick={() => {
                                onSubmit(form.getValues());
                                setOpen(false);
                                refreshData();
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    {isEditMode ? 'Actualizar destino' : 'Guardar destino'}
                                </>
                            )}
                        </Button>

                        {(savedDestinationId && !isEditMode) && (
                            <Button
                                type="button"
                                onClick={handleFinish}
                                className="bg-[#07BEB8] hover:bg-[#06a59f] text-white w-1/2"
                            >
                                Finalizar y crear otro destino
                            </Button>
                        )}
                    </div>
                </div>
            </form>
        </Form>
    );
}