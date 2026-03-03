'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { message } from 'antd'

const MERCHANT_RULES = [
  'Temu代发政策', '商家客户服务管理规则', '禁售商品及信息规范',
  '生产者延伸责任相关服务条款', 'Temu商家行为准则', '订单包邮服务条款',
  '虚假交易处理规则', 'Temu商家售后规则', '运输标签服务条款',
  'Temu商品安全与合规政策', 'Temu商品质量事故处理规则', 'Temu商家履约规则', '保证金规则',
]

const PRODUCT_CATEGORIES = [
  'CD和黑胶唱片', '办公用品', '宠物用品', '家电', '电子', '工业和科学',
  '家居、厨房用品', '庭院、草坪和园艺', '运动与户外用品', '服装', '母婴用品',
  '美容个护', '汽车用品', '工具', '食品', '玩具',
]

const SALE_COUNTRIES = ['美国', '加拿大', '英国', '德国', '法国', '日本', '澳大利亚', '意大利', '西班牙', '墨西哥', '巴西']

const NAMING_RULES = [
  '店铺名称请使用销售目的地的官方语言；店铺名称所有的单词首字母大写或者全部字母大写',
  '店铺logo请勿使用无文字或图案的纯色图；店铺logo若含有文字，只能含英文字母',
  '非旗舰店的店铺名称不得使用"official"或其他带有类似含义的内容',
  '店铺名称和logo不得带有电话号码、电子邮箱、网址、二维码、即时通讯工具或其他联系信息（如QQ号码、微信号等）',
  '店铺名称和logo不得包含会具有下列情形的内容：(1)有损国家、社会公共利益、或有损民族尊严的；(2)侵犯他人合法权利的；(3)夸大宣传、可能误导公众的；(4)外国国家或地区的名称；(5)国际组织的名称；(6)政治敏感信息，包括但不限于国家领导人姓名、党名称、党政军机关名称；(7)含有封建文化糟粕、有消极政治影响、或违背少数民族习俗、带有歧视性的；(8)与经营主体无关的其他电子商务平台信息；(9)其他违反法律法规或社会善良风俗的。',
]

interface ProductRow {
  id: string
  category: string
  image: string | null
  name: string
  price: string
  note: string
}

function UploadBox({
  src, label, width = 80, height = 80,
  onPick, onRemove,
}: {
  src: string | null; label?: string; width?: number; height?: number
  onPick: () => void; onRemove: () => void
}) {
  return (
    <div
      onClick={onPick}
      style={{
        width, height,
        border: '1px dashed #d9d9d9', borderRadius: 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', position: 'relative', overflow: 'hidden', flexShrink: 0,
        backgroundColor: '#fafafa', fontSize: 12, color: '#8c8c8c', gap: 4,
      }}
    >
      {src ? (
        <>
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div
            onClick={e => { e.stopPropagation(); onRemove() }}
            style={{
              position: 'absolute', top: 2, right: 2, width: 16, height: 16,
              background: 'rgba(0,0,0,0.5)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: 10, cursor: 'pointer',
            }}
          >✕</div>
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#bfbfbf" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>点击上传</span>
          {label && <span style={{ fontSize: 11, marginTop: 2 }}>{label}</span>}
        </>
      )}
    </div>
  )
}

function useFilePicker(onFile: (src: string) => void) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const pick = () => {
    if (!inputRef.current) {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.onchange = e => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) onFile(URL.createObjectURL(file))
      }
      inputRef.current = input
    }
    inputRef.current.value = ''
    inputRef.current.click()
  }
  return pick
}

function ShopPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const phone = searchParams.get('phone') || ''

  const [shopName, setShopName] = useState('')
  const [logoSrc, setLogoSrc] = useState<string | null>(null)
  const [storeType, setStoreType] = useState<'normal' | 'consignment'>('normal')
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [countryOpen, setCountryOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [productRows, setProductRows] = useState<ProductRow[]>([])
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [hasFactory, setHasFactory] = useState<'yes' | 'no'>('no')
  const [hasEcommExp, setHasEcommExp] = useState<'yes' | 'no'>('no')
  const [bizPhotos, setBizPhotos] = useState<(string | null)[]>([null, null, null, null, null])
  const [otherPhoto, setOtherPhoto] = useState<string | null>(null)
  const [inviteCode] = useState('fhfpdv')
  const [agreed, setAgreed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // 协议弹框
  const [showAgreement, setShowAgreement] = useState(false)
  const [agreementText, setAgreementText] = useState('')
  const [innerAgreed, setInnerAgreed] = useState(false)
  // 确认对话框
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (showAgreement && !agreementText) {
      fetch('/merchant-agreement.txt')
        .then(r => r.arrayBuffer())
        .then(buf => {
          const decoder = new TextDecoder('utf-8')
          const text = decoder.decode(buf).replace(/\r\n/g, '\n').replace(/\r/g, '\n')
          setAgreementText(text)
        })
        .catch(() => setAgreementText('协议加载失败，请重试。'))
    }
  }, [showAgreement, agreementText])

  const pickLogo = useFilePicker(src => setLogoSrc(src))

  const toggleCountry = (c: string) => {
    setSelectedCountries(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    )
  }

  const toggleCategory = (cat: string) => {
    const exists = productRows.some(r => r.category === cat)
    if (exists) {
      setProductRows(prev => prev.filter(r => r.category !== cat))
    } else {
      const catRows = productRows.filter(r => r.category === cat)
      if (productRows.filter((r, i, arr) => arr.findIndex(x => x.category === r.category) === i).length >= 5) {
        message.warning('最多选择5个商品类目')
        return
      }
      setProductRows(prev => [...prev, { id: Date.now().toString(), category: cat, image: null, name: '', price: '', note: '' }])
    }
    setCatOpen(false)
  }

  const addRow = (cat: string) => {
    setProductRows(prev => [...prev, { id: Date.now().toString(), category: cat, image: null, name: '', price: '', note: '' }])
  }

  const updateRow = (id: string, field: keyof ProductRow, value: string | null) => {
    setProductRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
  }

  const pickRowImage = (id: string) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) updateRow(id, 'image', URL.createObjectURL(file))
    }
    input.click()
  }

  const pickBizPhoto = (idx: number) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = e => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const src = URL.createObjectURL(file)
        setBizPhotos(prev => prev.map((p, i) => i === idx ? src : p))
      }
    }
    input.click()
  }

  const pickOther = useFilePicker(src => setOtherPhoto(src))

  const selectedCats = [...new Set(productRows.map(r => r.category))]

  const handleOpenAgreement = (e: React.MouseEvent | React.ChangeEvent) => {
    e.preventDefault()
    setShowAgreement(true)
  }

  const handleAgreementConfirm = () => {
    if (!innerAgreed) { message.warning('请先勾选同意以上协议'); return }
    setAgreed(true)
    setShowAgreement(false)
    setShowConfirm(true)
  }

  const handleFinalSubmit = () => {
    setShowConfirm(false)
    message.success('店铺信息已提交，等待审核')
    setTimeout(() => router.push('/login'), 1500)
  }

  const handleSubmit = () => {
    if (!agreed) { setShowAgreement(true); return }
    setShowConfirm(true)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0', position: 'relative' }}>
      {/* 水印 */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='120'><text x='10' y='60' font-size='11' fill='rgba(0,0,0,0.07)' font-family='Arial' transform='rotate(-20 110 60)'>304321686315531</text></svg>`
        )}")`,
        backgroundRepeat: 'repeat',
      }} />

      {/* Header */}
      <div style={{
        position: 'relative', zIndex: 2,
        backgroundColor: 'white', padding: '0 32px', height: 48,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>Seller Central</span>
          <span style={{
            fontSize: 11, color: '#8c8c8c', border: '1px solid #d9d9d9',
            borderRadius: 3, padding: '1px 6px',
          }}>Beta</span>
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: '#e8e8e8',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#595959" strokeWidth="2">
            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
      </div>

      {/* 标题 */}
      <div style={{
        position: 'relative', zIndex: 1,
        backgroundColor: 'white', textAlign: 'center', padding: '20px 0',
        borderBottom: '1px solid #f0f0f0',
        fontSize: 18, fontWeight: 600, color: '#262626',
      }}>
        欢迎来到卖家中心，请填写你的店铺
      </div>

      {/* 主体 */}
      <div style={{ position: 'relative', zIndex: 1, padding: '20px 32px', maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 20 }}>

        {/* 左侧表单 */}
        <div style={{ flex: 1, backgroundColor: 'white', borderRadius: 4, padding: '24px 32px', marginBottom: 120 }}>
          {/* 分组标题 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1677ff' }} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#262626' }}>店铺信息</span>
          </div>

          {/* 字段通用样式 */}
          {[
            /* 店铺名称 */
            <Row key="name" label="店铺名称" required>
              <input
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                placeholder="请填写店铺英文名称"
                style={inputStyle}
              />
            </Row>,

            /* 店铺logo */
            <Row key="logo" label="店铺logo" required>
              <div>
                <UploadBox
                  src={logoSrc} width={80} height={80}
                  onPick={pickLogo} onRemove={() => setLogoSrc(null)}
                />
                <div style={{ marginTop: 6, fontSize: 12, color: '#8c8c8c' }}>
                  尺寸：300*300，仅支持jpg、jpeg格式，主图文字使用销售目的地官方语言。
                </div>
              </div>
            </Row>,

            /* 店铺类别 */
            <Row key="type" label="店铺类别" required>
              <div>
                <div style={{ display: 'flex', gap: 24 }}>
                  {[
                    { value: 'normal', label: '常规店铺' },
                    { value: 'consignment', label: '半托管店铺' },
                  ].map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                      <input
                        type="radio" name="storeType"
                        checked={storeType === opt.value}
                        onChange={() => setStoreType(opt.value as 'normal' | 'consignment')}
                      />
                      <span style={{ fontSize: 14, color: '#262626' }}>{opt.label}</span>
                      {opt.value === 'consignment' && (
                        <span style={{
                          width: 16, height: 16, borderRadius: '50%', border: '1px solid #8c8c8c',
                          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 11, color: '#8c8c8c', cursor: 'help',
                        }}>?</span>
                      )}
                    </label>
                  ))}
                </div>
                {storeType === 'consignment' && (
                  <div style={{
                    marginTop: 10, padding: '8px 12px', backgroundColor: '#fff7e6',
                    border: '1px solid #ffd591', borderRadius: 4, fontSize: 13, color: '#d46b08',
                    display: 'flex', gap: 6,
                  }}>
                    <span>⓪</span>
                    <span>此类店铺下的商品，需要卖家在销售目的地或境外指定区域有库存 <strong>并</strong> 从相应境外仓库自行发货配送至消费者</span>
                  </div>
                )}
              </div>
            </Row>,

            /* 计划销售站点（仅半托管） */
            ...(storeType === 'consignment' ? [
              <Row key="sites" label="计划销售站点" required>
                <div style={{ position: 'relative' }}>
                  <div
                    onClick={() => setCountryOpen(o => !o)}
                    style={{
                      ...inputStyle, cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', userSelect: 'none',
                    }}
                  >
                    <span style={{ color: selectedCountries.length ? '#262626' : '#bfbfbf' }}>
                      {selectedCountries.length ? selectedCountries.join('、') : '请选择销售站点'}
                    </span>
                    <span style={{ fontSize: 10, color: '#8c8c8c' }}>{countryOpen ? '▲' : '▼'}</span>
                  </div>
                  {countryOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                      backgroundColor: 'white', border: '1px solid #d9d9d9', borderRadius: 4,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto',
                    }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
                        <input
                          type="checkbox"
                          checked={selectedCountries.length === SALE_COUNTRIES.length}
                          onChange={e => setSelectedCountries(e.target.checked ? [...SALE_COUNTRIES] : [])}
                        />
                        <span>全选</span>
                      </label>
                      {SALE_COUNTRIES.map(c => (
                        <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={selectedCountries.includes(c)} onChange={() => toggleCountry(c)} />
                          <span>{c}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </Row>,
            ] : []),

            /* 计划销售商品 */
            <Row key="cats" label="计划销售商品" required>
              <div>
                <div style={{ position: 'relative', marginBottom: 12 }}>
                  <div
                    onClick={() => setCatOpen(o => !o)}
                    style={{
                      ...inputStyle, cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'space-between', userSelect: 'none',
                    }}
                  >
                    <span style={{ color: '#bfbfbf' }}>选择商品类目，最多5个</span>
                    <span style={{ fontSize: 10, color: '#8c8c8c' }}>{catOpen ? '▲' : '▼'}</span>
                  </div>
                  {catOpen && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                      backgroundColor: 'white', border: '1px solid #d9d9d9', borderRadius: 4,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)', maxHeight: 200, overflowY: 'auto',
                    }}>
                      {PRODUCT_CATEGORIES.map(cat => (
                        <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', cursor: 'pointer' }}>
                          <input type="checkbox" checked={selectedCats.includes(cat)} onChange={() => toggleCategory(cat)} />
                          <span>{cat}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                {/* 商品表格 */}
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#fafafa' }}>
                      {['商品类目', '商品图', '商品名称', '单价（元）', '备注', '操作'].map(h => (
                        <th key={h} style={{ padding: '8px 12px', textAlign: 'left', border: '1px solid #f0f0f0', color: '#595959', fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {productRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#8c8c8c', border: '1px solid #f0f0f0' }}>暂无数据</td>
                      </tr>
                    ) : productRows.map(row => (
                      <tr key={row.id}>
                        <td style={{ padding: '8px 12px', border: '1px solid #f0f0f0', whiteSpace: 'nowrap' }}>{row.category}</td>
                        <td style={{ padding: '8px 12px', border: '1px solid #f0f0f0' }}>
                          <UploadBox src={row.image} width={50} height={50} onPick={() => pickRowImage(row.id)} onRemove={() => updateRow(row.id, 'image', null)} />
                        </td>
                        <td style={{ padding: '8px 12px', border: '1px solid #f0f0f0' }}>
                          <input value={row.name} onChange={e => updateRow(row.id, 'name', e.target.value)} placeholder="请输入" style={{ ...inputStyle, width: 120 }} />
                        </td>
                        <td style={{ padding: '8px 12px', border: '1px solid #f0f0f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <input value={row.price} onChange={e => updateRow(row.id, 'price', e.target.value)} placeholder="0.00" style={{ ...inputStyle, width: 80 }} />
                            <span style={{ color: '#8c8c8c', whiteSpace: 'nowrap' }}>元</span>
                          </div>
                        </td>
                        <td style={{ padding: '8px 12px', border: '1px solid #f0f0f0' }}>
                          <input value={row.note} onChange={e => updateRow(row.id, 'note', e.target.value)} placeholder="非必填" style={{ ...inputStyle, width: 80 }} />
                        </td>
                        <td style={{ padding: '8px 12px', border: '1px solid #f0f0f0' }}>
                          <button onClick={() => addRow(row.category)} style={{ background: 'none', border: 'none', color: '#1677ff', cursor: 'pointer', fontSize: 13 }}>添加商品</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Row>,

            /* 联系人姓名 */
            <Row key="cname" label="联系人姓名" required>
              <input value={contactName} onChange={e => setContactName(e.target.value)} placeholder="请输入" style={inputStyle} />
            </Row>,

            /* 联系人手机号 */
            <Row key="cphone" label="联系人手机号" required>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden', width: 280 }}>
                <select style={{ border: 'none', outline: 'none', padding: '7px 8px', fontSize: 14, background: 'white', cursor: 'pointer' }}>
                  <option>+86</option><option>+852</option><option>+1</option>
                </select>
                <div style={{ width: 1, height: 20, backgroundColor: '#d9d9d9' }} />
                <input
                  value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="请输入"
                  style={{ flex: 1, border: 'none', outline: 'none', padding: '7px 8px', fontSize: 14 }}
                />
              </div>
            </Row>,

            /* 有无自营工厂 */
            <Row key="factory" label="有无自营工厂" required>
              <div style={{ display: 'flex', gap: 24 }}>
                {[{ v: 'yes', l: '有' }, { v: 'no', l: '无' }].map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="radio" name="factory" checked={hasFactory === o.v} onChange={() => setHasFactory(o.v as 'yes' | 'no')} />
                    <span style={{ fontSize: 14, color: '#262626' }}>{o.l}</span>
                  </label>
                ))}
              </div>
            </Row>,

            /* 有无电商平台经验 */
            <Row key="ecomm" label="有无电商平台经验" required>
              <div style={{ display: 'flex', gap: 24 }}>
                {[{ v: 'yes', l: '是' }, { v: 'no', l: '否' }].map(o => (
                  <label key={o.v} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    <input type="radio" name="ecomm" checked={hasEcommExp === o.v} onChange={() => setHasEcommExp(o.v as 'yes' | 'no')} />
                    <span style={{ fontSize: 14, color: '#262626' }}>{o.l}</span>
                  </label>
                ))}
              </div>
            </Row>,

            /* 经营图片 */
            <Row key="bizphotos" label="经营图片">
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {(['公司全景/入口', '办公室', '仓库', '车间', '抽检'] as const).map((label, idx) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <UploadBox
                      src={bizPhotos[idx]} width={70} height={70}
                      onPick={() => pickBizPhoto(idx)}
                      onRemove={() => setBizPhotos(prev => prev.map((p, i) => i === idx ? null : p))}
                    />
                    <span style={{ fontSize: 12, color: '#8c8c8c' }}>{label}</span>
                  </div>
                ))}
              </div>
            </Row>,

            /* 其他图片 */
            <Row key="other" label="其他图片">
              <UploadBox src={otherPhoto} width={70} height={70} onPick={pickOther} onRemove={() => setOtherPhoto(null)} />
            </Row>,

            /* 入驻邀请码 */
            <Row key="invite" label="入驻邀请码">
              <input
                value={inviteCode} readOnly
                style={{ ...inputStyle, backgroundColor: '#fafafa', color: '#595959', cursor: 'not-allowed' }}
              />
            </Row>,
          ]}
        </div>

        {/* 右侧说明栏 */}
        <div style={{ width: 280, flexShrink: 0, position: 'sticky', top: 20, alignSelf: 'flex-start' }}>
          <div style={{ backgroundColor: 'white', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', borderBottom: '1px solid #f0f0f0',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 3, height: 16, backgroundColor: '#1677ff', borderRadius: 2 }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#262626' }}>店铺名命名规则</span>
              </div>
              <button
                onClick={() => setSidebarOpen(o => !o)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c8c8c', fontSize: 12 }}
              >
                {sidebarOpen ? '▲' : '▼'}
              </button>
            </div>
            {sidebarOpen && (
              <div style={{ padding: 16 }}>
                <div style={{
                  fontSize: 12, color: '#ff4d4f', fontWeight: 500, marginBottom: 12,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <span>✕</span> 不符合以下规范将会被审核驳回
                </div>
                <ol style={{ paddingLeft: 16, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {NAMING_RULES.map((rule, i) => (
                    <li key={i} style={{ fontSize: 12, color: '#595959', lineHeight: 1.6 }}>{rule}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 底部固定栏 */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10,
        backgroundColor: 'white', borderTop: '1px solid #f0f0f0',
        padding: '10px 40px',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 12, color: '#595959', marginBottom: 10, lineHeight: 1.6 }}>
            <label
              style={{ display: 'flex', alignItems: 'flex-start', gap: 6, cursor: 'pointer' }}
              onClick={handleOpenAgreement}
            >
              <input
                type="checkbox" checked={agreed} readOnly
                style={{ marginTop: 2, flexShrink: 0, cursor: 'pointer' }}
              />
              <span>
                我已阅读并同意接受
                <span style={{ color: '#1677ff' }}>《数字证书使用协议》</span>、
                <span style={{ color: '#1677ff' }}>《全球数据保护附件》</span>、
                <span style={{ color: '#1677ff' }}>《商家履约规则》</span>、
                <span style={{ color: '#1677ff' }}>《虚假交易处理规则》</span>
                ，授权平台与其合作第三方机构（包括但不限于上海付赢通支付服务有限公司及其关联公司）共享本人提交的注册信息用于完成身份认证，并以电子签章形式签订
                <span style={{ color: '#1677ff' }}>《付赢通跨境资金结算服务协议》</span>
              </span>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => router.back()}
              style={{
                padding: '8px 32px', border: '1px solid #d9d9d9', borderRadius: 4,
                background: 'white', cursor: 'pointer', fontSize: 14, color: '#262626',
              }}
            >
              上一步
            </button>
            <button
              onClick={handleSubmit}
              style={{
                padding: '8px 32px', border: 'none', borderRadius: 4,
                background: '#1677ff', color: 'white', cursor: 'pointer', fontSize: 14, fontWeight: 500,
              }}
            >
              提交
            </button>
          </div>
        </div>
      </div>

      {/* ====== 协议弹框 ====== */}
      {showAgreement && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'white', borderRadius: 4, width: 620, maxHeight: '85vh',
            display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            {/* 标题栏 */}
            <div style={{
              padding: '16px 24px', textAlign: 'center', position: 'relative',
              borderBottom: '1px solid #f0f0f0',
            }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#262626' }}>
                如要入驻商家中心，请签署以下协议。
              </span>
              <button
                onClick={() => setShowAgreement(false)}
                style={{
                  position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#8c8c8c',
                  lineHeight: 1,
                }}
              >✕</button>
            </div>

            {/* 协议内容 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
              {/* 协议文本 */}
              <div style={{ fontSize: 13, color: '#262626', lineHeight: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {agreementText || '加载中...'}
              </div>

              {/* 商家规则 */}
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#262626', marginBottom: 12 }}>
                  商家规则 / Merchant Rules:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {MERCHANT_RULES.map(rule => (
                    <a key={rule} href="#" style={{ color: '#1677ff', fontSize: 13, textDecoration: 'none' }}>
                      {rule}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* 底部操作区 */}
            <div style={{
              padding: '14px 28px', borderTop: '1px solid #f0f0f0',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#262626' }}>
                <input
                  type="checkbox" checked={innerAgreed}
                  onChange={e => setInnerAgreed(e.target.checked)}
                />
                我已阅读并同意以上协议
              </label>
              <button
                onClick={handleAgreementConfirm}
                style={{
                  padding: '8px 48px', border: 'none', borderRadius: 4,
                  background: innerAgreed ? '#1677ff' : '#d9d9d9',
                  color: 'white', cursor: innerAgreed ? 'pointer' : 'not-allowed',
                  fontSize: 14, fontWeight: 500,
                }}
              >
                确认入驻
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== 确认提交对话框 ====== */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1001,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: 'white', borderRadius: 4, width: 440,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }}>
            {/* 标题 */}
            <div style={{
              padding: '16px 20px 12px', display: 'flex', alignItems: 'center', gap: 8,
              borderBottom: '1px solid #f0f0f0',
            }}>
              <span style={{ fontSize: 18, color: '#fa8c16' }}>⚠</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#262626' }}>
                店铺类别提交后不可修改，确认提交吗？
              </span>
            </div>

            {/* 内容 */}
            <div style={{ padding: '16px 20px', fontSize: 13, color: '#262626', lineHeight: 1.8 }}>
              您当前创建的是
              <strong style={{ color: '#1677ff' }}>
                {storeType === 'consignment' ? ' 半托管店铺' : ' 常规店铺'}
              </strong>
              {storeType === 'consignment' ? '，即自配送模式。' : '。'}
              {storeType === 'consignment' && (
                <span>
                  此类店铺下的商品，需要卖家
                  <strong>在销售目的地或境外指定区域有库存</strong>
                  并
                  <strong>从相应境外仓库自行发货配送至消费者</strong>
                </span>
              )}
            </div>

            {/* 按钮 */}
            <div style={{
              padding: '12px 20px 16px',
              display: 'flex', justifyContent: 'flex-end', gap: 12,
            }}>
              <button
                onClick={handleFinalSubmit}
                style={{
                  padding: '7px 20px', border: 'none', borderRadius: 4,
                  background: '#1677ff', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                }}
              >
                确认无误，提交
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                style={{
                  padding: '7px 20px', border: '1px solid #d9d9d9', borderRadius: 4,
                  background: 'white', color: '#262626', cursor: 'pointer', fontSize: 13,
                }}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 20, gap: 12 }}>
      <div style={{ width: 120, flexShrink: 0, fontSize: 14, color: '#262626', paddingTop: 8, textAlign: 'right' }}>
        {required && <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>}
        {label}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', maxWidth: 400, padding: '7px 11px',
  border: '1px solid #d9d9d9', borderRadius: 4, fontSize: 14,
  outline: 'none', color: '#262626', boxSizing: 'border-box',
}

export default function TemuShopPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#f0f0f0' }} />}>
      <ShopPage />
    </Suspense>
  )
}
