'use client'

import { UserOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button } from 'antd'

// 宇航员 SVG 插图
function AstronautIllustration() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 身体阴影 */}
      <ellipse cx="55" cy="100" rx="28" ry="7" fill="#C8DFF5" opacity="0.5" />
      {/* 宇航服身体 */}
      <ellipse cx="55" cy="80" rx="26" ry="22" fill="#C5DCF2" />
      {/* 身体高光 */}
      <ellipse cx="48" cy="72" rx="8" ry="10" fill="#D9ECFF" opacity="0.6" />
      {/* 腰部装备带 */}
      <rect x="32" y="80" width="46" height="7" rx="3.5" fill="#A8CBE8" />
      {/* 中央模块 */}
      <rect x="47" y="81" width="16" height="5" rx="2.5" fill="#7BADD4" />
      <circle cx="55" cy="83.5" r="2.5" fill="#5A90C0" />
      {/* 左手臂 */}
      <ellipse cx="28" cy="75" rx="9" ry="6" fill="#C5DCF2" transform="rotate(-20 28 75)" />
      <ellipse cx="22" cy="80" rx="6" ry="5" fill="#BDD5EF" />
      {/* 右手臂 */}
      <ellipse cx="82" cy="75" rx="9" ry="6" fill="#C5DCF2" transform="rotate(20 82 75)" />
      <ellipse cx="88" cy="80" rx="6" ry="5" fill="#BDD5EF" />
      {/* 头盔外圈（暗色） */}
      <circle cx="55" cy="42" r="27" fill="#B8D4ED" />
      {/* 头盔主体（浅蓝白） */}
      <circle cx="55" cy="42" r="24" fill="url(#helmetGrad)" />
      {/* 头盔玻璃面罩区域 */}
      <ellipse cx="55" cy="44" rx="16" ry="17" fill="#A0C8E8" opacity="0.55" />
      {/* 玻璃反光1（大） */}
      <ellipse cx="47" cy="34" rx="7" ry="5" fill="white" opacity="0.45" transform="rotate(-25 47 34)" />
      {/* 玻璃反光2（小） */}
      <ellipse cx="60" cy="30" rx="3" ry="2" fill="white" opacity="0.3" />
      {/* 头盔边缘连接圈 */}
      <circle cx="55" cy="42" r="24" stroke="#A0C4E0" strokeWidth="1.5" fill="none" />
      {/* 肩膀连接 */}
      <ellipse cx="55" cy="64" rx="18" ry="5" fill="#B8D4ED" />

      <defs>
        <radialGradient id="helmetGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#EAF4FF" />
          <stop offset="60%" stopColor="#C0DCEF" />
          <stop offset="100%" stopColor="#9EC0DB" />
        </radialGradient>
      </defs>
    </svg>
  )
}

// 平台图标 SVG（简化版 logo）
function PlatformIcon({ type }: { type: 'ae' | 'lazada' | 'daraz' | 'miravia' }) {
  const configs = {
    ae: { bg: '#FF4422', text: 'AE', textColor: '#fff' },
    lazada: { bg: '#F57C00', text: 'L', textColor: '#fff' },
    daraz: { bg: '#E91E1E', text: 'D', textColor: '#fff' },
    miravia: { bg: '#7C3AED', text: 'M', textColor: '#fff' },
  }
  const c = configs[type]
  return (
    <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: c.bg, fontSize: 9, color: c.textColor, fontWeight: 700 }}>
      {c.text}
    </div>
  )
}

const PLATFORMS = [
  { type: 'ae' as const, name: 'AliExpress Store' },
  { type: 'lazada' as const, name: 'Lazada Store' },
  { type: 'daraz' as const, name: 'Daraz Store' },
  { type: 'miravia' as const, name: 'Miravia Store' },
]

const STEPS = [
  {
    title: '第一步：填写资金账户UBO信息',
    desc: '请提供持股比例超过25%的股东信息，和相关资金账户信息',
  },
  {
    title: '第二步：选择店铺主要售卖类目',
    desc: '请选择店铺主要售卖类目，审核通过后，需缴纳售卖类目对应的保证金',
  },
  {
    title: '第三步：经营信息填报',
    desc: '请完整填写企业基础信息内容，便于平台对您的企业资质进行审核',
  },
  {
    title: '第四步：缴纳店铺保证金',
    desc: '根据选择的主要售卖类目缴纳店铺保证金，即刻激活店铺',
  },
]

