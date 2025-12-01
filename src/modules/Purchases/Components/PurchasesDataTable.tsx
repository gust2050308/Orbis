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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, DollarSign, RefreshCw, Ban, Undo2, Clock, Trash2 } from 'lucide-react';
import type { PurchaseTableRow, PurchaseStatus } from '../types';

const statusColors: Record<PurchaseStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    reserved: 'bg-blue-100 text-blue-800 border-blue-300',
    paid: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    refunded: 'bg-purple-100 text-purple-800 border-purple-300',
    expired: 'bg-red-100 text-red-800 border-red-300',
    refund_required: 'bg-orange-100 text-orange-800 border-orange-300',
};

const statusLabels: Record<PurchaseStatus, string> = {
    pending: 'Pendiente',
    reserved: 'Reservado',
    paid: 'Pagado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
    expired: 'Expirado',
    refund_required: 'Requiere Reembolso',
};

interface PurchasesDataTableProps {
    data: PurchaseTableRow[];
    onViewDetails: (purchaseId: number) => void;
    onViewPayments: (purchaseId: number) => void;
    onChangeStatus: (purchaseId: number) => void;
    onManualPayment: (purchaseId: number) => void;
    onCancel: (purchaseId: number) => void;
    onRefund: (purchaseId: number) => void;
    onExtendExpiration: (purchaseId: number) => void;
    onDelete: (purchaseId: number) => void;
}

export function PurchasesDataTable({
    data,
    onViewDetails,
    onViewPayments,
    onChangeStatus,
    onManualPayment,
    onCancel,
    onRefund,
    onExtendExpiration,
    onDelete,
}: PurchasesDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const columns: ColumnDef<PurchaseTableRow>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => <span className="font-mono text-xs">#{row.original.id}</span>,
        },
        {
            accessorKey: 'userName',
            header: 'Usuario',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium text-[#102542]">
                        {row.original.userName}
                    </div>
                    <div className="text-xs text-[#102542]/60">
                        {row.original.userEmail}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'excursionTitle',
            header: 'Excursión',
            cell: ({ row }) => (
                <div className="max-w-[200px]">
                    <div className="font-medium text-[#102542] truncate">
                        {row.original.excursionTitle}
                    </div>
                    <div className="text-xs text-[#102542]/60">
                        {row.original.numberOfPeople} {row.original.numberOfPeople === 1 ? 'persona' : 'personas'}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'totalAmount',
            header: 'Total',
            cell: ({ row }) => (
                <div className="text-sm font-semibold">
                    ${row.original.totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
            ),
        },
        {
            accessorKey: 'amountPaid',
            header: 'Pagado',
            cell: ({ row }) => (
                <div className="text-sm text-green-600">
                    ${row.original.amountPaid.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
            ),
        },
        {
            accessorKey: 'remainingAmount',
            header: 'Restante',
            cell: ({ row }) => (
                <div className="text-sm text-orange-600">
                    ${row.original.remainingAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
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
            accessorKey: 'expiresAt',
            header: 'Expira',
            cell: ({ row }) => {
                const expiresAt = row.original.expiresAt;
                if (!expiresAt) return <span className="text-xs text-gray-400">N/A</span>;

                const date = new Date(expiresAt);
                const now = new Date();
                const isExpired = now > date;

                return (
                    <div className={`text-xs ${isExpired ? 'text-red-600' : 'text-[#102542]/60'}`}>
                        {date.toLocaleDateString('es-MX', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}
                    </div>
                );
            },
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const purchase = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onViewDetails(purchase.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onViewPayments(purchase.id)}>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Ver pagos
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onChangeStatus(purchase.id)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Cambiar estado
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onManualPayment(purchase.id)}>
                                <DollarSign className="mr-2 h-4 w-4" />
                                Registrar pago manual
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onCancel(purchase.id)}>
                                <Ban className="mr-2 h-4 w-4" />
                                Cancelar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRefund(purchase.id)}>
                                <Undo2 className="mr-2 h-4 w-4" />
                                Reembolsar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onExtendExpiration(purchase.id)}>
                                <Clock className="mr-2 h-4 w-4" />
                                Extender expiración
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(purchase.id)}
                                className="text-red-600"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                pageSize: 20,
            },
        },
    });

    return (
        <div className="space-y-4">
            {/* Search/Filter */}
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Buscar por usuario o excursión..."
                    value={(table.getColumn('userName')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('userName')?.setFilterValue(event.target.value)
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
                                    No hay compras.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-[#102542]/60">
                    {table.getFilteredRowModel().rows.length} compra(s)
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
