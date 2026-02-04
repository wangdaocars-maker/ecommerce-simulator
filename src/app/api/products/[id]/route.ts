import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId, safeJsonParse } from '@/lib/api-utils'
import type { ProductFormInput } from '@/types/product'

interface RouteContext {
  params: Promise<{ id: string }>
}

/**
 * GET /api/products/[id]
 * 获取单个商品详情
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const productId = parseInt(id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: '无效的商品ID' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        groups: {
          include: {
            group: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: '商品不存在' },
        { status: 404 }
      )
    }

    // 验证所有权
    if (product.userId !== userId) {
      return NextResponse.json(
        { success: false, error: '无权访问此商品' },
        { status: 403 }
      )
    }

    // 检查是否已软删除
    if (product.deletedAt) {
      return NextResponse.json(
        { success: false, error: '商品已删除' },
        { status: 404 }
      )
    }

    // 转换 JSON 字段
    const data = {
      ...product,
      countries: safeJsonParse<string[]>(product.countries, []),
      countryTitles: safeJsonParse<Record<string, string>>(product.countryTitles, {}),
      countryImages: safeJsonParse<Record<string, string[]>>(product.countryImages, {}),
      images: safeJsonParse<string[]>(product.images, []),
      selectedSizes: safeJsonParse<string[]>(product.selectedSizes, []),
      plugTypes: safeJsonParse<string[]>(product.plugTypes, []),
      shippingLocations: safeJsonParse<string[]>(product.shippingLocations, []),
      customAttributes: safeJsonParse<Array<{ id: string; name: string; value: string }>>(product.customAttributes, []),
      selectedRegions: safeJsonParse<string[]>(product.selectedRegions, []),
      regionalPrices: safeJsonParse<Record<string, string>>(product.regionalPrices, {}),
      regionalPriceAdjustments: safeJsonParse<Record<string, { operator: string; value: string }>>(product.regionalPriceAdjustments, {}),
      packageSize: safeJsonParse<{ length: number; width: number; height: number } | null>(product.packageSize, null),
      chartData: safeJsonParse<number[]>(product.chartData, []),
      visitorsChartData: safeJsonParse<number[]>(product.visitorsChartData, []),
      optimizationWarnings: safeJsonParse<string[]>(product.optimizationWarnings, []),
      groupIds: product.groups.map(g => g.groupId),
      groupNames: product.groups.map(g => g.group.name),
      categoryName: product.category?.name
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Get product error:', error)
    return NextResponse.json(
      { success: false, error: '获取商品详情失败' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/products/[id]
 * 更新商品
 */
