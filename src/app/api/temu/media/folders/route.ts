import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const TEMU_DEMO_USER_ID = 3

/**
 * GET /api/temu/media/folders
 * Temu 文件夹列表（无需登录，使用演示用户）
 */
export async function GET() {
  try {
    const folderCounts = await prisma.media.groupBy({
      by: ['folder'],
      where: { userId: TEMU_DEMO_USER_ID },
      _count: { id: true }
    })

    const folders = folderCounts.map(f => ({
      name: f.folder,
      count: f._count.id
    }))

    if (!folders.find(f => f.name === '未分组')) {
      folders.unshift({ name: '未分组', count: 0 })
    }

    folders.sort((a, b) => {
      if (a.name === '未分组') return -1
      if (b.name === '未分组') return 1
      return a.name.localeCompare(b.name)
    })

    return NextResponse.json({ success: true, data: { folders } })
  } catch (error) {
    console.error('Temu get folders error:', error)
    return NextResponse.json({ success: false, error: '获取文件夹列表失败' }, { status: 500 })
  }
}
