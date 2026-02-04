import type { Category } from '@/types/category'

interface CategoryResponse {
  success?: boolean
  data?: unknown
}

export function normalizeCategoryResponse(response: CategoryResponse): Category[] {
  if (!response?.success) {
    return []
  }

  if (Array.isArray(response.data)) {
    return response.data as Category[]
  }

  return []
}