export async function PUT(request: Request, context: RouteContext) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const productId = parseInt(id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: '无效的商品ID' },
        { status: 400 }
      )
    }

    // 查找商品
    const existing = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: '商品不存在' },
        { status: 404 }
      )
    }

    // 验证所有权
    if (existing.userId !== userId) {
      return NextResponse.json(
        { success: false, error: '无权修改此商品' },
        { status: 403 }
      )
    }

    // 检查是否已软删除
    if (existing.deletedAt) {
      return NextResponse.json(
        { success: false, error: '商品已删除，无法修改' },
        { status: 400 }
      )
    }

    const body: Partial<ProductFormInput> = await request.json()

    // 更新商品
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),

        // 多国家支持
        ...(body.countries !== undefined && { countries: JSON.stringify(body.countries) }),
        ...(body.countryTitles !== undefined && { countryTitles: JSON.stringify(body.countryTitles) }),
        ...(body.countryImages !== undefined && { countryImages: JSON.stringify(body.countryImages) }),
        ...(body.language !== undefined && { language: body.language }),

        // 基本信息
        ...(body.brand !== undefined && { brand: body.brand }),
        ...(body.model !== undefined && { model: body.model }),
        ...(body.keywords !== undefined && { keywords: body.keywords }),

        // 价格库存
        ...(body.price !== undefined && { price: body.price }),
        ...(body.comparePrice !== undefined && { comparePrice: body.comparePrice }),
        ...(body.stock !== undefined && { stock: body.stock }),
        ...(body.sku !== undefined && { sku: body.sku }),
        ...(body.minUnit !== undefined && { minUnit: body.minUnit }),
        ...(body.salesMethod !== undefined && { salesMethod: body.salesMethod }),
        ...(body.productValue !== undefined && { productValue: body.productValue }),
        ...(body.isPresale !== undefined && { isPresale: body.isPresale }),
        ...(body.productType !== undefined && { productType: body.productType }),

        // 商品属性
        ...(body.colorSystem !== undefined && { colorSystem: body.colorSystem }),
        ...(body.customColorName !== undefined && { customColorName: body.customColorName }),
        ...(body.selectedSizes !== undefined && { selectedSizes: JSON.stringify(body.selectedSizes) }),
        ...(body.plugTypes !== undefined && { plugTypes: JSON.stringify(body.plugTypes) }),
        ...(body.shippingLocations !== undefined && { shippingLocations: JSON.stringify(body.shippingLocations) }),
        ...(body.customAttributes !== undefined && { customAttributes: JSON.stringify(body.customAttributes) }),

        // 批发价
        ...(body.wholesaleEnabled !== undefined && { wholesaleEnabled: body.wholesaleEnabled }),
        ...(body.wholesaleMinQuantity !== undefined && { wholesaleMinQuantity: body.wholesaleMinQuantity }),
        ...(body.wholesaleDiscount !== undefined && { wholesaleDiscount: body.wholesaleDiscount }),

        // 区域定价
        ...(body.selectedRegions !== undefined && { selectedRegions: JSON.stringify(body.selectedRegions) }),
        ...(body.regionalPrices !== undefined && { regionalPrices: JSON.stringify(body.regionalPrices) }),
        ...(body.priceAdjustMethod !== undefined && { priceAdjustMethod: body.priceAdjustMethod }),
        ...(body.regionalPriceAdjustments !== undefined && { regionalPriceAdjustments: JSON.stringify(body.regionalPriceAdjustments) }),

        // 描述
        ...(body.shortDesc !== undefined && { shortDesc: body.shortDesc }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.descriptionLang !== undefined && { descriptionLang: body.descriptionLang }),
        ...(body.appTemplateId !== undefined && { appTemplateId: body.appTemplateId }),

        // 图片视频
        ...(body.images !== undefined && { images: JSON.stringify(body.images) }),
        ...(body.mainImage !== undefined && { mainImage: body.mainImage }),
        ...(body.video !== undefined && { video: body.video }),
        ...(body.videoCover !== undefined && { videoCover: body.videoCover }),

        // 物流
        ...(body.weight !== undefined && { weight: body.weight }),
        ...(body.packageSize !== undefined && { packageSize: body.packageSize ? JSON.stringify(body.packageSize) : null }),
        ...(body.shippingTemplate !== undefined && { shippingTemplate: body.shippingTemplate }),
        ...(body.serviceTemplate !== undefined && { serviceTemplate: body.serviceTemplate }),
        ...(body.customWeight !== undefined && { customWeight: body.customWeight }),

        // 其它设置
        ...(body.priceIncludesTax !== undefined && { priceIncludesTax: body.priceIncludesTax }),
        ...(body.saleType !== undefined && { saleType: body.saleType }),
        ...(body.inventoryDeduction !== undefined && { inventoryDeduction: body.inventoryDeduction }),
        ...(body.alipaySupported !== undefined && { alipaySupported: body.alipaySupported }),
        ...(body.euResponsiblePerson !== undefined && { euResponsiblePerson: body.euResponsiblePerson }),
        ...(body.manufacturer !== undefined && { manufacturer: body.manufacturer }),

        // 状态
        ...(body.status !== undefined && { status: body.status })
      }
    })

    // 更新分组关联
    if (body.groupIds !== undefined) {
      // 先删除现有关联
      await prisma.productToGroup.deleteMany({
        where: { productId }
      })

      // 创建新关联
      if (body.groupIds.length > 0) {
        await prisma.productToGroup.createMany({
          data: body.groupIds.map(groupId => ({
            productId,
            groupId
          }))
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: product.id,
        title: product.title,
        status: product.status
      }
    })
  } catch (error) {
    console.error('Update product error:', error)
    return NextResponse.json(
      { success: false, error: '更新商品失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/products/[id]
 * 软删除商品
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { id } = await context.params
    const productId = parseInt(id)

    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: '无效的商品ID' },
        { status: 400 }
      )
    }

    // 查找商品
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { success: false, error: '商品不存在' },
        { status: 404 }
      )
    }

    // 验证所有权
    if (product.userId !== userId) {
      return NextResponse.json(
        { success: false, error: '无权删除此商品' },
        { status: 403 }
      )
    }

    // 已经软删除的商品
    if (product.deletedAt) {
      return NextResponse.json(
        { success: false, error: '商品已删除' },
        { status: 400 }
      )
    }

    // 软删除：设置 deletedAt
    await prisma.product.update({
      where: { id: productId },
      data: { deletedAt: new Date() }
    })

    return NextResponse.json({
      success: true,
      data: { id: productId }
    })
  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { success: false, error: '删除商品失败' },
      { status: 500 }
    )
  }
}
