'use server'

import { deleteExcursion as deleteExcursionService, updateExcursion as updateExcursionService } from './service'
import type { Excursion } from './dtoExcursion'

export async function deleteExcursion(id: number) {
  try {
    const result = await deleteExcursionService(id)
    return { success: true, data: result }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar'
    return { success: false, error: message }
  }
}

export async function updateExcursion(id: number, excursion: Partial<Excursion>) {
  try {
    const result = await updateExcursionService(id, excursion)
    return { success: true, data: result }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar'
    return { success: false, error: message }
  }
}