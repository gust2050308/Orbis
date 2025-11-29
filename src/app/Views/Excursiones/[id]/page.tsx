import React from 'react'
import { notFound } from 'next/navigation'
import { getExcursionsById } from '@/modules/Excursions/shared/service'
import ExcursionDetailClient from './ExcursionDetailClient'

export default async function ExcursionDetailPage({ params }: { params: { id: string } }) {
    const excursion = await getExcursionsById(params.id)

    if (!excursion) {
        notFound()
    }

    return <ExcursionDetailClient excursion={excursion} />
}
