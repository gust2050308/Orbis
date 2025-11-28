// types/UserProfileTypes.ts
import { z } from 'zod';

/**
 * Tipo principal del perfil de usuario
 */
export type UserProfile = {
  id: string; // UUID del usuario (auth.users.id)
  name: string;
  last_name: string;
  phone: string;
  role: 'customer' | 'admin' | 'employee';
  profile_image: string | null;
  country: string;
  city: string;
  address: string;
  created_at: string;
  updated_at: string;
};

/**
 * Tipo para actualizaciones parciales del perfil
 */
export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'role' | 'created_at'>>;

/**
 * Schema de validación con Zod
 */
export const userProfileSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(255, 'Nombre muy largo'),
  last_name: z.string().max(255, 'Apellido muy largo').optional(),
  phone: z.string().max(50, 'Teléfono muy largo').optional(),
  country: z.string().max(100, 'País muy largo').optional(),
  city: z.string().max(100, 'Ciudad muy larga').optional(),
  address: z.string().optional(),
  profile_image: z.string().url('URL inválida').nullable().optional(),
});

/**
 * Validación de imagen de perfil
 */
export const profileImageSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'La imagen debe pesar menos de 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type),
      'Solo se permiten imágenes JPG, PNG o WebP'
    ),
});

/**
 * Constantes
 */
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  EMPLOYEE: 'employee',
} as const;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

/**
 * Type guards
 */
export function isValidUserRole(role: string): role is UserProfile['role'] {
  return Object.values(USER_ROLES).includes(role as any);
}

export function isValidImageType(type: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(type);
}

export function isValidImageSize(size: number): boolean {
  return size <= MAX_IMAGE_SIZE;
}