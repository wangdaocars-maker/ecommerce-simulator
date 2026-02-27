'use client'

import { useState } from 'react'
import { CheckCircleFilled, InfoCircleFilled, CloseOutlined, UserOutlined } from '@ant-design/icons'
import { Input, Button, message } from 'antd'
import { useRouter } from 'next/navigation'

export default function ShopRegisterCompanyPage() {
  const router = useRouter()
  const [creditCode, setCreditCode] = useState('')
  const [noticeClosed, setNoticeClosed] = useState(false)

  const handleConfirm = () => {
    message.success('信息提交成功')
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F6FA' }}>
      {/* Header */}
      <div className="bg-white" style={{ borderBottom: '1px solid #e8e8e8' }}>
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1677ff, #4096ff)' }}
            >
              <span className="text-white text-lg font-bold italic">S</span>
            </div>
            <div>
              <div className="text-base font-semibold leading-tight">跨境卖家中心</div>
              <div className="text-xs text-gray-400 leading-tight">Cross-border Seller Center</div>
            </div>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
            style={{ backgroundColor: '#ff4d4f' }}
          >
            <UserOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-5 items-start">

          {/* 左侧主卡片 */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-8" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

              {/* 认证成功行 */}
              <div className="flex items-center gap-2 mb-4">
                <CheckCircleFilled style={{ color: '#52c41a', fontSize: 18 }} />
                <span className="text-sm text-gray-700">
                  企业支付宝认证成功，请核对并填写完整以下信息
                </span>
                <span
                  className="text-sm cursor-pointer ml-1"
                  style={{ color: '#1677ff' }}
                >
                  更换支付宝账号
                </span>
              </div>

              <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 20 }} />

              {/* 信息提示框 */}
              {!noticeClosed && (
                <div
                  className="flex items-start gap-3 rounded-lg p-4 mb-6 relative"
                  style={{ backgroundColor: '#EEF4FF', border: '1px solid #c0d8ff' }}
                >
                  <InfoCircleFilled style={{ color: '#1677ff', fontSize: 16, marginTop: 1, flexShrink: 0 }} />
                  <p className="text-sm" style={{ color: '#333', lineHeight: 1.7 }}>
                    为减少操作成本，已根据公开信息自动填写部分企业/法定代表人信息，请仔细核对并根据最新信息补充或修改。
                    <br />
                    新注册、近期修改信息营业执照入驻要求详见
                    <span className="cursor-pointer ml-1" style={{ color: '#1677ff' }}>企业认证指引</span>
                  </p>
                  <CloseOutlined
                    className="cursor-pointer absolute"
                    style={{ color: '#999', fontSize: 12, top: 12, right: 12 }}
                    onClick={() => setNoticeClosed(true)}
                  />
                </div>
              )}

              {/* 企业经营信息 */}
              <h2 className="text-xl font-bold mb-6" style={{ color: '#1a1a2e' }}>
                企业经营信息
              </h2>

              {/* 统一社会信用代码 */}
              <div>
                <label className="text-sm font-medium mb-2 block" style={{ color: '#1a1a2e' }}>
                  <span style={{ color: '#ff4d4f' }}>* </span>企业统一社会信用代码
                </label>
                <div className="flex gap-3" style={{ maxWidth: 480 }}>
                  <Input
                    size="large"
                    placeholder="请输入"
                    value={creditCode}
                    onChange={(e) => setCreditCode(e.target.value)}
                  />
                  <Button
                    size="large"
                    style={{ minWidth: 72, borderColor: '#1677ff', color: '#1677ff' }}
                    onClick={handleConfirm}
                  >
                    确认
                  </Button>
                </div>
              </div>

            </div>
          </div>

          {/* 右侧 FAQ */}
          <div
            className="bg-white rounded-xl p-5 flex-shrink-0"
            style={{ width: 200, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <h3 className="text-base font-semibold mb-3" style={{ color: '#1a1a2e' }}>FAQ</h3>
            <p className="text-sm" style={{ color: '#1677ff', cursor: 'pointer' }}>· 入驻常见问题</p>
          </div>
        </div>
      </div>

      {/* 右侧悬浮收起按钮 */}
      <div
        className="fixed right-0 flex items-center justify-center cursor-pointer"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          width: 20,
          height: 60,
          backgroundColor: '#d9d9d9',
          borderRadius: '4px 0 0 4px',
          color: '#666',
          fontSize: 12,
        }}
      >
        ‹
      </div>
    </div>
  )
}
