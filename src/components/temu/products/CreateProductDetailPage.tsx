'use client'

import React, { useState } from 'react'
import { Button, Checkbox } from 'antd'
import {
  CheckOutlined,
  ExclamationCircleFilled,
  UploadOutlined,
  BgColorsOutlined,
} from '@ant-design/icons'
import { useSearchParams, useRouter } from 'next/navigation'

const BLUE = '#1677ff'
const ORANGE = '#FA8C16'

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
type SlotType = 'main' | 'size' | 'normal'

function UploadSlot({ type, hint }: { type: SlotType; hint?: string }) {
  const bgColor = '#fafafa'
  const borderColor = '#d9d9d9'
  return (
    <div style={{
      width: 90, height: 90, flexShrink: 0,
      border: `1px dashed ${borderColor}`,
      borderRadius: 4,
      backgroundColor: bgColor,
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

// ==================== 主组件 ====================
export default function CreateProductDetailPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const category = searchParams.get('category') || '客厅单人椅'
  const pathStr = searchParams.get('path') || ''
  const pathArr = pathStr ? pathStr.split(',') : ['家居、厨房用品', '家具', '客厅家具', category]

  const [carouselTab, setCarouselTab] = useState<'main' | 'size'>('main')
  const [languages, setLanguages] = useState<string[]>(['英语'])

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
              <div style={{
                border: '1px solid #f0f0f0', borderRadius: 4, padding: '16px 20px',
              }}>
                {/* Tab 切换：主图 / 尺寸图 */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {(['main', 'size'] as const).map(tab => (
                    <button key={tab} onClick={() => setCarouselTab(tab)} style={{
                      padding: '4px 20px', borderRadius: 20, cursor: 'pointer',
                      border: `1px solid ${carouselTab === tab ? BLUE : '#d9d9d9'}`,
                      backgroundColor: carouselTab === tab ? '#EBF2FF' : '#fff',
                      color: carouselTab === tab ? BLUE : '#666',
                      fontSize: 13, fontWeight: carouselTab === tab ? 500 : 400,
                    }}>
                      {tab === 'main' ? '主图' : '尺寸图'}
                    </button>
                  ))}
                </div>

                {/* 上传行 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{
                    width: 60, fontSize: 13, color: '#333', textAlign: 'right',
                    paddingRight: 8, flexShrink: 0, paddingTop: 36, fontWeight: 500,
                  }}>
                    <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>英语
                  </span>

                  {/* 上传槽 */}
                  {carouselTab === 'main' ? (
                    <>
                      <UploadSlot type="main" hint={'背景简洁\n突出商品\n卖点'} />
                      <UploadSlot type="normal" />
                      <UploadSlot type="size" hint={'需提供公制\n和英制单位'} />
                      <UploadSlot type="normal" />
                      <UploadSlot type="normal" />
                    </>
                  ) : (
                    <>
                      <UploadSlot type="size" hint={'需提供公制\n和英制单位'} />
                      <UploadSlot type="normal" />
                      <UploadSlot type="normal" />
                    </>
                  )}

                  {/* 素材中心 & AI制图 */}
                  <button style={{
                    width: 90, height: 90, flexShrink: 0,
                    border: '1px dashed #d9d9d9', borderRadius: 4,
                    backgroundColor: '#fafafa', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 4,
                    fontSize: 12, color: '#555',
                  }}>
                    <UploadOutlined style={{ fontSize: 20, color: '#aaa' }} />
                    素材中心
                  </button>
                  <div style={{ position: 'relative' }}>
                    <button style={{
                      width: 90, height: 90, flexShrink: 0,
                      border: '1px dashed #d9d9d9', borderRadius: 4,
                      backgroundColor: '#fafafa', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center', gap: 4,
                      fontSize: 12, color: '#555',
                    }}>
                      <BgColorsOutlined style={{ fontSize: 20, color: '#aaa' }} />
                      AI 制图
                    </button>
                    <span style={{
                      position: 'absolute', top: -8, right: -8,
                      backgroundColor: '#FFD700', color: '#000',
                      fontSize: 10, fontWeight: 700, padding: '1px 5px',
                      borderRadius: 3, lineHeight: '16px',
                    }}>NEW</span>
                  </div>
                </div>

                {/* 说明文字 */}
                <div style={{ fontSize: 12, color: '#999', marginTop: 10 }}>
                  轮播图要求3-10张，宽高比例为1:1且宽高均大于800px，大小2M内；请勿遗漏尺寸图
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
    </div>
  )
}
