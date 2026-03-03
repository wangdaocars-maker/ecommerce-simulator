'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function maskPhone(phone: string) {
  if (!phone || phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

function PendingPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const phone = searchParams.get('phone') || ''
  const [shopName, setShopName] = useState('')
  const [approved, setApproved] = useState(false)

  useEffect(() => {
    const name = sessionStorage.getItem('temuShopName') || ''
    setShopName(name)
    // 模拟5秒后审核通过
    const t = setTimeout(() => setApproved(true), 5000)
    return () => clearTimeout(t)
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
          {approved ? (
            /* 审核通过状态 */
            <>
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  backgroundColor: '#52c41a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto',
                }}>
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                    <path d="M9 22L19 32L35 14" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#262626', marginBottom: 12 }}>
                审核通过
              </div>
              <div style={{ fontSize: 14, color: '#595959', marginBottom: 32, lineHeight: 1.8 }}>
                您的入驻申请已审核通过，短信通知已发送至您的注册手机号，欢迎使用卖家中心！
              </div>
              {shopName && (
                <div style={{
                  backgroundColor: '#fafafa', borderRadius: 4,
                  padding: '12px 32px', marginBottom: 32,
                  display: 'inline-flex', alignItems: 'center', gap: 24,
                  fontSize: 14, color: '#595959',
                }}>
                  <span>店铺名称</span>
                  <span style={{ color: '#262626', fontWeight: 500 }}>{shopName}</span>
                </div>
              )}
              <div>
                <button
                  onClick={() => router.push(`/temu-site-main?phone=${encodeURIComponent(phone)}`)}
                  style={{
                    padding: '10px 40px', border: 'none', borderRadius: 4,
                    backgroundColor: '#1677ff', color: 'white',
                    fontSize: 15, fontWeight: 500, cursor: 'pointer',
                  }}
                >
                  进入履约中心
                </button>
              </div>
            </>
          ) : (
            /* 审核中状态 */
            <>
              <div style={{ marginBottom: 24 }}>
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="10" y="6" width="40" height="6" rx="2" fill="#1677ff" />
                  <rect x="10" y="48" width="40" height="6" rx="2" fill="#1677ff" />
                  <path d="M14 12 L30 30 L46 12" fill="#1677ff" opacity="0.2" />
                  <path d="M14 12 L30 30 L46 12" stroke="#1677ff" strokeWidth="2" fill="none" strokeLinejoin="round" />
                  <path d="M14 48 L24 38 M46 48 L36 38" stroke="#1677ff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="30" cy="38" r="5" fill="#1677ff" opacity="0.6" />
                </svg>
              </div>
              <div style={{ fontSize: 20, fontWeight: 600, color: '#262626', marginBottom: 16 }}>
                入驻信息审核中
              </div>
              <div style={{ fontSize: 14, color: '#595959', marginBottom: 32, lineHeight: 1.8 }}>
                预计{' '}
                <span style={{ color: '#fa8c16', fontWeight: 500 }}>3~5个工作日</span>
                {' '}审核完成，审核通过将发送短信至您的注册手机号，届时即可正常使用卖家中心，请耐心等待~
              </div>
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
            </>
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
