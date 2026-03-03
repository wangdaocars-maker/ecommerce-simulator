'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Form, Input, Select, DatePicker, Checkbox, Cascader, Button, Steps, message } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { regionData } from '@/data/regions'

function maskPhone(phone: string) {
  if (!phone || phone.length < 7) return phone
  return phone.slice(0, 3) + '****' + phone.slice(-4)
}

function EnterpriseForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const phone = searchParams.get('phone') || ''

  // 图片上传状态（本地预览 URL）
  const [licenseImage, setLicenseImage] = useState('')
  const [idFrontImage, setIdFrontImage] = useState('')
  const [idBackImage, setIdBackImage] = useState('')

  // 营业执照有效期
  const [licenseForever, setLicenseForever] = useState(false)

  // 证件有效期
  const [idForever, setIdForever] = useState(false)

  // 邮箱验证码
  const [emailCode, setEmailCode] = useState('')
  const [emailCountdown, setEmailCountdown] = useState(0)

  const pickLocalImage = (setter: (url: string) => void) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/jpeg,image/jpg,image/png'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) setter(URL.createObjectURL(file))
    }
    input.click()
  }

  const sendEmailCode = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000))
    setEmailCode(code)
    message.success('验证码已发送')
    setEmailCountdown(60)
    const timer = setInterval(() => {
      setEmailCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const handleSubmit = () => {
    message.success('提交成功！信息已保存。')
  }

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

      {/* 步骤条 */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        padding: '20px 40px',
        backgroundColor: 'white',
        borderBottom: '1px solid #f0f0f0',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Steps current={0} items={[
            { title: '填写主体信息' },
            { title: '主体实名验证' },
          ]} />
        </div>
      </div>

      {/* 主体内容 */}
      <div style={{ position: 'relative', zIndex: 1, padding: '24px 60px', paddingBottom: 80, maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
          {/* 左侧表单 */}
          <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 4, padding: '24px 32px' }}>
            <Form
              layout="horizontal"
              labelCol={{ style: { width: 130, minWidth: 130, textAlign: 'right' } }}
              wrapperCol={{ style: { flex: 1 } }}
            >
              {/* ===== 营业执照信息 ===== */}
              <Form.Item wrapperCol={{ style: { width: '100%' } }} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#262626', borderLeft: '3px solid #1677ff', paddingLeft: 8 }}>
                  · 营业执照信息
                </div>
              </Form.Item>

              {/* 营业执照图片 */}
              <Form.Item label="营业执照图片" required>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <ImageBox
                    src={licenseImage}
                    width={120} height={120}
                    label="上传"
                    onPick={() => pickLocalImage(setLicenseImage)}
                    onRemove={() => setLicenseImage('')}
                  />
                  <div style={{ fontSize: 12, color: '#8c8c8c', paddingTop: 4 }}>
                    仅支持JPG/JPEG/PNG格式
                  </div>
                </div>
              </Form.Item>

              {/* 统一社会信用代码 */}
              <Form.Item label="统一社会信用代码" required>
                <Input placeholder="请输入统一社会信用代码" maxLength={18} />
              </Form.Item>

              {/* 公司名称 */}
              <Form.Item label="公司名称" required>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 36, fontSize: 13, color: '#262626', flexShrink: 0 }}>
                    <span style={{ color: '#ff4d4f' }}>*</span>中文
                  </span>
                  <Input placeholder="请输入公司名称（中文）" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 36, fontSize: 13, color: '#8c8c8c', flexShrink: 0 }}>英文</span>
                  <Input placeholder="输入中文后自动翻译，也可手动填写" />
                </div>
              </Form.Item>

              {/* 营业执照地址 */}
              <Form.Item label="营业执照地址" required>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 36, fontSize: 13, color: '#262626', flexShrink: 0 }}>
                    <span style={{ color: '#ff4d4f' }}>*</span>中文
                  </span>
                  <Cascader options={regionData} placeholder="省/市/区" style={{ width: 180, flexShrink: 0 }} />
                  <Input placeholder="请输入详细地址（中文）" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 36, fontSize: 13, color: '#8c8c8c', flexShrink: 0 }}>英文</span>
                  <Input disabled placeholder="根据中文自动翻译" style={{ width: 180, flexShrink: 0 }} />
                  <Input placeholder="输入中文后自动翻译，也可手动填写" />
                </div>
              </Form.Item>

              {/* 成立日期 */}
              <Form.Item label="成立日期" required>
                <DatePicker style={{ width: '100%' }} placeholder="请选择成立日期" />
              </Form.Item>

              {/* 营业执照有效期 */}
              <Form.Item label="营业执照有效期" required>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <DatePicker disabled={licenseForever} style={{ flex: 1 }} placeholder="请选择到期日期" />
                  <Checkbox checked={licenseForever} onChange={e => setLicenseForever(e.target.checked)}>长期</Checkbox>
                </div>
              </Form.Item>

              {/* 办公地址 */}
              <Form.Item label="办公地址" required>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Cascader options={regionData} placeholder="省/市/区" style={{ width: 180, flexShrink: 0 }} />
                  <Input placeholder="请输入详细地址，比如街道、楼层号" />
                </div>
              </Form.Item>

              {/* 经营规模 */}
              <Form.Item label="经营规模" required>
                <Select placeholder="请选择经营规模" options={[
                  { value: '1-10', label: '1~10人' },
                  { value: '11-30', label: '11~30人' },
                  { value: '31-50', label: '31~50人' },
                  { value: '51-100', label: '51~100人' },
                  { value: '100+', label: '100人以上' },
                ]} />
              </Form.Item>

              {/* ===== 法定代表人信息 ===== */}
              <Form.Item wrapperCol={{ style: { width: '100%' } }} style={{ margin: '24px 0 16px', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#262626', borderLeft: '3px solid #1677ff', paddingLeft: 8 }}>
                  · 法定代表人信息
                </div>
              </Form.Item>

              {/* 证件类型 */}
              <Form.Item label="证件类型" required>
                <Select defaultValue="mainland-id" options={[
                  { value: 'mainland-id', label: '大陆身份证' },
                  { value: 'hk-id', label: '香港身份证' },
                  { value: 'hk-macao-pass', label: '港澳居民来往内地通行证' },
                  { value: 'taiwan-pass', label: '台湾居民来往大陆通行证' },
                  { value: 'hk-macao-residence', label: '港澳居民居住证' },
                  { value: 'taiwan-residence', label: '台湾居民居住证' },
                ]} />
              </Form.Item>

              {/* 证件照 */}
              <Form.Item label="证件照" required>
                <div style={{ display: 'flex', gap: 16 }}>
                  <div>
                    <ImageBox
                      src={idFrontImage}
                      width={180} height={120}
                      label="上传正面"
                      onPick={() => pickLocalImage(setIdFrontImage)}
                      onRemove={() => setIdFrontImage('')}
                    />
                    <div style={{ textAlign: 'center', fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>人像面</div>
                  </div>
                  <div>
                    <ImageBox
                      src={idBackImage}
                      width={180} height={120}
                      label="上传反面"
                      onPick={() => pickLocalImage(setIdBackImage)}
                      onRemove={() => setIdBackImage('')}
                    />
                    <div style={{ textAlign: 'center', fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>国徽面</div>
                  </div>
                </div>
              </Form.Item>

              {/* 姓名 */}
              <Form.Item label="姓名" required>
                <Input placeholder="请输入法定代表人姓名" />
              </Form.Item>

              {/* 证件号 */}
              <Form.Item label="证件号" required>
                <Input placeholder="请输入证件号码" maxLength={18} />
              </Form.Item>

              {/* 证件有效期 */}
              <Form.Item label="证件有效期" required>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <DatePicker disabled={idForever} style={{ flex: 1 }} placeholder="请选择到期日期" />
                  <Checkbox checked={idForever} onChange={e => setIdForever(e.target.checked)}>长期</Checkbox>
                </div>
              </Form.Item>

              {/* ===== 经营合规信息 ===== */}
              <Form.Item wrapperCol={{ style: { width: '100%' } }} style={{ margin: '24px 0 16px', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#262626', borderLeft: '3px solid #1677ff', paddingLeft: 8 }}>
                  · 经营合规信息
                </div>
              </Form.Item>

              {/* 商家类型 */}
              <Form.Item label="商家类型" required>
                <Select defaultValue="trader" options={[
                  { value: 'trader', label: '贸易商(Trader)' },
                ]} />
              </Form.Item>

              {/* 工商登记机关类型 */}
              <Form.Item label="工商登记机关类型" required>
                <Select defaultValue="samr" options={[
                  { value: 'samr', label: '国家市场监督管理总局(State Administration for Market Regulation)' },
                ]} />
              </Form.Item>

              {/* 经营专用电话 */}
              <Form.Item label="经营专用电话">
                <Input placeholder="请输入手机号（选填）" maxLength={11} />
              </Form.Item>

              {/* ===== 邮箱信息 ===== */}
              <Form.Item wrapperCol={{ style: { width: '100%' } }} style={{ margin: '24px 0 16px', paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: '#262626', borderLeft: '3px solid #1677ff', paddingLeft: 8 }}>
                  · 邮箱信息
                </div>
              </Form.Item>

              {/* 联系邮箱 */}
              <Form.Item label="联系邮箱" required>
                <Input type="email" placeholder="请输入邮箱地址" />
              </Form.Item>

              {/* 验证码 */}
              <Form.Item label="验证码" required>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Input
                    value={emailCode}
                    onChange={e => setEmailCode(e.target.value)}
                    placeholder="请输入验证码"
                    maxLength={6}
                    style={{ flex: 1 }}
                  />
                  <Button onClick={sendEmailCode} disabled={emailCountdown > 0}>
                    {emailCountdown > 0 ? `重新获取(${emailCountdown}s)` : '获取验证码'}
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>

          {/* 右侧说明栏 */}
          <div style={{
            width: 280,
            flexShrink: 0,
            position: 'sticky',
            top: 20,
            alignSelf: 'flex-start',
          }}>
            <div style={{ backgroundColor: 'white', borderRadius: 4, padding: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#262626', marginBottom: 16, marginTop: 0 }}>营业执照</h3>

              <div style={{ fontSize: 13, color: '#595959', lineHeight: 1.8 }}>
                <p style={{ margin: '0 0 8px' }}>1. 请确保营业执照图片字体清晰，边角完整，无任何无关水印，不可故意遮盖二维码或信息。若拍摄模糊建议上传扫描件。</p>
                <p style={{ margin: '0 0 8px' }}>2. 请您先自行在国家企业信用信息公示系统查询您填写的统一社会信用代码/注册号，确保能查询到您的主体信息，且登记状态为"存续（在营、开业、在册）"。</p>
                <p style={{ margin: '0 0 8px' }}>3. 请确保营业执照图片中的公司名称、统一社会信用代码、法定代表人与您填写的对应字段信息完全一致。</p>
                <p style={{ margin: 0 }}>4. 若公司名称或法定代表人等信息发生过变更，请填写最新信息，上传最新核准日期的营业执照图片。</p>
              </div>

              {/* 示例图区域 */}
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 12, color: '#262626' }}>示例</div>
                {/* 好的示例 */}
                <div style={{ marginBottom: 8 }}>
                  <div style={{ border: '1px solid #52c41a', borderRadius: 4, padding: 8, textAlign: 'center' }}>
                    <div style={{
                      width: '100%',
                      height: 60,
                      backgroundColor: '#f6ffed',
                      borderRadius: 2,
                      marginBottom: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      color: '#52c41a',
                    }}>
                      示例图
                    </div>
                    <div style={{ fontSize: 11, color: '#52c41a' }}>四角完整 / 亮度均匀 / 照片清晰</div>
                  </div>
                </div>
                {/* 坏的示例 */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {['缺边', '模糊', '闪光'].map(label => (
                    <div key={label} style={{ flex: 1, border: '1px solid #ff4d4f', borderRadius: 4, padding: 8, textAlign: 'center' }}>
                      <div style={{
                        width: '100%',
                        height: 40,
                        backgroundColor: '#fff1f0',
                        borderRadius: 2,
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <span style={{ color: '#ff4d4f', fontSize: 16 }}>X</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#ff4d4f' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部固定按钮栏 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: 'white',
        borderTop: '1px solid #f0f0f0',
        padding: '12px 40px',
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
      }}>
        <Button onClick={() => router.back()} style={{ minWidth: 100 }}>上一步</Button>
        <Button type="primary" onClick={handleSubmit} style={{ minWidth: 100 }}>下一步</Button>
      </div>

    </div>
  )
}

function ImageBox({
  src, width, height, label, onPick, onRemove,
}: {
  src: string; width: number; height: number; label: string
  onPick: () => void; onRemove: () => void
}) {
  return (
    <div
      onClick={onPick}
      style={{
        width, height,
        border: '1px dashed #d9d9d9',
        borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', backgroundColor: '#fafafa', overflow: 'hidden', position: 'relative',
      }}
    >
      {src ? (
        <>
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            style={{
              position: 'absolute', top: 4, right: 4,
              background: 'rgba(0,0,0,0.45)', borderRadius: '50%',
              width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <DeleteOutlined style={{ fontSize: 11, color: 'white' }} />
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', color: '#8c8c8c' }}>
          <PlusOutlined style={{ fontSize: 24, display: 'block', marginBottom: 4 }} />
          <span style={{ fontSize: 12 }}>{label}</span>
        </div>
      )}
    </div>
  )
}

export default function TemuEnterprisePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }} />}>
      <EnterpriseForm />
    </Suspense>
  )
}
