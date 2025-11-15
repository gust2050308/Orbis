import { supabase } from './destinationService';
import { DestinationImage, DestinationImageUpload } from '../types/TypesImages';

const BUCKET_NAME = 'imgs';

export const destinationImagesService = {
  /**
   * Subir una imagen a Supabase Storage
   */
  async uploadImage(file: File, destinationId: number): Promise<string> {
    // Generar nombre único para la imagen
    const fileExt = file.name.split('.').pop();
    const fileName = `${destinationId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Subir archivo a Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  },

  /**
   * Guardar referencia de imagen en la base de datos
   */
  async saveImageReference(destinationId: number, imageUrl: string): Promise<DestinationImage> {
    const { data, error } = await supabase
      .from('destination_images')
      .insert([{ destination_id: destinationId, image_url: imageUrl }])
      .select()
      .single();

    if (error) throw error;
    return data as DestinationImage;
  },

  /**
   * Subir imagen completo (storage + DB)
   */
  async addImage(file: File, destinationId: number): Promise<DestinationImage> {
    // 1. Subir a Storage
    const imageUrl = await this.uploadImage(file, destinationId);

    // 2. Guardar referencia en DB
    const imageRecord = await this.saveImageReference(destinationId, imageUrl);

    return imageRecord;
  },

  /**
   * Subir múltiples imágenes
   */
  async addMultipleImages(files: File[], destinationId: number): Promise<DestinationImage[]> {
    const uploadPromises = files.map((file) => this.addImage(file, destinationId));
    return Promise.all(uploadPromises);
  },

  /**
   * Obtener todas las imágenes de un destino
   */
  async getImagesByDestination(destinationId: number): Promise<DestinationImage[]> {
    const { data, error } = await supabase
      .from('destination_images')
      .select('*')
      .eq('destination_id', destinationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as DestinationImage[];
  },

  /**
   * Eliminar una imagen
   */
  async deleteImage(imageId: number, imageUrl: string): Promise<void> {
    // 1. Extraer path del storage desde la URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split(`/${BUCKET_NAME}/`);
    const filePath = pathParts[1];

    // 2. Eliminar de Storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (storageError) {
      console.error('Error al eliminar del storage:', storageError);
      // Continuar para eliminar de DB aunque falle el storage
    }

    // 3. Eliminar referencia de DB
    const { error: dbError } = await supabase
      .from('destination_images')
      .delete()
      .eq('id', imageId);

    if (dbError) throw dbError;
  },

  /**
   * Eliminar todas las imágenes de un destino
   */
  async deleteAllImagesFromDestination(destinationId: number): Promise<void> {
    // 1. Obtener todas las imágenes
    const images = await this.getImagesByDestination(destinationId);

    // 2. Eliminar cada una
    const deletePromises = images.map((img) => 
      this.deleteImage(img.id, img.image_url)
    );

    await Promise.all(deletePromises);
  },

  /**
   * Actualizar orden de imágenes (para drag & drop)
   */
  async reorderImages(imageIds: number[]): Promise<void> {
    // Aquí podrías agregar un campo 'sort_order' a la tabla
    // Por ahora, las imágenes se ordenan por created_at
    console.log('Reordering images:', imageIds);
    // TODO: Implementar si necesitas drag & drop
  },

  /**
   * Obtener conteo de imágenes por destino
   */
  async getImageCount(destinationId: number): Promise<number> {
    const { count, error } = await supabase
      .from('destination_images')
      .select('*', { count: 'exact', head: true })
      .eq('destination_id', destinationId);

    if (error) throw error;
    return count || 0;
  },
};