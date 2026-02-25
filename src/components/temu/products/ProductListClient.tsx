'use client'

import React, { useState } from 'react'
import { Table, Button, Input, Select, Pagination } from 'antd'
import type { TableColumnsType } from 'antd'
import {
  PlusOutlined,
  DownOutlined,
  ExclamationCircleFilled,
  EditOutlined,
} from '@ant-design/icons'

const ORANGE = '#FF6A00'
const BLUE = '#1677ff'

// ==================== 类型 ====================
type Product = {
  id: number
  hasImage: boolean
  image?: string
  title?: string
  category?: string
  spu?: string
  skc?: string
  sku: string
  isQualityPending?: boolean
  sites: string[]
  attributes: string[]
  sizeChart: string
  docStatus?: string
  docElectronic?: string
  docPaper?: string
  docLang?: string
  skuId?: string
  spec?: string
  shippingMode?: string
  inventory?: number | null
  showInventory?: string
  unpaidInventory?: number
  shippingOrigin?: string
  productCode?: string
  vol?: string
  weight?: string
  platformMeasure?: string
  sensitiveAttr?: string
  sensitiveStatus?: string
  skuClass?: string
  skuCount?: string
  skuNetWeight?: string
  skuBarcode?: string
  price?: number | null
  priceCNY?: number | null
  createdAt?: string
  marketing?: string
  operations: string[]
}

// ==================== 假数据 ====================
const mockProducts: Product[] = [
  {
    id: 1,
    hasImage: false,
    skc: '55069425056',
    sku: '6-1-W834S00608',
    isQualityPending: true,
    sites: [],
    attributes: [],
    sizeChart: '',
    operations: ['库存流水记录'],
  },
  {
    id: 2,
    hasImage: true,
    image: '#c5b8a8',
    title: 'U - Style Large 60 - Inch Console Table with Geometric Clean Lines Design, Stylish Entryway Table with Painted Finish and Adjustable Feet, Suitable Living Room, Entryway, Hallway.',
    category: '边桌',
    spu: '6132979075',
    skc: '31467191493',
    sku: '6-1-N711P303209K',
    sites: ['美国站'],
    attributes: ['材质: 人造板', '风格: 不拘一格', '材料: 其他材料', '特征: 其他特征...'],
    sizeChart: '-',
    docStatus: '处理成功',
    docElectronic: '(已压缩) 多国说...',
    docPaper: '去制作',
    docLang: '英文',
    skuId: '58769010874',
    spec: '颜色: White + Primary Living Space + American Design,American Traditional + MDF',
    shippingMode: '卖家自发货',
    inventory: 40,
    showInventory: '展示',
    unpaidInventory: 0,
    shippingOrigin: '美国',
    productCode: '-',
    vol: '163.1cm*50.8cm*21.1cm',
    weight: '49500.495g',
    platformMeasure: '-',
    sensitiveAttr: '非敏感品',
    sensitiveStatus: '待提交',
    skuClass: '单品',
    skuCount: '1件',
    skuNetWeight: '100克',
    skuBarcode: '6-1-N711P303209K',
    price: 502.85,
    priceCNY: 3508.84,
    createdAt: '2026-02-08 23:06:03',
    marketing: '暂无推荐',
    operations: ['编辑', '上传原图', '复制到其他站点', '修改库存', '库存流水记录'],
  },
  {
    id: 3,
    hasImage: true,
    image: '#d8d0c8',
    title: '1 Seater Sofa Living Room',
    category: '客厅单人椅',
    spu: '7297934759',
    skc: '35673022373',
    sku: '6-1-W68078887',
    sites: ['美国站'],
    attributes: ['护理说明: 干洗', '颜色: 紫色', '材料: 其他材料', '表面推荐: 其他...'],
    sizeChart: '-',
    docStatus: '处理成功',
    docElectronic: '(已压缩) 多国说...',
    docPaper: '去制作',
    docLang: '英文',
    skuId: '52741836774',
    spec: '颜色: White + Polyester',
    shippingMode: '卖家自发货',
    inventory: 21,
    showInventory: '展示',
    unpaidInventory: 0,
    shippingOrigin: '美国',
    productCode: '-',
    vol: '81.2cm*61.3cm*60.2cm',
    weight: '30290.874g',
    platformMeasure: '-',
    sensitiveAttr: '非敏感品',
    sensitiveStatus: '待提交',
    skuClass: '单品',
    skuCount: '1件',
    skuNetWeight: '100克',
    skuBarcode: '6-1-W68078887',
    price: 772.04,
    priceCNY: 5387.22,
    createdAt: '2026-02-08 23:05:40',
    marketing: '暂无推荐',
    operations: ['编辑', '上传原图', '复制到其他站点', '修改库存', '库存流水记录'],
  },
  {
    id: 4,
    hasImage: true,
    image: '#a0a8b0',
    title: 'Folding sofa bed, floor to ceiling sofa, corduroy fabric double sofa, suitable living rooms, guests, offices, apartments (dark gray)',
    category: '沙发和沙发床',
    spu: '8944777089',
    skc: '20108005037',
    sku: '6-1-W3739P36B636',
    sites: ['美国站'],
    attributes: ['风格: 不拘一格', '颜色: 黄色', '材料: 其他材料', '点缀功能: 其他点缀功...'],
    sizeChart: '-',
    docStatus: '处理成功',
    docElectronic: '(已压缩) 多国说...',
    docPaper: '去制作',
    docLang: '英文',
    skuId: '55467891427',
    spec: '颜色: DARK GREY + Foam',
    shippingMode: '卖家自发货',
    inventory: 56,
    showInventory: '展示',
    unpaidInventory: 0,
    shippingOrigin: '美国',
    productCode: '-',
    vol: '153.1cm*38cm*38cm',
    weight: '34926.584g',
    platformMeasure: '-',
    sensitiveAttr: '非敏感品',
    sensitiveStatus: '待提交',
    skuClass: '单品',
    skuCount: '1件',
    skuNetWeight: '100克',
    skuBarcode: '6-1-W3739P36B636',
    price: 639.78,
    priceCNY: 4464.32,
    createdAt: '2026-02-08 23:05:27',
    marketing: '暂无推荐',
    operations: ['编辑', '上传资质', '上传原图', '复制到其他站点', '修改库存'],
  },
]

