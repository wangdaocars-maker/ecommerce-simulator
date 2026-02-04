import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/api-utils'

// 使用 Node runtime（非 edge）
export const runtime = 'nodejs'

// 允许的文件类型
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']

// 文件大小限制
const MAX_IMAGE_SIZE = 5 * 1024 * 1024  // 5MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024 // 100MB

/**
 * 生成随机字符串
 */
function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * POST /api/media/upload
 * 统一上传接口（图片和视频共用）
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

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || '未分组'
    const duration = formData.get('duration') as string | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: '请选择文件' },
        { status: 400 }
      )
    }

    const mimeType = file.type
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType)
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType)

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { success: false, error: '不支持的文件类型' },
        { status: 400 }
      )
    }

    // 检查文件大小
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / 1024 / 1024
      return NextResponse.json(
        { success: false, error: `文件大小不能超过 ${maxSizeMB}MB` },
        { status: 400 }
      )
    }

    // 生成文件名和路径
    const ext = file.name.split('.').pop() || (isImage ? 'jpg' : 'mp4')
    const timestamp = Date.now()
    const randomStr = generateRandomString(8)
    const filename = `${timestamp}_${randomStr}.${ext}`

    // 存储目录：public/uploads/{userId}/
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', String(userId))
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, filename)
    const url = `/uploads/${userId}/${filename}`

    // 写入文件
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // 获取图片尺寸（简化处理，实际项目可使用 sharp 等库）
    let width: number | undefined
    let height: number | undefined

    // 创建媒体记录
    const media = await prisma.media.create({
      data: {
        userId,
        filename: file.name,
        path: filePath,
        url,
        type: isImage ? 'image' : 'video',
        size: file.size,
        width,
        height,
        duration: duration ? parseInt(duration) : undefined,
        folder
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: media.id,
        url: media.url,
        type: media.type,
        filename: media.filename,
        size: media.size,
        width: media.width,
        height: media.height,
        duration: media.duration
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: '上传失败' },
      { status: 500 }
    )
  }
}
