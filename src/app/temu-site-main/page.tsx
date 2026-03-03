'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'

function maskPhone(phone: string) {
  if (!phone || phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

const REGIONS = [
  {
    key: 'global',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <circle cx="26" cy="26" r="22" fill="#FF6B4A" opacity="0.15" />
        <circle cx="26" cy="26" r="18" fill="#FF6B4A" opacity="0.25" />
        <circle cx="26" cy="26" r="13" fill="#FF8C6B" />
        <ellipse cx="26" cy="26" rx="6" ry="13" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M13 26 Q26 20 39 26" stroke="white" strokeWidth="1.5" fill="none" />
        <path d="M13 26 Q26 32 39 26" stroke="white" strokeWidth="1.5" fill="none" />
        <circle cx="26" cy="26" r="13" stroke="white" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    title: '全球',
    subtitle: '除欧区、美国',
  },
  {
    key: 'us',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path d="M26 46 C26 46 12 34 12 24 C12 16.3 18.3 10 26 10 C33.7 10 40 16.3 40 24 C40 34 26 46 26 46Z"
          fill="#FF4444" stroke="#CC3333" strokeWidth="1" />
        <circle cx="26" cy="24" r="9" fill="white" />
        <rect x="17" y="21" width="18" height="2" fill="#B22234" />
        <rect x="17" y="25" width="18" height="2" fill="#B22234" />
        <rect x="17" y="17" width="9" height="8" fill="#3C3B6E" />
        <circle cx="19.5" cy="19.5" r="1" fill="white" />
        <circle cx="22.5" cy="19.5" r="1" fill="white" />
        <circle cx="21" cy="22" r="1" fill="white" />
        <text x="26" y="27" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#3C3B6E">US</text>
      </svg>
    ),
    title: '美国',
    subtitle: '',
  },
  {
    key: 'eu',
    icon: (
      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
        <path d="M26 46 C26 46 12 34 12 24 C12 16.3 18.3 10 26 10 C33.7 10 40 16.3 40 24 C40 34 26 46 26 46Z"
          fill="#FF4444" stroke="#CC3333" strokeWidth="1" />
        <circle cx="26" cy="24" r="9" fill="#003399" />
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
          const r = 6
          const rad = (deg - 90) * Math.PI / 180
          const x = 26 + r * Math.cos(rad)
          const y = 24 + r * Math.sin(rad)
          return <circle key={i} cx={x} cy={y} r="1" fill="#FFDD00" />
        })}
        <text x="26" y="27" textAnchor="middle" fontSize="6" fontWeight="bold" fill="white">EUR</text>
      </svg>
    ),
    title: '欧区',
    subtitle: '',
  },
]

