import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password, name, email } = body

    // 验证必填字段
    if (!username || !password || !name) {
      return NextResponse.json(
        { error: '用户名、密码和姓名不能为空' },
        { status: 400 }
      )
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '用户名已被注册' },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        role: 'student',
      },
    })

    return NextResponse.json(
      {
        message: '注册成功',
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('注册失败:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
}
