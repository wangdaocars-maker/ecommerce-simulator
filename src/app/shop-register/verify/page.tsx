'use client'

import { BankOutlined, FileTextOutlined, UserOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'
import { message } from 'antd'

export default function ShopRegisterVerifyPage() {
  const router = useRouter()

  const handleVerify = () => {
    message.success('认证成功')
    setTimeout(() => {
      router.push('/shop-register/company')
    }, 1000)
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
          {/* 右上角头像 */}
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
          <div className="flex-1 flex flex-col gap-4">
            {/* 认证卡片 */}
            <div className="bg-white rounded-xl p-8" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <h2 className="text-center text-xl font-semibold mb-6" style={{ color: '#1a1a2e' }}>
                企业信息支付宝认证一键认证
              </h2>

              {/* 内层卡片 */}
              <div className="rounded-lg p-6" style={{ border: '1px solid #e5e7eb', backgroundColor: '#fafbff' }}>
                {/* 红色提示 */}
                <p className="text-sm mb-6" style={{ color: '#ff4d4f' }}>
                  <span className="font-semibold">* </span>
                  填写企业信息前，请先认证企业支付宝账号，并准备以下材料
                </p>

                {/* 三个图标 */}
                <div className="flex justify-center gap-16 mb-8">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#EEF4FF', border: '1px solid #d0e4ff' }}
                    >
                      <BankOutlined style={{ fontSize: 22, color: '#1677ff' }} />
                    </div>
                    <span className="text-xs text-gray-500">企业注册地址</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#EEF4FF', border: '1px solid #d0e4ff' }}
                    >
                      <FileTextOutlined style={{ fontSize: 22, color: '#1677ff' }} />
                    </div>
                    <span className="text-xs text-gray-500">营业执照复印件</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: '#EEF4FF', border: '1px solid #d0e4ff' }}
                    >
                      <UserOutlined style={{ fontSize: 22, color: '#1677ff' }} />
                    </div>
                    <span className="text-xs text-gray-500">法人证件</span>
                  </div>
                </div>

                {/* 两个按钮 */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleVerify}
                    className="text-white text-sm font-medium px-6 py-2 rounded"
                    style={{ backgroundColor: '#1677ff', border: 'none', cursor: 'pointer', height: 36 }}
                  >
                    认证企业支付宝
                  </button>
                  <span className="text-gray-400 text-sm">或</span>
                  <button
                    onClick={handleVerify}
                    className="text-white text-sm font-medium px-6 py-2 rounded"
                    style={{ backgroundColor: '#1677ff', border: 'none', cursor: 'pointer', height: 36 }}
                  >
                    认证企业法人支付宝
                  </button>
                </div>
              </div>
            </div>

            {/* 温馨提示 */}
            <div className="bg-white rounded-xl p-6" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-medium">温馨提示：</span>
                <br />
                您可以选择【认证企业支付宝】或【认证企业法人支付宝】；
                <br />
                如您选择【认证企业支付宝】，入驻成功后激活Lazada店铺时可支持开通Lazada钱包，可关联"连连支付""支付宝""万里汇"或者"派安盈"账户以实现结算收款。
              </p>
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
