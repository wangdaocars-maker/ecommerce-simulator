'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserOutlined, CloseOutlined, PlusOutlined, QuestionCircleOutlined, CheckCircleFilled } from '@ant-design/icons'
import { Button } from 'antd'

// 成功状态：已缴纳
function PaidSuccess({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="flex flex-col items-center py-10">
      <CheckCircleFilled style={{ fontSize: 56, color: '#52c41a', marginBottom: 20 }} />
      <div className="font-bold mb-2" style={{ fontSize: 20, color: '#1a1a2e' }}>保证金缴纳成功！</div>
      <div className="mb-8" style={{ fontSize: 14, color: '#8c8c8c' }}>
        恭喜！CNH 10,000.00 保证金已缴纳，店铺即将激活。
      </div>
      <Button
        type="primary"
        size="large"
        style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', minWidth: 160, height: 44, fontSize: 15 }}
        onClick={onEnter}
      >
        进入商铺
      </Button>
    </div>
  )
}

export default function DepositPage() {
  const router = useRouter()
  // paid = true 表示绑定+缴纳已完成
  const [paid, setPaid] = useState(false)

  const handleBind = () => {
    // 一键完成：绑定支付宝 + 缴纳保证金
    setPaid(true)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F6FA' }}>

      {/* Header */}
      <div className="bg-white" style={{ borderBottom: '1px solid #e8e8e8' }}>
        <div className="flex items-center px-6" style={{ height: 52 }}>
          <div className="flex items-center gap-2 flex-shrink-0 mr-6">
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1677ff, #4096ff)' }}>
              <span className="text-white font-bold italic" style={{ fontSize: 16 }}>S</span>
            </div>
            <div>
              <div className="font-semibold leading-tight" style={{ fontSize: 13 }}>跨境卖家中心</div>
              <div className="text-gray-400 leading-tight" style={{ fontSize: 10 }}>Cross-border Seller Center</div>
            </div>
          </div>

          <div className="flex items-center border rounded"
            style={{ borderColor: '#e8e8e8', height: 32, overflow: 'hidden' }}>
            <div className="flex items-center gap-1.5 px-3 h-full"
              style={{ backgroundColor: '#f5f8ff', borderRight: '1px solid #e8e8e8' }}>
              <div className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FF4422', fontSize: 8, color: '#fff', fontWeight: 700 }}>AE</div>
              <span className="text-xs font-medium" style={{ color: '#1677ff' }}>AliExpress</span>
              <span className="text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#FFF7E6', color: '#FA8C16', border: '1px solid #FFD591', fontSize: 10 }}>
                开店中
              </span>
              <CloseOutlined style={{ fontSize: 10, color: '#bfbfbf', marginLeft: 2, cursor: 'pointer' }} />
            </div>
            <div className="flex items-center px-3 h-full text-xs text-gray-400 cursor-pointer hover:bg-gray-50"
              style={{ gap: 4 }}>
              <PlusOutlined style={{ fontSize: 10 }} />
            </div>
          </div>

          <span className="text-sm text-gray-600 ml-2">AliExpress Store</span>

          <div className="ml-auto w-8 h-8 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
            style={{ backgroundColor: '#ff4d4f' }}>
            <UserOutlined style={{ color: '#fff', fontSize: 14 }} />
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="px-6 py-6" style={{ maxWidth: 1080, margin: '0 auto' }}>

        <h1 className="font-bold mb-5" style={{ fontSize: 20, color: '#1a1a2e' }}>缴纳店铺保证金</h1>

        {/* 主卡片 + FAQ 并排 */}
        <div className="flex gap-4 items-start">

          {/* 主卡片 */}
          <div className="flex-1 bg-white rounded-xl" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '28px 36px' }}>

            {paid ? (
              <PaidSuccess onEnter={() => router.push('/login')} />
            ) : (
              <>
                {/* 店铺信息 */}
                <div className="mb-6">
                  <h2 className="font-semibold mb-4" style={{ fontSize: 15, color: '#1a1a2e' }}>店铺信息</h2>
                  <div className="flex gap-16">
                    <div>
                      <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>开店类型</div>
                      <span className="px-2 py-0.5 rounded text-sm font-medium"
                        style={{ backgroundColor: '#FFF7E6', color: '#FA8C16', border: '1px solid #FFD591' }}>
                        自运营店铺
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1" style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 8 }}>
                        经营类目
                        <QuestionCircleOutlined style={{ fontSize: 12, color: '#bfbfbf', cursor: 'pointer' }} />
                      </div>
                      <span style={{ fontSize: 14, color: '#262626' }}>母婴玩具</span>
                    </div>
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 24 }} />

                {/* 保证金信息 */}
                <div>
                  <h2 className="font-semibold mb-4" style={{ fontSize: 15, color: '#1a1a2e' }}>保证金信息</h2>

                  <div className="flex items-center gap-1 mb-2" style={{ fontSize: 13, color: '#8c8c8c' }}>
                    保证金标准
                    <QuestionCircleOutlined style={{ fontSize: 12, color: '#bfbfbf', cursor: 'pointer' }} />
                  </div>

                  <div className="font-bold mb-5" style={{ fontSize: 22, color: '#1a1a2e' }}>
                    CNH 10,000.00
                  </div>

                  <Button
                    type="primary"
                    style={{ backgroundColor: '#1677ff', minWidth: 140, height: 36 }}
                    onClick={handleBind}
                  >
                    绑定支付宝账号
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-xl p-5 flex-shrink-0"
            style={{ width: 180, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 className="font-semibold mb-3" style={{ fontSize: 14, color: '#1a1a2e' }}>FAQ</h3>
            <p className="text-sm cursor-pointer" style={{ color: '#1677ff' }}>· AE店铺激活常见问题</p>
          </div>
        </div>

        {/* 底部按钮（未缴纳时才显示） */}
        {!paid && (
          <div className="flex items-center justify-between mt-4"
            style={{ backgroundColor: '#fff', borderRadius: 12, padding: '12px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <Button size="large" style={{ minWidth: 72 }} onClick={() => router.back()}>返回</Button>
            <Button size="large" type="primary" disabled style={{ minWidth: 100 }}>
              缴纳保证金
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
