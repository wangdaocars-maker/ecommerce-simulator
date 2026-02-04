import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/categories/path?id=xxx
 * 获取类目路径（从根到指定类目的完整路径）
 * 用于详情页刷新恢复类目选择状态
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少类目ID参数' },
        { status: 400 }
      )
    }

    const categoryId = parseInt(id)
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { success: false, error: '无效的类目ID' },
        { status: 400 }
      )
    }

    // 递归向上查找父类目，构建路径
    const path: Array<{ id: number; name: string; level: number }> = []
    let currentId: number | null = categoryId

    while (currentId !== null) {
      const category: { id: number; name: string; level: number; parentId: number | null } | null = await prisma.category.findUnique({
        where: { id: currentId },
        select: { id: true, name: true, level: true, parentId: true }
      })

      if (!category) {
        break
      }

      // 插入到路径开头（因为是从子类目向上查找）
      path.unshift({
        id: category.id,
        name: category.name,
        level: category.level
      })

      currentId = category.parentId
    }

    if (path.length === 0) {
      return NextResponse.json(
        { success: false, error: '类目不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { path }
    })
  } catch (error) {
    console.error('Get category path error:', error)
    return NextResponse.json(
      { success: false, error: '获取类目路径失败' },
      { status: 500 }
    )
  }
}
