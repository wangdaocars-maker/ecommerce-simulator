import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

const TEMU_DEMO_USER_ID = 3

async function getSharp() {
  const sharp = await import('sharp')
  return sharp.default
}

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * POST /api/temu/media/upload
 * Temu 图片上传（无需登录，使用演示用户 student1）
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || '未分组'

    if (!file) {
      return NextResponse.json({ success: false, error: '请选择文件' }, { status: 400 })
    }

    const mimeType = file.type
    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return NextResponse.json({ success: false, error: '仅支持 JPG、PNG、WebP、GIF 格式' }, { status: 400 })
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ success: false, error: '图片大小不能超过 5MB' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', String(TEMU_DEMO_USER_ID))
    await mkdir(uploadDir, { recursive: true })

    const bytes = await file.arrayBuffer()
    let buffer: Buffer = Buffer.from(bytes)
    let compressedSize = buffer.length
    let width: number | undefined
    let height: number | undefined

    try {
      const sharpInstance = await getSharp()
      const compressed = await sharpInstance(buffer)
        .resize(1280, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer()
      const metadata = await sharpInstance(compressed).metadata()
      width = metadata.width
      height = metadata.height
      buffer = Buffer.from(compressed)
      compressedSize = compressed.length
    } catch (err) {
      console.error('Image compression failed:', err)
    }

    const timestamp = Date.now()
    const randomStr = generateRandomString(8)
    const finalFilename = `${timestamp}_${randomStr}.webp`
    const filePath = path.join(uploadDir, finalFilename)
    const url = `/uploads/${TEMU_DEMO_USER_ID}/${finalFilename}`

    await writeFile(filePath, buffer)

    const media = await prisma.media.create({
      data: {
        userId: TEMU_DEMO_USER_ID,
        filename: file.name,
        path: filePath,
        url,
        type: 'image',
        size: compressedSize,
        width,
        height,
        folder
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: media.id,
        url: media.url,
        filename: media.filename,
        size: media.size,
        width: media.width,
        height: media.height
      }
    })
  } catch (error) {
    console.error('Temu upload error:', error)
    return NextResponse.json({ success: false, error: '上传失败' }, { status: 500 })
  }
}
