'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  UserOutlined, CloseOutlined, PlusOutlined,
  QuestionCircleOutlined, PlusCircleOutlined,
} from '@ant-design/icons'
import { Radio, Select, Input, Button, Space, Cascader } from 'antd'

const CATEGORY_CASCADER = [
  {
    value: '母婴玩具',
    label: '母婴玩具',
    children: [
      {
        value: '玩具',
        label: '玩具',
        children: [
          { value: '手办', label: '手办' },
          { value: '积木', label: '积木' },
          { value: '模型', label: '模型' },
          { value: '益智玩具', label: '益智玩具' },
          { value: '毛绒玩具', label: '毛绒玩具' },
          { value: 'RC玩具', label: 'RC玩具' },
        ],
      },
      {
        value: '母婴',
        label: '母婴',
        children: [
          { value: '婴儿推车', label: '婴儿推车' },
          { value: '婴儿床', label: '婴儿床' },
          { value: '奶瓶', label: '奶瓶' },
        ],
      },
    ],
  },
]

const PLATFORM_OPTIONS = [
  { value: '亚马逊', label: '亚马逊' },
  { value: 'eBay', label: 'eBay' },
  { value: '速卖通', label: '速卖通' },
  { value: 'Shopify独立站', label: 'Shopify独立站' },
  { value: '其他', label: '其他' },
]

const TURNOVER_OPTIONS = [
  { value: '100万以下', label: '100万以下' },
  { value: '100-500万', label: '100-500万' },
  { value: '500-1000万', label: '500-1000万' },
  { value: '1000-5000万', label: '1000-5000万' },
  { value: '5000万以上', label: '5000万以上' },
]

function UploadBox({
  required = false,
  blue = false,
  label,
}: {
  required?: boolean
  blue?: boolean
  label: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setPreview(URL.createObjectURL(file))
  }

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <div style={{ fontSize: 12, color: '#262626', marginBottom: 6 }}>
        {required && <span style={{ color: '#ff4d4f' }}>* </span>}
        {label}
      </div>
      <div
        className="flex flex-col items-center justify-center cursor-pointer rounded-lg overflow-hidden"
        style={{
          width: 120,
          height: 100,
          border: `1px dashed ${preview ? 'transparent' : (blue ? '#1677ff' : '#d9d9d9')}`,
          backgroundColor: blue ? '#f0f7ff' : '#fafafa',
          position: 'relative',
        }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <>
            <PlusOutlined style={{ fontSize: 20, color: blue ? '#1677ff' : '#bfbfbf', marginBottom: 8 }} />
            <span style={{ fontSize: 12, color: blue ? '#1677ff' : '#8c8c8c' }}>上传图片</span>
          </>
        )}
      </div>
      <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }}>支持jpg/png，不超过5M</div>
    </div>
  )
}

