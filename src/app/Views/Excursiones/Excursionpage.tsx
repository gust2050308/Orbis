import React from 'react'
import CardExcursions from '@/modules/Excursions/cardExcursions'
import ModalExcursionCreate from '@/modules/Excursions/modalExcursionCreate'
import { getExcursions } from '@/modules/Excursions/shared/service'

export default async function page() {
  const excursions = await getExcursions()
  return (
    <div>
      <ModalExcursionCreate></ModalExcursionCreate>
        <CardExcursions excursions={excursions}></CardExcursions>
    </div>
  )
}

