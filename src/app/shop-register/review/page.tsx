'use client'

import { useEffect, useState } from 'react'
import { UserOutlined, CheckCircleFilled, LoadingOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useRouter } from 'next/navigation'

export default function ShopRegisterReviewPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  const [approved, setApproved] = useState(false)

  useEffect(() => {
    if (countdown <= 0) {
      setApproved(true)
      return
    }
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

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
            <div className="bg-white rounded-xl p-10" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

              {/* 插画 */}
              <div className="flex justify-center mb-6">
                <svg width="160" height="130" viewBox="0 0 160 130" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* 身体 */}
                  <ellipse cx="80" cy="110" rx="30" ry="12" fill="#E8F0FE" />
                  <rect x="60" y="75" width="40" height="40" rx="8" fill="#4A90D9" />
                  {/* 手臂 */}
                  <rect x="40" y="80" width="22" height="8" rx="4" fill="#4A90D9" />
                  <rect x="98" y="80" width="22" height="8" rx="4" fill="#4A90D9" />
                  {/* 手 */}
                  <circle cx="38" cy="84" r="6" fill="#FFDBB5" />
                  <circle cx="122" cy="84" r="6" fill="#FFDBB5" />
                  {/* 头 */}
                  <circle cx="80" cy="52" r="26" fill="#FFDBB5" />
                  {/* 头发 */}
                  <ellipse cx="80" cy="30" rx="20" ry="10" fill="#5C3D2E" />
                  <rect x="60" y="28" width="40" height="14" rx="4" fill="#5C3D2E" />
                  {/* 眼睛 */}
                  <circle cx="72" cy="52" r="3" fill="#333" />
                  <circle cx="88" cy="52" r="3" fill="#333" />
                  {/* 眉毛（思考） */}
                  <path d="M68 44 Q72 41 76 44" stroke="#5C3D2E" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M84 44 Q88 41 92 44" stroke="#5C3D2E" strokeWidth="2" strokeLinecap="round" fill="none" />
                  {/* 嘴 */}
                  <path d="M74 62 Q80 65 86 62" stroke="#C0785A" strokeWidth="2" strokeLinecap="round" fill="none" />
                  {/* 腿 */}
                  <rect x="66" y="112" width="10" height="16" rx="4" fill="#3A7BD5" />
                  <rect x="84" y="112" width="10" height="16" rx="4" fill="#3A7BD5" />
                  {/* 脚 */}
                  <ellipse cx="71" cy="128" rx="8" ry="4" fill="#333" />
                  <ellipse cx="89" cy="128" rx="8" ry="4" fill="#333" />
                  {/* 思考气泡 */}
                  <circle cx="108" cy="28" r="3" fill="#d0e4ff" />
                  <circle cx="116" cy="20" r="5" fill="#d0e4ff" />
                  <circle cx="126" cy="10" r="8" fill="#d0e4ff" />
                  <text x="122" y="14" fontSize="10" fill="#1677ff" textAnchor="middle">?</text>
                </svg>
              </div>

              {/* 标题 */}
              <h2 className="text-center text-2xl font-bold mb-2" style={{ color: approved ? '#52c41a' : '#1a1a2e' }}>
                {approved ? '审核通过' : '信息审核中'}
              </h2>
              <p className="text-center text-sm text-gray-500 mb-8">
                {approved
                  ? '恭喜！您的企业信息已通过审核，可以开始运营。'
                  : `平台审核大约需要1-3个工作日，我们会向你的联系人邮箱发送邮件。（模拟倒计时：${countdown}s）`
                }
              </p>

              {/* 步骤 */}
              <div className="flex flex-col gap-0 max-w-sm mx-auto">
                {/* 步骤1：信息提交 已完成 */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <CheckCircleFilled style={{ fontSize: 20, color: '#1677ff' }} />
                    <div style={{ width: 2, height: 36, backgroundColor: '#d0e4ff', marginTop: 2 }} />
                  </div>
                  <div className="pb-6">
                    <div className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>信息提交</div>
                    <div className="text-xs text-gray-400 mt-0.5">企业信息填写完成</div>
                  </div>
                </div>

                {/* 步骤2：企业信息审核 */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    {approved ? (
                      <CheckCircleFilled style={{ fontSize: 20, color: '#52c41a' }} />
                    ) : (
                      <div
                        style={{
                          width: 20, height: 20, borderRadius: '50%',
                          border: '2px solid #1677ff',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <LoadingOutlined style={{ fontSize: 12, color: '#1677ff' }} />
                      </div>
                    )}
                    <div style={{ width: 2, height: 36, backgroundColor: '#f0f0f0', marginTop: 2 }} />
                  </div>
                  <div className="pb-6">
                    <div className="text-sm font-semibold flex items-center gap-2">
                      <span style={{ color: approved ? '#52c41a' : '#1677ff' }}>
                        {approved ? '审核通过' : '审核中'}
                      </span>
                      {!approved && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: '#EEF4FF', color: '#1677ff' }}
                        >
                          企业信息审核
                        </span>
                      )}
                      {approved && (
                        <span
                          className="text-xs px-2 py-0.5 rounded"
                          style={{ backgroundColor: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f' }}
                        >
                          企业信息审核
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">平台审核企业信息、资金账户信息、经营信息</div>
                  </div>
                </div>

                {/* 步骤3：缴纳保证金 待开始 */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      style={{
                        width: 20, height: 20, borderRadius: '50%',
                        border: '2px solid #d9d9d9',
                        backgroundColor: '#fff',
                      }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-400">缴纳保证金</div>
                    <div className="text-xs text-gray-400 mt-0.5">绑定个人/公司支付宝账号缴纳</div>
                  </div>
                </div>
              </div>

              {/* 审核通过后：进入工作台按钮 */}
              {approved && (
                <div className="flex justify-center mt-8">
                  <Button
                    type="primary"
                    size="large"
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', minWidth: 160, height: 44 }}
                    onClick={() => router.push('/products')}
                  >
                    进入工作台
                  </Button>
                </div>
              )}
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
