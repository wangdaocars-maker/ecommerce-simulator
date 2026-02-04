import { NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/api-utils'

/**
 * GET /api/media
 * 获取媒体列表
 * 支持 folder, type, page, pageSize, search, startDate, endDate
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
    const folder = searchParams.get('folder')
    const type = searchParams.get('type') as 'image' | 'video' | null
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const search = searchParams.get('search')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // 构建查询条件
    const where: Record<string, unknown> = {
      userId
    }

    if (folder && folder !== '全部') {
      where.folder = folder
    }

    if (type) {
      where.type = type
    }

    if (search) {
      where.filename = {
        contains: search
      }
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) {
        (where.createdAt as Record<string, Date>).gte = new Date(startDate)
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        ;(where.createdAt as Record<string, Date>).lte = end
      }
    }

    // 查询总数
    const total = await prisma.media.count({ where })

    // 查询列表
    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    return NextResponse.json({
      success: true,
      data: {
        items: media.map(m => ({
          id: m.id,
          filename: m.filename,
          url: m.url,
          type: m.type,
          size: m.size,
          width: m.width,
          height: m.height,
          duration: m.duration,
          folder: m.folder,
          createdAt: m.createdAt.toISOString()
        })),
        total,
        page,
        pageSize
      }
    })
  } catch (error) {
    console.error('Get media error:', error)
    return NextResponse.json(
      { success: false, error: '获取媒体列表失败' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/media
 * 删除媒体文件
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
        { success: false, error: '缺少媒体ID' },
        { status: 400 }
      )
    }

    // 查找媒体记录
    const media = await prisma.media.findUnique({
      where: { id: parseInt(id) }
    })

    if (!media) {
      return NextResponse.json(
        { success: false, error: '媒体不存在' },
        { status: 404 }
      )
    }

    // 验证所有权
    if (media.userId !== userId) {
      return NextResponse.json(
        { success: false, error: '无权删除此媒体' },
        { status: 403 }
      )
    }

    // 删除文件
    try {
      await unlink(media.path)
    } catch {
      // 文件可能已不存在，忽略错误
    }

    // 删除数据库记录
    await prisma.media.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({
      success: true,
      data: { id: parseInt(id) }
    })
  } catch (error) {
    console.error('Delete media error:', error)
    return NextResponse.json(
      { success: false, error: '删除媒体失败' },
      { status: 500 }
    )
  }
}
