import type { ProductFormInput, ProductStatus } from '@/types/product'

export function resolveImageTargetKey(target: string, selectedCountries: string[]): string {
  if (!target) return 'default'
  if (target === 'default') return 'default'
  if (selectedCountries.includes(target)) return target
  return 'default'
}

export function resolveSubmitImages(
  countryImages: Record<string, string[]>,
  selectedCountries: string[]
): { images: string[]; mainImage?: string } {
  const defaultImages = countryImages['default'] || []
  if (defaultImages.length > 0) {
    return { images: defaultImages, mainImage: defaultImages[0] }
  }

  for (const country of selectedCountries) {
    const images = countryImages[country] || []
    if (images.length > 0) {
      return { images, mainImage: images[0] }
    }
  }

  return { images: [], mainImage: undefined }
}

export interface BuildProductPayloadInput {
  title: string
  countries: string[]
  countryTitles?: Record<string, string>
  countryImages?: Record<string, string[]>
  language: string
  categoryId: number | null
  price: number
  comparePrice?: number | null
  stock: number
  sku?: string | null
  minUnit: string
  salesMethod: string
  productValue?: number | null
  isPresale: boolean
  productType: string
  brand?: string | null
  model?: string | null
  keywords?: string | null
  colorSystem?: string | null
  customColorName?: string | null
  selectedSizes?: string[]
  plugTypes?: string[]
  shippingLocations?: string[]
  customAttributes?: Array<{ id: string; name: string; value: string }>
  wholesaleEnabled: boolean
  wholesaleMinQuantity?: number | null
  wholesaleDiscount?: number | null
  selectedRegions?: string[]
  regionalPrices?: Record<string, string>
  priceAdjustMethod: string
  regionalPriceAdjustments?: Record<string, { operator: string; value: string }>
  shortDesc?: string | null
  description: string
  descriptionLang: string
  appTemplateId?: string | null
  images: string[]
  mainImage?: string
  video?: string | null
  videoCover?: string | null
  weight?: number | null
  packageSize?: { length: number; width: number; height: number } | null
  shippingTemplate?: string | null
  serviceTemplate?: string | null
  customWeight: boolean
  priceIncludesTax: string
  saleType: string
  inventoryDeduction: string
  alipaySupported: boolean
  euResponsiblePerson?: string | null
  manufacturer?: string | null
  groupIds?: number[]
  status?: ProductStatus
}

export function buildProductPayload(input: BuildProductPayloadInput): ProductFormInput {
  return {
    title: input.title,
    countries: input.countries ?? [],
    countryTitles: input.countryTitles ?? {},
    countryImages: input.countryImages ?? {},
    language: input.language,
    categoryId: input.categoryId ?? undefined,

    price: input.price,
    comparePrice: input.comparePrice ?? undefined,
    stock: input.stock,
    sku: input.sku ?? undefined,
    minUnit: input.minUnit,
    salesMethod: input.salesMethod,
    productValue: input.productValue ?? undefined,
    isPresale: input.isPresale,
    productType: input.productType,

    brand: input.brand ?? undefined,
    model: input.model ?? undefined,
    keywords: input.keywords ?? undefined,
    colorSystem: input.colorSystem ?? undefined,
    customColorName: input.customColorName ?? undefined,
    selectedSizes: input.selectedSizes ?? [],
    plugTypes: input.plugTypes ?? [],
    shippingLocations: input.shippingLocations ?? [],
    customAttributes: input.customAttributes ?? [],

    wholesaleEnabled: input.wholesaleEnabled,
    wholesaleMinQuantity: input.wholesaleMinQuantity ?? undefined,
    wholesaleDiscount: input.wholesaleDiscount ?? undefined,

    selectedRegions: input.selectedRegions ?? [],
    regionalPrices: input.regionalPrices ?? {},
    priceAdjustMethod: input.priceAdjustMethod,
    regionalPriceAdjustments: input.regionalPriceAdjustments ?? {},

    shortDesc: input.shortDesc ?? undefined,
    description: input.description,
    descriptionLang: input.descriptionLang,
    appTemplateId: input.appTemplateId ?? undefined,

    images: input.images,
    mainImage: input.mainImage,
    video: input.video ?? undefined,
    videoCover: input.videoCover ?? undefined,

    weight: input.weight ?? undefined,
    packageSize: input.packageSize ?? undefined,
    shippingTemplate: input.shippingTemplate ?? undefined,
    serviceTemplate: input.serviceTemplate ?? undefined,
    customWeight: input.customWeight,

    priceIncludesTax: input.priceIncludesTax,
    saleType: input.saleType,
    inventoryDeduction: input.inventoryDeduction,
    alipaySupported: input.alipaySupported,
    euResponsiblePerson: input.euResponsiblePerson ?? undefined,
    manufacturer: input.manufacturer ?? undefined,
    groupIds: input.groupIds,
    status: input.status
  }
}
