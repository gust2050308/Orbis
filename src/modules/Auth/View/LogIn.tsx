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

export default function LogIn() {

    const logInForm = useForm<LogInFormType>({
        resolver: zodResolver(LogInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    return (
        <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md'>
            <div className='flex flex-col items-center'>
                <form id='logInForm' onSubmit={logInForm.handleSubmit(useLogin().Login)}>
                    <FieldGroup>
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
                                        placeholder="Email"
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
                                        placeholder="Contraseña"
                                        aria-invalid={fieldState.invalid}
                                        autoComplete="off"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </div>
        </div>
    )
}
