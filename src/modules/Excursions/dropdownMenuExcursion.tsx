import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react'
import type { Excursion } from './shared/dtoExcursion'

interface DropdownMenuExcursionProps {
    excursion: Excursion
    onView?: (excursion: Excursion) => void
    onEdit?: (excursion: Excursion) => void
    onDelete?: (id: number) => void
}

export default function DropdownMenuExcursion({
    excursion,
    onView,
    onEdit,
    onDelete
}: DropdownMenuExcursionProps) {
    const [loading, setLoading] = useState(false)

    const handleDelete = async () => {
        if (window.confirm(`¿Estás seguro de que deseas eliminar "${excursion.title}"?`)) {
            setLoading(true)
            try {
                if (onDelete) {
                    await onDelete(excursion.id)
                }
            } catch (error) {
                console.error('Error al eliminar:', error)
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={loading}
                    className='hover:text-black text-white'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 256 256"><path fill="currentColor" d="M144 128a16 16 0 1 1-16-16a16 16 0 0 1 16 16m-84-16a16 16 0 1 0 16 16a16 16 0 0 0-16-16m136 0a16 16 0 1 0 16 16a16 16 0 0 0-16-16"></path></svg>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => onView?.(excursion)}
                        className="cursor-pointer"
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Ver Detalles</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => onEdit?.(excursion)}
                        className="cursor-pointer"
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                        disabled={loading}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>{loading ? 'Eliminando...' : 'Eliminar'}</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
