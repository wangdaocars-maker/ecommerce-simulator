import { NextRequest, NextResponse } from 'next/server'
import { readFile, access } from 'fs/promises'
import path from 'path'
import { auth } from '@/lib/auth'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  // 验证登录状态
  const session = await auth()
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const segments = (await params).path
  // 防止路径穿越攻击
  if (segments.some(s => s.includes('..') || s.includes('\0'))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // 路径格式为 /{userId}/{filename}，验证访问者只能访问自己的文件
  // teacher/admin 可访问所有用户文件
  const fileOwnerIdStr = segments[0]
  const currentUserId = String(parseInt(session.user.id))
  const role = (session.user as { role?: string }).role
  if (role === 'student' && fileOwnerIdStr !== currentUserId) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const filePath = path.join(process.cwd(), 'public', 'uploads', ...segments)

  try {
    await access(filePath)
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }

  const ext = path.extname(filePath).toLowerCase()
  const contentType = MIME_TYPES[ext] || 'application/octet-stream'

  const buffer = await readFile(filePath)
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
