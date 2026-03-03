'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Steps, Checkbox, Button } from 'antd'

function maskPhone(phone: string) {
  if (!phone || phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

interface EnterpriseData {
  phone: string
  licenseImage: string
  licenseCode: string
  companyNameZh: string
  companyNameEn: string
  addressZhRegion: string[]
  addressZhDetail: string
  addressEnDetail: string
  licenseExpiry: string
  licenseForever: boolean
  foundDate: string
  officeRegion: string[]
  officeDetail: string
  companySize: string
  idFrontImage: string
  idBackImage: string
  legalName: string
  idNumber: string
  idExpiry: string
  idForever: boolean
}

const COMPANY_SIZE_LABELS: Record<string, string> = {
  '1-10': '1~10人',
  '11-30': '11~30人',
  '31-50': '31~50人',
  '51-100': '51~100人',
  '100+': '100人以上',
}

// 只读展示行
function ReadonlyRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minHeight: 36, borderBottom: '1px solid #f5f5f5' }}>
      <div style={{
        width: 160,
        minWidth: 160,
        padding: '8px 12px 8px 0',
        fontSize: 13,
        color: '#8c8c8c',
        textAlign: 'right',
        flexShrink: 0,
      }}>
        {label}
      </div>
      <div style={{ flex: 1, padding: '8px 0 8px 12px', fontSize: 13, color: '#262626' }}>
        {children}
      </div>
    </div>
  )
}

function ConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const phone = searchParams.get('phone') || ''

  const [data, setData] = useState<EnterpriseData | null>(null)
  const [agreed1, setAgreed1] = useState(false)
  const [agreed2, setAgreed2] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('temuEnterpriseData')
    if (raw) {
      try {
        setData(JSON.parse(raw))
      } catch {
        // ignore
      }
    }
  }, [])

  const handleSubmit = () => {
    router.push(`/temu-pending?phone=${encodeURIComponent(phone)}`)
  }

  const addressZh = data
    ? [data.addressZhRegion?.join('/'), data.addressZhDetail].filter(Boolean).join(' ')
    : ''
  const addressEn = data
    ? [data.addressZhRegion?.join('/'), data.addressEnDetail].filter(Boolean).join(' ')
    : ''
  const officeAddr = data
    ? [data.officeRegion?.join('/'), data.officeDetail].filter(Boolean).join(' ')
    : ''

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
          <Steps current={0} items={[
            { title: '填写主体信息' },
            { title: '主体实名验证' },
          ]} />
        </div>
      </div>

      {/* 主体内容 */}
      <div style={{ position: 'relative', zIndex: 1, padding: '24px 60px', paddingBottom: 120, maxWidth: 1200, margin: '0 auto' }}>
        {/* 页面标题 */}
        <div style={{
          fontSize: 18, fontWeight: 600, color: '#262626',
          marginBottom: 20, textAlign: 'center',
        }}>
          请仔细确认以下信息
        </div>

        {/* 主体信息卡片 */}
        <div style={{ backgroundColor: 'white', borderRadius: 4, padding: '24px 32px', marginBottom: 16 }}>
          {/* 卡片标题行 */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f0f0f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 18, backgroundColor: '#1677ff', borderRadius: 2 }} />
              <span style={{ fontSize: 15, fontWeight: 600, color: '#262626' }}>主体信息</span>
            </div>
            <a
              onClick={() => router.back()}
              style={{ fontSize: 13, color: '#1677ff', cursor: 'pointer' }}
            >
              主体信息有误？去修改
            </a>
          </div>

          {/* 营业执照信息小标题 */}
          <div style={{
            fontSize: 13, fontWeight: 600, color: '#262626',
            marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1677ff', display: 'inline-block' }} />
            营业执照信息
          </div>

          {/* 营业执照图片 */}
          <ReadonlyRow label="营业执照图片">
            {data?.licenseImage ? (
              <img
                src={data.licenseImage}
                alt="营业执照"
                style={{ width: 100, height: 100, objectFit: 'cover', border: '1px solid #f0f0f0', borderRadius: 4 }}
              />
            ) : (
              <span style={{ color: '#bfbfbf' }}>未上传</span>
            )}
          </ReadonlyRow>

          <ReadonlyRow label="统一社会信用代码">
            <span>{data?.licenseCode || <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>

          <ReadonlyRow label="公司名称（中文）">
            <span>{data?.companyNameZh || <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>

          <ReadonlyRow label="公司名称（英文）">
            <span>{data?.companyNameEn || <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>

          <ReadonlyRow label="营业执照地址（中文）">
            <span>{addressZh || <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>

          <ReadonlyRow label="营业执照地址（英文）">
            <span>{addressEn || <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>

          <ReadonlyRow label="营业执照有效期">
            <span>{data?.licenseExpiry || <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>

          <ReadonlyRow label="成立日期">
            <span>{data?.foundDate || <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>

          <ReadonlyRow label="办公地址">
            <span>{officeAddr || <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>

          <ReadonlyRow label="经营规模">
            <span>{data?.companySize ? COMPANY_SIZE_LABELS[data.companySize] || data.companySize : <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>

          {/* 法定代表人信息小标题 */}
          <div style={{
            fontSize: 13, fontWeight: 600, color: '#262626',
            marginTop: 24, marginBottom: 12,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1677ff', display: 'inline-block' }} />
            法定代表人信息
          </div>

          {/* 证件照 */}
          <ReadonlyRow label="证件照">
            <div style={{ display: 'flex', gap: 12 }}>
              {data?.idFrontImage ? (
                <div>
                  <img
                    src={data.idFrontImage}
                    alt="证件正面"
                    style={{ width: 120, height: 80, objectFit: 'cover', border: '1px solid #f0f0f0', borderRadius: 4, display: 'block' }}
                  />
                  <div style={{ fontSize: 12, color: '#8c8c8c', textAlign: 'center', marginTop: 4 }}>人像面</div>
                </div>
              ) : (
                <span style={{ color: '#bfbfbf' }}>未上传</span>
              )}
              {data?.idBackImage && (
                <div>
                  <img
                    src={data.idBackImage}
                    alt="证件背面"
                    style={{ width: 120, height: 80, objectFit: 'cover', border: '1px solid #f0f0f0', borderRadius: 4, display: 'block' }}
                  />
                  <div style={{ fontSize: 12, color: '#8c8c8c', textAlign: 'center', marginTop: 4 }}>国徽面</div>
                </div>
              )}
            </div>
          </ReadonlyRow>

          <ReadonlyRow label="姓名">
            <span>{data?.legalName || <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>

          <ReadonlyRow label="证件号">
            <span>{data?.idNumber || <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>

          <ReadonlyRow label="证件有效期">
            <span>{data?.idExpiry || <span style={{ color: '#bfbfbf' }}>未填写</span>}</span>
          </ReadonlyRow>
        </div>
      </div>

      {/* 底部固定栏 */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10,
        backgroundColor: 'white', borderTop: '1px solid #f0f0f0',
        padding: '12px 40px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        {/* 协议勾选 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Checkbox checked={agreed1} onChange={e => setAgreed1(e.target.checked)} />
            <span style={{ color: '#595959' }}>我已知晓并确认：上述信息中的营业执照信息，将作为我店铺的主体经营资质，提交后不可修改。</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Checkbox checked={agreed2} onChange={e => setAgreed2(e.target.checked)} />
            <span style={{ color: '#595959' }}>我已知晓并确认：上述主体信息与我的营业执照信息完全一致。</span>
          </div>
        </div>

        {/* 按钮 */}
        <div style={{ display: 'flex', gap: 12 }}>
          <Button onClick={() => router.back()} style={{ minWidth: 100 }}>上一步</Button>
          <Button
            type="primary"
            disabled={!agreed1 || !agreed2}
            onClick={handleSubmit}
            style={{ minWidth: 160 }}
          >
            我已确认，并提交
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function TemuConfirmPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }} />}>
      <ConfirmPage />
    </Suspense>
  )
}
