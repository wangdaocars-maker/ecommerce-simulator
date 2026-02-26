'use client'

import React, { useState } from 'react'
import { Button, Checkbox, Input, Modal, Popover, Radio, Select } from 'antd'
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  FullscreenOutlined,
  LinkOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  BgColorsOutlined,
} from '@ant-design/icons'
import { useSearchParams, useRouter } from 'next/navigation'
import TemuMediaModal from '@/components/temu/TemuMediaModal'

const BLUE = '#1677ff'
const ORANGE = '#FA8C16'

// ==================== 分类数据（与 CreateProductPage 同源）====================
const categoryData: Record<string, string[]> = {
  __root__: ['CD和黑胶唱片', '办公用品', '宠物用品', '家电', '电子', '工业和科学', '家居、厨房用品', '家居装修', '健康和家居用品', '乐器'],
  '家居、厨房用品': ['厨房和餐厅', '真空吸尘器和地板护理', '熨烫用品', '活动和派对用品', '浴室用品', '床上用品', '家居装饰', '家具', '收纳用品', '装饰字画'],
  '家具': ['卧室家具', '办公家具', '儿童家具', '客厅家具', '餐厅家具', '门厅家具', '儿童房家具', '厨房家具', '家具替换零件', '浴室家具'],
  '客厅家具': ['家庭娱乐家具', '客厅家具套装', '儿童家具', '客厅单人椅', '沙发和沙发床', '休闲椅', '梯架', '沙发床', '客厅桌', '软垫凳和带储藏箱的软垫凳', '客厅收纳储物柜'],
  '餐厅家具': ['餐桌', '餐椅', '餐边柜、餐具柜', '酒柜', '餐厅套装'],
  '卧室家具': ['床', '床头柜', '衣柜', '梳妆台', '卧室套装'],
  '家庭娱乐家具': ['电视柜和娱乐柜', '书柜', '展示柜'],
}

/** 从叶节点反向搜索完整路径（不含 __root__） */
function findCategoryPath(target: string): string[] {
  function dfs(node: string, path: string[]): string[] | null {
    const children = categoryData[node] || []
    for (const child of children) {
      if (child === target) return [...path, child]
      const result = dfs(child, [...path, child])
      if (result) return result
    }
    return null
  }
  return dfs('__root__', []) || [target]
}

