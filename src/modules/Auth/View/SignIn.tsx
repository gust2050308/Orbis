'use client'
import React, { useState } from 'react'
import { SignUpFormType } from "../Types/FormTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { SignUpSchema } from '../Types/FormTypes';
import { useSignUp } from '../Service/useSignUp'; // Asume que tienes este servicio
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from 'lucide-react';


export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { SignUp, SignUpWithGoogle } = useSignUp();

    const signUpForm = useForm<SignUpFormType>({
        resolver: zodResolver(SignUpSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    return (
        <div className='w-full p-5 rounded-lg'>
            <div className='w-full flex flex-col'>
                <form id='signUpForm' onSubmit={signUpForm.handleSubmit(
                    async (data) => {
                        const formData = new FormData();
                        formData.append('name', data.name);
                        formData.append('email', data.email);
                        formData.append('password', data.password);
                        formData.append('confirmPassword', data.confirmPassword);
                        await SignUp(formData);
                    },
                    (errors) => console.log('Errores de validación:', errors)
                )}>
                    <FieldGroup className='gap-5'>
                        <Controller
                            control={signUpForm.control}
                            name="name"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-signup-name">
                                        Nombre completo
                                        <span className='text-red-500'>*</span>
                                    </FieldLabel>
                                    <Input {...field}
                                        id="form-signup-name"
                                        placeholder="Ej. Juan Pérez"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete='off'
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            control={signUpForm.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-signup-email">
                                        Email
                                        <span className='text-red-500'>*</span>
                                    </FieldLabel>
                                    <Input {...field}
                                        id="form-signup-email"
                                        placeholder="Ej. user@gmail.com"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete='off'
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            control={signUpForm.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-signup-password">
                                        Contraseña
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="form-signup-password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Ej. 21sd12cDd"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            control={signUpForm.control}
                            name="confirmPassword"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-signup-confirm-password">
                                        Confirmar contraseña
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="form-signup-confirm-password"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Ej. 21sd12cDd"
                                            aria-invalid={fieldState.invalid}
                                            autoComplete="off"
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                            aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field>
                            <Button type="submit" form="signUpForm" className='cursor-pointer bg-gradient-to-r from-[#256EFF] to-blue-700 hover:scale-105 transition-transform duration-300 w-full'>
                                <p>Crear cuenta</p>
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
            <div className='w-full flex flex-col mt-4'>
                <div className='w-full grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-sm text-gray-500'>
                    <Separator />
                    <p>Or</p>
                    <Separator />
                </div>
                <div>
                    <Button variant="outline" className='w-full mt-4 cursor-pointer' onClick={() => { SignUpWithGoogle() }}>
                        <div className='flex flex-row justify-around items-center gap-3'>
                            <svg xmlns="http://www.w3.org/2000/svg" width={52} height={52} viewBox="0 0 48 48"><path fill="#ffc107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917"></path><path fill="#ff3d00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691"></path><path fill="#4caf50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.9 11.9 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44"></path><path fill="#1976d2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917"></path></svg>
                            <p>Continuar con Google</p>
                        </div>
                    </Button>
                </div>
            </div>
        </div >
    )
}