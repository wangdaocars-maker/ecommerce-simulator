import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/api-utils'
import type { ProductStats } from '@/types/product'

/**
 * GET /api/products/stats
 * 获取商品统计数据
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

    // 获取用户限制
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

    // 基础条件：用户的商品，未软删除
    const baseWhere = {
      userId,
      deletedAt: null
    }

    // 并行查询各状态数量
    const [
      sellingCount,
      draftCount,
      reviewingCount,
      rejectedCount,
      offlineCount,
      totalCount,
      abnormalCount
    ] = await Promise.all([
      // 正在销售
      prisma.product.count({
        where: { ...baseWhere, status: 'published' }
      }),
      // 草稿箱
      prisma.product.count({
        where: { ...baseWhere, status: 'draft' }
      }),
      // 审核中
      prisma.product.count({
        where: { ...baseWhere, status: 'reviewing' }
      }),
      // 审核不通过
      prisma.product.count({
        where: { ...baseWhere, status: 'rejected' }
      }),
      // 已下架
      prisma.product.count({
        where: { ...baseWhere, status: 'offline' }
      }),
      // 总数（不含软删除）
      prisma.product.count({
        where: baseWhere
      }),
      // 异常商品数（有优化任务的）
      prisma.product.count({
        where: {
          ...baseWhere,
          optimizationTasks: { gt: 0 }
        }
      })
    ])

    const stats: ProductStats = {
      selling: sellingCount,
      draft: draftCount,
      draftLimit: user.draftLimit,
      reviewing: reviewingCount,
      rejected: rejectedCount,
      offline: offlineCount,
      total: totalCount,
      limit: user.productLimit,
      abnormal: abnormalCount
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Get product stats error:', error)
    return NextResponse.json(
      { success: false, error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}
