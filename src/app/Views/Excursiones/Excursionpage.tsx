import React from 'react'
import { getExcursions } from '@/modules/Excursions/shared/service'
import ContentExcursion from '@/modules/Excursions/contentExcursion'

export default async function page() {
  return (
    <div>
      <ContentExcursion />
    </div>
  )
}

