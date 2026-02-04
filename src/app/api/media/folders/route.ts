import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/api-utils'

/**
 * GET /api/media/folders
 * 获取文件夹列表（含每个文件夹的文件数量）
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

    // 按文件夹分组统计
    const folderCounts = await prisma.media.groupBy({
      by: ['folder'],
      where: { userId },
      _count: { id: true }
    })

    const folders = folderCounts.map(f => ({
      name: f.folder,
      count: f._count.id
    }))

    // 确保"未分组"总是存在
    if (!folders.find(f => f.name === '未分组')) {
      folders.unshift({ name: '未分组', count: 0 })
    }

    // 按名称排序，但"未分组"放在最前面
    folders.sort((a, b) => {
      if (a.name === '未分组') return -1
      if (b.name === '未分组') return 1
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({
      success: true,
      data: { folders }
    })
  } catch (error) {
    console.error('Get folders error:', error)
    return NextResponse.json(
      { success: false, error: '获取文件夹列表失败' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/media/folders
 * 创建文件夹
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
        { success: false, error: '文件夹名称不能为空' },
        { status: 400 }
      )
    }

    const folderName = name.trim()

    // 检查是否已存在
    const existing = await prisma.media.findFirst({
      where: {
        userId,
        folder: folderName
      }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: '文件夹已存在' },
        { status: 400 }
      )
    }

    // 文件夹实际上是通过 media 记录的 folder 字段来体现的
    // 这里只是返回成功，不需要创建任何记录
    // 当用户上传文件到这个文件夹时，才会真正创建

    return NextResponse.json({
      success: true,
      data: {
        folder: {
          name: folderName,
          count: 0
        }
      }
    })
  } catch (error) {
    console.error('Create folder error:', error)
    return NextResponse.json(
      { success: false, error: '创建文件夹失败' },
      { status: 500 }
    )
  }
}
