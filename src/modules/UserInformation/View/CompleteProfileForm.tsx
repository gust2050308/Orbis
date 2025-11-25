'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProfileImageUploader } from './ProfileImageUploader';
import { completeProfileSchema, CompleteProfileFormType } from '../Types/UserProfileTypes';
import { userProfileService } from '../Service/userProfileService';
import { toast } from 'sonner';

type CompleteProfileFormProps = {
  userId: string;
  userEmail?: string;
  initialName?: string;
};

export function CompleteProfileForm({ 
  userId, 
  userEmail,
  initialName 
}: CompleteProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const form = useForm<CompleteProfileFormType>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      name: initialName || '',
      phone: '',
      profile_image: '',
    },
  });

  const onSubmit = async (data: CompleteProfileFormType) => {
    setIsSubmitting(true);

    try {
      // Agregar la imagen de perfil si existe
      const profileData = {
        ...data,
        profile_image: profileImage || undefined,
      };

      const result = await userProfileService.completeProfile(profileData);

      if (result.success) {
        toast.success('¡Perfil completado exitosamente!');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Error al completar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error inesperado al completar el perfil');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-[#256EFF]/20">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#102542] mb-2">
          Completa tu perfil
        </h2>
        <p className="text-sm text-[#102542]/60">
          Necesitamos algunos datos adicionales para continuar
        </p>
        {userEmail && (
          <p className="text-xs text-[#256EFF] mt-2">
            {userEmail}
          </p>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Imagen de perfil */}
          <div>
            <FormLabel className="text-[#102542]">Foto de perfil (opcional)</FormLabel>
            <div className="mt-2">
              <ProfileImageUploader
                userId={userId}
                currentImage={profileImage}
                onImageChange={setProfileImage}
              />
            </div>
          </div>

          {/* Nombre completo */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#102542]">Nombre completo *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Juan Pérez"
                    {...field}
                    className="border-[#256EFF]/30 focus:border-[#256EFF] focus:ring-[#256EFF]"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#102542]">Teléfono (opcional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="+52 123 456 7890"
                    {...field}
                    className="border-[#256EFF]/30 focus:border-[#256EFF] focus:ring-[#256EFF]"
                  />
                </FormControl>
                <FormMessage className="text-red-600" />
              </FormItem>
            )}
          />

          {/* Botón de envío */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#256EFF] hover:bg-[#256EFF]/90 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              'Continuar'
            )}
          </Button>
        </form>
      </Form>

      {/* Nota */}
      <div className="mt-4 text-center">
        <p className="text-xs text-[#102542]/60">
          Los campos marcados con * son obligatorios
        </p>
      </div>
    </div>
  );
}