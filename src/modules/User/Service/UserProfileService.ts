import { createClient } from '@/lib/Supabase/supabaseClient';

export type UserProfile = {
    id: string;
    name: string;
    last_name: string;
    phone: string;
    role: string;
    profile_image: string | null;
    country: string;
    city: string;
    address: string;
    created_at: string;
    updated_at: string;
};

const BUCKET_NAME = 'imgsUsers';

export const userProfileService = {
    /**
     * Subir imagen de perfil a Supabase Storage
     */
    async uploadProfileImage(file: File, userId: string): Promise<string> {
        const supabase = createClient();

        // Generar nombre único para la imagen
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Subir archivo a Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: true,
            });

        if (uploadError) throw uploadError;

        // Obtener URL pública
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    },

    /**
     * Eliminar imagen de perfil anterior del storage
     */
    async deleteProfileImage(imageUrl: string): Promise<void> {
        const supabase = createClient();

        try {
            // Extraer path del storage desde la URL
            const url = new URL(imageUrl);
            const pathParts = url.pathname.split(`/${BUCKET_NAME}/`);
            const filePath = pathParts[1];

            if (!filePath) return;

            // Eliminar de Storage
            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .remove([filePath]);

            if (error) {
                console.error('Error al eliminar imagen del storage:', error);
            }
        } catch (error) {
            console.error('Error procesando URL de imagen:', error);
        }
    },

    /**
     * Actualizar perfil de usuario
     */
    async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
        const supabase = createClient();

        // Remover campos que no deben actualizarse
        const { id, role, created_at, ...allowedUpdates } = updates as any;

        const { data, error } = await supabase
            .from('user_profiles')
            .update({
                ...allowedUpdates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as UserProfile;
    },

    /**
     * Actualizar imagen de perfil (elimina la anterior si existe)
     */
    async updateProfileImage(userId: string, file: File, currentImageUrl?: string | null): Promise<UserProfile> {
        // 1. Si existe una imagen anterior, eliminarla
        if (currentImageUrl) {
            await this.deleteProfileImage(currentImageUrl);
        }

        // 2. Subir nueva imagen
        const newImageUrl = await this.uploadProfileImage(file, userId);

        // 3. Actualizar en la base de datos
        const updatedProfile = await this.updateProfile(userId, {
            profile_image: newImageUrl,
        });

        return updatedProfile;
    },

    /**
     * Obtener perfil de usuario
     */
    async getUserProfile(userId: string): Promise<UserProfile> {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data as UserProfile;
    },

    /**
     * Eliminar imagen de perfil (establecer a null)
     */
    async removeProfileImage(userId: string, currentImageUrl: string): Promise<UserProfile> {
        // 1. Eliminar del storage
        await this.deleteProfileImage(currentImageUrl);

        // 2. Actualizar en la base de datos
        const updatedProfile = await this.updateProfile(userId, {
            profile_image: null,
        });

        return updatedProfile;
    },

    /**
     * Validar archivo de imagen
     */
    validateImageFile(file: File): { valid: boolean; error?: string } {
        // Validar tamaño (máx. 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return { valid: false, error: 'La imagen debe pesar menos de 5MB' };
        }

        // Validar tipo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Solo se permiten imágenes JPG, PNG o WebP' };
        }

        return { valid: true };
    },

    // ============ ADMIN FUNCTIONS ============

    /**
     * Admin: Obtener todos los usuarios (requiere rol admin)
     */
    async getAllUsers(): Promise<UserProfile[]> {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as UserProfile[];
    },

    /**
     * Admin: Actualizar cualquier usuario (incluido role)
     */
    async adminUpdateUser(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
        const supabase = createClient();

        // Remover campos que nunca deben actualizarse
        const { id, created_at, ...allowedUpdates } = updates as any;

        const { data, error } = await supabase
            .from('user_profiles')
            .update({
                ...allowedUpdates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data as UserProfile;
    },

    /**
     * Admin: Obtener compras de un usuario específico
     */
    async getUserPurchases(userId: string) {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('purchases')
            .select(`
        *,
        excursion:excursions (
          id,
          title,
          start_date,
          end_date,
          price
        ),
        payments (
          id,
          amount,
          status,
          payment_type,
          created_at
        )
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },
};