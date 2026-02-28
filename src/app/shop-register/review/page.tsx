'use client'

import { useEffect, useState } from 'react'
import { UserOutlined } from '@ant-design/icons'
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

          {/* 主卡片 */}
          <div className="flex-1">
            <div className="bg-white rounded-xl py-12 px-8" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

              {/* 插画：人物托腮 + 黄色时钟气泡 */}
              <div className="flex justify-center mb-8">
                <svg width="180" height="150" viewBox="0 0 180 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* 人物底部阴影 */}
                  <ellipse cx="82" cy="140" rx="38" ry="7" fill="#EEF2FF" />

                  {/* 身体（蓝色上衣） */}
                  <rect x="54" y="88" width="56" height="52" rx="12" fill="#3B82F6" />

                  {/* 领口 */}
                  <path d="M76 88 Q82 98 88 88" stroke="#2563EB" strokeWidth="2" fill="none" />

                  {/* 左臂 */}
                  <rect x="34" y="90" width="22" height="12" rx="6" fill="#3B82F6" />
                  {/* 左手（托腮） */}
                  <ellipse cx="34" cy="96" rx="8" ry="7" fill="#FBBF9A" />

                  {/* 右臂 */}
                  <rect x="108" y="90" width="20" height="12" rx="6" fill="#3B82F6" />
                  {/* 右手 */}
                  <ellipse cx="128" cy="96" rx="7" ry="6" fill="#FBBF9A" />

                  {/* 脖子 */}
                  <rect x="74" y="78" width="16" height="14" rx="4" fill="#FBBF9A" />

                  {/* 头 */}
                  <ellipse cx="82" cy="58" rx="26" ry="28" fill="#FBBF9A" />

                  {/* 头发（深色，遮住头顶） */}
                  <ellipse cx="82" cy="36" rx="24" ry="14" fill="#1F2937" />
                  <rect x="58" y="34" width="48" height="16" fill="#1F2937" />
                  {/* 刘海 */}
                  <path d="M58 42 Q65 52 72 46 Q78 42 82 50" stroke="#1F2937" strokeWidth="6" fill="none" strokeLinecap="round" />

                  {/* 眼镜框（左） */}
                  <rect x="64" y="54" width="14" height="10" rx="4" stroke="#1F2937" strokeWidth="2" fill="rgba(200,220,255,0.3)" />
                  {/* 眼镜框（右） */}
                  <rect x="85" y="54" width="14" height="10" rx="4" stroke="#1F2937" strokeWidth="2" fill="rgba(200,220,255,0.3)" />
                  {/* 眼镜鼻梁 */}
                  <line x1="78" y1="59" x2="85" y2="59" stroke="#1F2937" strokeWidth="2" />
                  {/* 眼镜腿 */}
                  <line x1="64" y1="59" x2="59" y2="61" stroke="#1F2937" strokeWidth="1.5" />
                  <line x1="99" y1="59" x2="104" y2="61" stroke="#1F2937" strokeWidth="1.5" />

                  {/* 眼睛 */}
                  <circle cx="71" cy="59" r="2.5" fill="#1F2937" />
                  <circle cx="92" cy="59" r="2.5" fill="#1F2937" />
                  {/* 眼神高光 */}
                  <circle cx="72.2" cy="58" r="0.8" fill="white" />
                  <circle cx="93.2" cy="58" r="0.8" fill="white" />

                  {/* 嘴（若有所思） */}
                  <path d="M76 70 Q82 72 88 70" stroke="#C0785A" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                  {/* 托腮的手放在下巴 */}
                  <ellipse cx="70" cy="75" rx="9" ry="6" fill="#FBBF9A" />

                  {/* 黄色时钟气泡（右上角） */}
                  <circle cx="130" cy="32" r="26" fill="#FBBF24" />
                  {/* 时钟外圈 */}
                  <circle cx="130" cy="32" r="16" stroke="white" strokeWidth="2.5" fill="none" />
                  {/* 时针 */}
                  <line x1="130" y1="32" x2="130" y2="20" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  {/* 分针 */}
                  <line x1="130" y1="32" x2="140" y2="36" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                  {/* 中心点 */}
                  <circle cx="130" cy="32" r="2" fill="white" />
                  {/* 气泡小尾巴 */}
                  <path d="M110 50 L104 58 L118 52 Z" fill="#FBBF24" />
                </svg>
              </div>

              {/* 标题 */}
              <h2 className="text-center text-2xl font-bold mb-2" style={{ color: approved ? '#52c41a' : '#1a1a2e' }}>
                {approved ? '审核通过' : '信息审核中'}
              </h2>
              <p className="text-center text-sm mb-10" style={{ color: '#8c8c8c' }}>
                {approved
                  ? '恭喜！您的企业信息已通过审核，可以开始运营。'
                  : '平台审核大约需要1-3个工作日，我们会向你的联系人邮箱发送邮件。'
                }
              </p>

              {/* 步骤列表 */}
              <div className="flex flex-col gap-0 mx-auto" style={{ maxWidth: 380 }}>

                {/* 步骤1：信息提交 */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div style={{
                      width: 12, height: 12, borderRadius: '50%',
                      backgroundColor: '#1677ff', marginTop: 3,
                    }} />
                    <div style={{ width: 2, height: 40, backgroundColor: '#d0e4ff', marginTop: 4 }} />
                  </div>
                  <div className="pb-2">
                    <div className="text-sm font-medium" style={{ color: '#1a1a2e' }}>信息提交</div>
                  </div>
                </div>

                {/* 步骤2：企业信息审核 */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div style={{
                      width: 12, height: 12, borderRadius: '50%',
                      backgroundColor: approved ? '#52c41a' : '#1677ff', marginTop: 3,
                    }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium" style={{ color: '#1a1a2e' }}>企业信息审核</span>
                      {!approved ? (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ backgroundColor: '#EEF4FF', color: '#1677ff' }}
                        >
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            backgroundColor: '#1677ff', display: 'inline-block', flexShrink: 0,
                          }} />
                          审核中
                        </span>
                      ) : (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ backgroundColor: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f' }}
                        >
                          <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            backgroundColor: '#52c41a', display: 'inline-block', flexShrink: 0,
                          }} />
                          审核通过
                        </span>
                      )}
                    </div>
                    {!approved && (
                      <div className="text-xs mt-1" style={{ color: '#8c8c8c' }}>
                        平台审核大约需要1到3个工作日，请耐心等待
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 审核通过后：进入工作台 */}
              {approved && (
                <div className="flex justify-center mt-10">
                  <Button
                    type="primary"
                    size="large"
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', minWidth: 160, height: 44, fontSize: 15 }}
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
