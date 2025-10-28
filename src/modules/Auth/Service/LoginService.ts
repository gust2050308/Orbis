import { useContext } from "react";
import { UserContext } from "@/Core/Context/UserContext";
import { SignUpFormType } from "../Types/FormTypes";

import { createClient } from '@/lib/Supabase/supabaseClient'
import { LogInFormType } from '../Types/FormTypes'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner' // o tu librería de notificaciones

export function useLogin() {
  const router = useRouter()
  const supabase = createClient()

  const Login = async (data: LogInFormType) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('¡Inicio de sesión exitoso!')
      router.push('/dashboard') // Redirige a donde necesites
      router.refresh()
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      toast.error('Error inesperado al iniciar sesión')
    }
  }

  const LoginWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error)
      toast.error('Error al iniciar sesión con Google')
    }
  }

  return { Login, LoginWithGoogle }
}

export function useSignUp() {
  const router = useRouter()
  const supabase = createClient()

  const SignUp = async (data: SignUpFormType) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name, // Metadata adicional
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('¡Cuenta creada! Revisa tu email para confirmar.')
      // Supabase envía un email de confirmación automáticamente
    } catch (error) {
      console.error('Error al crear cuenta:', error)
      toast.error('Error inesperado al crear cuenta')
    }
  }

  const SignUpWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      console.error('Error al registrarse con Google:', error)
      toast.error('Error al registrarse con Google')
    }
  }

  return { SignUp, SignUpWithGoogle }
}