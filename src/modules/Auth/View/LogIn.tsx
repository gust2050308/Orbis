'use client'
import React from 'react'
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


export default function LogIn() {

    const logInForm = useForm<LogInFormType>({
        resolver: zodResolver(LogInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <div className='w-full p-5 rounded-lg'>
            <div className='w-full flex flex-col'>
                <form id='logInForm' onSubmit={logInForm.handleSubmit(useLogin().Login)}>
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
                                    <Input
                                        {...field}
                                        id="form-rhf-demo-password"
                                        type="password"
                                        placeholder="Ej. 21sd12cDd"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Field>
                            <Button type="submit" form="form-rhf-demo">
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
                    <Button variant="outline" className='w-full mt-4'>
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
