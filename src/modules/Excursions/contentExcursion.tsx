'use client'
import React, { useState, useEffect } from 'react'
import CardExcursions from '@/modules/Excursions/cardExcursions'
import ModalExcursionCreate from '@/modules/Excursions/modalExcursionCreate'
import { getExcursions } from '@/modules/Excursions/shared/service'
import { Excursion } from './shared/dtoExcursion'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
export default function ContentExcursion() {
  const [excursions, setExcursions] = useState<Excursion[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchExcursions = async () => {
      try {
        const data = await getExcursions()
        setExcursions(data)
      } catch (error) {
        console.error('Error fetching excursions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchExcursions()
  }, [search])

  const handleSearch = () => {
    const filteredExcursions = excursions.filter(exc => exc.title.toLowerCase().includes(search.toLowerCase()))
    setExcursions(filteredExcursions)
  }

  if (loading) return <div>Cargando...</div>

  return (
    <div className='py-2 px-4 flex flex-col gap-4'>
        <div className='w-full flex flex-row gap-4 '>
          <div className='w-5/6 flex flex-row gap-4'>
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
                    <Search />
                    Buscar
                </Button>
          </div>
          <div className='w-1/6'>
            <ModalExcursionCreate/>
          </div>

        </div>
        <CardExcursions excursions={excursions}></CardExcursions>
    </div>
  )
}