function SellPlan({ index }: { index: number }) {
  const imgInputRef = useRef<HTMLInputElement>(null)
  const [imgPreview, setImgPreview] = useState<string | null>(null)

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setImgPreview(URL.createObjectURL(file))
  }

  return (
    <div className="rounded-lg mb-4 p-4" style={{ backgroundColor: '#f9fafc', border: '1px solid #f0f0f0' }}>
      <input
        type="file"
        ref={imgInputRef}
        accept="image/jpeg,image/png"
        style={{ display: 'none' }}
        onChange={handleImgChange}
      />
      <div className="font-medium mb-3" style={{ fontSize: 13, color: '#262626' }}>售卖计划 - {index}</div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <div>
          <label className="block mb-1" style={{ fontSize: 12, color: '#595959' }}>
            <span style={{ color: '#ff4d4f' }}>* </span>商品名称
          </label>
          <Input placeholder="请输入" />
        </div>
        <div>
          <label className="block mb-1" style={{ fontSize: 12, color: '#595959' }}>
            <span style={{ color: '#ff4d4f' }}>* </span>供货价（CNY）
          </label>
          <Input placeholder="请输入" />
        </div>
        <div>
          <label className="block mb-1" style={{ fontSize: 12, color: '#595959' }}>
            <span style={{ color: '#ff4d4f' }}>* </span>商品图
          </label>
          <div
            className="flex flex-col items-center justify-center cursor-pointer rounded overflow-hidden"
            style={{ width: 80, height: 80, border: imgPreview ? '1px solid #e8e8e8' : '1px dashed #d9d9d9', backgroundColor: '#fafafa' }}
            onClick={() => imgInputRef.current?.click()}
          >
            {imgPreview ? (
              <img src={imgPreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <>
                <PlusOutlined style={{ fontSize: 16, color: '#bfbfbf' }} />
                <span style={{ fontSize: 11, color: '#8c8c8c', marginTop: 4 }}>上传</span>
              </>
            )}
          </div>
        </div>
        <div>
          <label className="block mb-1" style={{ fontSize: 12, color: '#595959' }}>
            <span style={{ color: '#ff4d4f' }}>* </span>品牌
          </label>
          <Select
            placeholder="请选择品牌"
            style={{ width: '100%' }}
            options={[
              { value: '自有品牌', label: '自有品牌' },
              { value: '授权品牌', label: '授权品牌' },
              { value: '无品牌', label: '无品牌' },
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default function BusinessPage() {
  const router = useRouter()

  // 主营信息
  const [brandSellType, setBrandSellType] = useState<string | null>(null)

  // 经营现状
  const [bizMode, setBizMode] = useState<string | null>(null)
  const [tradeDir, setTradeDir] = useState<string | null>(null)
  const [stockType, setStockType] = useState<string | null>(null)

  // 运营经验
  const [hasEcomExp, setHasEcomExp] = useState<string | null>(null)
  const [ecomExps, setEcomExps] = useState([{ platform: null as string | null, url: '' }])

  const addEcomExp = () => {
    setEcomExps(prev => [...prev, { platform: null, url: '' }])
  }

  // 品牌资质证明文件
  const brandFileRef = useRef<HTMLInputElement>(null)
  const [brandFileName, setBrandFileName] = useState<string | null>(null)

  // 证明文件（支持多文件）
  const proofFileRef = useRef<HTMLInputElement>(null)
  const [proofFiles, setProofFiles] = useState<Array<{ name: string; url: string }>>([])
  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }))
    setProofFiles(prev => [...prev, ...newFiles])
    e.target.value = ''
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F0F5FF', paddingBottom: 72 }}>

      {/* Header */}
      <div className="bg-white" style={{ borderBottom: '1px solid #e8e8e8' }}>
        <div className="flex items-center px-6" style={{ height: 52 }}>
          <div className="flex items-center gap-2 flex-shrink-0 mr-6">
            <div className="w-8 h-8 rounded flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1677ff, #4096ff)' }}>
              <span className="text-white font-bold italic" style={{ fontSize: 16 }}>S</span>
            </div>
            <div>
              <div className="font-semibold leading-tight" style={{ fontSize: 13 }}>跨境卖家中心</div>
              <div className="text-gray-400 leading-tight" style={{ fontSize: 10 }}>Cross-border Seller Center</div>
            </div>
          </div>

          <div className="flex items-center border rounded"
            style={{ borderColor: '#e8e8e8', height: 32, overflow: 'hidden' }}>
            <div className="flex items-center gap-1.5 px-3 h-full"
              style={{ backgroundColor: '#f5f8ff', borderRight: '1px solid #e8e8e8' }}>
              <div className="w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#FF4422', fontSize: 8, color: '#fff', fontWeight: 700 }}>AE</div>
              <span className="text-xs font-medium" style={{ color: '#1677ff' }}>AliExpress</span>
              <span className="text-xs px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#FFF7E6', color: '#FA8C16', border: '1px solid #FFD591', fontSize: 10 }}>
                开店中
              </span>
              <CloseOutlined style={{ fontSize: 10, color: '#bfbfbf', marginLeft: 2, cursor: 'pointer' }} />
            </div>
            <div className="flex items-center px-3 h-full text-xs text-gray-400 cursor-pointer hover:bg-gray-50"
              style={{ gap: 4 }}>
              <PlusOutlined style={{ fontSize: 10 }} />
            </div>
          </div>

          <span className="text-sm text-gray-600 ml-2">AliExpress Store</span>

          <div className="ml-auto w-8 h-8 rounded-full flex items-center justify-center cursor-pointer flex-shrink-0"
            style={{ backgroundColor: '#ff4d4f' }}>
            <UserOutlined style={{ color: '#fff', fontSize: 14 }} />
          </div>
        </div>
      </div>

      {/* 主内容 */}
      <div className="px-6 py-6" style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* 页面标题 */}
        <h1 className="font-bold mb-4" style={{ fontSize: 20, color: '#1a1a2e' }}>第三步：经营信息填报</h1>

        {/* 温馨提示框 */}
        <div className="rounded-lg mb-5 px-4 py-3"
          style={{ backgroundColor: '#e8f4ff', border: '1px solid #91caff' }}>
          <div className="font-medium mb-1" style={{ fontSize: 13, color: '#1677ff' }}>温馨提示</div>
          <div style={{ fontSize: 12, color: '#4096ff', lineHeight: 1.9 }}>
            <div>1. 请据实填写您的企业经营信息，平台将根据该信息进行综合评估，请确保您提交的信息真实准确，否则将影响入驻审核结果。</div>
            <div>2. 请您提供的资料、图片及信息符合真实企业经营情况，若上传的图片/视频/文件中包含身份证、护照、合同等敏感信息，请做好遮挡处理。</div>
          </div>
        </div>

        {/* 白色主卡片 */}
        <div className="bg-white rounded-xl" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)', padding: '28px 40px' }}>

          {/* ===== 主营信息 ===== */}
          <section className="mb-8">
            <h2 className="font-semibold mb-5" style={{
              fontSize: 15, color: '#1a1a2e',
              borderBottom: '1px solid #f0f0f0', paddingBottom: 12,
            }}>
              主营信息
            </h2>

            {/* 经营大类 */}
            <div className="mb-5">
              <label className="block mb-1.5" style={{ fontSize: 13, color: '#262626' }}>经营大类</label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded text-sm"
                  style={{ backgroundColor: '#f0f5ff', color: '#1677ff', border: '1px solid #adc6ff' }}>
                  母婴玩具
                </span>
                <span style={{ fontSize: 12, color: '#8c8c8c' }}>（由您选择的类目权限决定）</span>
              </div>
            </div>

            {/* 计划主营类目 */}
            <div className="mb-5">
              <label className="block mb-1.5" style={{ fontSize: 13, color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>
                计划主营类目{' '}
                <QuestionCircleOutlined style={{ fontSize: 13, color: '#bfbfbf', cursor: 'pointer' }} />
              </label>
              <Cascader
                options={CATEGORY_CASCADER}
                defaultValue={['母婴玩具', '玩具', '手办']}
                style={{ width: 280 }}
                placeholder="请选择"
              />
            </div>

            {/* 计划售卖品牌类型 */}
            <div className="mb-5">
              <label className="block mb-2" style={{ fontSize: 13, color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>
                计划售卖品牌类型{' '}
                <QuestionCircleOutlined style={{ fontSize: 13, color: '#bfbfbf', cursor: 'pointer' }} />
              </label>
              <Radio.Group value={brandSellType} onChange={e => setBrandSellType(e.target.value)}>
                <Radio value="品牌"><span style={{ fontSize: 13 }}>品牌</span></Radio>
                <Radio value="无"><span style={{ fontSize: 13 }}>无</span></Radio>
              </Radio.Group>
            </div>

            {/* 品牌信息表格（选品牌后显示） */}
            {brandSellType === '品牌' && (
              <div className="mb-5">
                <div className="mb-2" style={{ fontSize: 13, color: '#262626' }}>
                  <span style={{ color: '#ff4d4f' }}>* </span>品牌信息
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ border: '1px solid #e8e8e8', padding: '8px 12px', textAlign: 'left', color: '#595959', fontWeight: 500 }}>品牌</th>
                      <th style={{ border: '1px solid #e8e8e8', padding: '8px 12px', textAlign: 'left', color: '#595959', fontWeight: 500 }}>品牌资质类型</th>
                      <th style={{ border: '1px solid #e8e8e8', padding: '8px 12px', textAlign: 'left', color: '#595959', fontWeight: 500 }}>品牌资质证明文件</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #e8e8e8', padding: '8px 12px' }}>
                        <Input placeholder="请输入品牌名称" style={{ width: 140 }} />
                      </td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '8px 12px' }}>
                        <Radio.Group>
                          <Radio value="自有品牌"><span style={{ fontSize: 12 }}>自有品牌</span></Radio>
                          <Radio value="授权品牌"><span style={{ fontSize: 12 }}>授权品牌</span></Radio>
                        </Radio.Group>
                      </td>
                      <td style={{ border: '1px solid #e8e8e8', padding: '8px 12px' }}>
                        <input
                          type="file"
                          ref={brandFileRef}
                          accept="image/jpeg,image/png,application/pdf"
                          style={{ display: 'none' }}
                          onChange={e => {
                            const f = e.target.files?.[0]
                            if (f) setBrandFileName(f.name)
                          }}
                        />
                        {brandFileName ? (
                          <span style={{ fontSize: 12, color: '#262626' }}>{brandFileName}</span>
                        ) : (
                          <div
                            className="inline-flex items-center gap-1 cursor-pointer rounded px-2 py-1"
                            style={{ border: '1px dashed #d9d9d9', backgroundColor: '#fafafa', fontSize: 12, color: '#595959' }}
                            onClick={() => brandFileRef.current?.click()}
                          >
                            <PlusOutlined style={{ fontSize: 11 }} />
                            上传文件
                          </div>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  className="flex items-center gap-1 mt-2 cursor-pointer"
                  style={{ fontSize: 13, color: '#1677ff' }}
                >
                  <PlusCircleOutlined style={{ fontSize: 13 }} />
                  添加品牌
                </div>
              </div>
            )}

            {/* 售卖计划 */}
            <div>
              <label className="block mb-3" style={{ fontSize: 13, color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>
                售卖计划{' '}
                <QuestionCircleOutlined style={{ fontSize: 13, color: '#bfbfbf', cursor: 'pointer' }} />
              </label>
              <SellPlan index={1} />
              <SellPlan index={2} />
              <SellPlan index={3} />
            </div>
          </section>

          <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 32 }} />

          {/* ===== 经营现状 ===== */}
          <section className="mb-8">
            <h2 className="font-semibold mb-5" style={{
              fontSize: 15, color: '#1a1a2e',
              borderBottom: '1px solid #f0f0f0', paddingBottom: 12,
            }}>
              经营现状
            </h2>

            {/* 经营模式 */}
            <div className="mb-5">
              <label className="block mb-2" style={{ fontSize: 13, color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>经营模式
              </label>
              <Radio.Group value={bizMode} onChange={e => setBizMode(e.target.value)}>
                <Radio value="工贸一体"><span style={{ fontSize: 13 }}>工贸一体</span></Radio>
                <Radio value="纯工厂"><span style={{ fontSize: 13 }}>纯工厂</span></Radio>
                <Radio value="贸易商"><span style={{ fontSize: 13 }}>贸易商</span></Radio>
              </Radio.Group>
            </div>

            {/* 贸易方向 */}
            <div className="mb-5">
              <label className="block mb-2" style={{ fontSize: 13, color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>贸易方向
              </label>
              <Radio.Group value={tradeDir} onChange={e => setTradeDir(e.target.value)}>
                <Radio value="纯外贸"><span style={{ fontSize: 13 }}>纯外贸</span></Radio>
                <Radio value="纯内贸"><span style={{ fontSize: 13 }}>纯内贸</span></Radio>
                <Radio value="内外贸结合"><span style={{ fontSize: 13 }}>内外贸结合</span></Radio>
              </Radio.Group>
            </div>

            {/* 进货类型 */}
            <div className="mb-7">
              <label className="block mb-2" style={{ fontSize: 13, color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>进货类型
              </label>
              <Radio.Group value={stockType} onChange={e => setStockType(e.target.value)}>
                <Radio value="自有工厂供货"><span style={{ fontSize: 13 }}>自有工厂供货</span></Radio>
                <Radio value="合作工厂供货"><span style={{ fontSize: 13 }}>合作工厂供货</span></Radio>
                <Radio value="三方拿货"><span style={{ fontSize: 13 }}>三方拿货</span></Radio>
                <Radio value="其他"><span style={{ fontSize: 13 }}>其他</span></Radio>
              </Radio.Group>
            </div>

            {/* 经营环境图 */}
            <div>
              <label className="block mb-3" style={{ fontSize: 13, color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>
                经营环境图{' '}
                <QuestionCircleOutlined style={{ fontSize: 13, color: '#bfbfbf', cursor: 'pointer' }} />
              </label>
              <div className="flex gap-6 flex-wrap">
                <UploadBox required label="公司入口" />
                <UploadBox required label="仓库" />
                <UploadBox label="工厂" />
                <UploadBox label="关联主体证明" blue />
              </div>
            </div>
          </section>

          <div style={{ borderBottom: '1px solid #f0f0f0', marginBottom: 32 }} />

          {/* ===== 运营经验 ===== */}
          <section>
            <h2 className="font-semibold mb-5" style={{
              fontSize: 15, color: '#1a1a2e',
              borderBottom: '1px solid #f0f0f0', paddingBottom: 12,
            }}>
              运营经验
            </h2>

            {/* 是否有电商平台运营经验 */}
            <div className="mb-5">
              <label className="block mb-2" style={{ fontSize: 13, color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>是否有电商平台运营经验
              </label>
              <Radio.Group value={hasEcomExp} onChange={e => setHasEcomExp(e.target.value)}>
                <Radio value="是"><span style={{ fontSize: 13 }}>是</span></Radio>
                <Radio value="否"><span style={{ fontSize: 13 }}>否</span></Radio>
              </Radio.Group>
            </div>

            {/* 有电商经验时展开 */}
            {hasEcomExp === '是' && (
              <div className="mb-5 pl-2">
                {ecomExps.map((exp, i) => (
                  <div key={i} className="mb-4">
                    <div className="mb-2" style={{ fontSize: 13, color: '#595959' }}>
                      电商平台经验 - {i + 1}
                    </div>
                    <div className="flex items-end gap-4">
                      <div>
                        <label className="block mb-1" style={{ fontSize: 12, color: '#8c8c8c' }}>
                          <span style={{ color: '#ff4d4f' }}>* </span>平台
                        </label>
                        <Select
                          placeholder="请选择"
                          style={{ width: 160 }}
                          options={PLATFORM_OPTIONS}
                          value={exp.platform}
                          onChange={val =>
                            setEcomExps(prev => prev.map((e, idx) => idx === i ? { ...e, platform: val } : e))
                          }
                        />
                      </div>
                      <div style={{ flex: 1, maxWidth: 320 }}>
                        <label className="block mb-1" style={{ fontSize: 12, color: '#8c8c8c' }}>
                          <span style={{ color: '#ff4d4f' }}>* </span>店铺链接
                        </label>
                        <Input
                          placeholder="请输入"
                          value={exp.url}
                          onChange={e =>
                            setEcomExps(prev => prev.map((ex, idx) => idx === i ? { ...ex, url: e.target.value } : ex))
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div
                  className="flex items-center gap-1 cursor-pointer mt-1"
                  style={{ fontSize: 13, color: '#1677ff' }}
                  onClick={addEcomExp}
                >
                  <PlusCircleOutlined style={{ fontSize: 13 }} />
                  新增电商平台经验
                </div>
              </div>
            )}

            {/* 公司年成交额 */}
            <div className="mb-5">
              <label className="block mb-2" style={{ fontSize: 13, color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>公司年成交额
              </label>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 6 }}>年成交额</div>
              <Space.Compact>
                <Select
                  defaultValue="CNY"
                  style={{ width: 80 }}
                  options={[{ value: 'CNY', label: 'CNY' }, { value: 'USD', label: 'USD' }]}
                />
                <Select
                  placeholder="请选择"
                  style={{ width: 200 }}
                  options={TURNOVER_OPTIONS}
                />
              </Space.Compact>
            </div>

            {/* 证明文件 */}
            <div>
              <label className="block mb-2" style={{ fontSize: 13, color: '#262626' }}>
                <span style={{ color: '#ff4d4f' }}>* </span>证明文件
              </label>
              <input
                type="file"
                ref={proofFileRef}
                accept="image/jpeg,image/png,application/pdf"
                multiple
                style={{ display: 'none' }}
                onChange={handleProofChange}
              />
              <div className="flex items-start gap-4">
                {/* 已上传的文件缩略图 */}
                {proofFiles.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 rounded overflow-hidden"
                    style={{ width: 80, height: 80, border: '1px solid #e8e8e8', position: 'relative' }}
                  >
                    {f.name.toLowerCase().endsWith('.pdf') ? (
                      <div className="w-full h-full flex flex-col items-center justify-center"
                        style={{ backgroundColor: '#fff2f0' }}>
                        <span style={{ fontSize: 11, color: '#ff4d4f', fontWeight: 600 }}>PDF</span>
                        <span style={{ fontSize: 10, color: '#8c8c8c', marginTop: 2, maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                      </div>
                    ) : (
                      <img src={f.url} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                ))}
                {/* 上传按钮 */}
                {proofFiles.length < 10 && (
                  <div
                    className="flex flex-col items-center justify-center cursor-pointer rounded-lg flex-shrink-0"
                    style={{ width: 80, height: 80, border: '1px dashed #d9d9d9', backgroundColor: '#fafafa' }}
                    onClick={() => proofFileRef.current?.click()}
                  >
                    <PlusOutlined style={{ fontSize: 18, color: '#bfbfbf', marginBottom: 6 }} />
                    <span style={{ fontSize: 11, color: '#8c8c8c' }}>上传文件</span>
                  </div>
                )}
              </div>
              <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: 1.9, marginTop: 8, marginBottom: 4 }}>
                请上传证明公司年成交额的材料，支持jpg/png/pdf格式，不超过10M，最多上传10个文件
              </div>
              <div style={{ fontSize: 12, color: '#ff4d4f', lineHeight: 1.9 }}>
                参考材料：
                <span className="cursor-pointer" style={{ color: '#1677ff' }}>增值税发票</span>
                、
                <span className="cursor-pointer" style={{ color: '#1677ff' }}>海关报关单</span>
                、
                <span className="cursor-pointer" style={{ color: '#1677ff' }}>外汇收款凭证</span>
                、
                <span className="cursor-pointer" style={{ color: '#1677ff' }}>第三方平台订单截图</span>
                等可证明年成交额的材料
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* FAQ - fixed 定位 */}
      <div className="fixed bg-white rounded-xl p-5"
        style={{ right: 24, top: 80, width: 160, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <h3 className="font-semibold mb-3" style={{ fontSize: 14, color: '#1a1a2e' }}>FAQ</h3>
        <p className="text-sm cursor-pointer" style={{ color: '#1677ff' }}>· 经营信息填写常见问题</p>
      </div>

      {/* 底部固定工具栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white flex items-center justify-between px-6"
        style={{ height: 56, borderTop: '1px solid #e8e8e8', boxShadow: '0 -2px 8px rgba(0,0,0,0.06)' }}>
        <Button size="large" style={{ minWidth: 96 }} onClick={() => router.back()}>返回上一步</Button>
        <div className="flex gap-3">
          <Button size="large" style={{ minWidth: 72 }}>保存</Button>
          <Button
            type="primary"
            size="large"
            style={{ minWidth: 72, backgroundColor: '#1677ff' }}
            onClick={() => router.push('/shop-register/activate?step=3&review=1')}
          >
            下一步
          </Button>
        </div>
      </div>
    </div>
  )
}
