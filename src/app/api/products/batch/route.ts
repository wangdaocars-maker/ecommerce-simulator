import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/api-utils'
import * as XLSX from 'xlsx'

type BatchAction = 'offline' | 'delete' | 'export' | 'online'

interface BatchRequest {
  action: BatchAction
  ids: number[]
}

// 状态映射
const statusMap: Record<string, string> = {
  draft: '草稿',
  reviewing: '审核中',
  published: '已发布',
  rejected: '审核不通过',
  offline: '已下架',
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

    // 导出功能
    if (action === 'export') {
      const products = await prisma.product.findMany({
        where: {
          id: { in: ids },
          userId,
          deletedAt: null
        },
        include: {
          category: { select: { name: true } }
        }
      })

      if (products.length === 0) {
        return NextResponse.json(
          { success: false, error: '没有可导出的商品' },
          { status: 400 }
        )
      }

      // 构建 Excel 数据
      const data = products.map(p => ({
        '商品ID': p.id,
        '商品标题': p.title,
        '类目': p.category?.name || '-',
        'SKU': p.sku || '-',
        '零售价(CNY)': p.price,
        '库存': p.stock,
        '状态': statusMap[p.status] || p.status,
        '创建时间': p.createdAt.toISOString().slice(0, 19).replace('T', ' '),
        '更新时间': p.updatedAt.toISOString().slice(0, 19).replace('T', ' '),
      }))

      // 生成 Excel
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(data)

      // 设置列宽
      ws['!cols'] = [
        { wch: 10 },  // 商品ID
        { wch: 40 },  // 商品标题
        { wch: 20 },  // 类目
        { wch: 15 },  // SKU
        { wch: 12 },  // 零售价
        { wch: 8 },   // 库存
        { wch: 12 },  // 状态
        { wch: 20 },  // 创建时间
        { wch: 20 },  // 更新时间
      ]

      XLSX.utils.book_append_sheet(wb, ws, '商品列表')

      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

      return new Response(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename=products.xlsx'
        }
      })
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
