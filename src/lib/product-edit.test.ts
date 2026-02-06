import { describe, it, expect } from 'vitest'
import { resolveCreateFlow } from './product-edit'

describe('resolveCreateFlow', () => {
  it('skips recovery in edit mode', () => {
    expect(resolveCreateFlow(true, false, false)).toBe('skip')
  })

  it('uses session when available', () => {
    expect(resolveCreateFlow(false, true, false)).toBe('session')
  })

  it('uses category when no session but categoryId exists', () => {
    expect(resolveCreateFlow(false, false, true)).toBe('category')
  })

  it('redirects when nothing available', () => {
    expect(resolveCreateFlow(false, false, false)).toBe('redirect')
  })
})
