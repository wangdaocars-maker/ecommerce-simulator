'use client'

import { useState } from 'react'
import { Form, Input, Button, Select, Checkbox, message } from 'antd'
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

export default function ShopRegisterPage() {
  const router = useRouter()
  const [form] = Form.useForm()
  const [emailCode, setEmailCode] = useState('')
  const [phoneCode, setPhoneCode] = useState('')
  const [emailCountdown, setEmailCountdown] = useState(0)
  const [phoneCountdown, setPhoneCountdown] = useState(0)

  const sendEmailCode = () => {
    const email = form.getFieldValue('email')
    if (!email) {
      message.error('请输入邮箱')
      return
    }
    message.success('验证码已发送至邮箱')
    setEmailCountdown(60)
    const timer = setInterval(() => {
      setEmailCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const sendPhoneCode = () => {
    const phone = form.getFieldValue('phone')
    if (!phone) {
      message.error('请输入手机号')
      return
    }
    message.success('验证码已发送至手机')
    setPhoneCountdown(60)
    const timer = setInterval(() => {
      setPhoneCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const onFinish = (values: any) => {
    console.log('注册信息:', values)
    message.success('这是模拟环境，注册演示完成')
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E8EAF6' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white text-xl font-bold">A</span>
            </div>
            <span className="text-lg font-medium">跨境卖家中心</span>
          </div>
          <div className="flex items-center gap-4">
            <Select
              defaultValue="zh"
              variant="borderless"
              style={{ width: 100 }}
              options={[
                { value: 'zh', label: '简体中文' },
                { value: 'en', label: 'English' },
              ]}
            />
            <Button type="primary" onClick={() => router.push('/login')}>
              去登录
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">
          欢迎入驻跨境卖家中心
        </h1>

        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 relative">
            {/* 新店扶持标签 */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg transform rotate-12">
              新店扶持
            </div>

            <h2 className="text-xl font-semibold mb-6">填写注册信息</h2>

            <Form form={form} onFinish={onFinish} layout="vertical">
              {/* 国家/地区 */}
              <Form.Item
                label={
                  <span>
                    <span className="text-red-500">*</span> 公司注册地所在国家/地区
                  </span>
                }
                name="country"
                initialValue="CN"
              >
                <Select
                  size="large"
                  options={[
                    { value: 'CN', label: '🇨🇳 中国大陆' },
                    { value: 'HK', label: '🇭🇰 中国香港' },
                    { value: 'US', label: '🇺🇸 美国' },
                  ]}
                />
              </Form.Item>
              <div className="text-gray-500 text-xs -mt-4 mb-4">
                账号注册后国家/地区不可更改，请慎填慎选
              </div>

              {/* 邮箱 */}
              <Form.Item
                label={
                  <span>
                    <span className="text-red-500">*</span> 邮箱
                  </span>
                }
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入正确的邮箱格式' },
                ]}
              >
                <Input size="large" placeholder="请输入邮箱" />
              </Form.Item>

              <Form.Item
                name="emailCode"
                rules={[{ required: true, message: '请输入邮箱验证码' }]}
              >
                <div className="flex gap-2">
                  <Input
                    size="large"
                    placeholder="请输入邮箱验证码"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                  />
                  <Button
                    size="large"
                    onClick={sendEmailCode}
                    disabled={emailCountdown > 0}
                    style={{ minWidth: 100 }}
                  >
                    {emailCountdown > 0 ? `${emailCountdown}s` : '发送'}
                  </Button>
                </div>
              </Form.Item>

              {/* 密码 */}
              <Form.Item
                label={
                  <span>
                    <span className="text-red-500">*</span> 设置账号密码
                  </span>
                }
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/,
                    message: '密码需为8-20位数字、字母、特殊符号，至少3种不同类型字符组合',
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="请输入密码"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
              <div className="text-gray-500 text-xs -mt-4 mb-4">
                密码需为8-20位数字、字母、特殊符号，至少3种不同类型字符组合
              </div>

              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请再次输入密码' },
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
                  size="large"
                  placeholder="请再次输入密码"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              {/* 手机号 */}
              <Form.Item
                label={
                  <span>
                    <span className="text-red-500">*</span> 绑定手机号
                  </span>
                }
              >
                <div className="flex gap-2">
                  <Select
                    defaultValue="+86"
                    size="large"
                    style={{ width: 100 }}
                    options={[
                      { value: '+86', label: '🇨🇳 +86' },
                      { value: '+1', label: '🇺🇸 +1' },
                      { value: '+852', label: '🇭🇰 +852' },
                    ]}
                  />
                  <Form.Item
                    name="phone"
                    rules={[
                      { required: true, message: '请输入手机号' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
                    ]}
                    noStyle
                  >
                    <Input size="large" placeholder="请输入手机号" />
                  </Form.Item>
                </div>
              </Form.Item>

              <Form.Item
                name="phoneCode"
                rules={[{ required: true, message: '请输入短信验证码' }]}
              >
                <div className="flex gap-2">
                  <Input
                    size="large"
                    placeholder="请输入短信验证码"
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value)}
                  />
                  <Button
                    size="large"
                    onClick={sendPhoneCode}
                    disabled={phoneCountdown > 0}
                    style={{ minWidth: 100 }}
                  >
                    {phoneCountdown > 0 ? `${phoneCountdown}s` : '发送'}
                  </Button>
                </div>
              </Form.Item>

              {/* 协议 */}
              <Form.Item
                name="agreement1"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error('请阅读并同意服务协议')),
                  },
                ]}
              >
                <Checkbox>
                  <span className="text-xs">
                    我已阅读并同意{' '}
                    <a href="#" className="text-blue-500">
                      《跨境商家宣统一平台服务协议》
                    </a>
                  </span>
                </Checkbox>
              </Form.Item>

              <Form.Item
                name="agreement2"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error('请阅读并同意传输同意函')),
                  },
                ]}
              >
                <Checkbox>
                  <span className="text-xs">
                    我已阅读并同意{' '}
                    <a href="#" className="text-blue-500">
                      《中国卖家个人信息跨境传输同意函》
                    </a>
                  </span>
                </Checkbox>
              </Form.Item>

              {/* 注册按钮 */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full"
                  style={{ backgroundColor: '#1677ff', height: 48 }}
                >
                  注册
                </Button>
              </Form.Item>
            </Form>
          </div>

          <div className="text-center mt-6 text-gray-600">
            <a href="/login" className="text-blue-500 hover:underline">
              返回登录
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
