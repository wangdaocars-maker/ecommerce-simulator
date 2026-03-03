'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Steps, Checkbox, Button, message } from 'antd'
import { QRCodeSVG } from 'qrcode.react'

type QrStatus = 'waiting' | 'scanned' | 'verified'

function maskPhone(phone: string) {
  if (!phone || phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

const VERIFY_STEPS = [
  '开始认证',
  '选择证件注册国和证件类型',
  '选择验证方式',
  '证件拍照&人脸识别',
  '完成认证',
]

function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const phone = searchParams.get('phone') || ''
  const name = searchParams.get('name') || '法定代表人'

  const [agreed, setAgreed] = useState(false)
  const [qrKey, setQrKey] = useState('simulate')
  const [qrStatus, setQrStatus] = useState<QrStatus>('waiting')

  const qrValue = `https://verify.example.com/auth?token=${qrKey}&phone=${phone}`

  // 模拟自动扫码流程：8s 后变为已扫码，再 5s 后认证成功
  useEffect(() => {
    const t1 = setTimeout(() => setQrStatus('scanned'), 8000)
    const t2 = setTimeout(() => setQrStatus('verified'), 13000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [qrKey])

  const handleRefresh = () => {
    setQrKey(`r_${Date.now()}`)
    setQrStatus('waiting')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValue).then(() => {
      message.success('链接已复制')
    }).catch(() => {
      message.success('链接已复制')
    })
  }

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

      {/* 步骤条 */}
      <div style={{
        position: 'relative', zIndex: 1,
        padding: '20px 40px', backgroundColor: 'white', borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Steps current={1} items={[
            { title: '填写主体信息', status: 'finish' },
            { title: '主体实名验证', status: 'process' },
          ]} />
        </div>
      </div>

      {/* 主体内容 */}
      <div style={{ position: 'relative', zIndex: 1, padding: '24px 60px', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

          {/* 左侧主内容 */}
          <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 4, padding: '48px 32px', textAlign: 'center' }}>

            {/* 状态2：认证成功 */}
            {qrStatus === 'verified' ? (
              <>
                <div style={{ marginBottom: 32 }}>
                  {/* 绿色大对号 */}
                  <div style={{
                    width: 100, height: 100, borderRadius: '50%',
                    backgroundColor: '#52c41a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px',
                  }}>
                    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                      <path d="M12 28L24 40L44 18" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#262626', marginBottom: 8 }}>
                    法定代表人实名认证成功
                  </div>
                  <div style={{ fontSize: 13, color: '#8c8c8c' }}>
                    认证已完成，请勾选协议后点击"入驻成功，下一步"继续
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* 标题 */}
                <div style={{ fontSize: 16, color: '#262626', marginBottom: 8, lineHeight: 1.8 }}>
                  请让 法定代表人
                  <span style={{
                    color: '#fa8c16', fontWeight: 600, margin: '0 4px',
                    border: '1px solid #fa8c16', borderRadius: 2, padding: '0 6px',
                  }}>
                    {name}
                  </span>
                  微信扫描下方二维码，并在20分钟内完成实名认证
                </div>
                <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 32 }}>
                  若对方不在身边，请手动截图或复制链接发送给对方
                </div>

                {/* 二维码区域（状态0：正常；状态1：遮罩） */}
                <div style={{
                  display: 'inline-block',
                  padding: 12,
                  border: '1px solid #e8e8e8',
                  borderRadius: 4,
                  marginBottom: 16,
                  position: 'relative',
                  cursor: qrStatus === 'scanned' ? 'pointer' : 'default',
                }}>
                  <QRCodeSVG
                    value={qrValue}
                    size={220}
                    level="M"
                    imageSettings={{
                      src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzRjYWYzZiIgZD0iTTAgMGg0OHY0OEgweiIvPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNMTcuNSAxMmM0LjggMCA4LjUgMy41IDguNSA4UzIyLjMgMjggMTcuNSAyOCAxMCAyNC41IDEwIDIwczMuNy04IDcuNS04em0xNSAxMGM0LjEgMCA3LjUgMyA3LjUgNi41UzM2LjYgMzUgMzIuNSAzNSAyNSAzMiAyNSAyOC41IDI4LjQgMjIgMzIuNSAyMnoiLz48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTE0IDI5aDdsMi41IDUgMy41LTEwIDMgNWg2Ii8+PC9zdmc+',
                      height: 40,
                      width: 40,
                      excavate: true,
                    }}
                  />

                  {/* 状态1遮罩：已扫码待认证 */}
                  {qrStatus === 'scanned' && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      borderRadius: 4,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      gap: 8,
                    }}>
                      {/* 时钟图标 */}
                      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                        <circle cx="18" cy="18" r="16" stroke="white" strokeWidth="2.5" />
                        <path d="M18 10V18L23 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span style={{ color: 'white', fontSize: 14, fontWeight: 500 }}>已扫码，待认证</span>
                      <a
                        onClick={handleRefresh}
                        style={{ color: '#4096ff', fontSize: 13, cursor: 'pointer', marginTop: 4 }}
                      >
                        点击刷新
                      </a>
                    </div>
                  )}
                </div>

                {/* 刷新链接（状态0显示） */}
                {qrStatus === 'waiting' && (
                  <div style={{ marginBottom: 20 }}>
                    <a
                      onClick={handleRefresh}
                      style={{ color: '#1677ff', fontSize: 14, cursor: 'pointer' }}
                    >
                      刷新二维码
                    </a>
                  </div>
                )}

                {/* 状态1时刷新链接占位 */}
                {qrStatus === 'scanned' && <div style={{ marginBottom: 20, height: 22 }} />}

                {/* 复制按钮 */}
                <Button
                  type="primary"
                  size="large"
                  onClick={handleCopyLink}
                  disabled={qrStatus === 'scanned'}
                  style={{
                    minWidth: 240,
                    backgroundColor: qrStatus === 'scanned' ? undefined : '#1677ff',
                  }}
                >
                  复制实名认证链接
                </Button>
              </>
            )}
          </div>

          {/* 右侧说明栏 */}
          <div style={{ width: 280, flexShrink: 0, position: 'sticky', top: 20, alignSelf: 'flex-start' }}>
            <div style={{ backgroundColor: 'white', borderRadius: 4, padding: 20 }}>
              <h3 style={{
                fontSize: 15, fontWeight: 600, color: '#262626',
                marginTop: 0, marginBottom: 16,
                borderLeft: '3px solid #1677ff', paddingLeft: 8,
              }}>
                实名认证
              </h3>
              <div style={{ fontSize: 13, color: '#595959', marginBottom: 16 }}>认证流程</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {VERIFY_STEPS.map((step) => (
                  <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      backgroundColor: '#1677ff', flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 13, color: '#262626' }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 底部协议 + 按钮 */}
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10,
          backgroundColor: 'white', borderTop: '1px solid #f0f0f0',
          padding: '12px 40px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Checkbox checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            <span style={{ color: '#595959' }}>我已阅读并同意</span>
            <a href="#" style={{ color: '#1677ff' }}>《一站式仓储综合服务协议》</a>
            <span style={{ color: '#595959' }}>、</span>
            <a href="#" style={{ color: '#1677ff' }}>《履约增值服务协议》</a>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button onClick={() => router.back()} style={{ minWidth: 100 }}>上一步</Button>
            <Button
              type="primary"
              disabled={!agreed || qrStatus !== 'verified'}
              onClick={() => router.push(`/temu-shop?phone=${encodeURIComponent(phone)}`)}
              style={{ minWidth: 140 }}
            >
              入驻成功，下一步
            </Button>
          </div>
        </div>

        {/* 底部按钮占位，防止内容被遮挡 */}
        <div style={{ height: 100 }} />
      </div>
    </div>
  )
}

export default function TemuVerifyPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }} />}>
      <VerifyPage />
    </Suspense>
  )
}
