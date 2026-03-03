'use client'

import { useState } from 'react'
import { Input, Button, Select, Checkbox, message } from 'antd'
import { useRouter } from 'next/navigation'

export default function TemuRegisterPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [code, setCode] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [loading, setLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')

  const sendCode = () => {
    if (!phone) {
      setPhoneError('请输入手机号码')
      return
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setPhoneError('请输入正确的手机号码')
      return
    }
    setPhoneError('')
    const generated = String(Math.floor(100000 + Math.random() * 900000))
    setCode(generated)
    message.success('验证码已发送')
    setCountdown(60)
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleRegister = async () => {
    if (!phone) { setPhoneError('请输入手机号码'); return }
    if (!/^1[3-9]\d{9}$/.test(phone)) { setPhoneError('请输入正确的手机号码'); return }
    setPhoneError('')
    if (!password) { message.error('请设置密码'); return }
    if (!code) { message.error('请输入验证码'); return }
    if (!agreed) { message.error('请阅读并同意协议'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: phone,
          password,
          name: `Temu卖家_${phone.slice(-4)}`,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        message.error(data.error || '注册失败')
        return
      }
      message.success('注册成功！')
      setTimeout(() => router.push(`/temu-settle?phone=${encodeURIComponent(phone)}`), 1500)
    } catch {
      message.error('注册失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #1a2a8f 0%, #2035c8 40%, #1e50d8 70%, #1a6fd4 100%)' }}>
      {/* Header */}
      <div className="bg-white" style={{ padding: '14px 32px' }}>
        <span style={{ fontSize: 18, fontWeight: 600, color: '#262626' }}>卖家中心</span>
      </div>

      {/* Main */}
      <div className="flex flex-1 items-center" style={{ padding: '0 10%' }}>
        {/* 左侧品牌区 */}
        <div className="flex-1 relative" style={{ minHeight: 380 }}>
          {/* 圆形标签 */}
          <div className="absolute" style={{ top: 40, left: '18%' }}>
            <FeatureTag icon="⚡" label="高效店铺工具" />
          </div>
          <div className="absolute" style={{ top: 30, right: '12%' }}>
            <FeatureTag icon="🎓" label="海量资源位" />
          </div>
          <div className="absolute" style={{ bottom: 60, left: '8%' }}>
            <FeatureTag icon="0" label="0元开店" circle />
          </div>
          <div className="absolute" style={{ bottom: 40, right: '18%' }}>
            <FeatureTag icon="✅" label="流量红利期" />
          </div>

          {/* 大标题 */}
          <div className="flex items-center justify-center h-full">
            <h1 style={{
              fontSize: 64,
              fontWeight: 800,
              color: 'white',
              textShadow: '0 2px 16px rgba(0,0,0,0.3)',
              letterSpacing: 4,
              marginTop: 60,
            }}>
              卖家中心
            </h1>
          </div>
        </div>

        {/* 右侧注册卡片 */}
        <div style={{
          width: 340,
          backgroundColor: 'white',
          borderRadius: 8,
          padding: '28px 28px 24px',
          flexShrink: 0,
        }}>
          <h2 style={{ textAlign: 'center', fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#262626' }}>
            0元开店
          </h2>

          {/* 手机号错误提示 */}
          {phoneError && (
            <div style={{
              background: '#fff1f0',
              border: '1px solid #ffa39e',
              borderRadius: 4,
              padding: '6px 12px',
              marginBottom: 12,
              color: '#ff4d4f',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span>●</span> {phoneError}
            </div>
          )}

          {/* 手机号输入 */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d9d9d9', borderRadius: 4, marginBottom: 12, overflow: 'hidden' }}>
            <span style={{ padding: '0 8px', color: '#8c8c8c', fontSize: 16 }}>👤</span>
            <Select
              defaultValue="+86"
              variant="borderless"
              style={{ width: 80 }}
              options={[
                { value: '+86', label: '+86' },
                { value: '+852', label: '+852' },
                { value: '+1', label: '+1' },
              ]}
            />
            <input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={e => { setPhone(e.target.value); setPhoneError('') }}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                padding: '8px 8px 8px 4px',
                fontSize: 14,
                color: '#262626',
              }}
            />
          </div>

          {/* 密码输入 */}
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d9d9d9', borderRadius: 4, marginBottom: 12, overflow: 'hidden' }}>
            <span style={{ padding: '0 10px', color: '#8c8c8c', fontSize: 16 }}>🔒</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="设置密码"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                padding: '8px 4px',
                fontSize: 14,
                color: '#262626',
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ background: 'none', border: 'none', padding: '0 10px', cursor: 'pointer', color: '#8c8c8c' }}
            >
              {showPassword ? '👁' : '🙈'}
            </button>
          </div>

          {/* 验证码输入 */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }}>
              <span style={{ padding: '0 10px', color: '#8c8c8c', fontSize: 16 }}>🛡</span>
              <input
                type="text"
                placeholder="请输入6位验证码"
                value={code}
                onChange={e => setCode(e.target.value)}
                maxLength={6}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  padding: '8px 4px',
                  fontSize: 14,
                  color: '#262626',
                }}
              />
            </div>
            <button
              onClick={sendCode}
              disabled={countdown > 0}
              style={{
                flexShrink: 0,
                padding: '0 10px',
                border: '1px solid #ff4d4f',
                borderRadius: 4,
                background: 'white',
                color: countdown > 0 ? '#8c8c8c' : '#ff4d4f',
                borderColor: countdown > 0 ? '#d9d9d9' : '#ff4d4f',
                cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
            >
              {countdown > 0 ? `${countdown}s` : '获取验证码'}
            </button>
          </div>

          {/* 协议 */}
          <div style={{ marginBottom: 14, fontSize: 12, color: '#8c8c8c' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 6, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <span>
                我已阅读并同意
                <a href="#" style={{ color: '#1677ff' }}>《账号使用须知》</a>
                <a href="#" style={{ color: '#1677ff' }}>《隐私政策》</a>
              </span>
            </label>
          </div>

          {/* 注册按钮 */}
          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: '100%',
              padding: '10px 0',
              background: loading ? '#ff9a8b' : '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: 12,
            }}
          >
            {loading ? '注册中...' : '立即注册'}
          </button>

          {/* 立即登录 */}
          <div style={{ textAlign: 'center', fontSize: 13, color: '#8c8c8c' }}>
            已有账号？{' '}
            <a
              href="/login"
              style={{ color: '#1677ff' }}
            >
              立即登录
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '20px 0 24px', textAlign: 'center' }}>
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center', gap: 24 }}>
          {['商家入驻', '服务市场', '卖家课堂', '规则中心'].map(item => (
            <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textDecoration: 'none' }}>
              {item}
            </a>
          ))}
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { icon: '📱', label: '手机App下载' },
              { icon: '🪟', label: 'Win版客户端' },
              { icon: '🍎', label: 'Mac版客户端' },
            ].map(btn => (
              <a key={btn.label} href="#" style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                padding: '4px 12px',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: 4,
                color: 'rgba(255,255,255,0.8)',
                fontSize: 12,
                textDecoration: 'none',
              }}>
                {btn.icon} {btn.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureTag({ icon, label, circle }: { icon: string; label: string; circle?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 40,
        height: 40,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(255,255,255,0.15)',
        flexShrink: 0,
        fontSize: circle ? 16 : 18,
        fontWeight: circle ? 700 : 400,
        color: 'white',
      }}>
        {icon}
      </div>
      <span style={{ color: 'white', fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap' }}>
        {label}
      </span>
    </div>
  )
}
