'use client'

import { useState, useRef } from 'react'
import {
  CheckCircleFilled, InfoCircleFilled, CloseOutlined,
  UserOutlined, PlusOutlined, DeleteOutlined,
} from '@ant-design/icons'
import { Input, Button, Select, Radio, DatePicker, Checkbox, message } from 'antd'

// 上传框（支持本地图片选择与预览）
function UploadBox({ label, width = 200, height = 160 }: { label: string; width?: number; height?: number }) {
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        border: preview ? '1px solid #d0e4ff' : '1px dashed #d0d0d0',
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        height,
        cursor: 'pointer',
        backgroundColor: preview ? '#fff' : '#fafafa',
        flexShrink: 0,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,application/pdf"
        style={{ display: 'none' }}
        onChange={handleChange}
        onClick={(e) => e.stopPropagation()}
      />
      {preview ? (
        <>
          <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {/* 删除按钮 */}
          <div
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: 'rgba(0,0,0,0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DeleteOutlined style={{ color: '#fff', fontSize: 12 }} />
          </div>
        </>
      ) : (
        <>
          <PlusOutlined style={{ fontSize: 20, color: '#bbb' }} />
          <span style={{ color: '#bbb', fontSize: 12, marginTop: 8, textAlign: 'center', padding: '0 8px' }}>{label}</span>
        </>
      )}
    </div>
  )
}

// 必填标签
function Req() {
  return <span style={{ color: '#ff4d4f' }}>* </span>
}

// 字段标签
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium mb-2 block" style={{ color: '#1a1a2e' }}>
      {children}
    </label>
  )
}

