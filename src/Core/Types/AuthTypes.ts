import type { User, Session } from '@supabase/supabase-js'

export type AuthContextType = {
    // Estado de autenticación
    user: User | null
    session: Session | null
    loading: boolean

    // Métodos de autenticación
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>

    // Helpers derivados
    isAuthenticated: boolean
    isLoading: boolean
}