// ==================== Banner ====================
function Banner() {
  return (
    <div style={{
      background: 'linear-gradient(to right, #FFD19A, #FFEBD4, #FFF8F2)',
      borderRadius: 8,
      padding: '16px 24px',
      marginBottom: 12,
      display: 'flex',
      alignItems: 'center',
      minHeight: 80,
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: '#7A3000' }}>春节专属补贴 </span>
          <span style={{ fontSize: 22, fontWeight: 900, color: ORANGE }}>提高推广转化率</span>
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#666' }}>
          <span>✅ 享有推广曝光</span>
          <span>✅ 春节专属消费者补贴，提高转化率</span>
          <span>✅ 调整ROAS，消费者可获得更多优惠</span>
        </div>
      </div>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'radial-gradient(circle, #FFCA80, #FF8C00)',
        opacity: 0.4, marginRight: 20, flexShrink: 0,
      }} />
      <button style={{
        backgroundColor: ORANGE, color: '#fff', border: 'none',
        borderRadius: 24, padding: '10px 24px',
        fontSize: 15, fontWeight: 700, cursor: 'pointer',
        flexShrink: 0,
      }}>
        前往推广 &gt;
      </button>
    </div>
  )
}

// ==================== 提示条 ====================
function NoticeBar() {
  return (
    <div style={{
      backgroundColor: '#FFFBE6', border: '1px solid #FFE58F',
      borderRadius: 4, padding: '10px 16px', marginBottom: 12,
      fontSize: 13, lineHeight: '24px',
    }}>
      <div>
        <ExclamationCircleFilled style={{ color: ORANGE, marginRight: 6 }} />
        1、您有 <span style={{ color: ORANGE, fontWeight: 600 }}>149</span> 个商品实拍图待上传或有异常，请尽快处理，
        <a href="#" style={{ color: ORANGE }}>否则影响售卖</a>。
        <a href="#" style={{ color: BLUE, marginLeft: 4 }}>前往处理</a>
      </div>
      <div style={{ color: '#666', paddingLeft: 20 }}>
        2、为了保护商家原图版权，请及时为您的商品【上传原图】
      </div>
    </div>
  )
}

