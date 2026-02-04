import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/api-utils'

/**
 * GET /api/product-groups
 * 获取商品分组列表（含商品数量）
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
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: groups.map(g => ({
        id: g.id,
        name: g.name,
        productCount: g._count.products,
        createdAt: g.createdAt.toISOString()
      }))
    })
  } catch (error) {
    console.error('Get product groups error:', error)
    return NextResponse.json(
      { success: false, error: '获取分组列表失败' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/product-groups
 * 创建商品分组
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

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { success: false, error: '分组名称不能为空' },
        { status: 400 }
      )
    }

    const groupName = name.trim()

    // 检查是否已存在（使用 unique 约束）
    const existing = await prisma.productGroup.findUnique({
      where: {
        name_userId: {
          name: groupName,
          userId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: '分组名称已存在' },
        { status: 400 }
      )
    }

    const group = await prisma.productGroup.create({
      data: {
        name: groupName,
        userId
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: group.id,
        name: group.name,
        productCount: 0,
        createdAt: group.createdAt.toISOString()
      }
    })
  } catch (error) {
    console.error('Create product group error:', error)
    return NextResponse.json(
      { success: false, error: '创建分组失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/product-groups
 * 删除商品分组
 */
export async function DELETE(request: Request) {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return NextResponse.json(
        { success: false, error: '请先登录' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少分组ID' },
        { status: 400 }
      )
    }

    const groupId = parseInt(id)

    // 查找分组
    const group = await prisma.productGroup.findUnique({
      where: { id: groupId }
    })

    if (!group) {
      return NextResponse.json(
        { success: false, error: '分组不存在' },
        { status: 404 }
      )
    }

    // 验证所有权
    if (group.userId !== userId) {
      return NextResponse.json(
        { success: false, error: '无权删除此分组' },
        { status: 403 }
      )
    }

    // 删除分组（级联删除 ProductToGroup 关联）
    await prisma.productGroup.delete({
      where: { id: groupId }
    })

    return NextResponse.json({
      success: true,
      data: { id: groupId }
    })
  } catch (error) {
    console.error('Delete product group error:', error)
    return NextResponse.json(
      { success: false, error: '删除分组失败' },
      { status: 500 }
    )
  }
}
