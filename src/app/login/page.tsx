'use client'

import { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

type Platform = 'aliexpress' | 'temu'

const platforms: Record<Platform, { name: string; title: string; color: string; textColor: string }> = {
  aliexpress: {
    name: 'AliExpress 速卖通',
    title: '速卖通商品管理系统',
    color: '#FF6A00',
    textColor: '#FF6A00',
  },
  temu: {
    name: 'Temu',
    title: 'Temu 商品管理系统',
    color: '#1A1A1A',
    textColor: '#1A1A1A',
  },
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawCallbackUrl = searchParams.get('callbackUrl') || ''
  const [loading, setLoading] = useState(false)
  const [platform, setPlatform] = useState<Platform>('aliexpress')

  const current = platforms[platform]

  const callbackUrl = rawCallbackUrl || (platform === 'temu' ? '/temu/products' : '/products')

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false,
      })

      if (result?.error) {
        message.error('用户名或密码错误')
      } else {
        message.success('登录成功')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (error) {
      message.error('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md" styles={{ body: { padding: 0 } }}>
        {/* 平台切换 Tab */}
        <div className="flex border-b border-gray-200">
          {(Object.entries(platforms) as [Platform, typeof platforms.aliexpress][]).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setPlatform(key)}
              style={{
                color: platform === key ? p.color : '#8c8c8c',
                borderBottom: platform === key ? `2px solid ${p.color}` : '2px solid transparent',
              }}
              className="flex-1 py-4 text-sm font-semibold transition-colors hover:text-gray-700 bg-transparent border-0 cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="p-8">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold" style={{ color: current.textColor }}>
              {current.title}
            </h1>
            <p className="text-gray-500 mt-2">
              请登录您的账号
            </p>
          </div>

          {/* 登录表单（速卖通 / Temu 共用，样式按平台区分） */}
          <Form name={`login-${platform}`} onFinish={onFinish} size="large">
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="用户名"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                className="w-full"
                loading={loading}
                size="large"
                style={{
                  backgroundColor: current.color,
                  borderColor: current.color,
                  color: '#fff',
                }}
              >
                登录
              </Button>
            </Form.Item>

            {platform === 'aliexpress' && (
              <Form.Item>
                <Button
                  type="default"
                  className="w-full"
                  size="large"
                  onClick={() => router.push('/shop-register')}
                >
                  店铺注册模拟
                </Button>
              </Form.Item>
            )}

            {platform === 'temu' && (
              <Form.Item>
                <Button
                  type="default"
                  className="w-full"
                  size="large"
                  onClick={() => router.push('/temu/register')}
                >
                  店铺注册模拟
                </Button>
              </Form.Item>
            )}

            <div className="text-center">
              <a href="/register" style={{ color: current.color }}>
                还没有账号？立即注册
              </a>
            </div>
          </Form>

          <div className="mt-6 p-4 bg-gray-50 rounded text-sm text-gray-600">
            <p className="font-semibold mb-2">测试账号：</p>
            <p>学员: student1 / 123456</p>
            <p>讲师: teacher / teacher123</p>
            <p>管理员: admin / admin123</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LoginForm />
    </Suspense>
  )
}