// ==================== 待办任务 ====================
function TodoBar() {
  const todos = [
    { label: '商品信息待修改', count: '6' },
    { label: '商品属性待办', count: '99+' },
    { label: '说明书待处理', count: '9' },
    { label: '待填写建议零售价', count: '99+' },
    { label: '热销款主图视频', count: '43' },
  ]
  return (
    <div style={{
      backgroundColor: '#fff', border: '1px solid #f0f0f0',
      borderRadius: 4, padding: '10px 16px', marginBottom: 12,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <ExclamationCircleFilled style={{ color: '#FA8C16', fontSize: 15 }} />
        <span style={{ fontSize: 13, fontWeight: 600 }}>待办任务</span>
      </div>
      <div style={{ flex: 1, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {todos.map((t) => (
          <div key={t.label} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 10px', border: '1px solid #f0f0f0',
            borderRadius: 4, cursor: 'pointer', fontSize: 13,
          }}>
            <span>{t.label}</span>
            <span style={{
              backgroundColor: '#ff4d4f', color: '#fff', borderRadius: 10,
              padding: '0 6px', fontSize: 11, fontWeight: 600,
            }}>{t.count}</span>
            <span style={{ color: '#bbb', fontSize: 12 }}>›</span>
          </div>
        ))}
      </div>
      <a href="#" style={{ color: BLUE, fontSize: 13, flexShrink: 0 }}>查看全部任务</a>
    </div>
  )
}

// ==================== 快速筛选 ====================
function QuickFilter() {
  const [active, setActive] = useState<string | null>(null)
  const filters = [
    { label: '热销款' },
    { label: '商品分类错误待修正' },
    { label: '流量扶持待领取 0' },
    { label: '欧盟潜力品 0', isNew: true },
    { label: '传视频得免费流量加权' },
    { label: '商品流量关注 337' },
  ]
  return (
    <div style={{
      backgroundColor: '#fff', border: '1px solid #f0f0f0',
      borderRadius: 4, padding: '10px 16px', marginBottom: 12,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <span style={{ fontSize: 13, color: '#666', flexShrink: 0 }}>快速筛选</span>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <button key={f.label} onClick={() => setActive(active === f.label ? null : f.label)} style={{
            padding: '6px 14px', cursor: 'pointer', fontSize: 13,
            border: `1px solid ${active === f.label ? ORANGE : '#ebebeb'}`,
            borderRadius: 4,
            backgroundColor: active === f.label ? '#FFF3E8' : '#f5f5f5',
            color: active === f.label ? ORANGE : '#333',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            {f.label}
            {f.isNew && (
              <span style={{
                backgroundColor: '#FFD700', color: '#000',
                fontSize: 10, fontWeight: 700, padding: '0 4px', borderRadius: 3,
              }}>NEW</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ==================== 搜索表单 ====================
function SearchForm() {
  return (
    <div style={{
      backgroundColor: '#fff', border: '1px solid #f0f0f0',
      borderRadius: 4, padding: '16px', marginBottom: 12,
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#333', flexShrink: 0, whiteSpace: 'nowrap' }}>商品ID查询</span>
          <Select defaultValue="SKC" size="small" style={{ width: 80 }}
            options={[{ value: 'SKC', label: 'SKC' }, { value: 'SPU', label: 'SPU' }]} />
          <Input size="small" placeholder="多个查询请空格或逗号依次输入" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#333', flexShrink: 0 }}>站点</span>
          <Select size="small" style={{ flex: 1 }} placeholder="请选择"
            options={[{ value: 'us', label: '美国' }, { value: 'eu', label: '欧区' }]} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#333', flexShrink: 0 }}>商品属性</span>
          <Select defaultValue="include" size="small" style={{ width: 70 }}
            options={[{ value: 'include', label: '包含' }, { value: 'exclude', label: '不包含' }]} />
          <Input size="small" placeholder="请输入属性名称" />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#333', flexShrink: 0 }}>货号</span>
          <Select defaultValue="sku" size="small" style={{ width: 130 }}
            options={[{ value: 'sku', label: 'SKU(精准查询)' }]} />
          <Input size="small" placeholder="多个查询请空格或逗号依次输入" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#333', flexShrink: 0 }}>商品名称</span>
          <Input size="small" placeholder="请输入" style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, color: '#333', flexShrink: 0 }}>商品分类</span>
          <Select size="small" style={{ flex: 1 }} placeholder="请选择"
            options={[{ value: 'all', label: '全部' }]} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="primary" size="small" style={{ backgroundColor: BLUE, borderColor: BLUE }}>查询</Button>
        <Button size="small">重置</Button>
        <Button size="small">展开 <DownOutlined /></Button>
      </div>
    </div>
  )
}

// ==================== 表格列配置 ====================
const columns: TableColumnsType<Product> = [
  {
    title: '商品信息',
    dataIndex: 'id',
    fixed: 'left',
    width: 300,
    onHeaderCell: () => ({ style: { backgroundColor: '#fafafa' } }),
    render: (_, record) => (
      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 4, flexShrink: 0,
          backgroundColor: record.hasImage ? record.image : '#f5f5f5',
          border: '1px solid #f0f0f0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ccc', fontSize: 24,
        }}>
          {!record.hasImage && '□'}
        </div>
        <div style={{ flex: 1, minWidth: 0, fontSize: 12, lineHeight: '18px' }}>
          {record.title && (
            <div style={{
              color: '#333', marginBottom: 3,
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>{record.title}</div>
          )}
          {record.category && <div style={{ color: '#666' }}>类目: {record.category}</div>}
          {record.spu && <div style={{ color: '#999' }}>SPU ID: {record.spu}</div>}
          {record.skc && <div style={{ color: '#999' }}>SKC ID: {record.skc}</div>}
          <div style={{ color: '#999' }}>货号: {record.sku}</div>
          {record.isQualityPending && <div style={{ color: ORANGE, marginTop: 2 }}>资质待上传</div>}
        </div>
      </div>
    ),
  },
  {
    title: '经营站点',
    dataIndex: 'sites',
    width: 90,
    render: (sites: string[]) => (
      <div style={{ fontSize: 12 }}>{sites.map(s => <div key={s}>{s}</div>)}</div>
    ),
  },
  {
    title: '商品属性',
    dataIndex: 'attributes',
    width: 140,
    render: (attrs: string[]) => (
      <div style={{ fontSize: 12, lineHeight: '20px' }}>
        {attrs.map((a, i) => <div key={i}>{a}</div>)}
        {attrs.length > 0 && <a href="#" style={{ color: BLUE }}>全部</a>}
      </div>
    ),
  },
  {
    title: '尺码表',
    dataIndex: 'sizeChart',
    width: 70,
    render: (v: string) => <span style={{ fontSize: 12 }}>{v}</span>,
  },
  {
    title: '说明书信息',
    children: [
      {
        title: '电子版',
        key: 'docElectronic',
        width: 150,
        render: (_, record) => (
          <div style={{ fontSize: 12, lineHeight: '20px' }}>
            {record.docStatus && (
              <div>
                <span style={{ color: '#52c41a', marginRight: 2 }}>●</span>
                {record.docStatus}
                <a href="#" style={{ color: BLUE, marginLeft: 4 }}>更新</a>
              </div>
            )}
            {record.docElectronic && <div style={{ color: '#666' }}>{record.docElectronic}</div>}
            {record.docLang && <div style={{ color: '#999' }}>包含语言: {record.docLang}</div>}
          </div>
        ),
      },
      {
        title: '纸质版',
        key: 'docPaper',
        width: 80,
        render: (_, record) => (
          <div style={{ fontSize: 12 }}>
            {record.docPaper && <a href="#" style={{ color: BLUE }}>{record.docPaper}</a>}
          </div>
        ),
      },
    ],
  },
  {
    title: 'SKU ID',
    dataIndex: 'skuId',
    width: 130,
    render: (v: string) => <span style={{ fontSize: 12 }}>{v}</span>,
  },
  {
    title: '商品规格',
    dataIndex: 'spec',
    width: 190,
    render: (v: string) => <span style={{ fontSize: 12, lineHeight: '18px' }}>{v}</span>,
  },
  {
    title: '发货模式',
    dataIndex: 'shippingMode',
    width: 120,
    render: (v: string) => (
      <span style={{ fontSize: 12 }}>
        {v}{v && <a href="#" style={{ color: BLUE, marginLeft: 4 }}><EditOutlined /></a>}
      </span>
    ),
  },
  {
    title: '库存',
    dataIndex: 'inventory',
    width: 80,
    render: (v: number | null) => (
      <span style={{ fontSize: 12 }}>
        {v != null && <>{v} <a href="#" style={{ color: BLUE }}><EditOutlined /></a></>}
      </span>
    ),
  },
  {
    title: '是否展示库存标',
    dataIndex: 'showInventory',
    width: 110,
    render: (v: string) => (
      <span style={{ fontSize: 12 }}>
        {v}{v && <a href="#" style={{ color: BLUE, marginLeft: 4 }}><EditOutlined /></a>}
      </span>
    ),
  },
  {
    title: '下单未支付库存',
    dataIndex: 'unpaidInventory',
    width: 110,
    render: (v: number) => <span style={{ fontSize: 12 }}>{v}</span>,
  },
  {
    title: '运费模版发货地',
    dataIndex: 'shippingOrigin',
    width: 110,
    render: (v: string) => <span style={{ fontSize: 12 }}>{v}</span>,
  },
  {
    title: '商品编码',
    dataIndex: 'productCode',
    width: 90,
    render: (v: string) => <span style={{ fontSize: 12 }}>{v}</span>,
  },
  {
    title: '体积重量信息',
    children: [
      {
        title: '卖家测量',
        key: 'vol',
        width: 170,
        render: (_, record) => (
          <div style={{ fontSize: 12, lineHeight: '20px' }}>
            {record.vol && <div>体积: {record.vol}</div>}
            {record.weight && <div>重量: {record.weight}</div>}
          </div>
        ),
      },
      {
        title: <span>平台测量参考 <a href="#" style={{ color: BLUE, fontWeight: 400 }}>?</a></span>,
        key: 'platformMeasure',
        width: 130,
        render: (_, record) => <span style={{ fontSize: 12 }}>{record.platformMeasure}</span>,
      },
    ],
  },
  {
    title: '敏感属性信息',
    dataIndex: 'sensitiveAttr',
    width: 130,
    render: (_, record) => (
      <div style={{ fontSize: 12, lineHeight: '20px' }}>
        {record.sensitiveAttr && (
          <div>{record.sensitiveAttr} <a href="#" style={{ color: BLUE }}><EditOutlined /></a></div>
        )}
        {record.sensitiveStatus && (
          <div>状态: <span style={{ color: '#FA8C16' }}>● </span>{record.sensitiveStatus}</div>
        )}
      </div>
    ),
  },
  {
    title: 'SKU分类',
    dataIndex: 'skuClass',
    width: 140,
    render: (_, record) => (
      <div style={{ fontSize: 12, lineHeight: '20px' }}>
        {record.skuClass && <div>{record.skuClass}</div>}
        {record.skuCount && <div>单品数量: {record.skuCount}</div>}
        {record.skuNetWeight && <div>单品净含量: {record.skuNetWeight}</div>}
      </div>
    ),
  },
  {
    title: 'SKU货号',
    dataIndex: 'skuBarcode',
    width: 160,
    render: (v: string) => <span style={{ fontSize: 12 }}>{v}</span>,
  },
  {
    title: (
      <div>
        <div>申报价格(USD)</div>
        <div style={{ fontWeight: 400, color: '#999', fontSize: 11 }}>换算汇率: 1USD=6.9779CNY</div>
      </div>
    ),
    dataIndex: 'price',
    width: 170,
    render: (_, record) => (
      <div style={{ fontSize: 12, lineHeight: '20px' }}>
        {record.price != null && (
          <>
            <div style={{ fontWeight: 500 }}>$ {record.price.toFixed(2)}</div>
            <div style={{ color: '#999' }}>人民币报价:{record.priceCNY?.toFixed(2)} CNY</div>
            <div style={{ color: '#999' }}>(参考价)</div>
          </>
        )}
      </div>
    ),
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 150,
    render: (v: string) => <span style={{ fontSize: 12 }}>{v}</span>,
  },
  {
    title: '营销推广',
    dataIndex: 'marketing',
    width: 90,
    render: (v: string) => <span style={{ fontSize: 12, color: '#999' }}>{v}</span>,
  },
  {
    title: '操作',
    dataIndex: 'operations',
    fixed: 'right',
    width: 120,
    render: (ops: string[]) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {(ops || []).map((op) => (
          <a key={op} href="#" style={{ color: BLUE, fontSize: 12, lineHeight: '20px' }}>{op}</a>
        ))}
      </div>
    ),
  },
]

// ==================== 主组件 ====================
export default function ProductListClient() {
  const [activeTab, setActiveTab] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const tabs = [
    { key: 'all', label: '全部', count: 15054 },
    { key: 'on_sale', label: '在售中', count: 230 },
    { key: 'not_published', label: '未发布到站点', count: 11879 },
    { key: 'off_shelf', label: '已下架/已终止', count: 2945 },
  ]

  const regions = [
    { label: '全球', color: '#52c41a', active: true },
    { label: '美国', color: '#1677ff', active: false },
    { label: '欧区', color: '#1677ff', active: false },
    { label: '商家中心', color: '#ff4d4f', active: false },
  ]

  return (
    <div>
      {/* 标题行 */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 12,
      }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>
          商品列表 · 全球
        </h2>
        <div style={{ display: 'flex', gap: 6 }}>
          {regions.map((r) => (
            <button key={r.label} style={{
              padding: '4px 12px', borderRadius: 16, cursor: 'pointer',
              border: `1px solid ${r.active ? ORANGE : '#d9d9d9'}`,
              backgroundColor: r.active ? '#FFF3E8' : '#fff',
              color: r.active ? ORANGE : '#666',
              fontSize: 13, display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: r.color, display: 'inline-block' }} />
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <Banner />
      <NoticeBar />
      <TodoBar />
      <QuickFilter />
      <SearchForm />

      {/* 表格容器 */}
      <div style={{ backgroundColor: '#fff', borderRadius: 4, padding: '0 0 16px' }}>

        {/* 状态 Tab 行 */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #f0f0f0', padding: '0 16px',
        }}>
          <div style={{ display: 'flex' }}>
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                padding: '12px 16px', border: 'none', backgroundColor: 'transparent',
                cursor: 'pointer', fontSize: 14,
                borderBottom: activeTab === tab.key ? `2px solid ${ORANGE}` : '2px solid transparent',
                color: activeTab === tab.key ? ORANGE : '#666',
                fontWeight: activeTab === tab.key ? 600 : 400,
                marginBottom: -1,
              }}>
                {tab.label}&nbsp;
                <span style={{ color: activeTab === tab.key ? ORANGE : '#999', fontSize: 13 }}>
                  {tab.count.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, padding: '12px 0' }}>
            <a href="#" style={{ color: BLUE, fontSize: 13 }}>草稿箱(8)</a>
            <a href="#" style={{ color: BLUE, fontSize: 13 }}>商品发布/编辑指引</a>
            <a href="#" style={{ color: BLUE, fontSize: 13 }}>定制模版维护</a>
          </div>
        </div>

        {/* 操作按钮行 */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 16px',
        }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Button type="primary" icon={<PlusOutlined />} size="small"
              style={{ backgroundColor: ORANGE, borderColor: ORANGE }}>
              新建商品
            </Button>
            <Button size="small">批量新增欧盟站点 <DownOutlined /></Button>
            <Button size="small">挑选机会商品发布</Button>
            <Button size="small">批量导入商品</Button>
            <Button size="small">下载查询结果15054</Button>
            <Button size="small" disabled>批量处理流量下降商品</Button>
            <Button size="small">更多 <DownOutlined /></Button>
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#666', flexShrink: 0 }}>
            <span>单日发品额度 <span style={{ color: '#333' }}>0/1000</span></span>
            <span>搬运/新增进度 <span style={{ color: '#333' }}>0%</span></span>
            <span style={{ color: ORANGE }}>
              <ExclamationCircleFilled style={{ marginRight: 4 }} />待搬运0
            </span>
          </div>
        </div>

        {/* 表格 */}
        <div style={{ padding: '0 16px' }}>
          <Table<Product>
            columns={columns}
            dataSource={mockProducts}
            rowKey="id"
            size="small"
            scroll={{ x: 3100 }}
            rowSelection={{ type: 'checkbox' }}
            pagination={false}
          />
        </div>

        {/* 分页 */}
        <div style={{
          marginTop: 16, paddingRight: 16,
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
        }}>
          <span style={{ fontSize: 13, color: '#666', marginRight: 12 }}>共有 15054 条</span>
          <Pagination
            current={currentPage}
            total={15054}
            pageSize={20}
            showSizeChanger
            showQuickJumper
            onChange={setCurrentPage}
            size="small"
          />
        </div>
      </div>
    </div>
  )
}
