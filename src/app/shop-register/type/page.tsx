'use client'

import { useState } from 'react'
import { Button, Select } from 'antd'
import { StarFilled } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const shopTypes = [
  {
    key: 'managed',
    title: '跨境全托管',
    desc: '全店托管，卖家专注产品备货，平台负责运营销售',
    features: [
      {
        title: '零佣金，快速付款',
        desc: '以供货价格结算后，优质供应商可获得更快的付款。',
      },
      {
        title: '更多流量机会',
        desc: '产品可以访问 Choice 和 Super Surge Days 等优质营销资源',
      },
      {
        title: '物流省心',
        desc: '卖家备货，平台负责物流和履约',
      },
      {
        title: '清晰的成长路径',
        desc: '全新阶梯式体系，优质供应商可享受流量、补贴、供应链等支持。',
      },
      {
        title: '多渠道全球售卖',
        logos: [
          { name: 'AliExpress', color: '#FF6A00' },
          { name: '❤ Lazada', color: '#EB2026' },
          { name: 'Daraz', color: '#EF6924' },
          { name: 'trendyol', color: '#F27A1A' },
          { name: 'Miravia', color: '#7B2FF7' },
        ],
      },
    ],
  },
  {
    key: 'self',
    title: '卖家自运营',
    desc: '卖家自主经营店铺，自由定价和流量投放，多种物流履约方式',
    features: [
      {
        title: '灵活自主管理',
        desc: '卖家自主决定利润空间和履约方式，例如跨境直邮和准时交付（JIT）。',
      },
      {
        title: '清晰的成长路径',
        desc: '全新分层体系，优商享受免罚额度、供应链金融优惠',
      },
      {
        title: '平台特色项目',
        desc: '数十亿补贴助力品牌出海，多条专线物流通道。',
      },
      {
        title: '多渠道全球售卖',
        desc: '多渠道注册后，产品销往全球近200个国家和地区。',
        logos: [
          { name: 'AliExpress', color: '#FF6A00' },
          { name: '❤ Lazada', color: '#EB2026' },
          { name: 'Daraz', color: '#EF6924' },
          { name: 'Miravia', color: '#7B2FF7' },
        ],
      },
    ],
  },
  {
    key: 'local',
    title: '本地供货商店',
    desc: '卖家海外仓有备货，本地配送，平台负责运营销售',
    features: [
      {
        title: '营销托管',
        desc: '该平台负责连接营销、推广和广告，从而提高转化效率。',
      },
      {
        title: '客户服务外包',
        desc: '平台代卖家处理消费者咨询，降低客服成本投入',
      },
      {
        title: '本地发货',
        desc: '卖家自行本地发货，快速直达，消费者满意度高',
      },
      {
        title: '让销售变得简单',
        desc: '卖家以低成本增加新的销售渠道，以适应更多品类',
      },
    ],
  },
]

export default function ShopRegisterTypePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ECEFFE' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* S 形 logo */}
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
          <Select
            defaultValue="zh"
            variant="borderless"
            style={{ width: 120 }}
            options={[
              { value: 'zh', label: '🌐 简体中文' },
              { value: 'en', label: '🌐 English' },
            ]}
          />
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-10" style={{ color: '#1a1a2e' }}>
          欢迎来到跨境卖家中心！请选择店铺开业类型
        </h1>

        {/* 三列卡片 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {shopTypes.map((type) => (
            <div
              key={type.key}
              onClick={() => setSelected(type.key)}
              className="bg-white rounded-2xl p-7 cursor-pointer transition-all"
              style={{
                border: selected === type.key ? '2px solid #1677ff' : '2px solid transparent',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
            >
              <h2 className="text-lg font-semibold mb-1" style={{ color: '#1a1a2e' }}>
                {type.title}
              </h2>
              <p className="text-sm text-gray-500 mb-5 pb-4" style={{ borderBottom: '1px dashed #e5e7eb' }}>
                {type.desc}
              </p>

              <div className="flex flex-col gap-4">
                {type.features.map((feature, i) => (
                  <div key={i} className="flex gap-2">
                    <StarFilled style={{ color: '#1677ff', fontSize: 16, marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div className="text-sm font-medium text-gray-800">{feature.title}</div>
                      {feature.desc && (
                        <div className="text-xs text-gray-500 mt-0.5">{feature.desc}</div>
                      )}
                      {feature.logos && (
                        <div className="flex items-center gap-3 mt-2 flex-wrap">
                          {feature.logos.map((logo, j) => (
                            <span
                              key={j}
                              className="text-xs font-semibold"
                              style={{ color: logo.color }}
                            >
                              {logo.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 底部白色区域 */}
        <div className="bg-white rounded-xl p-5 flex items-center justify-end" style={{ minHeight: 72 }}>
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: '#1677ff', minWidth: 100 }}
            onClick={() => router.push('/login')}
          >
            下一个
          </Button>
        </div>
      </div>

      {/* 右侧悬浮客服 */}
      <div
        className="fixed right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-white shadow-lg text-sm cursor-pointer"
        style={{ bottom: '40%', border: '1px solid #e5e7eb' }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
        <span className="text-gray-700">有问题找小何</span>
      </div>
    </div>
  )
}
