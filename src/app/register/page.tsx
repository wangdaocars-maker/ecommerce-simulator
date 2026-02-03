'use client'

import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined, IdcardOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  const onFinish = async (values: {
    username: string
    password: string
    name: string
    email?: string
  }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await response.json()

      if (!response.ok) {
        message.error(data.error || '注册失败')
        return
      }

      message.success('注册成功，请登录')
      router.push('/login')
    } catch (error) {
      message.error('注册失败，请稍后重试')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">注册账号</h1>
          <p className="text-gray-500 mt-2">创建您的学习账号</p>
        </div>

        <Form name="register" onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input
              prefix={<IdcardOutlined />}
              placeholder="真实姓名"
              autoComplete="name"
            />
          </Form.Item>

          <Form.Item name="email">
            <Input
              prefix={<MailOutlined />}
              type="email"
              placeholder="邮箱（可选）"
              autoComplete="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              autoComplete="new-password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              注册
            </Button>
          </Form.Item>

          <div className="text-center">
            <a href="/login" className="text-blue-500">
              已有账号？立即登录
            </a>
          </div>
        </Form>
      </Card>
    </div>
  )
}
