'use client'
import React, { useState, useEffect } from 'react'
import CardExcursions from '@/modules/Excursions/cardExcursions'
import ModalExcursionCreate from '@/modules/Excursions/modalExcursionCreate'
import { getExcursions } from '@/modules/Excursions/shared/service'

export default function contentExcursion() {
  const [excursions, setExcursions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
  }, [])

  if (loading) return <div>Cargando...</div>

  return (
    <div className='py-12 px-4'>
        <div className='mb-4 flex justify-end'>
            <ModalExcursionCreate/>

        </div>
        <CardExcursions excursions={excursions}></CardExcursions>
    </div>
  )
}
