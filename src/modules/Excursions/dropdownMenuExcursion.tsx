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
                >
                    <MoreHorizontal className="text-white h-4 w-4" />
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
