'use client';

import { useEffect, useState, useContext } from 'react';
import { MapPin, Trash2, Globe, Calendar, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { destinationService } from '../Services/destinationService';
import { Destination } from '../types/TypesDestinations';
import { Badge } from '@/components/ui/badge';
import { destinationImagesService } from '../Services/destinationImagesService';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { DestinationContext } from '../DestinationContext';

type DestinationListProps = {
    refreshTrigger?: number;
};

const ITEMS_PER_PAGE = 8; // Cambiado a 8

export function DestinationList({ refreshTrigger }: DestinationListProps) {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const { setOpen, refreshKey, setIdDestination } = useContext(DestinationContext);

    const loadDestinations = async () => {
        setLoading(true);
        try {
            const response = await destinationService.getPaginated({
                page,
                limit: ITEMS_PER_PAGE,
                search,
            });

            setDestinations(response.data);
            setTotalPages(response.totalPages);
            setTotalItems(response.totalItems);

        } catch (error) {
            toast.error("No se pudieron cargar los destinos");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDestinations();
    }, [page, refreshTrigger, refreshKey]);

    const handleToggleActive = async (id: number, currentStatus: boolean) => {
        try {
            await destinationService.toggleActive(id, !currentStatus);
            setDestinations((prev) =>
                prev.map((dest) =>
                    dest.id === id ? { ...dest, is_active: !currentStatus } : dest
                )
            );
            toast.success(`El destino ahora está ${!currentStatus ? 'activo' : 'inactivo'}`);
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            toast.error('No se pudo actualizar el estado');
        }
    };

    const handleDelete = async (id: number, name: string) => {
        try {
            await destinationImagesService.deleteAllImagesFromDestination(id);
            await destinationService.delete(id);
            setDestinations((prev) => prev.filter((dest) => dest.id !== id));
            toast.success(`${name} y sus imágenes han sido eliminados correctamente`);

            // Recargar si la página actual queda vacía
            if (destinations.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                loadDestinations();
            }
        } catch (error) {
            console.error('Error al eliminar destino:', error);
            toast.error('No se pudo eliminar el destino');
        }
    };

    const handleSearch = async () => {
        setPage(1); // Resetear a la primera página al buscar
        loadDestinations();
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Generar números de página a mostrar
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Mostrar todas las páginas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Mostrar con elipsis
            if (page <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('ellipsis');
                pages.push(totalPages);
            } else if (page >= totalPages - 2) {
                pages.push(1);
                pages.push('ellipsis');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('ellipsis');
                pages.push(page - 1);
                pages.push(page);
                pages.push(page + 1);
                pages.push('ellipsis');
                pages.push(totalPages);
            }
        }

        return pages;
    };
    /*
        if (loading) {
            return (
                <div className="flex justify-center items-center py-12">
                    <div className="text-[#102542]/60">Cargando destinos...</div>
                </div>
            );
        }
    
        if (destinations.length === 0 && !search) {
            return (
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Input
                            placeholder="Buscar destino..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            className="flex-1"
                        />
                        <Button
                            className="bg-[#256EFF] hover:bg-[#256EFF]/90"
                            onClick={handleSearch}
                        >
                            Buscar
                        </Button>
                        <Button
                            className="flex items-center gap-2 bg-[#102542] hover:bg-[#102542]/90"
                            onClick={() => setOpen(true)}
                        >
                            <Plus className="w-4 h-4" />
                            Crear destino
                        </Button>
                    </div>
                    <div className="text-center py-12 bg-[#F7F5FB] rounded-lg border border-[#256EFF]/10">
                        <MapPin className="w-12 h-12 mx-auto text-[#256EFF]/40 mb-3" />
                        <p className="text-[#102542]/60">No hay destinos registrados aún</p>
                    </div>
                </div>
            );
        }*/

    return (
        <div className="space-y-6">
            {/* Barra de búsqueda y acciones */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    placeholder="Buscar destino..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1"
                />
                <Button
                    className="bg-[#256EFF] hover:bg-[#256EFF]/90"
                    onClick={handleSearch}
                >
                    Buscar
                </Button>
                <Button
                    className="flex items-center gap-2 bg-[#102542] hover:bg-[#102542]/90"
                    onClick={() => setOpen(true)}
                >
                    <Plus className="w-4 h-4" />
                    Crear destino
                </Button>
            </div>

            {/* Información de resultados */}
            <div className='w-full flex flex-row justify-between'>
                <div>
                    {totalItems > 0 && (
                        <div className="text-sm text-[#102542]/60">
                            Mostrando {((page - 1) * ITEMS_PER_PAGE) + 1} - {Math.min(page * ITEMS_PER_PAGE, totalItems)} de {totalItems} destinos
                            {totalPages > 1 && ` • Página ${page} de ${totalPages}`}
                        </div>
                    )}

                </div>
                <div>
                    {totalPages > 1 && (
                        <div className="flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => page > 1 && handlePageChange(page - 1)}
                                            className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>

                                    {getPageNumbers().map((pageNum, idx) => (
                                        <PaginationItem key={idx}>
                                            {pageNum === 'ellipsis' ? (
                                                <PaginationEllipsis />
                                            ) : (
                                                <PaginationLink
                                                    onClick={() => handlePageChange(pageNum as number)}
                                                    isActive={pageNum === page}
                                                    className="cursor-pointer"
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            )}
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => page < totalPages && handlePageChange(page + 1)}
                                            className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            </div>
            {
                loading ? (
                    <div className="flex flex-col gap-4 items-center py-12">
                        <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24"><path className='text-sky-700' fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity={0.5}></path><path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate"></animateTransform></path></svg>
                        <div className="text-[#102542]/60">Cargando destinos...</div>
                    </div>
                ) :
                    destinations.length === 0 ? (
                        <div className="text-center py-12 bg-[#F7F5FB] rounded-lg border border-[#256EFF]/10">
                            <MapPin className="w-12 h-12 mx-auto text-[#256EFF]/40 mb-3" />
                            <p className="text-[#102542]/60">No se encontraron destinos con ese criterio</p>
                            <Button

                                onClick={() => {
                                    setSearch('');
                                    setPage(1);
                                    loadDestinations();
                                    console.log('Limpiando búsqueda :   ' + search);
                                }}
                                className="mt-4"
                            >
                                Limpiar búsqueda
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {destinations.map((destination) => (
                                <Card
                                    key={destination.id}
                                    className="border-[#256EFF]/20 hover:shadow-xl transition-shadow"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between truncate">
                                            <div className="flex-1 min-w-0 truncate">
                                                <CardTitle className="text-[#102542] text-lg truncate">
                                                    {destination.name}
                                                </CardTitle>
                                                {destination.country && (
                                                    <CardDescription className="flex items-center gap-1 mt-1">
                                                        <Globe className="w-3 h-3 flex-shrink-0" />
                                                        <span className="truncate">{destination.country}</span>
                                                    </CardDescription>
                                                )}
                                            </div>
                                            <Badge
                                                variant={destination.is_active ? 'default' : 'secondary'}
                                                className={
                                                    destination.is_active
                                                        ? 'bg-[#07BEB8] hover:bg-[#07BEB8]/90 flex-shrink-0'
                                                        : 'flex-shrink-0'
                                                }
                                            >
                                                {destination.is_active ? 'Activo' : 'Inactivo'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {destination.short_description && (
                                            <p className="text-sm text-[#102542]/70 line-clamp-2">
                                                {destination.short_description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 text-xs text-[#102542]/60">
                                            <MapPin className="w-3 h-3 flex-shrink-0" />
                                            <span className="truncate">
                                                {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-[#102542]/60">
                                            <Calendar className="w-3 h-3 flex-shrink-0" />
                                            <span>
                                                {new Date(destination.created_at).toLocaleDateString('es-MX')}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-[#256EFF]/10">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-[#102542]/60">Estado:</span>
                                                <Switch
                                                    checked={destination.is_active}
                                                    onCheckedChange={() =>
                                                        handleToggleActive(destination.id, destination.is_active)
                                                    }
                                                    className="data-[state=checked]:bg-[#07BEB8]"
                                                />
                                            </div>
                                            <div className='flex flex-row items-center gap-1'>
                                                <Button variant="ghost" className="rounded-sm group" onClick={()=>{
                                                    setIdDestination(destination.id);
                                                    setOpen(true);
                                                }}>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="text-gray-500 transition-transform duration-200 group-hover:scale-125"
                                                        width={18}
                                                        height={18}
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="m16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125"
                                                        />
                                                    </svg>
                                                </Button>

                                                <div>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4 transition-transform duration-200 group-hover:scale-125" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>¿Eliminar destino?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    ¿Estás seguro de que deseas eliminar "{destination.name}"?
                                                                    Esta acción no se puede deshacer.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDelete(destination.id, destination.name)}
                                                                    className="bg-red-600 hover:bg-red-700"
                                                                >
                                                                    Eliminar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>


                                                </div>

                                            </div>

                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
        </div>
    );
}