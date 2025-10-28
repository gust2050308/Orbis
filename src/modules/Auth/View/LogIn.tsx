'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { LogInFormType } from "../Types/FormTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { LogInSchema } from '../Types/FormTypes';
import { useLogin } from '../Service/LoginService';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from 'lucide-react';
import { signInWithGoogle,login } from '../Service/auth-actions';

export default function LogIn() {
    const [showPassword, setShowPassword] = useState(false);

    const logInForm = useForm<LogInFormType>({
        resolver: zodResolver(LogInSchema),
        mode: "onChange", // Valida mientras escribes
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <div className='w-full p-5 rounded-lg'>
            {/* Logo o imagen de encabezado */}
            <div className='w-full flex justify-center mb-6'>
                <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="m9.474 16l9.181 3.284a1.1 1.1 0 0 0 1.462-.887L21.99 4.239c.114-.862-.779-1.505-1.567-1.13L2.624 11.605c-.88.42-.814 1.69.106 2.017l2.44.868l1.33.467M13 17.26l-1.99 3.326c-.65.808-1.959.351-1.959-.683V17.24a2 2 0 0 1 .53-1.356l3.871-4.2"></path></svg>
            </div>
            
            <div className='w-full flex flex-col'>
                <form id='logInForm' onSubmit={logInForm.handleSubmit(async (data) => {
                        const formData = new FormData();
                        formData.append('email', data.email);
                        formData.append('password', data.password);
                        await login(formData);
                    },
                    (errors) => console.log('Errores de validación:', errors)
                )}>
                    <FieldGroup className='gap-5'>
                        <Controller
                            control={logInForm.control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-title">
                                        Email
                                    </FieldLabel>
                                    <Input {...field}
                                        id="form-rhf-demo-title"
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
                            control={logInForm.control}
                            name="password"
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-rhf-demo-password">
                                        Contraseña
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            id="form-rhf-demo-password"
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
                        <Field>
                            <Button type="submit" form="logInForm" className='cursor-pointer'>
                                <p>Iniciar sesión</p>
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
                    <Button variant="outline" className='w-full mt-4 cursor-pointer' onClick={() => {signInWithGoogle()}} >
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