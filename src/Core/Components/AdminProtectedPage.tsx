'use client'

import { useEffect, type ReactNode } from 'react'
import { useAuth } from '@/Core/CustomHooks/useAuth'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface AdminProtectedPageProps {
    children: ReactNode
}

export function AdminProtectedPage({ children }: AdminProtectedPageProps) {
    const { userRole, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Only redirect once auth is loaded
        if (loading) return

        if (userRole === 'customer') {
            router.replace('/Views/Excursions')
        } else if (userRole === 'guest' || !userRole) {
            router.replace('/Views/auth')
        }
    }, [userRole, loading, router])

    // Show loading state while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 mx-auto text-[#256EFF] animate-spin mb-4" />
                    <p className="text-[#102542]/60">Verificando permisos...</p>
                </div>
            </div>
        )
    }

    // Show access denied for non-admin users
    if (userRole !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[#102542] text-lg">Acceso denegado. Redirigiendo...</p>
                </div>
            </div>
        )
    }

    // Render children for admin users
    return <>{children}</>
}
