'use client'

import React, { useState } from 'react'
import { Button, Checkbox, Input, Modal, Popover, Radio, Select, Space } from 'antd'
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
  const [detailVideoModalVisible, setDetailVideoModalVisible] = useState(false)
  const [detailVideoUrl, setDetailVideoUrl] = useState<string>('')
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

  // 电子说明书
  const [manualUploadType, setManualUploadType] = useState<'update' | 'supplement'>('update')
  const [manualFileTab, setManualFileTab] = useState<'local' | 'tool'>('local')
  const [supplementModalVisible, setSupplementModalVisible] = useState(false)
  const [translateModalVisible, setTranslateModalVisible] = useState(false)
  const [selectManualModalVisible, setSelectManualModalVisible] = useState(false)
  const [selectedManualId, setSelectedManualId] = useState<number | null>(1)
  const [manualSearchQuery, setManualSearchQuery] = useState('')
  const [decorateModalVisible, setDecorateModalVisible] = useState(false)
  type DecorateBlock = {
    id: number
    type: 'image' | 'text'
    imageUrl: string
    text: string
    color: string
    fontSize: number
    align: 'left' | 'center' | 'right' | 'justify'
    bgColor: string
  }
  const [decorateBlocks, setDecorateBlocks] = useState<DecorateBlock[]>([])
  const [selectedDecorateBlockId, setSelectedDecorateBlockId] = useState<number | null>(null)
  const [decorateImagePickerVisible, setDecorateImagePickerVisible] = useState(false)
  const [decorateBlockCounter, setDecorateBlockCounter] = useState(0)

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
        <div style={{ backgroundColor: '#fff', borderRadius: 4, padding: '24px 32px', border: '1px solid #e8e8e8' }}>

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
        <div style={{ backgroundColor: '#fff', borderRadius: 4, padding: '24px 32px', border: '1px solid #e8e8e8' }}>
          <div style={{ display: 'flex', marginBottom: 16 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 4, lineHeight: '20px' }}>
              敏感属性<br />与体积重量
            </label>
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
                    {([
                      ['最长边', volumeL, setVolumeL],
                      ['次长边', volumeM, setVolumeM],
                      ['最短边', volumeS, setVolumeS],
                    ] as [string, string, (v: string) => void][]).map(([label, val, setter]) => (
                      <Space.Compact key={label} size="middle">
                        <Input readOnly value={label} style={{ width: 52, textAlign: 'center', background: '#fafafa', color: '#595959', cursor: 'default' }} />
                        <Input value={val} onChange={e => setter(e.target.value)} placeholder="请输入" style={{ width: 88 }} />
                        <Input readOnly value="cm" style={{ width: 36, textAlign: 'center', background: '#fafafa', color: '#595959', cursor: 'default' }} />
                      </Space.Compact>
                    ))}
                  </div>
                </div>

                {/* 第三列：重量 */}
                <div style={{ flex: '0 0 180px', flexShrink: 0, padding: '16px 20px' }}>
                  <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 500 }}>
                    <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>重量{' '}
                    <a href="#" style={{ color: BLUE, fontWeight: 400 }}>查看测量示例</a>
                  </div>
                  <Space.Compact size="middle" style={{ width: '100%' }}>
                    <Input value={productWeight} onChange={e => setProductWeight(e.target.value)} placeholder="请输入" style={{ flex: 1 }} />
                    <Input readOnly value="g" style={{ width: 36, textAlign: 'center', background: '#fafafa', color: '#595959', cursor: 'default' }} />
                  </Space.Compact>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SKU 信息 */}
      <div style={{ maxWidth: 1400, margin: '16px auto', padding: '0 24px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 4, padding: '24px 32px', border: '1px solid #e8e8e8' }}>

          <div style={{ display: 'flex', marginBottom: 16 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 4, lineHeight: '20px' }}>
              SKU 信息
            </label>
            <div style={{ flex: 1, minWidth: 0 }}>

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
            <div style={{ minWidth: 1700 }}>

              {/* 表头行 */}
              <div style={{ display: 'flex', backgroundColor: '#fafafa', borderBottom: '1px solid #e8e8e8' }}>
                {/* 参考链接 */}
                <div style={{ width: 220, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', borderRight: '1px solid #e8e8e8' }}>
                  参考链接 <span style={{ color: BLUE }}>助力快速上新</span>
                </div>
                {/* 申报价格 */}
                <div style={{ width: 220, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', borderRight: '1px solid #e8e8e8' }}>
                  <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>申报价格(USD)
                </div>
                {/* 库存 */}
                <div style={{ width: 200, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', textAlign: 'center', borderRight: '1px solid #e8e8e8' }}>
                  <div style={{ fontWeight: 500 }}>库存</div>
                  <div style={{ fontSize: 12, color: '#8c8c8c', lineHeight: '18px' }}>未填写则默认认为0，请在发布前修改</div>
                </div>
                {/* SKU分类 */}
                <div style={{ width: 320, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', borderRight: '1px solid #e8e8e8' }}>
                  SKU分类 <a href="#" style={{ color: BLUE }}>说明及填写示例</a>
                </div>
                {/* 建议零售价 */}
                <div style={{ width: 240, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', borderRight: '1px solid #e8e8e8' }}>
                  建议零售价 <span style={{ color: '#52c41a', fontWeight: 500 }}>填写可显著提升售卖率</span>
                </div>
                {/* 包装清单 */}
                <div style={{ width: 320, flexShrink: 0, padding: '12px 12px', fontSize: 13, color: '#333', borderRight: '1px solid #e8e8e8' }}>
                  <span>包装清单</span>
                  <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8c8c8c', fontSize: 13 }} />
                  <div style={{ fontSize: 12, color: ORANGE, fontWeight: 500, lineHeight: '18px', marginTop: 2 }}>
                    此内容在商品创建后不可修改，请认真慎填写
                  </div>
                </div>
                {/* SKU货号 */}
                <div style={{ flex: '0 0 160px', padding: '12px 12px', fontSize: 13, color: '#333', whiteSpace: 'nowrap' }}>
                  SKU货号
                </div>
              </div>

              {/* 数据行 */}
              <div style={{ display: 'flex', alignItems: 'flex-start', borderBottom: '1px solid #f0f0f0', minHeight: 72 }}>
                {/* 参考链接 */}
                <div style={{ width: 220, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
                  <Input
                    value={skuRefLink}
                    onChange={e => setSkuRefLink(e.target.value)}
                    placeholder="请输入"
                    prefix={<LinkOutlined style={{ color: '#bbb' }} />}
                    size="middle"
                  />
                </div>
                {/* 申报价格 */}
                <div style={{ width: 220, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
                  <Input
                    value={skuDeclarePrice}
                    onChange={e => setSkuDeclarePrice(e.target.value)}
                    placeholder="请输入"
                    prefix={<span style={{ color: '#bbb', fontSize: 13 }}>$</span>}
                    size="middle"
                  />
                </div>
                {/* 库存 */}
                <div style={{ width: 200, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
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
                <div style={{ width: 320, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
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
                <div style={{ width: 240, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
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
                <div style={{ width: 320, flexShrink: 0, padding: '12px 12px', borderRight: '1px solid #e8e8e8', alignSelf: 'stretch' }}>
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
                <div style={{ flex: '0 0 160px', padding: '12px 12px', alignSelf: 'stretch', display: 'flex', alignItems: 'center' }}>
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
        </div>
      </div>

      {/* 详情视频 & 电子说明书 */}
      <div style={{ maxWidth: 1400, margin: '16px auto', padding: '0 24px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 4, padding: '24px 32px', border: '1px solid #e8e8e8' }}>

          {/* 详情视频 */}
          <div style={{ display: 'flex', marginBottom: 28 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 2 }}>
              详情视频
            </label>
            <div style={{ flex: 1 }}>
              {detailVideoUrl ? (
                <div style={{
                  width: 120, height: 120, borderRadius: 4, overflow: 'hidden',
                  border: `2px solid ${BLUE}`, marginBottom: 12, position: 'relative', cursor: 'pointer',
                }} onClick={() => setDetailVideoModalVisible(true)}>
                  <video src={detailVideoUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
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
                  width: 90, height: 90, border: '1px dashed #d9d9d9', borderRadius: 4,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', backgroundColor: '#fafafa', marginBottom: 12,
                }}
                  onClick={() => setDetailVideoModalVisible(true)}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = BLUE)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#d9d9d9')}
                >
                  <UploadOutlined style={{ fontSize: 20, color: '#bbb', marginBottom: 6 }} />
                  <span style={{ fontSize: 13, color: '#595959' }}>上传视频</span>
                </div>
              )}
              <div style={{ fontSize: 13, color: '#8c8c8c', lineHeight: '24px' }}>
                <div>1. 使用1:1或3:4或16:9视频，时长600秒内，大小500M内，内容实用功能详实，非PPT、无黑边、无水印&nbsp;<a href="#" style={{ color: BLUE }}>查看视频要求</a></div>
                <div>2. 详情视频展示在详情图文顶部</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #f5f5f5', margin: '0 -32px 24px' }} />

          {/* 电子说明书 */}
          <div style={{ display: 'flex', marginBottom: 4 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 2 }}>
              电子说明书
            </label>
            <div style={{ flex: 1 }}>
              <div style={{ border: '1px solid #e8e8e8', borderRadius: 4, padding: '20px 24px' }}>
                {/* 上传类型 */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ width: 64, fontSize: 13, color: '#595959', textAlign: 'right', paddingRight: 12, flexShrink: 0 }}>上传类型</span>
                  <Radio.Group value={manualUploadType} onChange={e => setManualUploadType(e.target.value)}>
                    <Radio value="update">更新说明书文件</Radio>
                    <Radio value="supplement">补充或修改【安装/使用说明】和【安全信息说明】</Radio>
                  </Radio.Group>
                </div>
                {/* 说明书文件 */}
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <span style={{ width: 64, fontSize: 13, color: '#595959', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 7 }}>说明书文件</span>
                  <div style={{ flex: 1 }}>
                    {manualUploadType === 'update' ? (
                      <>
                        {/* Tab 切换 */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid #e8e8e8', marginBottom: 20 }}>
                          {(['local', 'tool'] as const).map((tab, i) => (
                            <button
                              key={tab}
                              onClick={() => setManualFileTab(tab)}
                              style={{
                                padding: '6px 16px', fontSize: 13, cursor: 'pointer',
                                color: manualFileTab === tab ? (tab === 'tool' ? BLUE : '#333') : '#8c8c8c',
                                border: manualFileTab === tab ? '1px solid #e8e8e8' : '1px solid transparent',
                                borderBottom: manualFileTab === tab ? '2px solid #fff' : '1px solid transparent',
                                borderRadius: '4px 4px 0 0', backgroundColor: '#fff',
                                marginBottom: -1, position: 'relative',
                                marginLeft: i > 0 ? 4 : 0,
                              }}
                            >{tab === 'local' ? '从本地上传' : '从说明书制作工具选择'}</button>
                          ))}
                        </div>

                        {/* 内容区：按 tab 切换 */}
                        {manualFileTab === 'local' ? (
                          <>
                            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                              <button
                                onClick={() => setTranslateModalVisible(true)}
                                style={{
                                  padding: '7px 16px', border: '1px solid #d9d9d9', borderRadius: 4,
                                  backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333',
                                }}>+ 翻译多语言并上传（0/35）</button>
                              <label style={{
                                padding: '7px 16px', border: '1px solid #d9d9d9', borderRadius: 4,
                                backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333',
                                display: 'inline-block',
                              }}>
                                + 上传文件（0/35）
                                <input type="file" accept=".pdf" style={{ display: 'none' }} />
                              </label>
                            </div>
                            <div style={{ fontSize: 13, color: '#8c8c8c' }}>
                              1. 说明书尽可能覆盖更多语言将有效提高转化和降低客诉
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ marginBottom: 12 }}>
                              <button
                                onClick={() => setSelectManualModalVisible(true)}
                                style={{
                                  padding: '7px 16px', border: '1px solid #d9d9d9', borderRadius: 4,
                                  backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333',
                                }}>+ 选择说明书</button>
                            </div>
                            <div style={{ fontSize: 13, color: '#8c8c8c' }}>
                              1. 说明书尽可能覆盖更多语言将有效提高转化和降低客诉
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => setSupplementModalVisible(true)}
                        style={{
                          padding: '7px 16px', border: '1px solid #d9d9d9', borderRadius: 4,
                          backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333',
                        }}>+ 上传文件并补充（0/35）</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 详情图文 */}
      <div style={{ maxWidth: 1400, margin: '16px auto', padding: '0 24px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 4, padding: '24px 32px', border: '1px solid #e8e8e8' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 2 }}>
              详情图文
            </label>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* 提示文字 */}
              <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 16 }}>
                图片宽高比 1/2 ≤ x ≤ 2；图文并茂利于提升转化，详情装修请同时具备图片展示及文字描述
              </div>
              {/* 两栏内容 */}
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                {/* 左栏：页面预览 */}
                <div style={{ width: 380, flexShrink: 0, border: '1px solid #e8e8e8', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ padding: '10px 14px', borderBottom: '1px solid #e8e8e8', fontSize: 13, color: '#333' }}>
                    页面预览
                  </div>
                  <div style={{
                    height: 420, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#fff',
                  }}>
                    <div style={{ fontSize: 56, marginBottom: 8, opacity: 0.5 }}>📦</div>
                    <div style={{ fontSize: 13, color: '#8c8c8c' }}>暂未编辑详情页</div>
                  </div>
                </div>

                {/* 右栏 */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {/* 装修详情页 */}
                  <div style={{ border: '1px solid #e8e8e8', borderRadius: 4, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 4 }}>装修详情页</div>
                      <div style={{ fontSize: 13, color: '#8c8c8c' }}>可添加文字图片</div>
                    </div>
                    <button style={{
                      padding: '7px 20px', border: `1px solid ${BLUE}`, borderRadius: 4,
                      backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: BLUE,
                    }} onClick={() => setDecorateModalVisible(true)}>开始装修</button>
                  </div>
                  {/* 更多功能 */}
                  <div style={{
                    border: '1px solid #e8e8e8', borderRadius: 4, padding: '40px 20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#fafafa', flex: 1, minHeight: 320,
                  }}>
                    <span style={{ fontSize: 13, color: '#8c8c8c' }}>更多功能开发中，敬请期待</span>
                  </div>
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

      {/* 详情视频素材中心弹窗 */}
      <TemuMediaModal
        visible={detailVideoModalVisible}
        onClose={() => setDetailVideoModalVisible(false)}
        onConfirm={(urls) => {
          if (urls.length > 0) setDetailVideoUrl(urls[0])
        }}
        maxCount={1}
        defaultMediaType="video"
      />

      {/* 图2：上传文件并补充 弹窗 */}
      <Modal
        open={supplementModalVisible}
        onCancel={() => setSupplementModalVisible(false)}
        footer={null}
        title="上传文件并补充"
        width={680}
      >
        {/* ① 上传说明书 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>1</div>
            <span style={{ fontSize: 15, fontWeight: 600 }}>上传说明书</span>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <button
              onClick={() => setTranslateModalVisible(true)}
              style={{ padding: '7px 16px', border: '1px solid #d9d9d9', borderRadius: 4, backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333' }}
            >+ 翻译多语言并上传（0/35）</button>
            <label style={{
              padding: '7px 16px', border: '1px solid #d9d9d9', borderRadius: 4,
              backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#333',
              display: 'inline-block',
            }}>
              + 上传文件（0/35）
              <input type="file" accept=".pdf" style={{ display: 'none' }} />
            </label>
          </div>
          <div style={{ fontSize: 13, color: '#8c8c8c', lineHeight: '22px' }}>
            <div>1. 说明书尽可能覆盖更多语言将有效提高转化和降低客诉</div>
            <div>2. 仅支持上传PDF，文件需在50M以内&nbsp;<a href="#" style={{ color: BLUE }}>查看说明书上传要求</a></div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f0f0f0', margin: '0 -24px 24px' }} />

        {/* ② 补充安装/使用说明 */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: BLUE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>2</div>
            <span style={{ fontSize: 15, fontWeight: 600 }}>补充【安装/使用说明】和【安全信息说明】</span>
            <a href="#" style={{ fontSize: 13, color: BLUE }}>查看示例</a>
          </div>
          {/* 安装/使用说明 */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>安装/使用说明</span>
              <span style={{
                padding: '2px 8px', borderRadius: 4, fontSize: 12,
                background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                color: '#fff',
              }}>✦ 通过AI生成</span>
            </div>
            {/* 图片上传区 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
              <div style={{
                flex: 1, border: '1px dashed #d9d9d9', borderRadius: 4, padding: '28px 0',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                backgroundColor: '#fafafa', cursor: 'pointer',
              }}>
                <UploadOutlined style={{ fontSize: 22, color: '#8c8c8c', marginBottom: 8 }} />
                <div style={{ fontSize: 13, color: '#333' }}>点击或将文件拖拽到这里上传</div>
                <div style={{ fontSize: 12, color: '#8c8c8c', marginTop: 4 }}>支持.jpg .jpge .png，大小5M内</div>
              </div>
              <a href="#" style={{ fontSize: 13, color: '#ff4d4f', flexShrink: 0, paddingTop: 4 }}>删除</a>
            </div>
            {/* 文本输入区 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <textarea
                placeholder="请输入"
                style={{
                  flex: 1, border: '1px solid #d9d9d9', borderRadius: 4,
                  padding: '8px 12px', fontSize: 13, resize: 'vertical',
                  minHeight: 80, outline: 'none', fontFamily: 'inherit',
                }}
              />
              <a href="#" style={{ fontSize: 13, color: '#ff4d4f', flexShrink: 0, paddingTop: 4 }}>删除</a>
            </div>
            <div style={{ marginTop: 10 }}>
              <a href="#" style={{ fontSize: 13, color: BLUE }}>+ 添加</a>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          <button
            onClick={() => setSupplementModalVisible(false)}
            style={{ padding: '7px 20px', border: '1px solid #d9d9d9', borderRadius: 4, backgroundColor: '#fff', cursor: 'pointer', fontSize: 14, color: '#333' }}
          >取消</button>
          <button style={{ padding: '7px 20px', border: 'none', borderRadius: 4, backgroundColor: BLUE, cursor: 'pointer', fontSize: 14, color: '#fff' }}>
            翻译并确认
          </button>
        </div>
      </Modal>

      {/* 图3：说明书多语言翻译编辑 弹窗 */}
      <Modal
        open={translateModalVisible}
        onCancel={() => setTranslateModalVisible(false)}
        footer={null}
        title="说明书多语言翻译编辑"
        width={800}
      >
        {/* PDF 拖入区 */}
        <div style={{
          border: '1px solid #e8e8e8', borderRadius: 4, padding: '40px 0',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          backgroundColor: '#fafafa', marginBottom: 28, cursor: 'pointer',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
          <div style={{ fontSize: 14, color: '#333', marginBottom: 4 }}>拖入或点击下方按钮添加文档</div>
          <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 16 }}>仅支持PDF格式</div>
          <button style={{ padding: '8px 32px', border: 'none', borderRadius: 4, backgroundColor: BLUE, color: '#fff', cursor: 'pointer', fontSize: 14 }}>
            选择文档
          </button>
        </div>

        {/* 说明区：上传文件 + 翻译文件 */}
        <div style={{ display: 'flex', gap: 40 }}>
          {/* ① 上传文件 */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: ORANGE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>1</div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>上传文件</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {/* 正确示例 */}
              <div style={{ flex: 1, border: '1px solid #e8e8e8', borderRadius: 4, padding: '12px', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ color: '#52c41a', fontWeight: 600 }}>✓</span>
                  <span style={{ fontSize: 12, color: '#333' }}>PDF中仅包含<span style={{ color: ORANGE, fontWeight: 600 }}>一种语言</span></span>
                </div>
                <div style={{ backgroundColor: '#f5f5f5', borderRadius: 2, padding: '8px', fontSize: 11, color: '#666', lineHeight: '16px' }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Usage Instruction of Product</div>
                  <div>Step 1: Accessing the tool page</div>
                  <div style={{ color: '#999' }}>Log in to the Temu seller backend...</div>
                </div>
              </div>
              {/* 错误示例 */}
              <div style={{ flex: 1, border: '1px solid #e8e8e8', borderRadius: 4, padding: '12px', backgroundColor: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ color: '#ff4d4f', fontWeight: 600 }}>✗</span>
                  <span style={{ fontSize: 12, color: '#333' }}>PDF中包含<span style={{ color: ORANGE, fontWeight: 600 }}>多种语言</span></span>
                </div>
                <div style={{ backgroundColor: '#f5f5f5', borderRadius: 2, padding: '8px', fontSize: 11, color: '#666', lineHeight: '16px' }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>商品翻译工具使用说明</div>
                  <div>(1) 第一步: 定位工具页面</div>
                  <div style={{ color: '#999' }}>Usage Instruction...</div>
                </div>
              </div>
            </div>
          </div>

          {/* ② 翻译文件 */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: ORANGE, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>2</div>
              <span style={{ fontSize: 14, fontWeight: 600 }}>翻译文件</span>
            </div>
            <div style={{ border: '1px solid #e8e8e8', borderRadius: 4, padding: '12px 16px', backgroundColor: '#fff' }}>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 12 }}>制作一份包含<span style={{ color: ORANGE, fontWeight: 600 }}>多语言</span>版本的说明书</div>
              {[
                { src: 'English Instruction Manual', target: '英语', n: '1/3' },
                { src: 'Manual de instrucciones en inglés', target: '西班牙语', n: '2/3' },
                { src: 'Englische Anleitung', target: '德语', n: '3/3' },
              ].map(row => (
                <div key={row.n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ flex: 1, border: '1px solid #e8e8e8', borderRadius: 2, padding: '6px 8px', fontSize: 11, color: '#333', backgroundColor: '#fafafa' }}>
                    <div style={{ fontWeight: 500 }}>{row.src}</div>
                    <div style={{ color: '#8c8c8c' }}>{row.n}</div>
                  </div>
                  <span style={{ color: '#8c8c8c', fontSize: 16 }}>→</span>
                  <div style={{ width: 56, fontSize: 12, color: '#333', textAlign: 'center' }}>{row.target}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* 从说明书制作工具选择 弹窗 */}
      <Modal
        open={selectManualModalVisible}
        onCancel={() => setSelectManualModalVisible(false)}
        onOk={() => setSelectManualModalVisible(false)}
        title="从说明书制作工具选择"
        width={900}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ style: { backgroundColor: BLUE } }}
        styles={{ body: { padding: 0 } }}
      >
        {(() => {
          const MOCK_MANUALS = [
            {
              id: 1,
              name: 'Add Manual 20251017024328',
              languages: '英文/德语/西班牙语/法语/意大利语/韩语/日语/瑞典语/捷克...',
              preview: [
                { type: 'heading', text: 'Sofa Furniture User Manual' },
                { type: 'section', title: '1. Product Introduction', body: 'Thank you for purchasing our sofa! Made with high-quality materials, our sofas are stylish and perfect for various home and office environments. Please read the manual carefully before use to ensure safe and comfortable usage.' },
                { type: 'section', title: '2. Basic Usage Tips', bullets: ['Avoid placing heavy objects on the sofa for prolonged periods to prevent damage to the structure.', 'Do not engage in vigorous activity or jumping on the sofa to prevent damage to the frame or cushioning.', 'Avoid direct sunlight exposure for extended periods, as it may cause the fabric to fade.'] },
                { type: 'section', title: '3. Cleaning & Maintenance', bullets: ['Wipe the sofa surface with a soft cloth and regularly clean dust.', 'Use a mild detergent to clean stains and avoid harsh chemical cleaners.', 'Regularly check the sofa structure to ensure no loose parts.'] },
                { type: 'section', title: '4. Assembly Instructions', bullets: ['If assembly is required, follow the included instructions.', 'Ensure all parts are securely fastened to avoid instability'] },
              ] as { type: string; text?: string; title?: string; body?: string; bullets?: string[] }[],
            },
          ]
          const filtered = MOCK_MANUALS.filter(m =>
            !manualSearchQuery || m.name.toLowerCase().includes(manualSearchQuery.toLowerCase())
          )
          const selected = MOCK_MANUALS.find(m => m.id === selectedManualId)
          return (
            <div style={{ display: 'flex', height: 580, overflow: 'hidden' }}>
              {/* 左侧：搜索 + 列表 */}
              <div style={{ width: 340, borderRight: '1px solid #f0f0f0', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input
                      value={manualSearchQuery}
                      onChange={e => setManualSearchQuery(e.target.value)}
                      placeholder="请输入"
                      style={{
                        width: '100%', boxSizing: 'border-box',
                        border: '1px solid #d9d9d9', borderRadius: 4,
                        padding: '6px 32px 6px 10px', fontSize: 13, outline: 'none',
                      }}
                    />
                  </div>
                  <button style={{ padding: '6px 16px', border: 'none', borderRadius: 4, backgroundColor: BLUE, color: '#fff', cursor: 'pointer', fontSize: 13, flexShrink: 0 }}>查询</button>
                </div>
                <div style={{ fontSize: 12, color: '#8c8c8c' }}>仅可选择已完成翻译的说明书</div>
                {filtered.map(m => {
                  const isSelected = selectedManualId === m.id
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedManualId(m.id)}
                      style={{
                        position: 'relative', overflow: 'hidden',
                        border: `1px solid ${isSelected ? ORANGE : '#e8e8e8'}`,
                        borderRadius: 4, padding: '12px 14px',
                        backgroundColor: isSelected ? '#fffbe6' : '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{m.name}</div>
                      <div style={{ fontSize: 12, color: '#8c8c8c' }}>说明书包含语言：{m.languages}</div>
                      {isSelected && (
                        <div style={{
                          position: 'absolute', top: 0, right: 0,
                          width: 0, height: 0,
                          borderStyle: 'solid', borderWidth: '0 28px 28px 0',
                          borderColor: `transparent ${ORANGE} transparent transparent`,
                        }}>
                          <span style={{ position: 'absolute', top: 4, right: -24, fontSize: 11, color: '#fff', fontWeight: 700 }}>✓</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {/* 右侧：预览 */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px', backgroundColor: '#fafafa' }}>
                {selected ? selected.preview.map((block, i) => {
                  if (block.type === 'heading') return (
                    <div key={i} style={{ textAlign: 'center', fontSize: 15, fontWeight: 600, marginBottom: 20, color: '#333' }}>{block.text}</div>
                  )
                  return (
                    <div key={i} style={{ marginBottom: 18 }}>
                      <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 8 }}>{block.title}</div>
                      {block.body && <div style={{ fontSize: 12, color: '#555', textAlign: 'center', lineHeight: '20px' }}>{block.body}</div>}
                      {block.bullets && block.bullets.map((b, j) => (
                        <div key={j} style={{ fontSize: 12, color: '#555', textAlign: 'center', lineHeight: '20px' }}>・{b}</div>
                      ))}
                    </div>
                  )
                }) : (
                  <div style={{ color: '#8c8c8c', fontSize: 13, textAlign: 'center', marginTop: 40 }}>请在左侧选择说明书</div>
                )}
              </div>
            </div>
          )
        })()}
      </Modal>

      {/* 详情页装修弹窗 */}
      <Modal
        open={decorateModalVisible}
        onCancel={() => setDecorateModalVisible(false)}
        footer={null}
        width="90vw"
        style={{ top: '5vh', padding: 0, margin: '0 auto', maxWidth: '90vw' }}
        styles={{ body: { padding: 0, height: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}
        closable={false}
      >
        {/* 顶部标题栏 */}
        <div style={{ height: 52, borderBottom: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', padding: '0 20px', backgroundColor: '#fff', flexShrink: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>详情页装修</span>
        </div>
        {/* 中间三栏内容区 */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          {/* 左侧：装修组件 */}
          <div style={{ width: 260, borderRight: '1px solid #e8e8e8', backgroundColor: '#fff', overflowY: 'auto', flexShrink: 0 }}>
            <div style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600, color: '#333', borderBottom: '1px solid #f0f0f0' }}>
              装修组件
            </div>
            <div style={{ padding: '12px 16px 8px' }}>
              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 8 }}>图文类</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { icon: '🖼️', label: '图片', type: 'image' as const },
                  { icon: '📝', label: '文本', type: 'text' as const },
                ].map(item => (
                  <div key={item.type} style={{
                    flex: 1, border: '1px solid #e8e8e8', borderRadius: 4, padding: '12px 8px',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    cursor: 'pointer', backgroundColor: '#fff',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = BLUE; e.currentTarget.style.backgroundColor = '#f0f7ff' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.backgroundColor = '#fff' }}
                    onClick={() => {
                      const newId = decorateBlockCounter + 1
                      setDecorateBlockCounter(newId)
                      setDecorateBlocks(prev => [...prev, { id: newId, type: item.type, imageUrl: '', text: '', color: '#000000', fontSize: 12, align: 'left', bgColor: '#ffffff' }])
                      setSelectedDecorateBlockId(newId)
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{item.icon}</span>
                    <span style={{ fontSize: 12, color: '#333' }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 中间：画布区 */}
          <div style={{ flex: 1, backgroundColor: '#f0f0f0', overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '32px 24px', minWidth: 0 }}>
            {decorateBlocks.length === 0 ? (
              <div style={{
                width: 390, minHeight: 500, backgroundColor: '#fff', borderRadius: 4,
                border: '1px solid #e8e8e8', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 12,
              }}>
                <span style={{ fontSize: 40 }}>📦</span>
                <span style={{ fontSize: 13, color: '#8c8c8c' }}>请插入装修组件</span>
              </div>
            ) : (
              /* 外层容器宽 470px：390px卡片 + 80px工具栏区 */
              <div style={{ width: 470, flexShrink: 0 }}>
                <div style={{ width: 390, backgroundColor: '#fff', borderRadius: 4 }}>
                  <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 13, color: '#333' }}>页面预览</div>
                  {decorateBlocks.map((block, idx) => {
                    const isSelected = selectedDecorateBlockId === block.id
                    return (
                      <div key={block.id} style={{ position: 'relative' }} onClick={() => setSelectedDecorateBlockId(block.id)}>
                        {/* block 内容 */}
                        <div style={{ border: `2px solid ${isSelected ? ORANGE : 'transparent'}` }}>
                          {block.type === 'image' ? (
                            block.imageUrl ? (
                              <img src={block.imageUrl} alt="" style={{ width: '100%', display: 'block' }} />
                            ) : (
                              <div style={{ padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, backgroundColor: '#fafafa' }}>
                                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="2" y="6" width="28" height="20" rx="2" stroke="#bbb" strokeWidth="1.5"/><circle cx="10" cy="13" r="2.5" stroke="#bbb" strokeWidth="1.5"/><path d="M2 22l7-6 5 5 4-4 7 7" stroke="#bbb" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                                <span style={{ fontSize: 13, color: '#8c8c8c' }}>请在右侧面板添加图片</span>
                              </div>
                            )
                          ) : (
                            <div style={{ padding: '16px', backgroundColor: block.bgColor, minHeight: 60, display: 'flex', alignItems: 'center' }}>
                              {block.text ? (
                                <span style={{ fontSize: block.fontSize, color: block.color, textAlign: block.align, lineHeight: '1.6', whiteSpace: 'pre-wrap', display: 'block', width: '100%' }}>{block.text}</span>
                              ) : (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8c8c8c' }}>
                                  <span style={{ fontSize: 18, color: ORANGE, fontFamily: 'Georgia,serif', fontStyle: 'italic' }}>Aa</span>
                                  <span style={{ fontSize: 13 }}>请在右侧面板添加文本</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {/* 浮动工具栏：定位在卡片右侧 */}
                        {isSelected && (
                          <div style={{
                            position: 'absolute', left: 398, top: '50%', transform: 'translateY(-50%)',
                            display: 'flex', gap: 4, backgroundColor: '#fff',
                            border: '1px solid #e8e8e8', borderRadius: 4, padding: '4px 6px', zIndex: 1,
                          }}>
                            <button style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #d9d9d9', backgroundColor: '#fff', cursor: idx === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: idx === 0 ? '#ccc' : '#555' }}
                              onClick={e => { e.stopPropagation(); if (idx > 0) { const a = [...decorateBlocks]; [a[idx-1], a[idx]] = [a[idx], a[idx-1]]; setDecorateBlocks(a) } }}>↑</button>
                            <button style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #d9d9d9', backgroundColor: '#fff', cursor: idx === decorateBlocks.length - 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: idx === decorateBlocks.length - 1 ? '#ccc' : '#555' }}
                              onClick={e => { e.stopPropagation(); if (idx < decorateBlocks.length - 1) { const a = [...decorateBlocks]; [a[idx], a[idx+1]] = [a[idx+1], a[idx]]; setDecorateBlocks(a) } }}>↓</button>
                            <button style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid #d9d9d9', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: '#555' }}
                              onClick={e => { e.stopPropagation(); setDecorateBlocks(prev => prev.filter(b => b.id !== block.id)); setSelectedDecorateBlockId(null) }}>×</button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
          {/* 右侧：属性面板 */}
          <div style={{ width: 300, borderLeft: '1px solid #e8e8e8', backgroundColor: '#fafafa', flexShrink: 0, overflowY: 'auto' }}>
            {(() => {
              if (selectedDecorateBlockId == null) return (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 13, color: '#8c8c8c', textAlign: 'center', padding: '0 20px' }}>请选择对应的组件</span>
                </div>
              )
              const sel = decorateBlocks.find(b => b.id === selectedDecorateBlockId)
              if (!sel) return null
              const selIdx = decorateBlocks.findIndex(b => b.id === selectedDecorateBlockId)
              const updateSel = (patch: Partial<typeof sel>) => setDecorateBlocks(prev => prev.map(b => b.id === sel.id ? { ...b, ...patch } : b))
              if (sel.type === 'image') return (
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 16 }}>图片{selIdx + 1}</div>
                  <div style={{ border: '1px solid #e8e8e8', borderRadius: 4, padding: '20px 16px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="3" y="7" width="34" height="26" rx="2" stroke="#d9d9d9" strokeWidth="1.5"/><circle cx="13" cy="16" r="3" stroke="#d9d9d9" strokeWidth="1.5"/><path d="M3 28l9-8 6 6 5-5 8 8" stroke="#d9d9d9" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                    <div style={{ fontSize: 12, color: '#8c8c8c', textAlign: 'center', lineHeight: '18px' }}>宽高比 1/2 ≤ x ≤ 2, 宽度 ≥ 480, 大小 3M 以内</div>
                    <button style={{ width: '100%', padding: '8px 0', border: 'none', borderRadius: 4, backgroundColor: BLUE, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 500 }}
                      onClick={() => setDecorateImagePickerVisible(true)}>+ 从素材中心添加</button>
                    {[
                      { icon: '🔄', label: '使用虚拟试衣工具' },
                      { icon: '👤', label: '使用真人模拍工具' },
                      { icon: '🖼', label: '使用静物背景工具' },
                      { icon: '✏️', label: '使用智能修图工具' },
                    ].map(it => (
                      <button key={it.label} style={{ width: '100%', padding: '7px 0', border: '1px solid #d9d9d9', borderRadius: 4, backgroundColor: '#fff', color: '#333', cursor: 'pointer', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                        onClick={() => setDecorateImagePickerVisible(true)}>
                        <span>{it.icon}</span><span>{it.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )
              // text block properties
              return (
                <div style={{ padding: '20px' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#333', marginBottom: 12 }}>文本{selIdx + 1}</div>
                  {/* 文本输入 */}
                  <textarea placeholder="请输入" value={sel.text}
                    onChange={e => updateSel({ text: e.target.value })}
                    style={{ width: '100%', minHeight: 80, border: '1px solid #d9d9d9', borderRadius: 4, padding: '8px', fontSize: 13, resize: 'vertical', outline: 'none', color: '#333', fontFamily: 'inherit', marginBottom: 14, boxSizing: 'border-box', display: 'block' }}
                  />
                  {/* 颜色 + 大小 */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#333', marginBottom: 6 }}>颜色</div>
                      <label style={{ display: 'block', height: 32, border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden', cursor: 'pointer' }}>
                        <input type="color" value={sel.color} onChange={e => updateSel({ color: e.target.value })}
                          style={{ width: '140%', height: '140%', marginTop: -4, marginLeft: -4, cursor: 'pointer', border: 'none', padding: 0 }} />
                      </label>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#333', marginBottom: 6 }}>大小</div>
                      <select value={sel.fontSize} onChange={e => updateSel({ fontSize: Number(e.target.value) })}
                        style={{ width: '100%', height: 32, border: '1px solid #d9d9d9', borderRadius: 4, padding: '0 8px', fontSize: 13, color: '#333', backgroundColor: '#fff', cursor: 'pointer' }}>
                        {[12, 14, 16, 18, 20, 24, 28, 32].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* 对齐方式 */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 12, color: '#333', marginBottom: 6 }}>对齐方式</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {(['left', 'center', 'right', 'justify'] as const).map((v, i) => {
                        const labels = ['左对齐', '居中对齐', '右对齐', '两端对齐']
                        return (
                          <button key={v} style={{ flex: 1, padding: '5px 2px', fontSize: 11, cursor: 'pointer', borderRadius: 4, border: `1px solid ${sel.align === v ? BLUE : '#d9d9d9'}`, backgroundColor: sel.align === v ? '#e6f4ff' : '#fff', color: sel.align === v ? BLUE : '#333' }}
                            onClick={() => updateSel({ align: v })}>{labels[i]}</button>
                        )
                      })}
                    </div>
                  </div>
                  {/* 背景颜色 */}
                  <div>
                    <div style={{ fontSize: 12, color: '#333', marginBottom: 6 }}>背景颜色</div>
                    <label style={{ display: 'block', height: 40, border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden', cursor: 'pointer' }}>
                      <input type="color" value={sel.bgColor} onChange={e => updateSel({ bgColor: e.target.value })}
                        style={{ width: '140%', height: '140%', marginTop: -4, marginLeft: -4, cursor: 'pointer', border: 'none', padding: 0 }} />
                    </label>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
        {/* 底部操作栏 */}
        <div style={{ height: 56, borderTop: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 24px', gap: 12, backgroundColor: '#fff', flexShrink: 0 }}>
          <button style={{ padding: '7px 24px', border: 'none', borderRadius: 4, backgroundColor: BLUE, color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}>
            保存
          </button>
          <button style={{ padding: '7px 24px', border: '1px solid #d9d9d9', borderRadius: 4, backgroundColor: '#fff', color: '#333', cursor: 'pointer', fontSize: 14 }}
            onClick={() => setDecorateModalVisible(false)}>
            取消
          </button>
          <button style={{ padding: '7px 24px', border: 'none', borderRadius: 4, backgroundColor: 'transparent', color: '#8c8c8c', cursor: 'pointer', fontSize: 14 }}>
            清空
          </button>
        </div>
      </Modal>

      {/* 装修图片选择（zIndex 高于装修弹窗） */}
      <TemuMediaModal
        visible={decorateImagePickerVisible}
        onClose={() => setDecorateImagePickerVisible(false)}
        onConfirm={(urls) => {
          if (urls.length > 0 && selectedDecorateBlockId != null) {
            setDecorateBlocks(prev => prev.map(b => b.id === selectedDecorateBlockId ? { ...b, imageUrl: urls[0] } : b))
          }
          setDecorateImagePickerVisible(false)
        }}
        maxCount={1}
        defaultMediaType="image"
        zIndex={1200}
      />
    </div>
  )
}
