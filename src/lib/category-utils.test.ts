import { describe, it, expect } from 'vitest'
import { normalizeCategoryResponse } from './category-utils'

const sampleCategories = [
  { id: 1, name: 'A', parentId: null, level: 1 }
]

describe('normalizeCategoryResponse', () => {
  it('returns data array when response is successful', () => {
    const result = normalizeCategoryResponse({ success: true, data: sampleCategories })
    expect(result).toEqual(sampleCategories)
  })

  it('returns empty array when response is unsuccessful or invalid', () => {
    const result = normalizeCategoryResponse({ success: false, error: 'fail' })
    expect(result).toEqual([])
  })
})
