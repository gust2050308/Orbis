'use client';

import { useState } from 'react';
import { Upload, X, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { userProfileService } from '../Service/userProfileService';
import { toast } from 'sonner';

type ProfileImageUploaderProps = {
    userId: string;
    currentImage?: string | null;
    onImageChange?: (imageUrl: string | null) => void;
};

export function ProfileImageUploader({
    userId,
    currentImage = null,
    onImageChange
}: ProfileImageUploaderProps) {
    const [image, setImage] = useState<string | null>(currentImage);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tamaño
        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen no debe superar los 5MB');
            return;
        }

        // Validar tipo
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
            toast.error('Solo se permiten imágenes JPG, PNG o WebP');
            return;
        }

        setUploading(true);

        try {
            // Crear preview local
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Subir imagen
            const imageUrl = await userProfileService.uploadProfileImage(file, userId);

            if (imageUrl) {
                setImage(imageUrl);
                onImageChange?.(imageUrl);
                toast.success('Imagen subida correctamente');
            }
        } catch (error) {
            console.error('Error al subir imagen:', error);
            toast.error('No se pudo subir la imagen');
            setPreview(currentImage);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDeleteImage = async () => {
        if (!image) return;

        try {
            await userProfileService.deleteProfileImage(image);
            setImage(null);
            setPreview(null);
            onImageChange?.(null);
            toast.success('Imagen eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            toast.error('No se pudo eliminar la imagen');
        }
    };

    return (
        <div className="space-y-4">
            {/* Preview de la imagen */}
            <div className="flex justify-center">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#256EFF]/20 bg-[#F7F5FB]">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Imagen de perfil"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User className="w-16 h-16 text-[#256EFF]/40" />
                            </div>
                        )}
                    </div>

                    {/* Botón de eliminar (solo si hay imagen) */}
                    {preview && !uploading && (
                        <button
                            type="button"
                            onClick={handleDeleteImage}
                            className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}

                    {/* Loading spinner */}
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
            </div>

            {/* Botón de subir */}
            <div className="flex justify-center">
                <Button
                    type="button"
                    variant="outline"
                    className="relative border-[#256EFF] text-[#256EFF] hover:bg-[#256EFF]/10"
                    disabled={uploading}
                >
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                    />
                    {uploading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Subiendo...
                        </>
                    ) : (
                        <>
                            <Upload className="mr-2 h-4 w-4" />
                            {preview ? 'Cambiar imagen' : 'Subir imagen'}
                        </>
                    )}
                </Button>
            </div>

            {/* Nota informativa */}
            <div className="bg-[#F7F5FB] border border-[#256EFF]/20 rounded-lg p-3">
                <p className="text-xs text-[#102542]/70 text-center">
                    <strong>Nota:</strong> JPG, PNG o WebP. Máximo 5MB.
                </p>
            </div>
        </div>
    );
}