'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function maskPhone(phone: string) {
  if (!phone || phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

function PendingPage() {
  const searchParams = useSearchParams()
  const phone = searchParams.get('phone') || ''
  const [shopName, setShopName] = useState('')

  useEffect(() => {
    const name = sessionStorage.getItem('temuShopName') || ''
    setShopName(name)
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', position: 'relative' }}>
      {/* 水印层 */}
      <div
        aria-hidden
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
            `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='120'>
              <text x='10' y='60' font-size='11' fill='rgba(0,0,0,0.07)' font-family='Arial' transform='rotate(-20 110 60)'>www.kuajingmaihuo.com</text>
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
        <span style={{ fontSize: 18, fontWeight: 600, color: '#262626' }}>卖家中心</span>
        {phone && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#262626', cursor: 'pointer' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: '#e8e8e8',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>👤</div>
            <span>+86 {maskPhone(phone)}</span>
            <span style={{ fontSize: 10, color: '#8c8c8c' }}>▼</span>
          </div>
        )}
      </div>

      {/* 主体内容 */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 56px)',
        padding: '40px 20px',
      }}>
        <div style={{
          backgroundColor: 'white', borderRadius: 4,
          padding: '60px 80px', textAlign: 'center',
          maxWidth: 700, width: '100%',
        }}>
          {/* 沙漏图标 */}
          <div style={{ marginBottom: 24 }}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8h36v8c0 4-6 10-18 14C18 34 12 40 12 44v8h36v-8c0-4-6-10-18-14C18 26 12 20 12 16V8z"
                fill="#1677ff" opacity="0.15" />
              <path d="M12 8h36v8c0 4-6 10-18 14C18 34 12 40 12 44v8h36v-8c0-4-6-10-18-14C18 26 12 20 12 16V8z"
                stroke="#1677ff" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
              <path d="M12 8h36" stroke="#1677ff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M12 52h36" stroke="#1677ff" strokeWidth="2.5" strokeLinecap="round" />
              {/* 沙粒上半 */}
              <path d="M20 14 Q30 22 40 14" stroke="#1677ff" strokeWidth="1.5" fill="#1677ff" opacity="0.4" />
              {/* 沙粒下半（少量） */}
              <circle cx="30" cy="46" r="4" fill="#1677ff" opacity="0.5" />
              <circle cx="26" cy="49" r="2.5" fill="#1677ff" opacity="0.3" />
              <circle cx="34" cy="49" r="2.5" fill="#1677ff" opacity="0.3" />
            </svg>
          </div>

          {/* 标题 */}
          <div style={{ fontSize: 20, fontWeight: 600, color: '#262626', marginBottom: 16 }}>
            入驻信息审核中
          </div>

          {/* 说明文字 */}
          <div style={{ fontSize: 14, color: '#595959', marginBottom: 32, lineHeight: 1.8 }}>
            预计{' '}
            <span style={{ color: '#fa8c16', fontWeight: 500 }}>3~5个工作日</span>
            {' '}审核完成，审核通过将发送短信至您的注册手机号，届时即可正常使用卖家中心，请耐心等待~
          </div>

          {/* 店铺信息 */}
          {shopName && (
            <div style={{
              backgroundColor: '#fafafa', borderRadius: 4,
              padding: '12px 32px',
              display: 'inline-flex', alignItems: 'center', gap: 24,
              fontSize: 14, color: '#595959',
            }}>
              <span>店铺名称</span>
              <span style={{ color: '#262626', fontWeight: 500 }}>{shopName}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TemuPendingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }} />}>
      <PendingPage />
    </Suspense>
  )
}