export default function ShopRegisterCompanyPage() {
  const [creditCode, setCreditCode] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [noticeClosed, setNoticeClosed] = useState(false)
  const [companyType, setCompanyType] = useState('')
  const [phoneType, setPhoneType] = useState('other')
  const [emailType, setEmailType] = useState('other')
  const [longValid, setLongValid] = useState(true)

  const handleConfirm = () => {
    if (!creditCode.trim()) {
      message.warning('请输入企业统一社会信用代码')
      return
    }
    setConfirmed(true)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F6FA', paddingBottom: confirmed ? 80 : 32 }}>
      {/* Header */}
      <div className="bg-white" style={{ borderBottom: '1px solid #e8e8e8' }}>
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
          <div className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer" style={{ backgroundColor: '#ff4d4f' }}>
            <UserOutlined style={{ color: '#fff', fontSize: 16 }} />
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-5 items-start">

          {/* 左侧主卡片 */}
          <div className="flex-1">
            <div className="bg-white rounded-xl p-8" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

              {/* 认证成功 */}
              <div className="flex items-center gap-2 mb-4">
                <CheckCircleFilled style={{ color: '#52c41a', fontSize: 18 }} />
                <span className="text-sm text-gray-700">企业支付宝认证成功，请核对并填写完整以下信息</span>
                <span className="text-sm cursor-pointer ml-1" style={{ color: '#1677ff' }}>更换支付宝账号</span>
              </div>

              <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 20 }} />

              {/* 提示框 */}
              {!noticeClosed && (
                <div className="flex items-start gap-3 rounded-lg p-4 mb-6 relative" style={{ backgroundColor: '#EEF4FF', border: '1px solid #c0d8ff' }}>
                  <InfoCircleFilled style={{ color: '#1677ff', fontSize: 16, marginTop: 1, flexShrink: 0 }} />
                  <p className="text-sm" style={{ color: '#333', lineHeight: 1.7 }}>
                    为减少操作成本，已根据公开信息自动填写部分企业/法定代表人信息，请仔细核对并根据最新信息补充或修改。
                    <br />新注册、近期修改信息营业执照入驻要求详见<span className="cursor-pointer ml-1" style={{ color: '#1677ff' }}>企业认证指引</span>
                  </p>
                  <CloseOutlined className="cursor-pointer absolute" style={{ color: '#999', fontSize: 12, top: 12, right: 12 }} onClick={() => setNoticeClosed(true)} />
                </div>
              )}

              {/* ===== 企业经营信息 ===== */}
              <h2 className="text-xl font-bold mb-6" style={{ color: '#1a1a2e' }}>企业经营信息</h2>

              {/* 社会信用代码 */}
              <div className="mb-6">
                <FieldLabel><Req />企业统一社会信用代码</FieldLabel>
                {!confirmed ? (
                  <div className="flex gap-3" style={{ maxWidth: 480 }}>
                    <Input size="large" placeholder="请输入" value={creditCode} onChange={(e) => setCreditCode(e.target.value)} />
                    <Button size="large" style={{ minWidth: 72, borderColor: '#1677ff', color: '#1677ff' }} onClick={handleConfirm}>确认</Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Input size="large" value={creditCode} readOnly style={{ maxWidth: 400, backgroundColor: '#fafafa' }} />
                    <span className="text-sm cursor-pointer" style={{ color: '#1677ff' }} onClick={() => setConfirmed(false)}>更换</span>
                  </div>
                )}
              </div>

              {confirmed && (<>

                {/* 企业营业执照 */}
                <div className="mb-6">
                  <FieldLabel><Req />企业营业执照</FieldLabel>
                  <div className="flex gap-12 items-start">
                    <div>
                      <p className="text-xs text-gray-500 mb-2">企业营业执照</p>
                      <UploadBox label="请上传营业执照" width={180} height={150} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-2">示例</p>
                      <div style={{ width: 200, height: 150, border: '1px solid #e5e7eb', borderRadius: 4, backgroundColor: '#f5f5e8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center', padding: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#333', marginBottom: 6 }}>营业执照</div>
                          <div style={{ fontSize: 9, color: '#666', lineHeight: 1.6 }}>
                            <div>统一社会信用代码</div>
                            <div>XXXXXXXXXXXXXXXX</div>
                            <div style={{ marginTop: 4 }}>名称：XX有限公司</div>
                          </div>
                          <div style={{ color: '#ff4d4f', fontSize: 10, marginTop: 8, opacity: 0.5 }}>复印件</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#8c8c8c' }}>新办理营业执照需在办理日31天后才可申请入驻</p>
                </div>

                {/* 企业名称 */}
                <div className="mb-6">
                  <FieldLabel><Req />企业名称</FieldLabel>
                  <Input size="large" defaultValue="郑州奥朵商贸有限公司" style={{ maxWidth: 400 }} />
                </div>

                {/* 成立日期 */}
                <div className="mb-6">
                  <FieldLabel><Req />成立日期</FieldLabel>
                  <DatePicker size="large" style={{ maxWidth: 300 }} placeholder="请选择" />
                </div>

                {/* 企业类型 */}
                <div className="mb-6">
                  <FieldLabel><Req />企业类型</FieldLabel>
                  <Radio.Group value={companyType} onChange={(e) => setCompanyType(e.target.value)}>
                    <Radio value="sole">独资企业</Radio>
                    <Radio value="limited">有限责任公司</Radio>
                    <Radio value="stock">股份有限公司</Radio>
                  </Radio.Group>
                </div>

                {/* 企业注册地址 */}
                <div className="mb-6">
                  <FieldLabel><Req />企业注册地址</FieldLabel>
                  <div style={{ maxWidth: 480 }}>
                    <Select size="large" placeholder="国家 / 省 / 市 / 区" style={{ width: '100%', marginBottom: 8 }} />
                    <Input size="large" placeholder="详细地址，具体到门牌号" />
                  </div>
                </div>

                {/* 企业经营地址 */}
                <div className="mb-6">
                  <FieldLabel><Req />企业经营地址</FieldLabel>
                  <div style={{ maxWidth: 480 }}>
                    <Select size="large" placeholder="国家 / 省 / 市 / 区" style={{ width: '100%', marginBottom: 8 }} />
                    <Input size="large" placeholder="详细地址，具体到门牌号" />
                  </div>
                </div>

                {/* 营业执照有效期 */}
                <div className="mb-6">
                  <FieldLabel><Req />营业执照有效期</FieldLabel>
                  <div className="flex items-center gap-4 flex-wrap">
                    <DatePicker.RangePicker
                      size="large"
                      style={{ maxWidth: 340 }}
                      disabled={longValid}
                      allowEmpty={[true, true]}
                      placeholder={['开始日期', '结束日期']}
                    />
                    <Checkbox checked={longValid} onChange={(e) => setLongValid(e.target.checked)}>长期有效</Checkbox>
                  </div>
                </div>

                {/* 登记机关 */}
                <div className="mb-6">
                  <FieldLabel><Req />登记机关</FieldLabel>
                  <Select size="large" showSearch placeholder="搜索机构名称或地址" style={{ maxWidth: 480, width: '100%' }} options={[]} />
                </div>

                {/* 手持营业执照 */}
                <div className="mb-8">
                  <FieldLabel><Req />手持营业执照</FieldLabel>
                  <p className="text-xs mb-1" style={{ color: '#8c8c8c' }}>1.请上传PDF、JPG、JPEG、PNG格式，仅限一个文件，大小不超过10M</p>
                  <p className="text-xs mb-3">2.查看<span style={{ color: '#1677ff', cursor: 'pointer' }}>参考示例</span></p>
                  <UploadBox label="手持营业执照" width={180} height={150} />
                </div>

                <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 24 }} />

                {/* ===== 法人信息 ===== */}
                <h2 className="text-xl font-bold mb-6" style={{ color: '#1a1a2e' }}>法人信息</h2>

                {/* 法人姓名 */}
                <div className="mb-6">
                  <FieldLabel><Req />法人姓名</FieldLabel>
                  <Input size="large" defaultValue="郭*" style={{ maxWidth: 400 }} />
                </div>

                {/* 证件类型 */}
                <div className="mb-6">
                  <FieldLabel><Req />证件类型</FieldLabel>
                  <Select size="large" defaultValue="id" style={{ maxWidth: 400, width: '100%' }}
                    options={[{ value: 'id', label: '身份证' }, { value: 'passport', label: '护照' }]}
                  />
                </div>

                {/* 证件照片 */}
                <div className="mb-6">
                  <FieldLabel><Req />证件照片</FieldLabel>
                  <p className="text-xs mb-1" style={{ color: '#8c8c8c' }}>1.请上传证件照片，支持jpg, jpeg, png, pdf格式，大小不超过10MB</p>
                  <p className="text-xs mb-3" style={{ color: '#8c8c8c' }}>2.请上传身份证正反面，同时确保国徽面签发机关与正面地址对应区域一致</p>
                  <div className="flex gap-4">
                    <UploadBox label="请上传身份证人像面" width={200} height={150} />
                    <UploadBox label="请上传身份证国徽面" width={200} height={150} />
                  </div>
                </div>

                {/* 证件号码 */}
                <div className="mb-6">
                  <FieldLabel><Req />证件号码</FieldLabel>
                  <Input size="large" placeholder="请输入" style={{ maxWidth: 400 }} />
                </div>

                {/* 手持身份证照 */}
                <div className="mb-6">
                  <FieldLabel><Req />手持身份证照</FieldLabel>
                  <div className="flex gap-4 mb-3">
                    <UploadBox label="请上传手持身份证正面照片" width={200} height={150} />
                    <UploadBox label="请上传手持身份证背面照片" width={200} height={150} />
                  </div>
                  <p className="text-xs mb-1" style={{ color: '#8c8c8c' }}>1.请上传PDF、JPG、JPEG、PNG格式，仅限一个文件，大小不超过10M</p>
                  <p className="text-xs">2.查看<span style={{ color: '#1677ff', cursor: 'pointer' }}>参考示例</span></p>
                </div>

                {/* 法人生日 */}
                <div className="mb-6">
                  <FieldLabel><Req />法人生日</FieldLabel>
                  <DatePicker size="large" style={{ maxWidth: 300, width: '100%' }} placeholder="请选择" />
                </div>

                {/* 法人国籍 */}
                <div className="mb-6">
                  <FieldLabel><Req />法人国籍</FieldLabel>
                  <Select size="large" placeholder="请选择" style={{ maxWidth: 300, width: '100%' }}
                    options={[{ value: 'CN', label: '中国' }, { value: 'US', label: '美国' }, { value: 'HK', label: '中国香港' }]}
                  />
                </div>

                {/* 法人居住地址 */}
                <div className="mb-8">
                  <FieldLabel><Req />法人居住地址</FieldLabel>
                  <div style={{ maxWidth: 480 }}>
                    <Select size="large" placeholder="国家 / 省 / 市 / 区" style={{ width: '100%', marginBottom: 8 }} />
                    <Input size="large" placeholder="详细地址，具体到门牌号" />
                  </div>
                </div>

                <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 24 }} />

                {/* ===== 联系人信息 ===== */}
                <h2 className="text-xl font-bold mb-1" style={{ color: '#1a1a2e' }}>联系人信息</h2>
                <p className="text-xs text-gray-500 mb-6">请保证联系人信息准确性，如有任何法律/监管要求，平台有权对外提供或展示当前联系人信息</p>

                {/* 联系人姓名 */}
                <div className="mb-6">
                  <FieldLabel><Req />联系人姓名</FieldLabel>
                  <Input size="large" placeholder="请输入" style={{ maxWidth: 260 }} />
                </div>

                {/* 联系人电话 */}
                <div className="mb-6">
                  <FieldLabel><Req />联系人电话</FieldLabel>
                  <Radio.Group value={phoneType} onChange={(e) => setPhoneType(e.target.value)} className="mb-3" style={{ display: 'block' }}>
                    <Radio value="registered">使用注册手机号码</Radio>
                    <Radio value="other">其他手机号码</Radio>
                  </Radio.Group>
                  {phoneType === 'other' && (
                    <div className="flex gap-6 mt-2 flex-wrap">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block"><Req />新手机号码</label>
                        <div className="flex items-center gap-2">
                          <Input addonBefore="+86" size="large" placeholder="请输入" style={{ maxWidth: 220 }} />
                          <span style={{ color: '#1677ff', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>获取验证码</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block"><Req />验证码</label>
                        <div className="flex items-center gap-2">
                          <Input size="large" placeholder="请输入" style={{ maxWidth: 180 }} />
                          <span style={{ color: '#1677ff', fontSize: 13, cursor: 'pointer' }}>校验</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 联系人邮箱 */}
                <div className="mb-6">
                  <FieldLabel><Req />联系人邮箱</FieldLabel>
                  <Radio.Group value={emailType} onChange={(e) => setEmailType(e.target.value)} className="mb-3" style={{ display: 'block' }}>
                    <Radio value="registered">使用注册邮箱</Radio>
                    <Radio value="other">其他邮箱</Radio>
                  </Radio.Group>
                  {emailType === 'other' && (
                    <div className="flex gap-6 mt-2 flex-wrap">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block"><Req />新邮箱</label>
                        <div className="flex items-center gap-2">
                          <Input size="large" placeholder="请输入" style={{ maxWidth: 220 }} />
                          <span style={{ color: '#1677ff', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>获取验证码</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block"><Req />验证码</label>
                        <div className="flex items-center gap-2">
                          <Input size="large" placeholder="请输入" style={{ maxWidth: 180 }} />
                          <span style={{ color: '#1677ff', fontSize: 13, cursor: 'pointer' }}>校验</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

              </>)}

            </div>
          </div>

          {/* 右侧 FAQ */}
          <div className="bg-white rounded-xl p-5 flex-shrink-0" style={{ width: 200, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h3 className="text-base font-semibold mb-3" style={{ color: '#1a1a2e' }}>FAQ</h3>
            <p className="text-sm" style={{ color: '#1677ff', cursor: 'pointer' }}>· 入驻常见问题</p>
          </div>
        </div>
      </div>

      {/* 底部固定栏 */}
      {confirmed && (
        <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center justify-end px-10 gap-3"
          style={{ height: 64, borderTop: '1px solid #e8e8e8', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
          <Button size="large" style={{ minWidth: 80 }}>保存</Button>
          <Button type="primary" size="large" style={{ minWidth: 80, backgroundColor: '#1677ff' }}
            onClick={() => message.success('提交成功，等待审核')}>
            提交
          </Button>
        </div>
      )}

      {/* 右侧悬浮收起 */}
      <div className="fixed right-0 flex items-center justify-center cursor-pointer"
        style={{ top: '50%', transform: 'translateY(-50%)', width: 20, height: 60, backgroundColor: '#d9d9d9', borderRadius: '4px 0 0 4px', color: '#666', fontSize: 12 }}>
        ‹
      </div>
    </div>
  )
}
