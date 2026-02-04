import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Category } from '@/types/category'

/**
 * 构建类目树形结构
 */
function buildCategoryTree(categories: Category[], parentId: number | null = null): Category[] {
  return categories
    .filter(cat => cat.parentId === parentId)
    .map(cat => ({
      ...cat,
      children: buildCategoryTree(categories, cat.id)
    }))
    .sort((a, b) => a.id - b.id)
}

/**
 * GET /api/categories
 * 获取类目树
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')

    const where = level ? { level: parseInt(level) } : {}

    const categories = await prisma.category.findMany({
      where,
      orderBy: [
        { level: 'asc' },
        { sortOrder: 'asc' },
        { id: 'asc' }
      ]
    })

    // 如果指定了 level，直接返回扁平列表
    if (level) {
      return NextResponse.json({
        success: true,
        data: categories
      })
    }

    // 否则返回树形结构
    const tree = buildCategoryTree(categories as Category[])

    return NextResponse.json({
      success: true,
      data: tree
    })
  } catch (error) {
    console.error('Get categories error:', error)
    return NextResponse.json(
      { success: false, error: '获取类目失败' },
      { status: 500 }
    )
  }
}
