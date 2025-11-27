'use client'

import { useAuth } from '@/Core/CustomHooks/useAuth'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
    const { signOut, isLoading } = useAuth()

    return (
        <Button
            onClick={() => signOut()}
            disabled={isLoading}
            variant="outline"
            className="w-full justify-start"
        >
            <LogOut className="mr-2 h-4 w-4" />
            {isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </Button>
    )
}
