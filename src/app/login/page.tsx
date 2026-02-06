'use client'

import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/products'

  const onFinish = async (values: { username: string; password: string }) => {
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
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">速卖通商品管理系统</h1>
          <p className="text-gray-500 mt-2">请登录您的账号</p>
        </div>

        <Form name="login" onFinish={onFinish} size="large">
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
            <Button type="primary" htmlType="submit" className="w-full">
              登录
            </Button>
          </Form.Item>

          <Form.Item>
            <Button
              type="default"
              className="w-full"
              onClick={() => router.push('/shop-register')}
            >
              店铺注册模拟
            </Button>
          </Form.Item>

          <div className="text-center">
            <a href="/register" className="text-blue-500">
              还没有账号？立即注册
            </a>
          </div>
        </Form>

        <div className="mt-8 p-4 bg-gray-50 rounded text-sm text-gray-600">
          <p className="font-semibold mb-2">测试账号：</p>
          <p>学生: student1 / 123456</p>
          <p>教师: teacher / teacher123</p>
          <p>管理员: admin / admin123</p>
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
