'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, CreditCard, Users, Calendar } from 'lucide-react';
import type { ReservationTableRow } from '../types';

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    paid: 'bg-green-100 text-green-800 border-green-300',
    partially_paid: 'bg-blue-100 text-blue-800 border-blue-300',
    expired: 'bg-red-100 text-red-800 border-red-300',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
};

const statusLabels = {
    pending: 'Pendiente',
    paid: 'Pagado',
    partially_paid: 'Pago Parcial',
    expired: 'Expirado',
    cancelled: 'Cancelado',
};

interface ReservationsDataTableProps {
    data: ReservationTableRow[];
    onCompletePayment: (reservationId: number) => void;
}

export function ReservationsDataTable({ data, onCompletePayment }: ReservationsDataTableProps) {
    const router = useRouter();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const columns: ColumnDef<ReservationTableRow>[] = [
        {
            accessorKey: 'excursionTitle',
            header: 'Excursión',
            cell: ({ row }) => {
                const image = row.original.image;
                return (
                    <div className="flex items-center gap-3">
                        {image && (
                            <img
                                src={image}
                                alt={row.original.excursionTitle}
                                className="w-12 h-12 rounded object-cover"
                            />
                        )}
                        <div>
                            <div className="font-medium text-[#102542]">
                                {row.original.excursionTitle}
                            </div>
                            <div className="text-xs text-[#102542]/60">
                                ID: {row.original.id}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: 'startDate',
            header: 'Fecha',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#256EFF]" />
                    <div className="text-sm">
                        <div className="font-medium">
                            {new Date(row.original.startDate).toLocaleDateString('es-MX', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </div>
                        <div className="text-xs text-[#102542]/60">
                            Hasta {new Date(row.original.endDate).toLocaleDateString('es-MX', {
                                day: '2-digit',
                                month: 'short',
                            })}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'numberOfPeople',
            header: 'Personas',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#07BEB8]" />
                    <span className="font-medium">{row.original.numberOfPeople}</span>
                </div>
            ),
        },
        {
            accessorKey: 'totalAmount',
            header: 'Total',
            cell: ({ row }) => (
                <div className="text-sm">
                    <div className="font-semibold text-[#102542]">
                        ${row.original.totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </div>
                    <div className="text-xs text-green-600">
                        Pagado: ${row.original.amountPaid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'status',
            header: 'Estado',
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge
                        variant="outline"
                        className={`${statusColors[status]} font-medium`}
                    >
                        {statusLabels[status]}
                    </Badge>
                );
            },
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const reservation = row.original;
                const canCompletePayment =
                    reservation.status === 'pending' ||
                    reservation.status === 'partially_paid';
                const isExpired = reservation.status === 'expired';
                const now = new Date();
                const expiresAt = new Date(reservation.expiresAt);
                const isActuallyExpired = now > expiresAt;

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => router.push(`/Views/Excursions/${reservation.excursionId}`)}
                            className="flex items-center gap-1"
                        >
                            <Eye className="w-4 h-4" />
                            Ver
                        </Button>
                        {canCompletePayment && !isActuallyExpired && (
                            <Button
                                size="sm"
                                onClick={() => onCompletePayment(reservation.id)}
                                className="flex items-center gap-1 bg-gradient-to-r from-[#256EFF] to-[#07BEB8] text-white hover:opacity-90"
                            >
                                <CreditCard className="w-4 h-4" />
                                Completar Pago
                            </Button>
                        )}
                        {isExpired && (
                            <span className="text-xs text-red-600">Expirado</span>
                        )}
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        state: {
            sorting,
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
    });

    return (
        <div className="space-y-4">
            {/* Search/Filter */}
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Buscar excursión..."
                    value={(table.getColumn('excursionTitle')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('excursionTitle')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>

            {/* Table */}
            <div className="rounded-lg border border-[#102542]/10">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No tienes reservaciones.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-[#102542]/60">
                    {table.getFilteredRowModel().rows.length} reservación(es)
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <span className="text-sm text-[#102542]/60">
                        Página {table.getState().pagination.pageIndex + 1} de{' '}
                        {table.getPageCount()}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    );
}
