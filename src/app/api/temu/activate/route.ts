import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

// 用手机号自动注册账号（手机号 = 账号 = 密码）
export async function POST(request: Request) {
  try {
    const { phone, shopName } = await request.json()
    if (!phone) {
      return NextResponse.json({ error: '手机号不能为空' }, { status: 400 })
    }

    const existing = await prisma.user.findUnique({ where: { username: phone } })
    if (!existing) {
      const hashed = await bcrypt.hash(phone, 10)
      await prisma.user.create({
        data: {
          username: phone,
          password: hashed,
          name: shopName || phone,
          role: 'student',
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('temu activate error:', error)
    return NextResponse.json({ error: '激活失败' }, { status: 500 })
  }
}
