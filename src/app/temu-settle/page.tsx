'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { message } from 'antd'

function maskPhone(phone: string) {
  if (!phone || phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

const MAINLAND_TYPES = [
  { title: '个人店', desc: '无营业执照，想以个人身份开店' },
  { title: '个体工商户', desc: '有营业执照，想以个体工商户身份开店' },
  { title: '企业主体', desc: '有营业执照，想以企业为主体开店' },
]

const OVERSEAS_TYPES = [
  { title: '香港企业主体', desc: '有香港公司注册证和商业登记证，想以香港企业为主体开店' },
]

function SettlePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const phone = searchParams.get('phone') || ''

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', position: 'relative', overflow: 'hidden' }}>
      {/* 水印层 */}
      <div
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
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
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'white',
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: '#262626' }}>卖家中心</span>
        {phone && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 14,
            color: '#262626',
            cursor: 'pointer',
          }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#e8e8e8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              👤
            </div>
            <span>+86 {maskPhone(phone)}</span>
            <span style={{ fontSize: 10, color: '#8c8c8c' }}>▼</span>
          </div>
        )}
      </div>

      {/* 主体 */}
      <div style={{ position: 'relative', zIndex: 1, padding: '32px 40px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, color: '#262626', marginBottom: 24 }}>
          请继续完善入驻信息
        </h2>

        <div style={{ display: 'flex', gap: 24 }}>
          {/* 大陆主体入驻 */}
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <div style={{ width: 3, height: 16, backgroundColor: '#1677ff', borderRadius: 2 }} />
                <span style={{ fontWeight: 600, fontSize: 15, color: '#262626' }}>大陆主体入驻</span>
                <span style={{ fontSize: 12, color: '#8c8c8c' }}>针对大陆注册前的企业、个体工商户和个人入驻</span>
              </div>
              {MAINLAND_TYPES.map((item, i) => (
                <div
                  key={item.title}
                  style={{
                    padding: '18px 20px',
                    borderBottom: i < MAINLAND_TYPES.length - 1 ? '1px solid #f5f5f5' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, color: '#262626', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>{item.desc}</div>
                  </div>
                  <button
                    onClick={() => message.info('这是模拟环境，该功能暂未开放')}
                    style={{
                      padding: '6px 20px',
                      backgroundColor: '#1677ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 13,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    立即入驻
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 非大陆主体入驻 */}
          <div style={{ flex: 1 }}>
            <div style={{ backgroundColor: 'white', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <div style={{ width: 3, height: 16, backgroundColor: '#1677ff', borderRadius: 2 }} />
                <span style={{ fontWeight: 600, fontSize: 15, color: '#262626' }}>非大陆主体入驻</span>
                <span style={{ fontSize: 12, color: '#8c8c8c' }}>针对非大陆注册的企业入驻</span>
              </div>
              {OVERSEAS_TYPES.map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 15, color: '#262626', marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: '#8c8c8c' }}>{item.desc}</div>
                  </div>
                  <button
                    onClick={() => message.info('这是模拟环境，该功能暂未开放')}
                    style={{
                      padding: '6px 20px',
                      backgroundColor: '#1677ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      fontSize: 13,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    立即入驻
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TemuSettlePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }} />}>
      <SettlePage />
    </Suspense>
  )
}
