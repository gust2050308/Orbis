'use client'
import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Destinations } from './shared/dtoDestinations'

interface ExcursionDestinationRow extends Destinations {
  excursion_destination_id?: number
  order_index?: number
}

export const columns: ColumnDef<ExcursionDestinationRow>[] = [
  {
    id: "order",
    header: "Orden",
    cell: ({ row }) => (
      <div className="font-semibold text-center w-12">
        {(row.original.order_index || 0) + 1}
      </div>
    ),
    size: 60,
  },
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="font-semibold">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "country",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          País
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("country") || "—"}</div>,
  },
  {
    accessorKey: "short_description",
    header: "Descripción Corta",
    cell: ({ row }) => (
      <div className="text-sm text-gray-600 line-clamp-2 max-w-xs">
        {row.getValue("short_description") || "—"}
      </div>
    ),
  },
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      const isActive = row.getValue("is_active")
      return (
        <span className={`px-2 py-1 rounded text-xs font-medium ${isActive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
          }`}>
          {isActive ? "Activo" : "Inactivo"}
        </span>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const destination = row.original
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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(destination.name)}
            >
              Copiar nombre
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

interface DatatableExcursionDestinationsUpdateProps {
  excursionId: number
  destinations?: ExcursionDestinationRow[]
  loading?: boolean
  onUpdate?: () => void
}

interface DatatableExcursionDestinationsUpdateHandle {
  getChanges: () => { destinationOrders: Array<{ destinationId: number; orderIndex: number }>; deletedDestinations: number[] }
  resetChanges: () => void
}

const DatatableExcursionDestinationsUpdate = React.forwardRef<DatatableExcursionDestinationsUpdateHandle, DatatableExcursionDestinationsUpdateProps>(
  ({
    destinations = [],
    loading = false,
  }, ref) => {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [localDestinations, setLocalDestinations] = React.useState(destinations)
    const [hasChanges, setHasChanges] = React.useState(false)

    React.useEffect(() => {
      setLocalDestinations(destinations)
      setHasChanges(false)
    }, [destinations])

    const table = useReactTable({
      data: localDestinations,
      columns,
      onSortingChange: setSorting,
      onColumnFiltersChange: setColumnFilters,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      onColumnVisibilityChange: setColumnVisibility,
      onRowSelectionChange: setRowSelection,
      state: {
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
      },
    })

    // Mover fila hacia arriba
    const moveRowUp = (index: number) => {
      if (index === 0) return
      const newDestinations: ExcursionDestinationRow[] = [...localDestinations]
      const temp = newDestinations[index - 1]
      newDestinations[index - 1] = newDestinations[index]
      newDestinations[index] = temp

      newDestinations.forEach((dest, idx) => {
        dest.order_index = idx
      })

      setLocalDestinations(newDestinations)
      setHasChanges(true)
    }

    // Mover fila hacia abajo
    const moveRowDown = (index: number) => {
      if (index === localDestinations.length - 1) return
      const newDestinations: ExcursionDestinationRow[] = [...localDestinations]
      const temp = newDestinations[index]
      newDestinations[index] = newDestinations[index + 1]
      newDestinations[index + 1] = temp

      newDestinations.forEach((dest, idx) => {
        dest.order_index = idx
      })

      setLocalDestinations(newDestinations)
      setHasChanges(true)
    }

    // Eliminar destino solo del local state (no guardar aún)
    const handleDeleteDestination = (destinationId: number) => {
      if (!window.confirm('¿Estás seguro de que deseas eliminar este destino?')) {
        return
      }

      const updatedDestinations = localDestinations
        .filter((dest) => dest.id !== destinationId)
        .map((dest, index) => ({
          ...dest,
          order_index: index,
        }))

      setLocalDestinations(updatedDestinations)
      setHasChanges(true)
    }

    // Función para obtener los cambios (será llamada desde el modal)
    React.useImperativeHandle(ref, () => ({
      getChanges: () => ({
        destinationOrders: localDestinations.map((dest) => ({
          destinationId: dest.id,
          orderIndex: dest.order_index || 0,
        })),
        deletedDestinations: destinations
          .filter(d => !localDestinations.some(ld => ld.id === d.id))
          .map(d => d.id),
        hasChanges
      }),
      resetChanges: () => {
        setLocalDestinations(destinations)
        setHasChanges(false)
      }
    }))

    if (loading) {
      return <div className="text-center py-8 text-muted-foreground">Cargando destinos...</div>
    }

    return (
      <div className="w-full space-y-4">
        {/* Filtro */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar por nombre o país..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columnas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mensajes */}
        {hasChanges && (
          <div className="p-3 bg-amber-100 text-amber-700 rounded text-sm border border-amber-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Tienes cambios sin guardar - serán guardados al hacer clic en Guardar Cambios del modal
          </div>
        )}

        {/* Tabla */}
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50 transition"
                  >
                    {row.getVisibleCells().map((cell) => {
                      // Agregar botones de movimiento en la columna de orden
                      if (cell.column.id === "order") {
                        return (
                          <TableCell key={cell.id}>
                            <div className="flex flex-col gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveRowUp(index);
                                }}
                                disabled={index === 0}
                                className="h-6 text-xs"
                              >
                                ↑
                              </Button>
                              <span className="text-center font-semibold">
                                {(row.original.order_index || 0) + 1}
                              </span>
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveRowDown(index);
                                }}
                                disabled={index === localDestinations.length - 1}
                                className="h-6 text-xs"
                              >
                                ↓
                              </Button>
                            </div>
                          </TableCell>
                        )
                      }

                      // Agregar botón eliminar en la columna de acciones
                      if (cell.column.id === "actions") {
                        return (
                          <TableCell key={cell.id}>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteDestination(row.original.id)}
                              className="h-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )
                      }

                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No hay destinos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s)
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
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
    )
  }
)

DatatableExcursionDestinationsUpdate.displayName = 'DatatableExcursionDestinationsUpdate'

export default DatatableExcursionDestinationsUpdate

