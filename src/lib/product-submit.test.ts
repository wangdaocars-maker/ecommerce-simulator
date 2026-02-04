import { describe, it, expect } from 'vitest'
import { buildProductPayload, resolveSubmitImages, resolveImageTargetKey } from './product-submit'

const baseInput = {
  title: '测试商品标题',
  countries: ['us'],
  countryTitles: {},
  countryImages: { default: ['img-1'] },
  language: 'en',
  categoryId: 1,
  price: 10,
  stock: 5,
  minUnit: 'piece',
  salesMethod: 'piece',
  isPresale: false,
  productType: 'normal',
  selectedSizes: ['S'],
  plugTypes: ['US'],
  shippingLocations: ['CN'],
  customAttributes: [{ id: '1', name: '材质', value: '棉' }],
  wholesaleEnabled: false,
  selectedRegions: [],
  regionalPrices: {},
  priceAdjustMethod: 'direct',
  regionalPriceAdjustments: {},
  description: '描述',
  descriptionLang: 'English',
  images: ['img-1'],
  customWeight: false,
  priceIncludesTax: 'include',
  saleType: 'normal',
  inventoryDeduction: 'payment',
  alipaySupported: true
}

describe('resolveSubmitImages', () => {
  it('prefers default images when present', () => {
    const result = resolveSubmitImages({
      default: ['a', 'b'],
      es: ['c']
    }, ['es'])
    expect(result.images).toEqual(['a', 'b'])
    expect(result.mainImage).toBe('a')
  })

  it('falls back to first selected country when default is empty', () => {
    const result = resolveSubmitImages({ es: ['c'] }, ['es', 'fr'])
    expect(result.images).toEqual(['c'])
    expect(result.mainImage).toBe('c')
  })

  it('returns empty when no images', () => {
    const result = resolveSubmitImages({}, ['es'])
    expect(result.images).toEqual([])
    expect(result.mainImage).toBeUndefined()
  })
})

describe('resolveImageTargetKey', () => {
  it('maps unknown target to default', () => {
    expect(resolveImageTargetKey('marketing-1-1', ['es'])).toBe('default')
  })

  it('returns country code when valid', () => {
    expect(resolveImageTargetKey('es', ['es'])).toBe('es')
  })

  it('returns default when empty', () => {
    expect(resolveImageTargetKey('', ['es'])).toBe('default')
  })
})

describe('buildProductPayload', () => {
  it('keeps arrays and objects without stringifying', () => {
    const payload = buildProductPayload({
      ...baseInput,
      countryImages: { default: ['img-1'] },
      selectedSizes: ['S', 'M']
    })

    expect(payload.selectedSizes).toEqual(['S', 'M'])
    expect(payload.countryImages).toEqual({ default: ['img-1'] })
    expect(Array.isArray(payload.selectedSizes)).toBe(true)
  })

  it('does not derive comparePrice from productValue', () => {
    const payload = buildProductPayload({
      ...baseInput,
      productValue: 199
    })

    expect(payload.comparePrice).toBeUndefined()
    expect(payload.productValue).toBe(199)
  })
})
