'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/Core/CustomHooks/useAuth';
import { User, Camera, Loader2, MapPin, Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { toast } from 'sonner';
import { userProfileService, type UserProfile } from '@/modules/User/Service/UserProfileService';
import { SetPasswordDialog } from '@/modules/User/Components/SetPasswordDialog';

export function UserInfo() {
  const { user: authUser, loading, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showSetPasswordDialog, setShowSetPasswordDialog] = useState(false);

  // Cargar perfil completo cuando se abre el drawer
  useEffect(() => {
    const loadUserProfile = async () => {
      if (open && authUser && isAuthenticated) {
        setLoadingProfile(true);
        try {
          const profile = await userProfileService.getUserProfile(authUser.id);
          setUserProfile(profile);
          setFormData(profile);
          setImagePreview(profile.profile_image);
        } catch (error) {
          console.error('Error loading profile:', error);
          // Si no existe el perfil en la tabla users, usar datos básicos del auth
          const basicProfile: Partial<UserProfile> = {
            id: authUser.id,
            name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
            last_name: '',
            phone: '',
            role: 'customer',
            profile_image: null,
            country: '',
            city: '',
            address: '',
          };
          setFormData(basicProfile);
        } finally {
          setLoadingProfile(false);
        }
      }
    };

    loadUserProfile();
  }, [open, authUser, isAuthenticated]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser) return;

    // Validar archivo
    const validation = userProfileService.validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    setUploadingImage(true);

    try {
      const imageUrl = await userProfileService.uploadProfileImage(file, authUser.id);
      setImagePreview(imageUrl);
      setFormData(prev => ({ ...prev, profile_image: imageUrl }));
      toast.success('Imagen cargada correctamente');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error al cargar la imagen');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!authUser) return;

    setLoadingProfile(true);

    try {
      const updatedProfile = await userProfileService.updateProfile(authUser.id, formData);
      setUserProfile(updatedProfile);
      toast.success('Perfil actualizado correctamente');
      setOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center gap-2 px-2 py-2 animate-pulse">
        <div className="h-8 w-8 rounded-full bg-gray-300"></div>
        <div className="flex flex-col gap-1">
          <div className="h-3 w-20 bg-gray-300 rounded"></div>
          <div className="h-2 w-28 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  // Usuario no autenticado
  if (!isAuthenticated || !authUser) {
    return (
      <div className="flex items-center gap-2 px-2 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white text-xs font-semibold">
          ?
        </div>
        <div className="flex flex-col gap-0.5 text-xs">
          <span className="font-medium text-[#102542]">Invitado</span>
          <span className="text-[#102542]/60">No autenticado</span>
        </div>
      </div>
    );
  }

  // Obtener datos para mostrar
  const fullName = authUser.user_metadata?.full_name || authUser.email || 'Usuario';
  const displayImage = userProfile?.profile_image || imagePreview;
  const initials = fullName
    .split(' ')
    .map((word: string) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen} direction="right">
        <DrawerTrigger asChild>
          <button className="w-full text-left hover:bg-[#256EFF]/10 transition-colors rounded-lg p-2 group">
            <div className="flex items-center gap-2">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt={fullName}
                  className="h-8 w-8 rounded-full object-cover border-2 border-[#256EFF]/20 group-hover:border-[#256EFF]/40 transition-colors"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#07BEB8] text-white text-xs font-semibold group-hover:bg-[#07BEB8]/80 transition-colors">
                  {initials}
                </div>
              )}
              <div className="flex flex-col gap-0.5 text-xs">
                <span className="font-medium text-[#102542] truncate max-w-[120px]">
                  {authUser.user_metadata?.full_name || 'Usuario'}
                </span>
                <span className="text-[#102542]/60 truncate max-w-[120px]">
                  {authUser.email}
                </span>
              </div>
            </div>
          </button>
        </DrawerTrigger>

        <DrawerContent className="h-full w-full sm:w-[540px] ml-auto">
          <DrawerHeader className="border-b border-[#256EFF]/20">
            <DrawerTitle className="text-2xl text-[#102542]">Mi Perfil</DrawerTitle>
            <DrawerDescription className="text-[#102542]/60">
              Actualiza tu información personal
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto p-6">
            {loadingProfile ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-[#256EFF]" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Image Section */}
                <div className="flex flex-col items-center gap-4 pb-6 border-b border-[#256EFF]/20">
                  <div className="relative">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-[#256EFF]/20"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-[#07BEB8] flex items-center justify-center border-4 border-[#256EFF]/20 text-white text-4xl font-bold">
                        {initials}
                      </div>
                    )}

                    <Button
                      type="button"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-[#256EFF] hover:bg-[#1557d8] shadow-lg"
                      disabled={uploadingImage}
                    >
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleImageSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingImage}
                      />
                      {uploadingImage ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Camera className="w-5 h-5" />
                      )}
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-[#102542]/60">
                      Haz clic en el ícono de cámara para cambiar tu foto
                    </p>
                    <p className="text-xs text-[#102542]/40 mt-1">
                      JPG, PNG o WebP. Máx. 5MB
                    </p>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#102542] flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Información Personal
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className='flex flex-col gap-2'>
                      <Label htmlFor="name" className="text-[#102542]">Nombre</Label>
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="border-[#256EFF]/20 focus:border-[#256EFF]"
                        placeholder="Tu nombre"
                      />
                    </div>

                    <div className='flex flex-col gap-2'>
                      <Label htmlFor="last_name" className="text-[#102542]">Apellido</Label>
                      <Input
                        id="last_name"
                        value={formData.last_name || ''}
                        onChange={(e) => handleChange('last_name', e.target.value)}
                        className="border-[#256EFF]/20 focus:border-[#256EFF]"
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Label htmlFor="phone" className="text-[#102542] flex items-center gap-2">
                      <Phone className="w-3 h-3" />
                      Teléfono
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="border-[#256EFF]/20 focus:border-[#256EFF]"
                      placeholder="+52 777 123 4567"
                    />
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#102542] flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Ubicación
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className='flex flex-col gap-2'>
                      <Label htmlFor="country" className="text-[#102542]">País</Label>
                      <Input
                        id="country"
                        value={formData.country || ''}
                        onChange={(e) => handleChange('country', e.target.value)}
                        className="border-[#256EFF]/20 focus:border-[#256EFF]"
                        placeholder="México"
                      />
                    </div>

                    <div className='flex flex-col gap-2'>
                      <Label htmlFor="city" className="text-[#102542]">Ciudad</Label>
                      <Input
                        id="city"
                        value={formData.city || ''}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className="border-[#256EFF]/20 focus:border-[#256EFF]"
                        placeholder="Cuernavaca"
                      />
                    </div>
                  </div>

                  <div className='flex flex-col gap-2'>
                    <Label htmlFor="address" className="text-[#102542]">Dirección</Label>
                    <Input
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                      className="border-[#256EFF]/20 focus:border-[#256EFF]"
                      placeholder="Calle, número, colonia..."
                    />
                  </div>
                </div>

                {/* Role Display (Read-only) */}
                <div className="bg-[#F7F5FB] border border-[#256EFF]/20 rounded-lg p-4">
                  <Label className="text-[#102542]/70 text-xs">Rol en el sistema</Label>
                  <p className="text-[#102542] font-medium capitalize mt-1">
                    {formData.role || 'customer'}
                  </p>
                  <p className="text-xs text-[#102542]/50 mt-1">
                    El rol no puede ser modificado
                  </p>
                </div>

                {/* Email Display (Read-only) */}
                <div className="bg-[#F7F5FB] border border-[#256EFF]/20 rounded-lg p-4">
                  <Label className="text-[#102542]/70 text-xs">Correo electrónico</Label>
                  <p className="text-[#102542] font-medium mt-1">
                    {authUser.email}
                  </p>
                  <p className="text-xs text-[#102542]/50 mt-1">
                    El correo no puede ser modificado
                  </p>
                </div>

                {/* Security Section */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#102542] flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Seguridad
                  </h3>

                  {/* Detectar si el usuario tiene contraseña o es OAuth */}
                  {authUser.app_metadata?.provider === 'google' ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800 font-medium">
                        Cuenta de Google
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        Iniciaste sesión con Google. Puedes establecer una contraseña opcional para tener acceso alternativo.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 border-blue-300 text-blue-700 hover:bg-blue-100"
                        onClick={() => setShowSetPasswordDialog(true)}
                      >
                        Establecer Contraseña
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-[#F7F5FB] border border-[#256EFF]/20 rounded-lg p-4">
                      <p className="text-sm text-[#102542] font-medium">
                        Contraseña
                      </p>
                      <p className="text-xs text-[#102542]/50 mt-1">
                        Tu cuenta está protegida con contraseña
                      </p>
                      <p className="text-xs text-[#102542]/40 mt-1">
                        Usa "¿Olvidaste tu contraseña?" en el login para cambiarla
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <DrawerFooter className="border-t border-[#256EFF]/20 flex-row gap-2">
            <DrawerClose asChild>
              <Button variant="outline" className="flex-1 border-[#256EFF]/20">
                Cancelar
              </Button>
            </DrawerClose>
            <Button
              onClick={handleSubmit}
              disabled={loadingProfile}
              className="flex-1 bg-[#256EFF] hover:bg-[#1557d8]"
            >
              {loadingProfile ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Set Password Dialog */}
      <SetPasswordDialog
        open={showSetPasswordDialog}
        onOpenChange={setShowSetPasswordDialog}
      />
    </>
  );
}