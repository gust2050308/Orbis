'use client'

import { useState } from 'react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, ShoppingBag } from 'lucide-react';
import type { UserTableRow } from '../types';

interface UsersDataTableProps {
    data: UserTableRow[];
    onEditUser: (userId: string) => void;
    onViewPurchases: (userId: string) => void;
}

export function UsersDataTable({
    data,
    onEditUser,
    onViewPurchases,
}: UsersDataTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const columns: ColumnDef<UserTableRow>[] = [
        {
            accessorKey: 'profileImage',
            header: '',
            cell: ({ row }) => {
                const initials = row.original.fullName
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                return (
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={row.original.profileImage || undefined} />
                        <AvatarFallback className="bg-[#256EFF] text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                );
            },
        },
        {
            accessorKey: 'fullName',
            header: 'Nombre',
            cell: ({ row }) => (
                <div>
                    <div className="font-medium text-[#102542]">
                        {row.original.fullName}
                    </div>
                    <div className="text-xs text-[#102542]/60">
                        {row.original.email}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'phone',
            header: 'Teléfono',
            cell: ({ row }) => (
                <span className="text-sm">{row.original.phone || 'N/A'}</span>
            ),
        },
        {
            accessorKey: 'role',
            header: 'Rol',
            cell: ({ row }) => (
                <Badge
                    variant="outline"
                    className={row.original.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 border-purple-300'
                        : 'bg-blue-100 text-blue-800 border-blue-300'
                    }
                >
                    {row.original.role === 'admin' ? 'Admin' : 'Cliente'}
                </Badge>
            ),
        },
        {
            accessorKey: 'country',
            header: 'Ubicación',
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.original.city && row.original.country ? (
                        <span>{row.original.city}, {row.original.country}</span>
                    ) : row.original.country ? (
                        <span>{row.original.country}</span>
                    ) : (
                        <span className="text-gray-400">N/A</span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'Registro',
            cell: ({ row }) => (
                <span className="text-xs text-[#102542]/60">
                    {new Date(row.original.createdAt).toLocaleDateString('es-MX', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}
                </span>
            ),
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditUser(row.original.id)}
                        title="Editar usuario"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewPurchases(row.original.id)}
                        title="Ver compras"
                    >
                        <ShoppingBag className="h-4 w-4" />
                    </Button>
                </div>
            ),
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
            {/* Search */}
            <Input
                placeholder="Buscar por nombre o email..."
                value={(table.getColumn('fullName')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                    table.getColumn('fullName')?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
            />

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
                                <TableRow key={row.id}>
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
                                    No hay usuarios.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between">
                <div className="text-sm text-[#102542]/60">
                    {table.getFilteredRowModel().rows.length} usuario(s)
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
