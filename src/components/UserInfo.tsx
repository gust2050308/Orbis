'use client'

import { useAuth } from '@/Core/CustomHooks/useAuth'

export function UserInfo() {
    const { user, loading, isAuthenticated } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-2 py-2 animate-pulse">
                <div className="h-8 w-8 rounded-full bg-gray-300"></div>
                <div className="flex flex-col gap-1">
                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                    <div className="h-2 w-28 bg-gray-300 rounded"></div>
                </div>
            </div>
        )
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="flex items-center gap-2 px-2 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white text-xs font-semibold">
                    ?
                </div>
                <div className="flex flex-col gap-0.5 text-xs">
                    <span className="font-medium text-[#102542]">Invitado</span>
                    <span className="text-[#102542]/60">No autenticado</span>
                </div>
            </div>
        )
    }

    // Obtener iniciales del nombre
    const fullName = user.user_metadata?.full_name || user.email || 'Usuario'
    const initials = fullName
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="flex items-center gap-2 px-2 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#07BEB8] text-white text-xs font-semibold">
                {initials}
            </div>
            <div className="flex flex-col gap-0.5 text-xs">
                <span className="font-medium text-[#102542] truncate max-w-[120px]">
                    {user.user_metadata?.full_name || 'Usuario'}
                </span>
                <span className="text-[#102542]/60 truncate max-w-[120px]">
                    {user.email}
                </span>
            </div>
        </div>
    )
}
