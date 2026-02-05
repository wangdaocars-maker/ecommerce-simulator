import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/api-utils'

/**
 * GET /api/products/groups
 * 获取当前用户的商品分组列表
 */
export async function GET() {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const groups = await prisma.productGroup.findMany({
      where: { userId },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    const data = groups.map(g => ({
      id: g.id,
      name: g.name,
      productCount: g._count.products
    }))

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Get product groups error:', error)
    return NextResponse.json(
      { success: false, error: '获取商品分组失败' },
      { status: 500 }
    )
  }
}
