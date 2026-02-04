// 商品状态（不含 'deleted'，软删用 deletedAt 字段判断）
export type ProductStatus = 'draft' | 'reviewing' | 'published' | 'rejected' | 'offline'

// 表格展示用的商品数据（匹配 mockData 结构）
export interface ProductListItem {
  key: string           // 用于 antd Table
  id: string            // 商品ID
  title: string
  image: string         // mainImage
  hasSale: boolean
  skuCount: number      // 计算值或固定1
  groups: string[]      // 从 ProductToGroup 关联获取
  price: {
    amount: string      // 格式化后的价格 "CNY 248.62"
    hasRange: boolean
    min?: string
    max?: string
  }
  stock: number
  optimization: {
    status: string      // optimizationStatus
    tasks: number       // optimizationTasks
    warnings?: string[] // optimizationWarnings JSON解析
  }
  sales30d: number | null
  views30d: number
  conversion30d: string // 格式化 "0.04%"
  chartData: number[]
  paymentAmount30d: number
  visitors30d: number
  visitorsChartData: number[]
  payingBuyers30d: number
  avgOrderValue30d: number
  shippingTemplate: {
    line1: string
    line2: string
  }
  editTime: {
    edited: string      // updatedAt 格式化
    created: string     // createdAt 格式化
  }
}

// 商品创建/更新输入
export interface ProductFormInput {
  // 基本信息
  title: string
  countries: string[]
  countryTitles: Record<string, string>
  countryImages: Record<string, string[]>
  language: string
  categoryId?: number

  // 价格库存
  price: number
  comparePrice?: number
  stock: number
  sku?: string
  minUnit: string
  salesMethod: string
  productValue?: number
  isPresale: boolean
  productType: string

  // 商品属性
  brand?: string
  model?: string
  keywords?: string
  colorSystem?: string
  customColorName?: string
  selectedSizes: string[]
  plugTypes: string[]
  shippingLocations: string[]
  customAttributes: Array<{ id: string; name: string; value: string }>

  // 批发价
  wholesaleEnabled: boolean
  wholesaleMinQuantity?: number
  wholesaleDiscount?: number

  // 区域定价
  selectedRegions: string[]
  regionalPrices: Record<string, string>
  priceAdjustMethod: string
  regionalPriceAdjustments: Record<string, { operator: string; value: string }>

  // 描述
  shortDesc?: string
  description: string
  descriptionLang: string
  appTemplateId?: string

  // 图片视频
  images: string[]
  mainImage?: string
  video?: string
  videoCover?: string

  // 物流
  weight?: number
  packageSize?: { length: number; width: number; height: number }
  shippingTemplate?: string
  serviceTemplate?: string
  customWeight: boolean

  // 其它
  priceIncludesTax: string
  saleType: string
  inventoryDeduction: string
  alipaySupported: boolean
  euResponsiblePerson?: string
  manufacturer?: string
  groupIds?: number[]  // 商品分组ID数组

  // 状态
  status?: ProductStatus
}

// 商品统计数据
export interface ProductStats {
  selling: number      // 正在销售（status=published, deletedAt=null）
  draft: number        // 草稿箱（status=draft, deletedAt=null）
  draftLimit: number   // 草稿上限（来自 user.draftLimit）
  reviewing: number    // 审核中
  rejected: number     // 审核不通过
  offline: number      // 已下架
  total: number        // 总数（不含软删除）
  limit: number        // 发品上限（来自 user.productLimit）
  abnormal: number     // 异常商品数（有 optimizationTasks > 0 的商品数）
}

// 查询参数
export interface ProductListParams {
  page?: number
  pageSize?: number
  status?: ProductStatus
  search?: string
  searchType?: 'productId' | 'title' | 'sku'
  categoryId?: number
  groupId?: number
  filterType?: 'all' | 'soldout' | 'presale' | 'wholesale' | 'flash'
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// 商品分组
export interface ProductGroup {
  id: number
  name: string
  productCount: number
}
