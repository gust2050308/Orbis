'use client'

import { createContext, useState, useEffect, type FC, type ReactNode } from 'react'
import { createClient } from '@/lib/Supabase/supabaseClient'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { AuthContextType, UserProfile } from '../Types/AuthTypes'
import type { User, Session } from '@supabase/supabase-js'

// Crear el contexto con valores por defecto
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const router = useRouter()
    const supabase = createClient()

    // Inicializar y suscribirse a cambios de autenticación
    useEffect(() => {
        // Obtener sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Suscribirse a cambios de autenticación
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [supabase.auth])

    // Obtener perfil de usuario cuando el usuario cambia
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!user) {
                setUserProfile(null)
                return
            }

            try {
                const { data, error } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (error) {
                    console.error('Error fetching user profile:', error)
                    setUserProfile(null)
                } else {
                    setUserProfile(data as UserProfile)
                }
            } catch (error) {
                console.error('Error fetching user profile:', error)
                setUserProfile(null)
            }
        }

        fetchUserProfile()
    }, [user, supabase])


    // Método: Login con email/password
    const signIn = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) throw error

            toast.success('Inicio de sesión exitoso')
            router.push('/Views/dashboard')
        } catch (error: any) {
            console.error('Error en signIn:', error)
            toast.error(error.message || 'Error al iniciar sesión')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Método: Registro con email/password
    const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: metadata,
                    emailRedirectTo: `${window.location.origin}/auth/confirm`,
                },
            })

            if (error) throw error

            toast.success('¡Cuenta creada! Revisa tu correo para confirmar.')
            router.push('/Views/dashboard')
        } catch (error: any) {
            console.error('Error en signUp:', error)
            toast.error(error.message || 'Error al crear cuenta')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Método: Login con Google OAuth
    const signInWithGoogle = async () => {
        setIsLoading(true)
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/confirm`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                },
            })

            if (error) throw error

            // Redirigir al URL de OAuth
            if (data?.url) {
                window.location.href = data.url
            }
        } catch (error: any) {
            console.error('Error en signInWithGoogle:', error)
            toast.error(error.message || 'Error al iniciar con Google')
            setIsLoading(false)
            throw error
        }
        // No ponemos finally aquí porque redirigimos a otra página
    }

    // Método: Cerrar sesión
    const signOut = async () => {
        setIsLoading(true)
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            toast.success('Sesión cerrada exitosamente')
            router.push('/')
        } catch (error: any) {
            console.error('Error en signOut:', error)
            toast.error(error.message || 'Error al cerrar sesión')
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    // Valor del contexto
    const value: AuthContextType = {
        user,
        session,
        loading,
        userProfile,
        userRole: userProfile?.role ?? null,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        isAuthenticated: !!user,
        isLoading,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
