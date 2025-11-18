'use client';

import { useCallback, useEffect, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { destinationImagesService } from '../../Services/destinationImagesService';
import { DestinationImage, MAX_IMAGES_PER_DESTINATION } from '../../types/TypesImages';
import { toast } from 'sonner';
import { set } from 'zod';

type ImageUploaderProps = {
    destinationId: number;
    existingImages?: DestinationImage[];
    onImagesChange?: (images: DestinationImage[]) => void;
};

export function ImageUploader({
    destinationId,
    existingImages = [],
    onImagesChange
}: ImageUploaderProps) {
    const [images, setImages] = useState<DestinationImage[]>(existingImages);
     const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);

    useEffect(() => {
        setImages(existingImages);
    }, [existingImages]);
   

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validar número máximo de imágenes
        if (images.length + files.length > MAX_IMAGES_PER_DESTINATION) {
            toast.info(`Solo se permiten un máximo de ${MAX_IMAGES_PER_DESTINATION} imágenes por destino`);
            return;
        }

        // Validar tamaño y tipo
        const validFiles = files.filter((file) => {
            if (file.size > 5 * 1024 * 1024) {
                toast.info(`${file.name} supera los 5MB`)
                return false;
            }
            if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
                toast.info(`${file.name} no es JPG, PNG o WebP`)
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        setUploading(true);

        try {
            // Subir imágenes
            const uploadedImages = await destinationImagesService.addMultipleImages(
                validFiles,
                destinationId
            );

            const newImages = [...images, ...uploadedImages];
            setImages(newImages);
            onImagesChange?.(newImages);

            toast.success(`${validFiles.length} imagen(es) subida(s) correctamente`)
        } catch (error) {
            console.error('Error al subir imágenes:', error);
            toast.error('No se pudieron subir las imágenes')
        } finally {
            setUploading(false);
            e.target.value = ''; // Reset input
        }
    }, [images, destinationId, toast, onImagesChange]);

    const handleDeleteImage = async (image: DestinationImage) => {
        try {
            await destinationImagesService.deleteImage(image.id, image.image_url);

            const newImages = images.filter((img) => img.id !== image.id);
            setImages(newImages);
            onImagesChange?.(newImages);

            toast.success('Imagen eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            toast.error('No se pudo eliminar la imagen');
        }
    };

    return (
        <div className="space-y-4">
            {/* Upload button */}
            <div className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="outline"
                    className="relative border-[#256EFF] text-[#256EFF] hover:bg-[#256EFF]/10"
                    disabled={uploading || images.length >= MAX_IMAGES_PER_DESTINATION}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading || images.length >= MAX_IMAGES_PER_DESTINATION}
                    />
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Subiendo...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            Subir imágenes
                        </>
                    )}
                </Button>
                <span className="text-sm text-[#102542]/60">
                    {images.length} / {MAX_IMAGES_PER_DESTINATION} imágenes
                </span>
            </div>

            {/* Grid de imágenes */}
            {images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((image) => (
                        <div
                            key={image.id}
                            className="relative group aspect-square rounded-lg overflow-hidden border-2 border-[#256EFF]/20 hover:border-[#256EFF] transition-colors"
                        >
                            <img
                                src={image.image_url}
                                alt="Imagen del destino"
                                className="w-full h-full object-cover"
                            />

                            {/* Overlay con botón de eliminar */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDeleteImage(image)}
                                    className="bg-red-600 hover:bg-red-700"
                                >
                                    <X className="h-4 w-4 mr-1" />
                                    Eliminar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="border-2 border-dashed border-[#256EFF]/30 rounded-lg p-12 text-center">
                    <ImageIcon className="w-12 h-12 mx-auto text-[#256EFF]/40 mb-3" />
                    <p className="text-[#102542]/60 mb-2">No hay imágenes aún</p>
                    <p className="text-sm text-[#102542]/40">
                        Haz clic en "Subir imágenes" para agregar fotos
                    </p>
                </div>
            )}

            {/* Nota informativa */}
            <div className="bg-[#F7F5FB] border border-[#256EFF]/20 rounded-lg p-3">
                <p className="text-xs text-[#102542]/70">
                    <strong>Nota:</strong> Formatos permitidos: JPG, PNG, WebP. Tamaño máximo: 5MB por imagen.
                </p>
            </div>
        </div>
    );
}