import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/api-utils'

type BatchAction = 'offline' | 'delete' | 'export' | 'online'

interface BatchRequest {
  action: BatchAction
  ids: number[]
}

/**
 * POST /api/products/batch
 * 批量操作商品
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

    const body: BatchRequest = await request.json()
    const { action, ids } = body

    if (!action || !ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: '参数错误' },
        { status: 400 }
      )
    }

    // 导出功能暂未实现
    if (action === 'export') {
      return NextResponse.json(
        { success: false, error: '导出功能暂未实现' },
        { status: 501 }
      )
    }

    // 验证所有商品都属于当前用户
    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        userId,
        deletedAt: null
      },
      select: { id: true }
    })

    const validIds = products.map(p => p.id)

    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '没有可操作的商品' },
        { status: 400 }
      )
    }

    let affectedCount = 0

    switch (action) {
      case 'delete':
        // 软删除：设置 deletedAt
        const deleteResult = await prisma.product.updateMany({
          where: { id: { in: validIds } },
          data: { deletedAt: new Date() }
        })
        affectedCount = deleteResult.count
        break

      case 'offline':
        // 下架：设置 status = 'offline'
        const offlineResult = await prisma.product.updateMany({
          where: {
            id: { in: validIds },
            status: 'published'  // 只能下架已发布的商品
          },
          data: { status: 'offline' }
        })
        affectedCount = offlineResult.count
        break

      case 'online':
        // 上架：设置 status = 'published'
        const onlineResult = await prisma.product.updateMany({
          where: {
            id: { in: validIds },
            status: 'offline'  // 只能上架已下架的商品
          },
          data: { status: 'published' }
        })
        affectedCount = onlineResult.count
        break

      default:
        return NextResponse.json(
          { success: false, error: '不支持的操作类型' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: {
        action,
        requestedCount: ids.length,
        affectedCount
      }
    })
  } catch (error) {
    console.error('Batch operation error:', error)
    return NextResponse.json(
      { success: false, error: '批量操作失败' },
      { status: 500 }
    )
  }
}