function SiteMainPage() {
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const [shopName, setShopName] = useState('')
  const [authorized, setAuthorized] = useState(true)
  const [entering, setEntering] = useState(false)

  useEffect(() => {
    const name = sessionStorage.getItem('temuShopName') || 'My Store'
    setShopName(name)
  }, [])

  const handleEnter = async () => {
    if (entering) return
    setEntering(true)
    try {
      // 用手机号自动注册账号（手机号=账号=密码）
      await fetch('/api/temu/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, shopName }),
      })
      // 登录并跳转商品列表
      await signIn('credentials', { username: phone, password: phone, callbackUrl: '/temu/products' })
    } catch {
      setEntering(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', position: 'relative' }}>
      {/* 水印层 */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='120'>
              <text x='10' y='60' font-size='11' fill='rgba(0,0,0,0.06)' font-family='Arial' transform='rotate(-20 110 60)'>www.kuajingmaihuo.com</text>
            </svg>`
          )}")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Header */}
      <div style={{
        position: 'relative', zIndex: 1,
        backgroundColor: 'white', padding: '0 32px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>履约中心</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {['账户管理', '规则中心', '卖家课堂', '消息中心', '官方客服'].map(item => (
            <span key={item} style={{ fontSize: 13, color: '#595959', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {item}
            </span>
          ))}
          {phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#262626', cursor: 'pointer' }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%', background: '#e8e8e8',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>👤</div>
              <span>+86 {maskPhone(phone)}</span>
              <span style={{ fontSize: 10, color: '#8c8c8c' }}>▼</span>
            </div>
          )}
        </div>
      </div>

      {/* 主体 */}
      <div style={{ position: 'relative', zIndex: 1, padding: '48px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>

          {/* 左侧内容 */}
          <div style={{ flex: 1 }}>
            {/* 标题 */}
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', marginBottom: 16 }}>
              Seller Central
            </div>

            {/* 店铺名 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', backgroundColor: '#4096ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span style={{ fontSize: 15, color: '#262626', fontWeight: 500 }}>{shopName}</span>
              <span style={{ fontSize: 13, color: '#1677ff', cursor: 'pointer' }}>切换</span>
            </div>

            {/* 授权 checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, fontSize: 13, color: '#595959' }}>
              <div
                onClick={() => setAuthorized(v => !v)}
                style={{
                  width: 16, height: 16, borderRadius: 2, flexShrink: 0,
                  backgroundColor: authorized ? '#1677ff' : 'white',
                  border: authorized ? '1px solid #1677ff' : '1px solid #d9d9d9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                {authorized && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span>
                您授权"卖家中心"与Seller Central共享您的账号ID和店铺名称，并已阅读并同意{' '}
                <span style={{ color: '#1677ff', cursor: 'pointer' }}>隐私政策</span>
              </span>
            </div>

            {/* 三个区域卡片 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
              {REGIONS.map(region => (
                <div key={region.key} style={{
                  backgroundColor: 'white', borderRadius: 8,
                  border: '1px solid #e8e8e8',
                  padding: '28px 20px 24px',
                  textAlign: 'center',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ marginBottom: 12 }}>{region.icon}</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#262626', marginBottom: 4 }}>
                    {region.title}
                  </div>
                  {region.subtitle && (
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 16 }}>
                      {region.subtitle}
                    </div>
                  )}
                  {!region.subtitle && <div style={{ height: 20, marginBottom: 0 }} />}
                  <button
                    onClick={handleEnter}
                    disabled={entering}
                    style={{
                      width: '100%', padding: '8px 0',
                      backgroundColor: entering ? '#69b1ff' : '#1677ff', color: 'white',
                      border: 'none', borderRadius: 4,
                      fontSize: 14, fontWeight: 500, cursor: entering ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                    }}
                  >
                    {entering ? '登录中...' : <>{`进入 `}<span style={{ fontSize: 12 }}>›</span></>}
                  </button>
                </div>
              ))}
            </div>

            {/* 商家中心链接 */}
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 13, color: '#1677ff', cursor: 'pointer' }}>商家中心</span>
            </div>
          </div>

          {/* 右侧插图 */}
          <div style={{ width: 280, flexShrink: 0, paddingTop: 20 }}>
            <svg width="280" height="220" viewBox="0 0 280 220" fill="none">
              {/* 平台底座 */}
              <ellipse cx="140" cy="180" rx="100" ry="20" fill="#e8eaf0" />
              {/* 主屏幕 */}
              <rect x="60" y="60" width="160" height="110" rx="8" fill="#f5f6fa" stroke="#d9dce8" strokeWidth="2" />
              <rect x="66" y="66" width="148" height="98" rx="6" fill="white" />
              {/* 屏幕内容线条 */}
              <rect x="76" y="76" width="80" height="8" rx="4" fill="#e8eaf0" />
              <rect x="76" y="90" width="128" height="6" rx="3" fill="#f0f2f5" />
              <rect x="76" y="102" width="100" height="6" rx="3" fill="#f0f2f5" />
              <rect x="76" y="114" width="120" height="6" rx="3" fill="#f0f2f5" />
              <rect x="76" y="130" width="60" height="20" rx="4" fill="#1677ff" opacity="0.8" />
              {/* 支架 */}
              <rect x="128" y="170" width="24" height="12" rx="2" fill="#d9dce8" />
              {/* 底座 */}
              <rect x="100" y="178" width="80" height="8" rx="4" fill="#c8cad8" />
              {/* 装饰小点 */}
              <circle cx="220" cy="50" r="8" fill="#4096ff" opacity="0.3" />
              <circle cx="240" cy="70" r="5" fill="#4096ff" opacity="0.2" />
              <circle cx="50" cy="100" r="6" fill="#fa8c16" opacity="0.2" />
              <circle cx="35" cy="80" r="4" fill="#52c41a" opacity="0.2" />
            </svg>
          </div>

        </div>
      </div>
    </div>
  )
}

export default function TemuSiteMainPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }} />}>
      <SiteMainPage />
    </Suspense>
  )
}
