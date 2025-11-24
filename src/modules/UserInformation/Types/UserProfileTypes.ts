import { z } from "zod"

export const completeProfileSchema = z.object({
    name: z.string().min(2, "El nombre debe tener almenos 2 caracteres"),
    phone: z.string()
        .min(10,"El teléfono debe de tener al menos 10 dígitos")
        .regex(/^\+?[0-9\s\-()]+$/, "Formato de teléfono inválido")
        .optional()
        .or(z.literal("")),
    profile_image: z.string().url("Debe de ser un enlace válido").optional(),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").optional(),
    phone: z.string()
        .min(10, "El teléfono debe tener al menos 10 dígitos")
        .regex(/^\+?[0-9\s\-()]+$/, "Formato de teléfono inválido")
        .optional()
        .or(z.literal("")),
    profile_image: z.string().url().optional(),
    role: z.enum(["customer", "admin", "guide"]).optional(),
});

export type CompleteProfileFormType = z.infer<typeof completeProfileSchema>;
export type UpdateProfileFormType = z.infer<typeof updateProfileSchema>

export interface UserProfile {
    id: string;
    name: string | null;
    phone: string | null;
    role: string;
    profile_image: string | null;
    created_at: string;
    update_at: string;
}

export interface ProfileCompleteStatus {
    isComplete: boolean;
    missingFields: string[];
}