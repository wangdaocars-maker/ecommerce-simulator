import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId, formatPrice, formatConversion, formatDateTime, safeJsonParse } from '@/lib/api-utils'
import type { ProductListItem, ProductListParams, ProductFormInput } from '@/types/product'

/**
 * GET /api/products
 * 获取商品列表
 */
export async function GET(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const params: ProductListParams = {
      page: parseInt(searchParams.get('page') || '1'),
      pageSize: parseInt(searchParams.get('pageSize') || '20'),
      status: searchParams.get('status') as ProductListParams['status'] || undefined,
      search: searchParams.get('search') || undefined,
      searchType: searchParams.get('searchType') as ProductListParams['searchType'] || undefined,
      categoryId: searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')!) : undefined,
      groupId: searchParams.get('groupId') ? parseInt(searchParams.get('groupId')!) : undefined,
      filterType: searchParams.get('filterType') as ProductListParams['filterType'] || undefined,
      sortBy: searchParams.get('sortBy') || 'updatedAt',
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    }

    // 构建查询条件
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId,
      deletedAt: null  // 排除软删除的商品
    }

    // 状态筛选
    if (params.status) {
      where.status = params.status
    }

    // 搜索
    if (params.search) {
      if (params.searchType === 'productId') {
        const searchId = parseInt(params.search)
        if (!isNaN(searchId)) {
          where.id = searchId
        }
      } else if (params.searchType === 'sku') {
        where.sku = { contains: params.search }
      } else {
        // 默认按标题搜索
        where.title = { contains: params.search }
      }
    }

    // 类目筛选
    if (params.categoryId) {
      where.categoryId = params.categoryId
    }

    // 分组筛选
    if (params.groupId) {
      where.groups = {
        some: {
          groupId: params.groupId
        }
      }
    }

    // 特殊筛选
    if (params.filterType === 'soldout') {
      where.stock = 0
    } else if (params.filterType === 'presale') {
      where.isPresale = true
    } else if (params.filterType === 'wholesale') {
      where.wholesaleEnabled = true
    } else if (params.filterType === 'flash') {
      where.isFlash = true
    }

    // 查询总数
    const total = await prisma.product.count({ where })

    // 查询列表
    const products = await prisma.product.findMany({
      where,
      include: {
        groups: {
          include: {
            group: true
          }
        }
      },
      orderBy: { [params.sortBy!]: params.sortOrder },
      skip: (params.page! - 1) * params.pageSize!,
      take: params.pageSize
    })

    // 转换为前端需要的格式
    const items: ProductListItem[] = products.map(p => {
      // 获取缩略图：优先使用 mainImage，否则使用 images 数组的第一张
      const images = safeJsonParse<string[]>(p.images, [])
      const thumbnail = p.mainImage || images[0] || '/placeholder.png'

      return {
        key: String(p.id),
        id: String(p.id),
        title: p.title,
        image: thumbnail,
        hasSale: p.hasSale,
      skuCount: 1,  // 简化处理，实际可从 SKU 数量计算
      groups: p.groups.map(g => g.group.name),
      price: {
        amount: formatPrice(p.price),
        hasRange: false
      },
      stock: p.stock,
      optimization: {
        status: p.optimizationStatus || '',
        tasks: p.optimizationTasks,
        warnings: safeJsonParse<string[]>(p.optimizationWarnings, [])
      },
      sales30d: p.sales30d || null,
      views30d: p.views30d,
      conversion30d: formatConversion(p.conversion30d),
      chartData: safeJsonParse<number[]>(p.chartData, []),
      paymentAmount30d: p.paymentAmount30d,
      visitors30d: p.visitors30d,
      visitorsChartData: safeJsonParse<number[]>(p.visitorsChartData, []),
      payingBuyers30d: p.payingBuyers30d,
      avgOrderValue30d: p.avgOrderValue30d,
      shippingTemplate: {
        line1: p.shippingTemplate || '未设置运费模板',
        line2: ''
      },
      editTime: {
        edited: formatDateTime(p.updatedAt),
        created: formatDateTime(p.createdAt)
      }
    }})

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page: params.page,
        pageSize: params.pageSize
      }
    })
  } catch (error) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { success: false, error: '获取商品列表失败' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/products
 * 创建商品
 */
export async function POST(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    // 获取用户信息，检查发品限制
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { productLimit: true, draftLimit: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: '用户不存在' },
        { status: 404 }
      )
    }

    const body: ProductFormInput = await request.json()

    // 检查发品限制
    const productCount = await prisma.product.count({
      where: { userId, deletedAt: null }
    })

    if (productCount >= user.productLimit) {
      return NextResponse.json(
        { success: false, error: `已达到发品上限（${user.productLimit}件）` },
        { status: 400 }
      )
    }

    // 如果是草稿，检查草稿限制
    if (body.status === 'draft') {
      const draftCount = await prisma.product.count({
        where: { userId, status: 'draft', deletedAt: null }
      })

      if (draftCount >= user.draftLimit) {
        return NextResponse.json(
          { success: false, error: `已达到草稿上限（${user.draftLimit}件）` },
          { status: 400 }
        )
      }
    }

    // 创建商品
    const product = await prisma.product.create({
      data: {
        userId,
        title: body.title,
        categoryId: body.categoryId,

        // 多国家支持
        countries: JSON.stringify(body.countries || []),
        countryTitles: JSON.stringify(body.countryTitles || {}),
        countryImages: JSON.stringify(body.countryImages || {}),
        language: body.language || 'zh',

        // 基本信息
        brand: body.brand,
        model: body.model,
        keywords: body.keywords,

        // 价格库存
        price: body.price,
        comparePrice: body.comparePrice,
        stock: body.stock,
        sku: body.sku,
        minUnit: body.minUnit || 'piece',
        salesMethod: body.salesMethod || 'piece',
        productValue: body.productValue,
        isPresale: body.isPresale || false,
        productType: body.productType || 'normal',

        // 商品属性
        colorSystem: body.colorSystem,
        customColorName: body.customColorName,
        selectedSizes: JSON.stringify(body.selectedSizes || []),
        plugTypes: JSON.stringify(body.plugTypes || []),
        shippingLocations: JSON.stringify(body.shippingLocations || []),
        customAttributes: JSON.stringify(body.customAttributes || []),

        // 批发价
        wholesaleEnabled: body.wholesaleEnabled || false,
        wholesaleMinQuantity: body.wholesaleMinQuantity,
        wholesaleDiscount: body.wholesaleDiscount,

        // 区域定价
        selectedRegions: JSON.stringify(body.selectedRegions || []),
        regionalPrices: JSON.stringify(body.regionalPrices || {}),
        priceAdjustMethod: body.priceAdjustMethod || 'direct',
        regionalPriceAdjustments: JSON.stringify(body.regionalPriceAdjustments || {}),

        // 描述
        shortDesc: body.shortDesc,
        description: body.description || '',
        descriptionLang: body.descriptionLang || 'English',
        appTemplateId: body.appTemplateId,

        // 图片视频
        images: JSON.stringify(body.images || []),
        mainImage: body.mainImage || (body.images?.[0] || null),
        video: body.video,
        videoCover: body.videoCover,

        // 物流
        weight: body.weight,
        packageSize: body.packageSize ? JSON.stringify(body.packageSize) : null,
        shippingTemplate: body.shippingTemplate,
        serviceTemplate: body.serviceTemplate,
        customWeight: body.customWeight || false,

        // 其它设置
        priceIncludesTax: body.priceIncludesTax || 'include',
        saleType: body.saleType || 'normal',
        inventoryDeduction: body.inventoryDeduction || 'payment',
        alipaySupported: body.alipaySupported !== false,
        euResponsiblePerson: body.euResponsiblePerson,
        manufacturer: body.manufacturer,

        // 状态
        status: body.status || 'draft'
      }
    })

    // 关联分组
    if (body.groupIds && body.groupIds.length > 0) {
      await prisma.productToGroup.createMany({
        data: body.groupIds.map(groupId => ({
          productId: product.id,
          groupId
        }))
      })
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
    console.error('Create product error:', error)
    return NextResponse.json(
      { success: false, error: '创建商品失败' },
      { status: 500 }
    )
  }
}