export default function ShopActivatePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F5FF' }}>

      {/* Header */}
      <div className="bg-white" style={{ borderBottom: '1px solid #e8e8e8' }}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 py-2 flex-shrink-0">
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1677ff, #4096ff)' }}>
              <span className="text-white font-bold italic" style={{ fontSize: 16 }}>S</span>
            </div>
            <div>
              <div className="font-semibold leading-tight" style={{ fontSize: 13 }}>跨境卖家中心</div>
              <div className="text-gray-400 leading-tight" style={{ fontSize: 10 }}>Cross-border Seller Center</div>
            </div>
          </div>

          {/* 平台标签页 */}
          <div className="flex items-stretch h-full flex-1 mx-6">
            {PLATFORMS.map((p, i) => (
              <div
                key={p.type}
                className="flex items-center gap-2 px-5 cursor-pointer relative"
                style={{
                  borderBottom: i === 0 ? '2px solid #1677ff' : '2px solid transparent',
                  paddingTop: 14,
                  paddingBottom: 14,
                }}
              >
                <PlatformIcon type={p.type} />
                <span className="text-sm" style={{ color: i === 0 ? '#1677ff' : '#595959' }}>
                  {p.name}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: '#FFF7E6',
                    color: '#FA8C16',
                    border: '1px solid #FFD591',
                    fontSize: 10,
                    lineHeight: 1.4,
                  }}
                >
                  待激活
                </span>
              </div>
            ))}
          </div>

          {/* 头像 */}
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer"
            style={{ backgroundColor: '#ff4d4f' }}>
            <UserOutlined style={{ color: '#fff', fontSize: 14 }} />
          </div>
        </div>
      </div>

      {/* 主内容区（蓝色渐变背景） */}
      <div style={{
        background: 'linear-gradient(180deg, #C8DEFF 0%, #DCEEFF 30%, #EDF4FF 65%, #F0F5FF 100%)',
        minHeight: 'calc(100vh - 53px)',
        paddingTop: 32,
        paddingBottom: 60,
      }}>
        <div className="mx-auto px-6" style={{ maxWidth: 780 }}>

          {/* 标题栏 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {/* 地图钉图标 */}
              <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
                <path d="M10 0C4.477 0 0 4.477 0 10c0 7.5 10 14 10 14S20 17.5 20 10C20 4.477 15.523 0 10 0z" fill="#FF4422" />
                <circle cx="10" cy="10" r="4" fill="white" />
              </svg>
              <h1 className="font-bold" style={{ fontSize: 20, color: '#1a1a2e' }}>
                距离成功激活AliExpress店铺，仅剩{' '}
                <span style={{ color: '#1677ff' }}>4</span>{' '}步！
              </h1>
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: '#8c8c8c' }}>
              <span className="flex items-center gap-1 cursor-pointer" style={{ color: '#595959' }}>
                <QuestionCircleOutlined style={{ fontSize: 14 }} />
                AE店铺激活常见问题
              </span>
              <span style={{ color: '#d9d9d9' }}>|</span>
              <span className="cursor-pointer" style={{ color: '#595959' }}>暂不激活</span>
            </div>
          </div>

          {/* 步骤卡片 */}
          <div className="flex flex-col gap-3">

            {/* 第一步：激活当前步骤 */}
            <div className="bg-white rounded-xl p-7 relative overflow-hidden"
              style={{ boxShadow: '0 4px 16px rgba(22,119,255,0.14)' }}>
              <div className="flex items-start justify-between">
                <div style={{ flex: 1 }}>
                  <h3 className="font-semibold mb-2" style={{ fontSize: 16, color: '#1a1a2e' }}>
                    {STEPS[0].title}
                  </h3>
                  <p className="mb-5" style={{ fontSize: 13, color: '#8c8c8c', lineHeight: 1.6 }}>
                    {STEPS[0].desc}
                  </p>
                  <Button
                    type="primary"
                    style={{ backgroundColor: '#1677ff', minWidth: 88, height: 34, fontSize: 13 }}
                  >
                    去填写
                  </Button>
                </div>
                {/* 宇航员插图 */}
                <div className="flex-shrink-0 ml-4 self-center">
                  <AstronautIllustration />
                </div>
              </div>
            </div>

            {/* 第二、三、四步：禁用 */}
            {STEPS.slice(1).map((step, i) => (
              <div
                key={i}
                className="bg-white rounded-xl px-7 py-5"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
              >
                <h3 className="font-semibold mb-1" style={{ fontSize: 15, color: '#bfbfbf' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: '#d9d9d9', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  )
}
