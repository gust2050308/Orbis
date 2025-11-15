import { z } from 'zod';

export const destinationSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  country: z
    .string()
    .min(2, 'El país debe tener al menos 2 caracteres')
    .max(100, 'El país no puede exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  short_description: z
    .string()
    .max(200, 'La descripción corta no puede exceder 200 caracteres')
    .optional()
    .or(z.literal('')),
  description: z
    .string()
    .max(5000, 'La descripción no puede exceder 5000 caracteres')
    .optional()
    .or(z.literal('')),
  latitude: z
    .number()
    .min(-90, 'Latitud inválida')
    .max(90, 'Latitud inválida'),
  longitude: z
    .number()
    .min(-180, 'Longitud inválida')
    .max(180, 'Longitud inválida'),
  is_active: z.boolean(),
});

export type DestinationFormData = z.infer<typeof destinationSchema>;

export type Destination = DestinationFormData & {
  id: number;
  created_at: string;
  updated_at: string;
};
