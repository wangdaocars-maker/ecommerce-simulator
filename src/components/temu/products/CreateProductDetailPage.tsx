'use client'

import React, { useState } from 'react'
import { Button, Checkbox, Input, Select } from 'antd'
import {
  CheckOutlined,
  ExclamationCircleFilled,
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
      <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 24px' }}>
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
