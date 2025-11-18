import React from 'react'
import CardExcursions from '@/modules/Excursions/cardExcursions'
import ModalExcursionCreate from '@/modules/Excursions/modalExcursionCreate'
export default function page() {
  return (
    <div>
      <ModalExcursionCreate></ModalExcursionCreate>
        <CardExcursions />
    </div>
  )
}

