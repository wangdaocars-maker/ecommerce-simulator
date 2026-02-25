'use client'

import React, { useState, useMemo } from 'react'
import { Select, Input, Button } from 'antd'
import { SearchOutlined, RightOutlined, ReloadOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const BLUE = '#1677ff'

// ==================== 分类数据 ====================
const categoryData: Record<string, string[]> = {
  __root__: [
    'CD和黑胶唱片', '办公用品', '宠物用品', '家电', '电子',
    '工业和科学', '家居、厨房用品', '家居装修', '健康和家居用品', '乐器',
  ],
  '家居、厨房用品': [
    '厨房和餐厅', '真空吸尘器和地板护理', '熨烫用品', '活动和派对用品',
    '浴室用品', '床上用品', '家居装饰', '家具', '收纳用品', '装饰字画',
  ],
  '家具': [
    '卧室家具', '办公家具', '儿童家具', '客厅家具',
    '餐厅家具', '门厅家具', '儿童房家具', '厨房家具', '家具替换零件', '浴室家具',
  ],
  '客厅家具': [
    '家庭娱乐家具', '客厅家具套装', '儿童家具', '客厅单人椅',
    '沙发和沙发床', '休闲椅', '梯架', '沙发床', '客厅桌',
    '软垫凳和带储藏箱的软垫凳', '客厅收纳储物柜',
  ],
  '餐厅家具': ['餐桌', '餐椅', '餐边柜、餐具柜', '酒柜', '餐厅套装'],
  '卧室家具': ['床', '床头柜', '衣柜', '梳妆台', '卧室套装'],
  '家庭娱乐家具': ['电视柜和娱乐柜', '书柜', '展示柜'],
}

const hasChildren = (cat: string) => !!(categoryData[cat]?.length)

const quickRecommend = [
  { label: '家居、厨房用品>...>客厅单人椅', path: ['家居、厨房用品', '家具', '客厅家具', '客厅单人椅'] },
  { label: '家居、厨房用品>...>沙发和沙发床', path: ['家居、厨房用品', '家具', '客厅家具', '沙发和沙发床'] },
  { label: '家居、厨房用品>...>餐边柜、餐具柜', path: ['家居、厨房用品', '家具', '餐厅家具', '餐边柜、餐具柜'] },
  { label: '家居、厨房用品>...>电视柜和娱乐柜', path: ['家居、厨房用品', '家具', '客厅家具', '家庭娱乐家具', '电视柜和娱乐柜'] },
  { label: '家居、厨房用品>...>床头柜', path: ['家居、厨房用品', '家具', '卧室家具', '床头柜'] },
]

// ==================== 步骤条 ====================
function StepBar({ current }: { current: 1 | 2 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0, padding: '20px 0 4px' }}>
      {/* 步骤1 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          backgroundColor: current >= 1 ? BLUE : '#f0f0f0',
          border: current >= 1 ? 'none' : '1px solid #d9d9d9',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: current >= 1 ? '#fff' : '#bbb', fontSize: 13, fontWeight: 600,
        }}>1</div>
        <span style={{ color: current >= 1 ? BLUE : '#bbb', fontWeight: current === 1 ? 600 : 400, fontSize: 14 }}>
          选择商品分类
        </span>
      </div>

      {/* 连接线 */}
      <div style={{ width: 100, height: 1, backgroundColor: '#d9d9d9', margin: '0 12px' }} />

      {/* 步骤2 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          backgroundColor: current >= 2 ? BLUE : 'transparent',
          border: `1px solid ${current >= 2 ? BLUE : '#d9d9d9'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: current >= 2 ? '#fff' : '#bbb', fontSize: 13, fontWeight: 600,
        }}>2</div>
        <span style={{ color: current >= 2 ? BLUE : '#bbb', fontSize: 14 }}>基本信息</span>
      </div>
    </div>
  )
}

// ==================== 主组件 ====================
export default function CreateProductPage() {
  const router = useRouter()
  const [site, setSite] = useState<string>('')
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const [colSearches, setColSearches] = useState<string[]>(Array(6).fill(''))

  // 计算每列数据
  const columns = useMemo(() => {
    const cols: string[][] = [categoryData['__root__']]
    for (let i = 0; i < selectedPath.length; i++) {
      const children = categoryData[selectedPath[i]]
      if (children?.length) cols.push(children)
      else break
    }
    while (cols.length < 6) cols.push([])
    return cols
  }, [selectedPath])

  // 点击某列某项
  const handleSelect = (colIndex: number, cat: string) => {
    setSelectedPath([...selectedPath.slice(0, colIndex), cat])
    // 清空该列之后的搜索词
    setColSearches(prev => {
      const next = [...prev]
      for (let i = colIndex + 1; i < 6; i++) next[i] = ''
      return next
    })
  }

  // 最终选中的叶节点（无子分类）
  const selectedLeaf = useMemo(() => {
    if (!selectedPath.length) return null
    const last = selectedPath[selectedPath.length - 1]
    return !hasChildren(last) ? last : null
  }, [selectedPath])

  const updateColSearch = (colIdx: number, val: string) => {
    setColSearches(prev => { const n = [...prev]; n[colIdx] = val; return n })
  }

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: 'calc(100vh - 52px)', paddingBottom: 88 }}>

      {/* 顶部白色区域 */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0', padding: '16px 32px 0' }}>
        {/* 标题 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 4, height: 20, backgroundColor: BLUE, borderRadius: 2 }} />
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>新建商品</h2>
        </div>
        <StepBar current={1} />
      </div>

      {/* 内容卡片 */}
      <div style={{ maxWidth: 1100, margin: '24px auto', padding: '0 24px' }}>
        {/* 右上角链接 */}
        <div style={{ textAlign: 'right', fontSize: 13, color: '#666', marginBottom: 12 }}>
          不知道如何发品？<a href="#" style={{ color: BLUE }}>查看发品攻略</a>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 4, padding: '28px 32px' }}>

          {/* 经营站点 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0 }}>
              <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>经营站点
            </label>
            <Select
              value={site || undefined}
              placeholder="请选择"
              style={{ width: 500 }}
              size="large"
              onChange={(v) => { setSite(v); setSelectedPath([]); setColSearches(Array(6).fill('')) }}
              options={[
                { value: 'us', label: '美国站' },
                { value: 'eu', label: '欧洲站' },
                { value: 'global', label: '全球站' },
              ]}
            />
          </div>

          {/* 站点与发货仓关系 */}
          {site && (
            <div style={{ display: 'flex', marginBottom: 24 }}>
              <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, lineHeight: '20px', paddingTop: 2 }}>
                站点与发货仓关系
              </label>
              <div style={{ flex: 1 }}>
                <div style={{ border: '1px solid #f0f0f0', borderRadius: 4, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <div style={{ fontSize: 13, color: '#666' }}>
                      <span style={{ fontWeight: 600, color: '#333', marginRight: 8 }}>我的模版</span>
                      暂无模版，填写以下信息并点击右侧按钮即可保存模版
                    </div>
                    <Button size="small">保存为模版</Button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 180px', gap: '10px 16px', alignItems: 'center', fontSize: 13 }}>
                    <span style={{ color: '#666' }}>覆盖站点</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#ff4d4f' }}>*</span>
                      <span style={{ color: '#333' }}>卖家自发货仓</span>
                      <span style={{ color: '#FA8C16' }}>多发货仓时，订单就近发货</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 6, fontSize: 13 }}>
                      <span style={{ color: '#999' }}>无可选发货仓？</span>
                      <a href="#" style={{ color: BLUE }}>去创建</a>
                      <a href="#" style={{ color: BLUE }}><ReloadOutlined /> 刷新</a>
                    </div>

                    <span style={{ color: '#333', fontWeight: 500 }}>
                      {site === 'us' ? '美国站' : site === 'eu' ? '欧洲站' : '全球站'}
                    </span>
                    <Select placeholder="请选择" size="small"
                      options={[{ value: '1', label: '美国仓库A' }]} />
                    <span />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 商品分类 */}
          <div style={{ display: 'flex' }}>
            <label style={{ width: 110, fontSize: 13, color: '#333', textAlign: 'right', paddingRight: 12, flexShrink: 0, paddingTop: 6 }}>
              <span style={{ color: '#ff4d4f', marginRight: 2 }}>*</span>商品分类
            </label>
            <div style={{ flex: 1 }}>
              {/* 全局搜索框 */}
              <Input
                prefix={<SearchOutlined style={{ color: '#bbb' }} />}
                placeholder="搜索分类：可输入商品名称"
                style={{ marginBottom: 10 }}
              />

              {/* 常用推荐 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap', fontSize: 13 }}>
                <span style={{ color: '#666', flexShrink: 0 }}>常用推荐：</span>
                {quickRecommend.map((r) => (
                  <a key={r.label} href="#"
                    onClick={(e) => { e.preventDefault(); setSelectedPath(r.path); setColSearches(Array(6).fill('')) }}
                    style={{ color: BLUE }}>
                    {r.label}
                  </a>
                ))}
              </div>

              {/* 面包屑路径条 */}
              <div style={{
                backgroundColor: '#f0f6ff', borderRadius: '4px 4px 0 0',
                padding: '8px 12px', fontSize: 13,
                display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2,
              }}>
                <a href="#"
                  onClick={(e) => { e.preventDefault(); setSelectedPath([]) }}
                  style={{ color: BLUE, fontWeight: 500, textDecoration: 'none' }}
                >全部分类</a>
                {selectedPath.map((p, i) => (
                  <React.Fragment key={p}>
                    <span style={{ color: '#999', margin: '0 2px' }}>&gt;</span>
                    <a href="#"
                      onClick={(e) => { e.preventDefault(); setSelectedPath(selectedPath.slice(0, i + 1)) }}
                      style={{
                        color: BLUE,
                        fontWeight: !hasChildren(p) && i === selectedPath.length - 1 ? 600 : 400,
                        textDecoration: 'none',
                      }}
                    >{p}</a>
                  </React.Fragment>
                ))}
              </div>

              {/* 6列级联选择器 */}
              <div style={{
                border: '1px solid #f0f0f0', borderTop: 'none', borderRadius: '0 0 4px 4px',
                display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)',
                height: 380, overflow: 'hidden',
              }}>
                {columns.slice(0, 6).map((col, colIdx) => (
                  <div key={colIdx} style={{
                    borderRight: colIdx < 5 ? '1px solid #f0f0f0' : 'none',
                    display: 'flex', flexDirection: 'column',
                    height: '100%', overflow: 'hidden',
                  }}>
                    {/* 列搜索框 */}
                    <div style={{ padding: '6px 8px', borderBottom: '1px solid #f5f5f5', flexShrink: 0 }}>
                      <Input
                        size="small"
                        prefix={<SearchOutlined style={{ color: '#bbb', fontSize: 11 }} />}
                        placeholder="搜索类目"
                        value={colSearches[colIdx]}
                        onChange={e => updateColSearch(colIdx, e.target.value)}
                        style={{ fontSize: 12 }}
                      />
                    </div>
                    {/* 分类列表 */}
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                      {col
                        .filter(cat => !colSearches[colIdx] || cat.includes(colSearches[colIdx]))
                        .map((cat) => {
                          const isSelected = selectedPath[colIdx] === cat
                          const isOnPath = selectedPath.includes(cat)
                          return (
                            <div key={cat}
                              onClick={() => handleSelect(colIdx, cat)}
                              style={{
                                padding: '7px 10px', fontSize: 13, cursor: 'pointer',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                backgroundColor: isSelected ? '#EBF2FF' : 'transparent',
                                color: isOnPath ? BLUE : '#333',
                                fontWeight: isOnPath ? 500 : 400,
                              }}
                              onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5' }}
                              onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
                            >
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cat}</span>
                              {hasChildren(cat) && <RightOutlined style={{ fontSize: 10, color: '#bbb', flexShrink: 0, marginLeft: 4 }} />}
                            </div>
                          )
                        })}
                    </div>
                  </div>
                ))}
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
      }}>
        {selectedLeaf ? (
          <div style={{ fontSize: 14, color: '#333', marginBottom: 10 }}>
            已选分类：<span style={{ color: BLUE, fontWeight: 500 }}>{selectedLeaf}</span>
          </div>
        ) : (
          <div style={{ fontSize: 13, color: '#999', marginBottom: 10 }}>请完整选择商品分类</div>
        )}
        <Button
          type="primary"
          size="large"
          disabled={!selectedLeaf}
          style={{ width: 200 }}
          onClick={() => router.push(`/temu/products/create/detail?category=${encodeURIComponent(selectedLeaf!)}`)}
        >
          下一步
        </Button>
      </div>
    </div>
  )
}
