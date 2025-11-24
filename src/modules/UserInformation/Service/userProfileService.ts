import { createClient } from "@/lib/Supabase/supabaseClient";
import { UserProfile,  ProfileCompleteStatus, CompleteProfileFormType  } from "../Types/UserProfileTypes"

class UserProfileService{

    private supabase = createClient();

    async getCurrentUserProfile(): Promise<UserProfile | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await this.supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      return null;
    }
  }

  async checkProfileCompletion(): Promise<ProfileCompleteStatus>{

    const profile = await this.getCurrentUserProfile();

    if(!profile){
        return{
            isComplete: false,
            missingFields: ["name", "phone"]
        };
    }

    const missingFields: string[] = [];

    if(!profile.name || profile.name.trim() === ""){
        missingFields.push("name");
    }

    if(!profile.phone || profile.phone.trim() === ""){
        missingFields.push("phone");
    }

    return{
        isComplete: missingFields.length === 0,
        missingFields,
    }
  }

  async completeProfile(data: CompleteProfileFormType): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        return { success: false, error: "Usuario no autenticado" };
      }

      const { error } = await this.supabase
        .from("user_profiles")
        .update({
          name: data.name,
          phone: data.phone || null,
          profile_image: data.profile_image || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Error al completar perfil:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Error desconocido" 
      };
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await this.supabase
        .from("user_profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Error desconocido" 
      };
    }
  }

  async uploadProfileImage(file: File, userId: string): Promise<string | null> {
    try {
      if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
        throw new Error("Formato de imagen no válido. Usa JPG, PNG o WebP");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("La imagen no debe superar los 5MB");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await this.supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = this.supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error al subir imagen de perfil:", error);
      throw error;
    }
  }

  async deleteProfileImage(imageUrl: string): Promise<boolean> {
    try {
      
      const urlParts = imageUrl.split("/profile-images/");
      if (urlParts.length !== 2) return false;

      const filePath = urlParts[1];

      const { error } = await this.supabase.storage
        .from("profile-images")
        .remove([filePath]);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error("Error al eliminar imagen de perfil:", error);
      return false;
    }
  }

  async getAllProfiles(): Promise<UserProfile[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error al obtener perfiles:", error);
      return [];
    }
  }


  async deleteProfile(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      
      const profile = await this.getCurrentUserProfile();
      if (profile?.profile_image) {
        await this.deleteProfileImage(profile.profile_image);
      }

      const { error } = await this.supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error("Error al eliminar perfil:", error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Error desconocido" 
      };
    }
  }
}

export const userProfileService = new UserProfileService();