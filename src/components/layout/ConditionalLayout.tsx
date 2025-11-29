'use client'

import { usePathname } from 'next/navigation'
import { DashboardLayout } from './DashboardLayout'

interface ConditionalLayoutProps {
    children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
    const pathname = usePathname()

    // Rutas que NO deben tener el sidebar/dashboard layout
    const publicRoutes = ['/', '/Views/auth', '/Views/landing', '/login', '/error', '/Views/reset-password']
    const publicPrefixes = ['/auth', '/auth/confirm', '/Views/reset-password'] // Para callbacks como /auth/confirm

    const isPublicRoute =
        publicRoutes.includes(pathname || '') ||
        publicPrefixes.some(prefix => pathname?.startsWith(prefix))

    // Si es una ruta pública, renderizar solo el contenido
    if (isPublicRoute) {
        return <>{children}</>
    }

    // Si es una ruta privada (dashboard), usar el DashboardLayout
    return <DashboardLayout>{children}</DashboardLayout>
}
