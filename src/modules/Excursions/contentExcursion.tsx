'use client'
import React, { useState, useEffect } from 'react'
import CardExcursions from '@/modules/Excursions/cardExcursions'
import ModalExcursionCreate from '@/modules/Excursions/modalExcursionCreate'
import { getFilteredExcursions, type ExcursionFilters, type PaginationParams } from '@/modules/Excursions/shared/service'
import { getAllDestinations } from '@/modules/Excursions/shared/serviceDestinations'
import { Excursion } from './shared/dtoExcursion'
import { Input } from '@/components/ui/input'
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useAuth } from '@/Core/CustomHooks/useAuth'

export default function ContentExcursion() {
  const [excursions, setExcursions] = useState<Excursion[]>([])
  const [loading, setLoading] = useState(true)
  const [destinations, setDestinations] = useState<any[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const { userRole } = useAuth()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 9

  // Filter states
  const [filters, setFilters] = useState<ExcursionFilters>({
    search: '',
    minPrice: undefined,
    maxPrice: undefined,
    hasAvailability: false,
    startDate: '',
    endDate: '',
    minDuration: undefined,
    maxDuration: undefined,
    destinationIds: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [excursionsData, destinationsData] = await Promise.all([
          getFilteredExcursions(filters, { page: currentPage, pageSize }),
          getAllDestinations()
        ])
        setExcursions(excursionsData.data)
        setTotal(excursionsData.total)
        setTotalPages(excursionsData.totalPages)
        setDestinations(destinationsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, filters]) // Added filters to dependency array to re-fetch when filters change

  const applyFilters = async () => {
    setLoading(true)
    setCurrentPage(1) // Reset to first page when applying filters
    try {
      const data = await getFilteredExcursions(filters, { page: 1, pageSize })
      setExcursions(data.data)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error applying filters:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = async () => {
    const resetFilters: ExcursionFilters = {
      search: '',
      minPrice: undefined,
      maxPrice: undefined,
      hasAvailability: false,
      startDate: '',
      endDate: '',
      minDuration: undefined,
      maxDuration: undefined,
      destinationIds: [],
    }
    setFilters(resetFilters)
    setCurrentPage(1)
    setLoading(true)
    try {
      const data = await getFilteredExcursions(resetFilters, { page: 1, pageSize })
      setExcursions(data.data)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Error clearing filters:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDestination = (destId: number) => {
    setFilters(prev => {
      const currentIds = prev.destinationIds || []
      const newIds = currentIds.includes(destId)
        ? currentIds.filter(id => id !== destId)
        : [...currentIds, destId]
      return { ...prev, destinationIds: newIds }
    })
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  if (loading) return <div className="px-4 py-8 text-center">Cargando...</div>

  const isAdmin = userRole === 'admin'

  return (
    <div className='px-4 flex flex-col gap-4'>
      {/* Search Bar */}
      <div className='w-full flex flex-row gap-4'>
        <div className='flex-1 flex flex-row gap-4'>
          <Input
            placeholder="Buscar aventura..."
            value={filters.search || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="flex-1"
          />
          <Button
            className="bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:opacity-90"
            onClick={applyFilters}
          >
            <Search className="mr-2 h-4 w-4" />
            Buscar
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
        {isAdmin && (
          <div className='w-auto'>
            <ModalExcursionCreate />
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      <Collapsible open={showFilters} onOpenChange={setShowFilters}>
        <CollapsibleContent>
          <div className="border rounded-lg p-4 space-y-4 bg-card">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Filtros Avanzados</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Price Range */}
              <div className="space-y-2">
                <Label>Rango de Precio</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Mínimo"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      minPrice: e.target.value ? Number(e.target.value) : undefined
                    }))}
                  />
                  <Input
                    type="number"
                    placeholder="Máximo"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      maxPrice: e.target.value ? Number(e.target.value) : undefined
                    }))}
                  />
                </div>
              </div>

              {/* Duration Range */}
              <div className="space-y-2">
                <Label>Duración (días)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Mín"
                    value={filters.minDuration || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      minDuration: e.target.value ? Number(e.target.value) : undefined
                    }))}
                  />
                  <Input
                    type="number"
                    placeholder="Máx"
                    value={filters.maxDuration || ''}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      maxDuration: e.target.value ? Number(e.target.value) : undefined
                    }))}
                  />
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Rango de Fechas</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={filters.startDate || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                  <Input
                    type="date"
                    value={filters.endDate || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label>Disponibilidad</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="availability"
                    checked={filters.hasAvailability}
                    onCheckedChange={(checked) =>
                      setFilters(prev => ({ ...prev, hasAvailability: checked as boolean }))
                    }
                  />
                  <label
                    htmlFor="availability"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Solo lugares disponibles
                  </label>
                </div>
              </div>

              {/* Destinations */}
              <div className="space-y-2 md:col-span-2">
                <Label>Destinos</Label>
                <div className="flex flex-wrap gap-2">
                  {destinations.map((dest) => (
                    <div key={dest.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`dest-${dest.id}`}
                        checked={filters.destinationIds?.includes(dest.id) || false}
                        onCheckedChange={() => toggleDestination(dest.id)}
                      />
                      <label
                        htmlFor={`dest-${dest.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {dest.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                className="bg-gradient-to-r from-[#256EFF] to-[#07BEB8] hover:opacity-90"
                onClick={applyFilters}
              >
                Aplicar Filtros
              </Button>
              <Button
                variant="outline"
                onClick={clearFilters}
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Excursions Grid */}
      <CardExcursions excursions={excursions} isAdmin={isAdmin} />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Mostrando {excursions.length} de {total} excursiones
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <div className="text-sm font-medium px-4">
              Página {currentPage} de {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
