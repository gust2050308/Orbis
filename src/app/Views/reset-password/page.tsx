'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/lib/Supabase/supabaseClient';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';

const resetPasswordSchema = z.object({
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const supabase = createClient();

    const form = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    // Mostrar errores de la URL si existen
    useEffect(() => {
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error && errorDescription) {
            toast.error(errorDescription);
            // Redirigir al login después de mostrar el error
            setTimeout(() => {
                router.push('/Views/auth');
            }, 3000);
        }
    }, [searchParams, router]);

    const onSubmit = async (data: ResetPasswordForm) => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: data.password,
            });

            if (error) throw error;

            toast.success('¡Contraseña actualizada exitosamente!', {
                description: 'Ahora puedes iniciar sesión con tu nueva contraseña',
                icon: <CheckCircle2 className="h-5 w-5" />,
            });

            // Esperar un momento para que el usuario vea el mensaje
            setTimeout(() => {
                router.push('/Views/auth');
            }, 1500);
        } catch (error: any) {
            console.error('Error:', error);
            toast.error(error.message || 'Error al actualizar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F7F5FB] via-white to-[#E8F4F8] p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#256EFF]/10">
                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#256EFF] to-[#07BEB8] rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#102542]">Restablecer Contraseña</h1>
                    <p className="text-sm text-[#102542]/60 text-center mt-2">
                        Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    {/* Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-[#102542] font-medium">
                            Nueva Contraseña
                        </Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Mínimo 6 caracteres"
                                {...form.register('password')}
                                disabled={loading}
                                className="pr-10 border-[#256EFF]/20 focus:border-[#256EFF] transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#256EFF] transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {form.formState.errors.password && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <span className="text-xs">⚠</span>
                                {form.formState.errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-[#102542] font-medium">
                            Confirmar Contraseña
                        </Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Repite tu contraseña"
                                {...form.register('confirmPassword')}
                                disabled={loading}
                                className="pr-10 border-[#256EFF]/20 focus:border-[#256EFF] transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#256EFF] transition-colors"
                                tabIndex={-1}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {form.formState.errors.confirmPassword && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                                <span className="text-xs">⚠</span>
                                {form.formState.errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:from-[#1557d8] hover:to-[#06a89a] text-white font-medium py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <Lock className="mr-2 h-5 w-5" />
                                Actualizar Contraseña
                            </>
                        )}
                    </Button>
                </form>

                {/* Footer */}
                <div className="mt-6 text-center">
                    <button
                        type="button"
                        onClick={() => router.push('/Views/auth')}
                        className="text-sm text-[#256EFF] hover:text-[#1557d8] hover:underline transition-colors"
                    >
                        Volver al inicio de sesión
                    </button>
                </div>
            </div>
        </div>
    );
}