// ==================== 步骤条（步骤2激活）====================
function StepBar() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, padding: '20px 0 4px' }}>
      {/* 步骤1：已完成 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          border: `2px solid ${BLUE}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: BLUE, fontSize: 13,
        }}>
          <CheckOutlined style={{ fontSize: 12 }} />
        </div>
        <span style={{ color: BLUE, fontSize: 14 }}>选择商品分类</span>
      </div>

      {/* 连接线 */}
      <div style={{ width: 100, height: 1, backgroundColor: BLUE, margin: '0 12px' }} />

      {/* 步骤2：当前 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          backgroundColor: BLUE,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 13, fontWeight: 600,
        }}>2</div>
        <span style={{ color: BLUE, fontWeight: 600, fontSize: 14 }}>基本信息</span>
      </div>
    </div>
  )
}

// ==================== 图片上传槽 ====================
function UploadSlot({ hint, imageUrl }: { hint?: string; imageUrl?: string }) {
  const borderColor = '#d9d9d9'

  if (imageUrl) {
    return (
      <div style={{
        width: 90, height: 90, flexShrink: 0,
        border: `2px solid ${BLUE}`,
        borderRadius: 4, overflow: 'hidden',
        cursor: 'pointer', position: 'relative',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    )
  }

  return (
    <div style={{
      width: 90, height: 90, flexShrink: 0,
      border: `1px dashed ${borderColor}`,
      borderRadius: 4, backgroundColor: '#fafafa',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 11,
      color: '#999', textAlign: 'center', lineHeight: '16px',
      padding: '6px 4px',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
      onMouseLeave={e => (e.currentTarget.style.borderColor = borderColor)}
    >
      {hint ? (
        <span style={{ whiteSpace: 'pre-wrap' }}>{hint}</span>
      ) : (
        <>
          <UploadOutlined style={{ fontSize: 18, color: '#bbb', marginBottom: 4 }} />
          <span style={{ fontSize: 11, color: '#bbb' }}>高清大图</span>
        </>
      )}
    </div>
  )
}

// ==================== 素材中心 / AI制图 按钮 ====================
function MediaBtn({ icon, label, showNew }: { icon: React.ReactNode; label: string; showNew?: boolean }) {
  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button style={{
        width: 90, height: 90,
        border: '1px dashed #d9d9d9', borderRadius: 4,
        backgroundColor: '#fafafa', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 4,
        fontSize: 12, color: '#555',
      }}>
        {icon}
        {label}
      </button>
      {showNew && (
        <span style={{
          position: 'absolute', top: -8, right: -8,
          backgroundColor: '#FFD700', color: '#000',
          fontSize: 10, fontWeight: 700, padding: '1px 5px',
          borderRadius: 3, lineHeight: '16px',
        }}>NEW</span>
      )}
    </div>
  )
}

// ==================== 国家/地区选项 ====================
const COUNTRY_OPTIONS = [
  { value: 'US', label: '美国' },
  { value: 'GB', label: '英国' },
  { value: 'DE', label: '德国' },
  { value: 'FR', label: '法国' },
  { value: 'IT', label: '意大利' },
  { value: 'ES', label: '西班牙' },
  { value: 'NL', label: '荷兰' },
  { value: 'PL', label: '波兰' },
  { value: 'CA', label: '加拿大' },
  { value: 'AU', label: '澳大利亚' },
  { value: 'JP', label: '日本' },
  { value: 'KR', label: '韩国' },
  { value: 'SG', label: '新加坡' },
  { value: 'MX', label: '墨西哥' },
  { value: 'BR', label: '巴西' },
  { value: 'SA', label: '沙特阿拉伯' },
  { value: 'AE', label: '阿联酋' },
  { value: 'SE', label: '瑞典' },
  { value: 'NO', label: '挪威' },
  { value: 'DK', label: '丹麦' },
  { value: 'FI', label: '芬兰' },
  { value: 'BE', label: '比利时' },
  { value: 'AT', label: '奥地利' },
  { value: 'CH', label: '瑞士' },
  { value: 'PT', label: '葡萄牙' },
  { value: 'CZ', label: '捷克' },
  { value: 'RO', label: '罗马尼亚' },
  { value: 'HU', label: '匈牙利' },
  { value: 'GR', label: '希腊' },
  { value: 'IE', label: '爱尔兰' },
  { value: 'NZ', label: '新西兰' },
  { value: 'ZA', label: '南非' },
  { value: 'IL', label: '以色列' },
  { value: 'TR', label: '土耳其' },
  { value: 'PH', label: '菲律宾' },
  { value: 'TH', label: '泰国' },
  { value: 'MY', label: '马来西亚' },
  { value: 'ID', label: '印度尼西亚' },
  { value: 'IN', label: '印度' },
]

// ==================== 主组件 ====================
export default function CreateProductDetailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get('category') || '客厅单人椅'
  const pathArr = findCategoryPath(category)

  const [languages, setLanguages] = useState<string[]>(['英语'])
  const [mediaModalVisible, setMediaModalVisible] = useState(false)
  const [currentLang, setCurrentLang] = useState<string>('英语')
  const [carouselImages, setCarouselImages] = useState<Record<string, string[]>>({})
  const [productName, setProductName] = useState('')
  const [englishName, setEnglishName] = useState('')
  const [capitalizeFirst, setCapitalizeFirst] = useState(true)
  const [videoModalVisible, setVideoModalVisible] = useState(false)
  const [mainVideoUrl, setMainVideoUrl] = useState<string>('')
  const [originCountry, setOriginCountry] = useState<string>('')
  const [sensitiveYesNo, setSensitiveYesNo] = useState<string>('否')
  const [sensitiveProperty, setSensitiveProperty] = useState<string | undefined>(undefined)
  const [volumeL, setVolumeL] = useState('')
  const [volumeM, setVolumeM] = useState('')
  const [volumeS, setVolumeS] = useState('')
  const [productWeight, setProductWeight] = useState('')
  const [sensitivePopOpen, setSensitivePopOpen] = useState(false)
  const [volumePopOpen, setVolumePopOpen] = useState(false)

  // SKU信息
  const [skuRefLink, setSkuRefLink] = useState('')
  const [skuDeclarePrice, setSkuDeclarePrice] = useState('')
  const [skuStock, setSkuStock] = useState('')
  const [skuCategoryVal, setSkuCategoryVal] = useState<string | undefined>(undefined)
  const [skuRetailPrice, setSkuRetailPrice] = useState<string | undefined>(undefined)
  const [skuItemNumber, setSkuItemNumber] = useState('')
  const [certModalVisible, setCertModalVisible] = useState(false)
  const [packingItems, setPackingItems] = useState<{ id: number; item: string | undefined; qty: string }[]>([
    { id: 1, item: undefined, qty: '' },
  ])
  const addPackingItem = () =>
    setPackingItems(prev => [...prev, { id: Date.now(), item: undefined, qty: '' }])
  const removePackingItem = (id: number) =>
    setPackingItems(prev => prev.filter(p => p.id !== id))
  const updatePackingItem = (id: number, field: 'item' | 'qty', value: string | undefined) =>
    setPackingItems(prev => prev.map(p => (p.id === id ? { ...p, [field]: value } : p)))

  // SKU 表头 Popover 状态
  const [declarePricePopOpen, setDeclarePricePopOpen] = useState(false)
  const [retailPricePopOpen, setRetailPricePopOpen] = useState(false)
  const [skuCatPopOpen, setSkuCatPopOpen] = useState(false)
  const [packingPopOpen, setPackingPopOpen] = useState(false)
  const [retailCurrency, setRetailCurrency] = useState('USD')
  const [retailCurrencyOpen, setRetailCurrencyOpen] = useState(false)
  const [skuCatDropOpen, setSkuCatDropOpen] = useState(false)

  const CURRENCY_OPTIONS = [
    { value: 'USD', label: 'USD（$）' },
    { value: 'CNY', label: 'CNY（¥）' },
    { value: 'JPY', label: 'JPY（¥）' },
    { value: 'CAD', label: 'CAD（CA$）' },
    { value: 'GBP', label: 'GBP（£）' },
    { value: 'AUD', label: 'AUD（AU$）' },
  ]
  const SKU_CAT_OPTIONS = [
    { value: 'single', label: '单品', desc: '仅1件商品（如1个碗、1对耳环）' },
    { value: 'multi', label: '同款多件装', desc: '多件同规格同种类单品（如2个相同的杯子）' },
    { value: 'bundle', label: '混合套装', desc: '多件不同品类/规格单品（如1个杯子+1个勺子）' },
  ]
  const PACKING_GOODS = ['测试配件1', '电源适配器', '插针', '说明书', '螺丝', '螺丝刀']

  const langOptions = ['英语', '西班牙语', '法语', '阿拉伯语', '韩语']

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 52px)', paddingBottom: 88 }}>

      {/* 顶部白色区域 */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 32px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 4, height: 20, backgroundColor: BLUE, borderRadius: 2 }} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>新建商品</h2>
        </div>
        <StepBar />
      </div>

      {/* 内容区 */}
      <div style={{ maxWidth: 1400, margin: '24px auto', padding: '0 24px' }}>
        {/* 右上角链接 */}
        <div style={{ textAlign: 'right', fontSize: 13, color: '#666', marginBottom: 12 }}>
          不知道如何发品？<a href="#" style={{ color: BLUE }}>查看发品攻略</a>
        </div>

        {/* 白色卡片 */}
        <div style={{ backgroundColor: '#fff', borderRadius: 4, padding: '24px 32px' }}>

          {/* 经营站点 & 商品分类 */}
          <div style={{ marginBottom: 24, fontSize: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 10 }}>
              <span style={{ color: '#666', width: 80, textAlign: 'right', flexShrink: 0 }}>经营站点</span>
              <span style={{ color: '#333', fontWeight: 500 }}>美国站</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: '#666', width: 80, textAlign: 'right', flexShrink: 0 }}>商品分类</span>
              <span style={{ color: '#333' }}>
                {pathArr.join(' > ')}
              </span>
              <a href="/temu/products/create" style={{ color: BLUE, fontSize: 13 }}>修改</a>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f5f5f5', margin: '0 -32px 24px' }} />

          {/* 素材语言 */}
          <div style={{ display: 'flex', marginBottom: 28 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 2 }}>
              <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>素材语言
            </label>
            <div style={{ flex: 1 }}>
              {/* 提示框 */}
              <div style={{
                backgroundColor: '#FFFBE6', border: '1px solid #FFE58F',
                borderRadius: 4, padding: '10px 14px', marginBottom: 14,
                fontSize: 13, color: '#666', display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <ExclamationCircleFilled style={{ color: ORANGE, marginTop: 1, flexShrink: 0 }} />
                <span>
                  图片包含文字卖点或商品说明，建议勾选多语言素材上传，让商品描述精准适配目标市场语言。提升购买意愿。
                  <a href="#" style={{ color: BLUE, marginLeft: 4 }}>了解更多</a>
                </span>
              </div>
              {/* 语言复选框 */}
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                {langOptions.map(lang => (
                  <Checkbox
                    key={lang}
                    checked={languages.includes(lang)}
                    onChange={e => {
                      if (e.target.checked) setLanguages(prev => [...prev, lang])
                      else setLanguages(prev => prev.filter(l => l !== lang))
                    }}
                  >
                    {lang}
                  </Checkbox>
                ))}
              </div>
            </div>
          </div>

          {/* 商品轮播图 */}
          <div style={{ display: 'flex', marginBottom: 28 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 2 }}>
              商品轮播图
            </label>
            <div style={{ flex: 1 }}>
              {/* 类目警告 */}
              <div style={{
                backgroundColor: '#FFF7E6', border: '1px solid #FFD591',
                borderRadius: 4, padding: '10px 14px', marginBottom: 16,
                fontSize: 13, display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <ExclamationCircleFilled style={{ color: ORANGE, marginTop: 1, flexShrink: 0 }} />
                <span>
                  <span style={{ color: ORANGE, fontWeight: 500 }}>{category}</span>
                  类目下的商品需上传尺寸图，若未上传或上传的尺寸图
                  <span style={{ color: ORANGE, fontWeight: 500 }}>不符合规范</span>
                  ，图片将会
                  <span style={{ color: ORANGE }}>更新失败</span>
                  &nbsp;<a href="#" style={{ color: BLUE }}>查看示例</a>
                </span>
              </div>

              {/* 图片上传区 */}
              <div style={{ padding: '0 0 4px' }}>

                {/* 列组标题行：主图 / 尺寸图 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingLeft: 88 }}>
                  {/* 主图标题：跨2个槽 (90+8+90=188px) */}
                  <div style={{ width: 188, display: 'flex', justifyContent: 'center' }}>
                    <span style={{
                      padding: '3px 24px', border: '1px solid #d9d9d9',
                      borderRadius: 20, fontSize: 13, color: '#666', backgroundColor: '#fff',
                    }}>主图</span>
                  </div>
                  {/* 尺寸图标题：跨3个槽 (90+8+90+8+90=286px) */}
                  <div style={{ width: 286, display: 'flex', justifyContent: 'center' }}>
                    <span style={{
                      padding: '3px 24px', border: '1px solid #d9d9d9',
                      borderRadius: 20, fontSize: 13, color: '#666', backgroundColor: '#fff',
                    }}>尺寸图</span>
                  </div>
                </div>

                {/* 每种语言一行 */}
                {languages.map(lang => {
                  const imgs = carouselImages[lang] || []
                  return (
                    <div key={lang} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      {/* 语言标签 */}
                      <div style={{ width: 80, textAlign: 'right', paddingRight: 8, flexShrink: 0 }}>
                        <div style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>
                          <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>{lang}
                        </div>
                        {lang !== '英语' && (
                          <a href="#" onClick={e => e.preventDefault()}
                            style={{ fontSize: 12, color: '#999', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', marginTop: 2 }}>
                            ↺ 复制英语
                          </a>
                        )}
                      </div>
                      {/* 主图 2 槽 */}
                      <UploadSlot hint={'背景简洁\n突出商品\n卖点'} imageUrl={imgs[0]} />
                      <UploadSlot imageUrl={imgs[1]} />
                      {/* 尺寸图 3 槽 */}
                      <UploadSlot hint={'需提供公制\n和英制单位'} imageUrl={imgs[2]} />
                      <UploadSlot imageUrl={imgs[3]} />
                      <UploadSlot imageUrl={imgs[4]} />
                      {/* 素材中心 & AI制图 */}
                      <div onClick={() => { setCurrentLang(lang); setMediaModalVisible(true) }}>
                        <MediaBtn icon={<UploadOutlined style={{ fontSize: 20, color: '#aaa' }} />} label="素材中心" />
                      </div>
                      <MediaBtn icon={<BgColorsOutlined style={{ fontSize: 20, color: '#aaa' }} />} label="AI 制图" showNew />
                    </div>
                  )
                })}

                {/* 说明文字 */}
                <div style={{ fontSize: 12, color: '#999', marginTop: 4, paddingLeft: 88 }}>
                  <div>轮播图要求3-10张，宽高比例为1:1且宽高均大于800px，大小2M内；请勿遗漏尺寸图</div>
                  <div>请补充对应语种的轮播图素材，单个语种轮播图至少需要有1张与英语轮播图不同</div>
                </div>
              </div>
            </div>
          </div>

          {/* 商品素材图 */}
          <div style={{ display: 'flex', marginBottom: 28 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 2 }}>
              <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>商品素材图
            </label>
            <div style={{ flex: 1 }}>
              {/* 上传占位 */}
              <div style={{
                width: 120, height: 120,
                border: '1px dashed #d9d9d9', borderRadius: 4,
                backgroundColor: '#fafafa',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: '#bbb', fontSize: 13,
                marginBottom: 10,
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = '#d9d9d9')}
              >
                暂未上传
              </div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                素材图会用于收藏、足迹的场景，图片展示效果可能影响用户下单的转化
              </div>
              <div style={{ fontSize: 12, color: '#999' }}>
                上传商品规格图片后会自动裁剪成1:1的缩略图
              </div>
            </div>
          </div>

          {/* 主图视频 */}
          <div style={{ display: 'flex', marginBottom: 28 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 2 }}>
              主图视频
            </label>
            <div style={{ flex: 1 }}>
              {/* 上传按钮 / 视频预览 */}
              {mainVideoUrl ? (
                <div style={{
                  width: 120, height: 120, borderRadius: 4, overflow: 'hidden',
                  border: `2px solid ${BLUE}`, marginBottom: 12, position: 'relative', cursor: 'pointer',
                }} onClick={() => setVideoModalVisible(true)}>
                  <video src={mainVideoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.25)',
                  }}>
                    <span style={{ color: '#fff', fontSize: 12 }}>点击更换</span>
                  </div>
                </div>
              ) : (
                <div style={{
                  width: 120, height: 120,
                  border: '1px dashed #d9d9d9', borderRadius: 4,
                  backgroundColor: '#fafafa',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#999', gap: 6,
                  marginBottom: 12,
                }}
                  onClick={() => setVideoModalVisible(true)}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#d9d9d9')}
                >
                  <UploadOutlined style={{ fontSize: 22, color: '#bbb' }} />
                  <span style={{ fontSize: 13 }}>上传视频</span>
                </div>
              )}
              {/* 专属福利 */}
              <div style={{ fontSize: 13, marginBottom: 6 }}>
                专属福利：
                <a href="#" style={{ color: ORANGE }}>上传主图视频抢专属权益，用户最高可享8折优惠</a>
                &nbsp;
                <a href="#" style={{ color: BLUE }}>查看全部福利</a>
              </div>
              {/* 尺寸规格 */}
              <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
                尺寸规格：推荐1:1或3:4，小于600秒，500M内
              </div>
              {/* 内容规范 */}
              <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>
                内容规范：贴合商品，无黑边水印，无侵权风险。建议
                <span style={{ color: ORANGE }}>前5秒展示核心卖点</span>
                ，并配上语音或英文字幕
              </div>
              {/* 帮助链接 */}
              <div style={{ fontSize: 13, color: '#666' }}>
                需要帮助？&nbsp;
                <a href="#" style={{ color: BLUE }}>视频拍摄服务</a>
                &nbsp;和&nbsp;
                <a href="#" style={{ color: BLUE }}>音频翻译</a>
                &nbsp;工具，助您轻松创作；更多示例请见&nbsp;
                <a href="#" style={{ color: BLUE }}>优质视频拍摄指引</a>
              </div>
            </div>
          </div>

          {/* 商品名称 */}
          <div style={{ display: 'flex', marginBottom: 28 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 6 }}>
              <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>商品名称
            </label>
            <div style={{ flex: 1 }}>
              <Input
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="请输入"
                size="large"
              />
            </div>
          </div>

          {/* 英文名称 */}
          <div style={{ display: 'flex', marginBottom: 28 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 6 }}>
              <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>英文名称
            </label>
            <div style={{ flex: 1 }}>
              <Input
                value={englishName}
                onChange={e => setEnglishName(e.target.value)}
                placeholder="请输入"
                size="large"
                style={{ marginBottom: 10 }}
              />
              <Checkbox
                checked={capitalizeFirst}
                onChange={e => setCapitalizeFirst(e.target.checked)}
              >
                首字母大写
              </Checkbox>
            </div>
          </div>

          {/* 商品产地 */}
          <div style={{ display: 'flex', marginBottom: 28 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 6 }}>
              <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>商品产地
            </label>
            <div style={{ flex: 1 }}>
              {/* 下拉 + 产地证明 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <Select
                  value={originCountry || undefined}
                  onChange={v => setOriginCountry(v)}
                  placeholder="请选择"
                  size="large"
                  style={{ flex: 1 }}
                  showSearch
                  filterOption={(input, option) =>
                    String(option?.label ?? '').includes(input)
                  }
                  options={COUNTRY_OPTIONS}
                />
                <button style={{
                  border: '1px solid #d9d9d9', borderRadius: 4, padding: '6px 14px',
                  backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#555',
                  display: 'flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
                  height: 40, flexShrink: 0,
                }}>
                  <UploadOutlined style={{ fontSize: 14 }} />
                  产地证明（选填）
                  <span style={{ color: '#bbb', fontSize: 13, marginLeft: 2 }}>?</span>
                </button>
              </div>
              {/* 提示文字 */}
              <div style={{ fontSize: 13, color: ORANGE, fontWeight: 500, marginBottom: 6 }}>
                请如实填写，卖家需为产地真实性负责
              </div>
              <div style={{ fontSize: 13, color: '#666', lineHeight: '22px' }}>
                <div>1.&nbsp;<span style={{ color: ORANGE, fontWeight: 500 }}>发货时可能会被海关检验</span>，如海关要求提供产地证明卖家需配合提供</div>
                <div>2. 商品产地将展示给消费者；上传含产地信息的实拍图，有机会获得平台"优质产地"标签，提升转化。</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 敏感属性与体积重量 */}
      <div style={{ maxWidth: 1400, margin: '16px auto', padding: '0 24px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 4, padding: '24px 32px' }}>
          <div style={{ display: 'flex' }}>
            {/* 左侧 label */}
            <label style={{
              width: 110, fontSize: 13, color: '#333', textAlign: 'right',
              paddingRight: 12, flexShrink: 0, paddingTop: 4, lineHeight: '20px',
            }}>
              敏感属性<br />与体积重量
            </label>

            {/* 右侧内容 */}
            <div style={{ flex: 1 }}>
              {/* 警告条 */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                backgroundColor: '#fffbe6', border: '1px solid #ffe58f',
                borderRadius: 4, padding: '8px 12px', marginBottom: 16,
              }}>
                <ExclamationCircleFilled style={{ color: '#faad14', fontSize: 15, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: '#595959' }}>
                  您填写的重量体积数据将会用于消费者售后环节，请务必如实准确填写。
                </span>
              </div>

              {/* SKU 表头行 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                {/* SKU 列标题 */}
                <Select
                  defaultValue="SKU"
                  size="middle"
                  style={{ width: 120 }}
                  options={[{ value: 'SKU', label: 'SKU' }]}
                />

                {/* 敏感属性 列标题 —— Popover 弹出单选 */}
                <Popover
                  open={sensitivePopOpen}
                  onOpenChange={setSensitivePopOpen}
                  trigger="click"
                  placement="bottom"
                  content={
                    <div style={{ width: 220, padding: '4px 0' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#262626', marginBottom: 10 }}>是否敏感品</div>
                      <Radio.Group
                        value={sensitiveYesNo}
                        onChange={e => { setSensitiveYesNo(e.target.value); setSensitivePopOpen(false) }}
                      >
                        <Radio value="否">否</Radio>
                        <Radio value="是">是</Radio>
                      </Radio.Group>
                    </div>
                  }
                >
                  <button style={{
                    width: 120, height: 32, border: `1px solid ${sensitivePopOpen ? BLUE : '#d9d9d9'}`,
                    borderRadius: 6, backgroundColor: '#fff', cursor: 'pointer',
                    fontSize: 13, color: '#333', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '0 10px',
                    outline: sensitivePopOpen ? `2px solid ${BLUE}22` : 'none',
                  }}>
                    <span>敏感属性</span>
                    <span style={{ fontSize: 10, color: '#999', transform: sensitivePopOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
                  </button>
                </Popover>

                {/* 体积重量 列标题 —— Popover 弹出输入框 */}
                <Popover
                  open={volumePopOpen}
                  onOpenChange={setVolumePopOpen}
                  trigger="click"
                  placement="bottom"
                  content={
                    <div style={{ width: 260, padding: '4px 0' }}>
                      {([
                        ['最长边', volumeL, setVolumeL, 'cm'],
                        ['次长边', volumeM, setVolumeM, 'cm'],
                        ['最短边', volumeS, setVolumeS, 'cm'],
                        ['重量',   productWeight, setProductWeight, 'g'],
                      ] as [string, string, (v: string) => void, string][]).map(([label, val, setter, unit]) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <span style={{
                            width: 48, fontSize: 13, color: '#595959',
                            backgroundColor: '#f5f5f5', padding: '4px 0',
                            borderRadius: 4, textAlign: 'center', flexShrink: 0,
                          }}>{label}</span>
                          <Input
                            value={val}
                            onChange={e => setter(e.target.value)}
                            placeholder="请输入"
                            size="small"
                            style={{ flex: 1 }}
                          />
                          <span style={{ fontSize: 13, color: '#555', width: 16, textAlign: 'right' }}>{unit}</span>
                        </div>
                      ))}
                    </div>
                  }
                >
                  <button style={{
                    width: 120, height: 32, border: `1px solid ${volumePopOpen ? BLUE : '#d9d9d9'}`,
                    borderRadius: 6, backgroundColor: '#fff', cursor: 'pointer',
                    fontSize: 13, color: '#333', display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '0 10px',
                    outline: volumePopOpen ? `2px solid ${BLUE}22` : 'none',
                  }}>
                    <span>体积重量</span>
                    <span style={{ fontSize: 10, color: '#999', transform: volumePopOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
                  </button>
                </Popover>

                <button style={{
                  border: '1px solid #d9d9d9', borderRadius: 4, padding: '5px 16px',
                  backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333',
                }}>
                  批量填写
                </button>
              </div>

              {/* 三列字段区 */}
              <div style={{ display: 'flex', gap: 0, border: '1px solid #e8e8e8', borderRadius: 4, overflow: 'hidden' }}>

                {/* 第一列：敏感属性 */}
                <div style={{ flex: '0 0 220px', padding: '16px 20px', borderRight: '1px solid #e8e8e8' }}>
                  <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 500 }}>
                    <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>敏感属性{' '}
                    <a href="#" style={{ color: BLUE, fontWeight: 400 }}>说明及测量示例</a>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Select
                      value={sensitiveYesNo}
                      onChange={v => setSensitiveYesNo(v)}
                      size="middle"
                      style={{ width: 72 }}
                      options={[
                        { value: '否', label: '否' },
                        { value: '是', label: '是' },
                      ]}
                    />
                    <Select
                      value={sensitiveProperty}
                      onChange={v => setSensitiveProperty(v)}
                      placeholder="请选择敏感属性"
                      size="middle"
                      style={{ flex: 1 }}
                      disabled={sensitiveYesNo === '否'}
                      options={[
                        { value: 'battery', label: '含锂电池' },
                        { value: 'magnetic', label: '含磁铁' },
                        { value: 'liquid', label: '含液体' },
                        { value: 'powder', label: '含粉末' },
                        { value: 'cream', label: '含膏体' },
                      ]}
                    />
                  </div>
                </div>

                {/* 第二列：体积 */}
                <div style={{ flex: '2 1 0', minWidth: 0, padding: '16px 20px', borderRight: '1px solid #e8e8e8', overflow: 'hidden' }}>
                  <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 500 }}>
                    <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>体积(单位:cm){' '}
                    <a href="#" style={{ color: BLUE, fontWeight: 400 }}>查看测量示例</a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'nowrap' }}>
                    <Input
                      addonBefore="最长边"
                      addonAfter="cm"
                      value={volumeL}
                      onChange={e => setVolumeL(e.target.value)}
                      placeholder="请输入"
                      size="middle"
                      style={{ width: 180 }}
                    />
                    <Input
                      addonBefore="次长边"
                      addonAfter="cm"
                      value={volumeM}
                      onChange={e => setVolumeM(e.target.value)}
                      placeholder="请输入"
                      size="middle"
                      style={{ width: 180 }}
                    />
                    <Input
                      addonBefore="最短边"
                      addonAfter="cm"
                      value={volumeS}
                      onChange={e => setVolumeS(e.target.value)}
                      placeholder="请输入"
                      size="middle"
                      style={{ width: 180 }}
                    />
                  </div>
                </div>

                {/* 第三列：重量 */}
                <div style={{ flex: '0 0 180px', flexShrink: 0, padding: '16px 20px' }}>
                  <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 500 }}>
                    <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>重量{' '}
                    <a href="#" style={{ color: BLUE, fontWeight: 400 }}>查看测量示例</a>
                  </div>
                  <Input
                    addonAfter="g"
                    value={productWeight}
                    onChange={e => setProductWeight(e.target.value)}
                    placeholder="请输入"
                    size="middle"
                    style={{ width: '100%' }}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SKU 信息 */}
      <div style={{ maxWidth: 1400, margin: '16px auto', padding: '0 24px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 4, padding: '24px 32px' }}>

          {/* 标题行 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 4, height: 18, backgroundColor: BLUE, borderRadius: 2 }} />
              <span style={{ fontSize: 15, fontWeight: 600 }}>SKU 信息</span>
            </div>
          </div>

          {/* 表头操作行 */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

              {/* SKU — 普通 Select */}
              <Select defaultValue="SKU" size="middle" style={{ width: 110 }} options={[{ value: 'SKU', label: 'SKU' }]} />

              {/* 申报价格 Popover */}
              <Popover
                open={declarePricePopOpen}
                onOpenChange={setDeclarePricePopOpen}
                trigger="click"
                placement="bottom"
                content={
                  <div style={{ width: 220, padding: '4px 0' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>申报价格 (USD)</div>
                    <Input
                      value={skuDeclarePrice}
                      onChange={e => setSkuDeclarePrice(e.target.value)}
                      placeholder="请输入"
                      size="middle"
                    />
                  </div>
                }
              >
                <button style={{
                  width: 110, height: 32, border: `1px solid ${declarePricePopOpen ? BLUE : '#d9d9d9'}`,
                  borderRadius: 6, backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px',
                }}>
                  <span>申报价格</span>
                  <span style={{ fontSize: 10, color: '#999', transform: declarePricePopOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
                </button>
              </Popover>

              {/* 建议零售价 Popover */}
              <Popover
                open={retailPricePopOpen}
                onOpenChange={v => { setRetailPricePopOpen(v); if (!v) setRetailCurrencyOpen(false) }}
                trigger="click"
                placement="bottom"
                content={
                  <div style={{ width: 260, padding: '4px 0' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <Input
                        value={skuRetailPrice ?? ''}
                        onChange={e => setSkuRetailPrice(e.target.value)}
                        placeholder=""
                        size="middle"
                        style={{ flex: 1 }}
                      />
                      {/* 货币选择器 */}
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={() => setRetailCurrencyOpen(o => !o)}
                          style={{
                            height: 32, border: `1px solid ${retailCurrencyOpen ? BLUE : '#d9d9d9'}`,
                            borderRadius: 6, backgroundColor: '#fff', cursor: 'pointer',
                            fontSize: 13, color: '#333', display: 'flex', alignItems: 'center',
                            gap: 4, padding: '0 8px', whiteSpace: 'nowrap',
                          }}
                        >
                          <span>{CURRENCY_OPTIONS.find(c => c.value === retailCurrency)?.label ?? 'USD（$）'}</span>
                          <span style={{ fontSize: 10, color: '#999', transform: retailCurrencyOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
                        </button>
                        {retailCurrencyOpen && (
                          <div style={{
                            position: 'absolute', top: 36, right: 0, zIndex: 1000,
                            backgroundColor: '#fff', border: '1px solid #e8e8e8',
                            borderRadius: 6, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            minWidth: 140,
                          }}>
                            {CURRENCY_OPTIONS.map(c => (
                              <div
                                key={c.value}
                                onClick={() => { setRetailCurrency(c.value); setRetailCurrencyOpen(false) }}
                                style={{
                                  padding: '8px 14px', fontSize: 13, cursor: 'pointer',
                                  backgroundColor: c.value === retailCurrency ? '#f0f7ff' : '#fff',
                                  color: '#333',
                                }}
                                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                                onMouseLeave={e => (e.currentTarget.style.backgroundColor = c.value === retailCurrency ? '#f0f7ff' : '#fff')}
                              >
                                {c.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                }
              >
                <button style={{
                  width: 110, height: 32, border: `1px solid ${retailPricePopOpen ? BLUE : '#d9d9d9'}`,
                  borderRadius: 6, backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px',
                }}>
                  <span>建议零售价</span>
                  <span style={{ fontSize: 10, color: '#999', transform: retailPricePopOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
                </button>
              </Popover>

              {/* SKU分类 Popover */}
              <Popover
                open={skuCatPopOpen}
                onOpenChange={v => { setSkuCatPopOpen(v); if (!v) setSkuCatDropOpen(false) }}
                trigger="click"
                placement="bottom"
                content={
                  <div style={{ width: 280, padding: '4px 0' }}>
                    {/* 触发下拉按钮 */}
                    <button
                      onClick={() => setSkuCatDropOpen(o => !o)}
                      style={{
                        width: '100%', height: 32, border: `1px solid ${skuCatDropOpen ? BLUE : '#d9d9d9'}`,
                        borderRadius: 6, backgroundColor: '#fff', cursor: 'pointer',
                        fontSize: 13, color: skuCategoryVal ? '#333' : '#bbb',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '0 10px', marginBottom: 4,
                      }}
                    >
                      <span>{SKU_CAT_OPTIONS.find(o => o.value === skuCategoryVal)?.label ?? '请选择SKU分类'}</span>
                      <span style={{ fontSize: 10, color: '#999', transform: skuCatDropOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
                    </button>
                    {/* 选项列表 */}
                    {skuCatDropOpen && (
                      <div style={{ border: '1px solid #e8e8e8', borderRadius: 6, overflow: 'hidden' }}>
                        {SKU_CAT_OPTIONS.map(opt => (
                          <div
                            key={opt.value}
                            onClick={() => { setSkuCategoryVal(opt.value); setSkuCatDropOpen(false); setSkuCatPopOpen(false) }}
                            style={{
                              padding: '10px 14px', cursor: 'pointer',
                              backgroundColor: opt.value === skuCategoryVal ? '#f0f7ff' : '#fff',
                              borderBottom: '1px solid #f0f0f0',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f5f5f5')}
                            onMouseLeave={e => (e.currentTarget.style.backgroundColor = opt.value === skuCategoryVal ? '#f0f7ff' : '#fff')}
                          >
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#262626' }}>{opt.label}</div>
                            <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 2 }}>{opt.desc}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                }
              >
                <button style={{
                  width: 110, height: 32, border: `1px solid ${skuCatPopOpen ? BLUE : '#d9d9d9'}`,
                  borderRadius: 6, backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px',
                }}>
                  <span>SKU分类</span>
                  <span style={{ fontSize: 10, color: '#999', transform: skuCatPopOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
                </button>
              </Popover>

              {/* 包装清单 Popover */}
              <Popover
                open={packingPopOpen}
                onOpenChange={setPackingPopOpen}
                trigger="click"
                placement="bottom"
                content={
                  <div style={{ width: 320, padding: '4px 0' }}>
                    {packingItems.map(p => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                        <Select
                          value={p.item}
                          onChange={v => updatePackingItem(p.id, 'item', v)}
                          placeholder="可选择或搜索物品"
                          size="middle"
                          style={{ flex: 1 }}
                          showSearch
                          options={PACKING_GOODS.map(g => ({ value: g, label: g }))}
                        />
                        <Input
                          value={p.qty}
                          onChange={e => updatePackingItem(p.id, 'qty', e.target.value)}
                          placeholder="数量"
                          size="middle"
                          style={{ width: 64 }}
                        />
                        <DeleteOutlined
                          style={{ color: BLUE, cursor: 'pointer', fontSize: 16, flexShrink: 0 }}
                          onClick={() => removePackingItem(p.id)}
                        />
                      </div>
                    ))}
                    <a
                      href="#"
                      style={{ color: BLUE, fontSize: 13 }}
                      onClick={e => { e.preventDefault(); addPackingItem() }}
                    >+ 添加</a>
                  </div>
                }
              >
                <button style={{
                  width: 110, height: 32, border: `1px solid ${packingPopOpen ? BLUE : '#d9d9d9'}`,
                  borderRadius: 6, backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px',
                }}>
                  <span>包装清单</span>
                  <span style={{ fontSize: 10, color: '#999', transform: packingPopOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
                </button>
              </Popover>

              <button style={{
                border: '1px solid #d9d9d9', borderRadius: 4, padding: '5px 16px',
                backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333',
              }}>批量填写</button>
            </div>
            <a href="#" style={{ color: BLUE, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}>
              <FullscreenOutlined />全屏填写
            </a>
          </div>

          {/* 表格（横向滚动） */}
          <div style={{ overflowX: 'auto', border: '1px solid #e8e8e8', borderRadius: 4 }}>
            <div style={{ minWidth: 1200 }}>

              {/* 表头行 */}
              <div style={{ display: 'flex', backgroundColor: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                {/* 参考链接 */}
                <div style={{ width: 160, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', borderRight: '1px solid #e8e8e8' }}>
                  参考链接 <span style={{ color: BLUE }}>助力快速上新</span>
                </div>
                {/* 申报价格 */}
                <div style={{ width: 160, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', borderRight: '1px solid #e8e8e8' }}>
                  <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>申报价格(USD)
                </div>
                {/* 库存 */}
                <div style={{ width: 160, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', textAlign: 'center', borderRight: '1px solid #e8e8e8' }}>
                  <div>库存</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>（选填，若未填写则默认认为0，请在发布前修改）</div>
                </div>
                {/* SKU分类 */}
                <div style={{ width: 200, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', borderRight: '1px solid #e8e8e8' }}>
                  SKU分类 <a href="#" style={{ color: BLUE }}>说明及填写示例</a>
                </div>
                {/* 建议零售价 */}
                <div style={{ width: 180, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', borderRight: '1px solid #e8e8e8' }}>
                  建议零售价 <span style={{ color: '#52c41a', fontWeight: 500 }}>填写可显著提升售卖率</span>
                </div>
                {/* 包装清单 */}
                <div style={{ width: 260, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', borderRight: '1px solid #e8e8e8' }}>
                  <span>包装清单</span>
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', fontSize: 13 }} />
                  <div style={{ fontSize: 12, color: ORANGE, fontWeight: 500, lineHeight: '18px', marginTop: 2 }}>
                    此内容在商品创建后不可修改，请认真慎填写
                  </div>
                </div>
                {/* SKU货号 */}
                <div style={{ flex: 1, padding: '12px 12px', fontSize: 13, color: '#333' }}>
                  SKU货号
                </div>
              </div>

              {/* 数据行 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', borderBottom: '1px solid #f0f0f0', minHeight: 72 }}>
                {/* 参考链接 */}
                <div style={{ width: 160, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
                  <Input
                    value={skuRefLink}
                    onChange={e => setSkuRefLink(e.target.value)}
                    placeholder="请输入"
                    prefix={<LinkOutlined style={{ color: '#bbb' }} />}
                    size="middle"
                  />
                </div>
                {/* 申报价格 */}
                <div style={{ width: 160, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
                  <Input
                    value={skuDeclarePrice}
                    onChange={e => setSkuDeclarePrice(e.target.value)}
                    placeholder="请输入"
                    prefix={<span style={{ color: '#bbb', fontSize: 13 }}>$</span>}
                    size="middle"
                  />
                </div>
                {/* 库存 */}
                <div style={{ width: 160, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <span style={{ fontSize: 13, color: '#333' }}>{skuStock || '-'}</span>
                  <EditOutlined
                    style={{ color: BLUE, cursor: 'pointer', fontSize: 14 }}
                    onClick={() => {
                      const v = window.prompt('请输入库存数量', skuStock)
                      if (v !== null) setSkuStock(v)
                    }}
                  />
                </div>
                {/* SKU分类 */}
                <div style={{ width: 200, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
                  <Select
                    value={skuCategoryVal}
                    onChange={v => setSkuCategoryVal(v)}
                    placeholder="请选择"
                    size="middle"
                    style={{ width: '100%' }}
                    options={[
                      { value: 'A', label: '分类A' },
                      { value: 'B', label: '分类B' },
                    ]}
                  />
                </div>
                {/* 建议零售价 */}
                <div style={{ width: 180, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
                  <Select
                    value={skuRetailPrice}
                    onChange={v => setSkuRetailPrice(v)}
                    placeholder=""
                    size="middle"
                    style={{ width: '100%' }}
                    options={[]}
                    allowClear
                  />
                  <a
                    href="#"
                    style={{ color: BLUE, fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
                    onClick={e => { e.preventDefault(); setCertModalVisible(true) }}
                  >
                    <UploadOutlined />证明材料（选填）
                  </a>
                </div>
                {/* 包装清单 */}
                <div style={{ width: 260, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch' }}>
                  {packingItems.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <Select
                        value={p.item}
                        onChange={v => updatePackingItem(p.id, 'item', v)}
                        placeholder="可选择或搜索物品"
                        size="middle"
                        style={{ flex: 1 }}
                        showSearch
                        options={PACKING_GOODS.map(g => ({ value: g, label: g }))}
                      />
                      <Input
                        value={p.qty}
                        onChange={e => updatePackingItem(p.id, 'qty', e.target.value)}
                        placeholder="数量"
                        size="middle"
                        style={{ width: 60 }}
                      />
                      <DeleteOutlined
                        style={{ color: BLUE, cursor: 'pointer', fontSize: 16, flexShrink: 0 }}
                        onClick={() => removePackingItem(p.id)}
                      />
                    </div>
                  ))}
                  <a
                    href="#"
                    style={{ color: BLUE, fontSize: 13 }}
                    onClick={e => { e.preventDefault(); addPackingItem() }}
                  >+ 添加</a>
                </div>
                {/* SKU货号 */}
                <div style={{ flex: 1, padding: '12px 12px', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
                  <Input
                    value={skuItemNumber}
                    onChange={e => setSkuItemNumber(e.target.value)}
                    placeholder="请输入"
                    size="middle"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* 证明材料弹窗 */}
      <Modal
        open={certModalVisible}
        onCancel={() => setCertModalVisible(false)}
        onOk={() => setCertModalVisible(false)}
        title="证明材料（选填）"
        width={640}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ style: { backgroundColor: BLUE } }}
      >
        <p style={{ fontSize: 13, color: '#595959', marginBottom: 20 }}>
          请酌情提供以下二类证明文件，其中类型二为选填。以下文件均需要有时效性，建议为六个月内
        </p>

        {/* 类型一 */}
        <div style={{ borderLeft: `3px solid ${BLUE}`, paddingLeft: 14, marginBottom: 28 }}>
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>类型一</span>
            <span style={{ fontSize: 13, color: '#8c8c8c', marginLeft: 8 }}>可选择以下任意材料上传</span>
          </div>
          <div style={{ marginBottom: 6 }}>
            <span style={{ color: ORANGE, fontWeight: 600 }}>•</span>
            <span style={{ fontSize: 13, marginLeft: 6 }}>
              <b>合同或协议</b>（经销或采购合同中适用于相关欧盟国家的建议零售价条款）
            </span>
          </div>
          <div style={{ marginBottom: 14 }}>
            <span style={{ color: ORANGE, fontWeight: 600 }}>•</span>
            <span style={{ fontSize: 13, marginLeft: 6 }}>
              <b>制造商或品牌方的官方文件或官方网站</b>（制造商或供货品牌方出具的、或其官方网站上列明的官方价格表、通知或声明中适用于欧盟国家的建议零售价）
            </span>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px',
            border: '1px solid #d9d9d9', borderRadius: 4, backgroundColor: '#fff',
            cursor: 'pointer', fontSize: 13, color: '#333', marginBottom: 8,
          }}>
            <span style={{ fontSize: 16 }}>+</span> 上传文件
          </button>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>格式：支持jpg、jpeg、png、pdf 格式；10M以内；最多上传5张</div>
        </div>

        {/* 类型二 */}
        <div style={{ borderLeft: `3px solid ${BLUE}`, paddingLeft: 14 }}>
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>类型二</span>
            <span style={{ fontSize: 13, color: '#8c8c8c', marginLeft: 8 }}>可选择以下任意材料上传</span>
          </div>
          <div style={{ marginBottom: 6 }}>
            <span style={{ color: ORANGE, fontWeight: 600 }}>•</span>
            <span style={{ fontSize: 13, marginLeft: 6 }}>
              <b>商品包装或标签</b>（在相关欧盟国家实际出售的产品外包装或吊牌上标注的建议零售价）
            </span>
          </div>
          <div style={{ marginBottom: 14 }}>
            <span style={{ color: ORANGE, fontWeight: 600 }}>•</span>
            <span style={{ fontSize: 13, marginLeft: 6 }}>
              <b>其他官方授权线上平台的零售价截图</b>（其他欧盟地区获授权的电商平台上对同一型号和规格的产品的零售价证明，截图需包含日期，并与 URL 一并提供）
            </span>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px',
            border: '1px solid #d9d9d9', borderRadius: 4, backgroundColor: '#f5f5f5',
            cursor: 'not-allowed', fontSize: 13, color: '#bbb', marginBottom: 8,
          }} disabled>
            <span style={{ fontSize: 16 }}>+</span> 上传文件
          </button>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>格式：支持jpg、jpeg、png、pdf 格式；10M以内；最多上传5张</div>
        </div>
      </Modal>

      {/* 底部固定栏 */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff', borderTop: '1px solid #f0f0f0',
        padding: '12px 0 16px', textAlign: 'center',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <Button size="large" style={{ width: 120 }}
          onClick={() => router.back()}>
          上一步
        </Button>
        <Button type="primary" size="large" style={{ width: 160 }}>
          提交
        </Button>
      </div>

      {/* 轮播图素材中心弹窗 */}
      <TemuMediaModal
        visible={mediaModalVisible}
        onClose={() => setMediaModalVisible(false)}
        onConfirm={(images) => {
          setCarouselImages(prev => ({
            ...prev,
            [currentLang]: images.slice(0, 5),
          }))
        }}
        maxCount={10}
        defaultMediaType="image"
      />

      {/* 主图视频素材中心弹窗 */}
      <TemuMediaModal
        visible={videoModalVisible}
        onClose={() => setVideoModalVisible(false)}
        onConfirm={(urls) => {
          if (urls.length > 0) setMainVideoUrl(urls[0])
        }}
        maxCount={1}
        defaultMediaType="video"
      />
    </div>
  )
}
