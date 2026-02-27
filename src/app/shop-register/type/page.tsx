'use client'

import { useState } from 'react'
import { Button, Select, message } from 'antd'
import { StarFilled } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const shopTypes = [
  {
    key: 'managed',
    title: '跨境全托管',
    desc: '全店托管，卖家专注产品备货，平台负责运营销售',
    features: [
      { title: '零佣金，快速付款', desc: '以供货价格结算后，优质供应商可获得更快的付款。' },
      { title: '更多流量机会', desc: '产品可以访问 Choice 和 Super Surge Days 等优质营销资源' },
      { title: '物流省心', desc: '卖家备货，平台负责物流和履约' },
      { title: '清晰的成长路径', desc: '全新阶梯式体系，优质供应商可享受流量、补贴、供应链等支持。' },
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
    steps: [
      { num: '01', title: '支付宝认证', tag: '大约 10 分钟', desc: '企业支付宝或法定代表人支付宝' },
      { num: '02', title: '提交材料', tag: '大约 30 分钟', desc: '上传营业执照、法律/受益人文件、类别/产品信息等' },
      { num: '03', title: '平台评价', tag: '1~3个工作日，90%商家约1个工...', desc: '平台审核企业信息、资金账户信息、经营信息' },
      { num: '04', title: '缴纳保证金', tag: '大约 10 分钟', desc: '绑定个人/公司支付宝账号缴纳，约1~3w人民币' },
      { num: '05', title: '店铺激活', tag: '', desc: '激活店铺，审核通过后即可开始运营。' },
    ],
  },
  {
    key: 'self',
    title: '卖家自运营',
    desc: '卖家自主经营店铺，自由定价和流量投放，多种物流履约方式',
    features: [
      { title: '灵活自主管理', desc: '卖家自主决定利润空间和履约方式，例如跨境直邮和准时交付（JIT）。' },
      { title: '清晰的成长路径', desc: '全新分层体系，优商享受免罚额度、供应链金融优惠' },
      { title: '平台特色项目', desc: '数十亿补贴助力品牌出海，多条专线物流通道。' },
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
    steps: [
      { num: '01', title: '账号认证', tag: '大约 10 分钟', desc: '个人或企业账号实名认证' },
      { num: '02', title: '提交材料', tag: '大约 30 分钟', desc: '上传营业执照、产品类别申请等资质文件' },
      { num: '03', title: '平台审核', tag: '1~3个工作日', desc: '平台审核企业资质、资金账户和经营信息' },
      { num: '04', title: '签署协议', tag: '大约 5 分钟', desc: '阅读并签署卖家服务协议及平台规则' },
      { num: '05', title: '店铺激活', tag: '', desc: '激活店铺，即可发布商品开始运营。' },
    ],
  },
  {
    key: 'local',
    title: '本地供货商店',
    desc: '卖家海外仓有备货，本地配送，平台负责运营销售',
    features: [
      { title: '营销托管', desc: '该平台负责连接营销、推广和广告，从而提高转化效率。' },
      { title: '客户服务外包', desc: '平台代卖家处理消费者咨询，降低客服成本投入' },
      { title: '本地发货', desc: '卖家自行本地发货，快速直达，消费者满意度高' },
      { title: '让销售变得简单', desc: '卖家以低成本增加新的销售渠道，以适应更多品类' },
    ],
    steps: [
      { num: '01', title: '实名认证', tag: '大约 10 分钟', desc: '提供本地企业或个人资质证明' },
      { num: '02', title: '提交材料', tag: '大约 30 分钟', desc: '营业执照、本地仓储证明、产品信息等' },
      { num: '03', title: '资质审核', tag: '2~5个工作日', desc: '平台审核本地仓储能力和运营资质' },
      { num: '04', title: '缴纳保证金', tag: '大约 10 分钟', desc: '根据经营类别缴纳相应金额的保证金' },
      { num: '05', title: '店铺激活', tag: '', desc: '完成仓储对接后，即可正式开始运营。' },
    ],
  },
]

export default function ShopRegisterTypePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ECEFFE' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
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
          {shopTypes.map((type) => {
            const isHovered = hoveredKey === type.key
            const isSelected = selected === type.key
            return (
              <div
                key={type.key}
                style={{ perspective: '1200px', height: 520 }}
                onMouseEnter={() => setHoveredKey(type.key)}
                onMouseLeave={() => setHoveredKey(null)}
                onClick={() => setSelected(type.key)}
              >
                {/* 翻转容器 */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: isHovered ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    cursor: 'pointer',
                  }}
                >
                  {/* 正面 */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      backgroundColor: '#fff',
                      borderRadius: 16,
                      padding: 28,
                      border: isSelected ? '2px solid #1677ff' : '2px solid transparent',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      overflow: 'hidden',
                    }}
                  >
                    <h2 className="text-lg font-semibold mb-1" style={{ color: '#1a1a2e' }}>
                      {type.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-5 pb-4" style={{ borderBottom: '1px dashed #e5e7eb', minHeight: '2.8rem' }}>
                      {type.desc}
                    </p>
                    <div className="flex flex-col gap-4">
                      {type.features.map((feature, i) => (
                        <div key={i} className="flex gap-2" style={{ alignItems: 'flex-start' }}>
                          <StarFilled style={{ color: '#1677ff', fontSize: 16, marginTop: 3, flexShrink: 0 }} />
                          <div>
                            <div className="text-sm font-medium text-gray-800">{feature.title}</div>
                            {feature.desc && (
                              <div className="text-xs text-gray-500 mt-0.5">{feature.desc}</div>
                            )}
                            {feature.logos && (
                              <div className="flex items-center gap-3 mt-2 flex-wrap">
                                {feature.logos.map((logo, j) => (
                                  <span key={j} className="text-xs font-semibold" style={{ color: logo.color }}>
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

                  {/* 背面 */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0, left: 0, right: 0, bottom: 0,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      backgroundColor: '#fff',
                      borderRadius: 16,
                      padding: 28,
                      border: isSelected ? '2px solid #1677ff' : '2px solid transparent',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <h2 className="text-lg font-semibold mb-1" style={{ color: '#1a1a2e' }}>
                      {type.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-5 pb-4" style={{ borderBottom: '1px dashed #e5e7eb' }}>
                      {type.desc}
                    </p>

                    <div className="flex flex-col gap-5 flex-1">
                      {type.steps.map((step, i) => (
                        <div key={i} className="flex gap-3">
                          {/* 左侧数字 + 竖线 */}
                          <div className="flex flex-col items-center" style={{ minWidth: 32 }}>
                            <span className="text-base font-bold" style={{ color: '#1677ff', lineHeight: 1 }}>
                              {step.num}
                            </span>
                            {i < type.steps.length - 1 && (
                              <div style={{ width: 1, flex: 1, backgroundColor: '#d0e4ff', marginTop: 4, minHeight: 16 }} />
                            )}
                          </div>
                          {/* 右侧内容 */}
                          <div style={{ paddingBottom: i < type.steps.length - 1 ? 0 : 0 }}>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
                                {step.title}
                              </span>
                              {step.tag && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded"
                                  style={{ backgroundColor: '#EEF4FF', color: '#1677ff', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}
                                >
                                  {step.tag}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">{step.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-3" style={{ borderTop: '1px solid #f0f0f0' }}>
                      <span className="text-sm" style={{ color: '#1677ff', cursor: 'pointer' }}>查看更多</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 底部白色区域 */}
        <div className="bg-white rounded-xl p-5 flex items-center justify-end" style={{ minHeight: 72 }}>
          <Button
            type="primary"
            size="large"
            style={{ backgroundColor: selected ? '#1677ff' : '#a0b4d6', minWidth: 100 }}
            onClick={() => {
              if (!selected) {
                message.warning('请先选择一种店铺开业类型')
                return
              }
              router.push('/shop-register/verify')
            }}
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
