import type { User, Session } from '@supabase/supabase-js'

export type UserProfile = {
    id: string;
    name: string;
    last_name: string;
    phone: string;
    role: 'customer' | 'admin' | 'employee';
    profile_image: string | null;
    country: string;
    city: string;
    address: string;
    created_at: string;
    updated_at: string;
}

export type AuthContextType = {
    // Estado de autenticación
    user: User | null
    session: Session | null
    loading: boolean
    userProfile: UserProfile | null
    userRole: 'customer' | 'admin' | 'employee' | null

    // Métodos de autenticación
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string, metadata?: { full_name?: string }) => Promise<void>
    signInWithGoogle: () => Promise<void>
    signOut: () => Promise<void>

    // Helpers derivados
    isAuthenticated: boolean
    isLoading: boolean
}
