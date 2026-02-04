import type { ProductFormInput } from '@/types/product'

export interface ValidationError {
  field: string
  message: string
}

/**
 * 验证商品表单数据
 */
export function validateProductForm(data: Partial<ProductFormInput>): ValidationError[] {
  const errors: ValidationError[] = []

  // 标题验证
  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: '商品标题不能为空' })
  } else if (data.title.length < 10) {
    errors.push({ field: 'title', message: '商品标题至少10个字符' })
  } else if (data.title.length > 200) {
    errors.push({ field: 'title', message: '商品标题最多200个字符' })
  }

  // 类目验证
  if (!data.categoryId) {
    errors.push({ field: 'categoryId', message: '请选择商品类目' })
  }

  // 价格验证
  if (!data.price || data.price <= 0) {
    errors.push({ field: 'price', message: '请输入有效的零售价' })
  }

  // 划线价验证（如果填写了）
  if (data.comparePrice !== undefined && data.comparePrice !== null) {
    if (data.comparePrice <= 0) {
      errors.push({ field: 'comparePrice', message: '划线价必须大于0' })
    } else if (data.price && data.comparePrice <= data.price) {
      errors.push({ field: 'comparePrice', message: '划线价必须大于零售价' })
    }
  }

  // 库存验证
  if (data.stock === undefined || data.stock < 0) {
    errors.push({ field: 'stock', message: '库存不能为负数' })
  }

  // 图片验证
  if (!data.images?.length) {
    errors.push({ field: 'images', message: '请至少上传一张商品图片' })
  }

  // 描述验证
  if (!data.description?.trim()) {
    errors.push({ field: 'description', message: '请填写商品描述' })
  }

  // 批发价验证
  if (data.wholesaleEnabled) {
    if (!data.wholesaleMinQuantity || data.wholesaleMinQuantity < 2) {
      errors.push({ field: 'wholesaleMinQuantity', message: '批发最小数量至少为2' })
    }
    if (
      data.wholesaleDiscount === undefined ||
      data.wholesaleDiscount === null ||
      data.wholesaleDiscount <= 0 ||
      data.wholesaleDiscount >= 100
    ) {
      errors.push({ field: 'wholesaleDiscount', message: '批发折扣需在0-100之间' })
    }
  }

  // 预售验证
  if (data.isPresale && data.saleType !== 'presale') {
    errors.push({ field: 'saleType', message: '预售商品的销售类型必须为预售' })
  }

  return errors
}

/**
 * 验证草稿表单（要求更宽松）
 */
export function validateDraftForm(data: Partial<ProductFormInput>): ValidationError[] {
  const errors: ValidationError[] = []

  // 草稿只需要标题
  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: '商品标题不能为空' })
  }

  return errors
}
