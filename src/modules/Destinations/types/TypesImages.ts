import { z } from 'zod';

export const destinationImageSchema = z.object({
  destination_id: z.number(),
  image_url: z.string().url('URL de imagen inválida'),
});

export type DestinationImage = {
  id: number;
  destination_id: number;
  image_url: string;
  created_at: string;
};

export type DestinationImageUpload = z.infer<typeof destinationImageSchema>;

// Validación de archivos para el cliente
export const imageFileSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'La imagen debe pesar menos de 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type),
      'Solo se permiten imágenes JPG, PNG o WebP'
    ),
});

export const MAX_IMAGES_PER_DESTINATION = 10;