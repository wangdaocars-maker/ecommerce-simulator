import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Temu 模拟器演示用户（student1，id=3），无需登录
const TEMU_DEMO_USER_ID = 3

/**
 * GET /api/temu/media
 * Temu 媒体列表（无需登录，使用演示用户）
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder')
    const type = searchParams.get('type') as 'image' | 'video' | null
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const search = searchParams.get('search')

    const where: Record<string, unknown> = { userId: TEMU_DEMO_USER_ID }

    if (folder && folder !== '全部') where.folder = folder
    if (type) where.type = type
    if (search) where.filename = { contains: search }

    const total = await prisma.media.count({ where })
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
          folder: m.folder,
          createdAt: m.createdAt.toISOString()
        })),
        total,
        page,
        pageSize
      }
    })
  } catch (error) {
    console.error('Temu get media error:', error)
    return NextResponse.json({ success: false, error: '获取媒体列表失败' }, { status: 500 })
  }
}
