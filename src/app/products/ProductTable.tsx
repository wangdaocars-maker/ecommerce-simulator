'use client'

import { useState } from 'react'
import { Table, Checkbox, Button, Dropdown, Space, Popover } from 'antd'
import {
  EditOutlined,
  DownOutlined,
  QuestionCircleOutlined,
  MoreOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import Image from 'next/image'

// 商品数据类型
interface ProductData {
  key: string
  id: string
  title: string
  image: string
  hasSale: boolean
  skuCount: number
  groups: string[]
  price: {
    amount: string
    hasRange: boolean
    min?: string
    max?: string
  }
  stock: number
  optimization: {
    status: string
    tasks: number
    warnings?: string[]
  }
  sales30d: number | null
  views30d: number
  conversion30d: string
  chartData: number[]
  paymentAmount30d: number
  visitors30d: number
  visitorsChartData: number[]
  payingBuyers30d: number
  avgOrderValue30d: number
  shippingTemplate: {
    line1: string
    line2: string
  }
  editTime: {
    edited: string
    created: string
  }
}

// 模拟数据
const mockData: ProductData[] = [
  {
    key: '1',
    id: '1005009016721297',
    title: 'Bandai Original Genuine Fig...',
    image: '/uploads/products/sample1.jpg',
    hasSale: true,
    skuCount: 1,
    groups: ['GLOBAL / Bandai', 'Gundam / HG 1:144'],
    price: {
      amount: 'CNY 248.62',
      hasRange: false,
    },
    stock: 26,
    optimization: {
      status: '影响转化',
      tasks: 1,
    },
    sales30d: 6,
    views30d: 14118,
    conversion30d: '0.04%',
    chartData: [100, 120, 110, 130, 125, 135, 140],
    paymentAmount30d: 164.11,
    visitors30d: 14118,
    visitorsChartData: [140, 120, 110, 100, 105, 110, 115],
    payingBuyers30d: 6,
    avgOrderValue30d: 27.3517,
    shippingTemplate: {
      line1: '10usd 400g PuHuo',
      line2: 'QYDJ',
    },
    editTime: {
      edited: '2026/01/17 05:20:58 PST',
      created: '2025/05/12 03:41:55 PST',
    },
  },
  {
    key: '2',
    id: '1005010686112631',
    title: 'Bandai S.H.Figuarts One Pie...',
    image: '/uploads/products/sample2.jpg',
    hasSale: true,
    skuCount: 1,
    groups: ['GLOBAL / Bandai', 'One Piece / S.H.Figuarts'],
    price: {
      amount: 'CNY 1239.12',
      hasRange: false,
    },
    stock: 20,
    optimization: {
      status: '影响转化',
      tasks: 1,
      warnings: ['6个国家/地区已屏蔽'],
    },
    sales30d: null,
    views30d: 4191,
    conversion30d: '0.00%',
    chartData: [80, 90, 95, 100, 85, 75, 70],
    paymentAmount30d: 0,
    visitors30d: 4191,
    visitorsChartData: [100, 95, 90, 85, 80, 75, 70],
    payingBuyers30d: 0,
    avgOrderValue30d: 0,
    shippingTemplate: {
      line1: '10usd 400g PuHuo',
      line2: 'QYDJ',
    },
    editTime: {
      edited: '2026/01/17 05:20:58 PST',
      created: '2025/05/12 03:41:55 PST',
    },
  },
]

// 列配置类型
type ColumnConfig = {
  key: string
  label: string
  visible: boolean
  fixed?: boolean // 固定列不能取消选择
}

// 默认列配置
const defaultColumnConfig: ColumnConfig[] = [
  { key: 'product', label: '商品', visible: true, fixed: true },
  { key: 'groups', label: '商品分组', visible: true },
  { key: 'price', label: '价格', visible: true },
  { key: 'stock', label: '库存', visible: true },
  { key: 'optimization', label: '优化建议', visible: true },
  { key: 'sales30d', label: '近三十日销量', visible: true },
  { key: 'views30d', label: '近三十日曝光', visible: true },
  { key: 'conversion30d', label: '近三十日转化率', visible: true },
  { key: 'paymentAmount30d', label: '近30日支付金额', visible: true },
  { key: 'visitors30d', label: '近30日访客数', visible: true },
  { key: 'payingBuyers30d', label: '近30日支付买家数', visible: true },
  { key: 'avgOrderValue30d', label: '近30日客单价', visible: true },
  { key: 'shippingTemplate', label: '日销运费模板', visible: true },
  { key: 'editTime', label: '编辑时间', visible: true },
  { key: 'action', label: '操作', visible: true, fixed: true },
]

export default function ProductTable() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(defaultColumnConfig)
  const [columnSettingVisible, setColumnSettingVisible] = useState(false)

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId(null)
    }, 2000) // 2秒后恢复为复制图标
  }

  // 切换列显示状态
  const toggleColumn = (key: string) => {
    setColumnConfig(prev =>
      prev.map(col =>
        col.key === key && !col.fixed ? { ...col, visible: !col.visible } : col
      )
    )
  }

  // 重置列配置
  const resetColumns = () => {
    setColumnConfig(defaultColumnConfig)
  }

  // 列设置弹出层内容
  const columnSettingContent = (
    <div className="w-64">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Checkbox checked={true} />
          <span className="text-[14px] font-medium">列展示</span>
        </div>
        <Button type="link" size="small" onClick={resetColumns}>
          重置
        </Button>
      </div>

      <div className="mb-3">
        <div className="text-[12px] text-[#8c8c8c] mb-2">固定在左侧</div>
        <div className="flex items-center gap-2 py-2">
          <Checkbox checked={true} disabled />
          <span className="text-[14px]">商品</span>
        </div>
      </div>

      <div>
        <div className="text-[12px] text-[#8c8c8c] mb-2">不固定</div>
        {columnConfig
          .filter(col => !col.fixed)
          .map(col => (
            <div key={col.key} className="flex items-center gap-2 py-2">
              <span className="text-[#d9d9d9] cursor-move">⋮⋮</span>
              <Checkbox
                checked={col.visible}
                onChange={() => toggleColumn(col.key)}
              />
              <span className="text-[14px]">{col.label}</span>
            </div>
          ))}
      </div>
    </div>
  )

  const allColumns: ColumnsType<ProductData> = [
    // 1. 全选列
    {
      title: <Checkbox />,
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 40,
      fixed: 'left',
      render: () => <Checkbox />,
    },

    // 2. 商品列
    {
      title: '商品',
      dataIndex: 'product',
      key: 'product',
      width: 320,
      fixed: 'left',
      render: (_, record) => (
        <div className="flex gap-3">
          {/* 商品图片 */}
          <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
            <img
              src={record.image}
              alt={record.title}
              className="w-full h-full object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+'
              }}
            />
          </div>

          {/* 商品信息 */}
          <div className="flex-1 min-w-0">
            {/* 商品标题 */}
            <div className="text-[14px] text-[#262626] font-medium hover:underline cursor-pointer mb-1.5 truncate">
              {record.title}
            </div>

            {/* 商品ID */}
            <div className="text-[12px] text-[#8c8c8c] flex items-center gap-1.5 mb-1.5">
              <span>ID: {record.id}</span>
              <button
                className="cursor-pointer hover:opacity-60 transition-opacity bg-transparent border-none p-0"
                onClick={() => handleCopy(record.id)}
              >
                {copiedId === record.id ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#52c41a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8c8c8c" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>

            {/* SALE 标签和 SKU 信息 */}
            <div className="flex items-center gap-2">
              {/* SALE 标签 */}
              {record.hasSale && (
                <div className="bg-[#ff4d4f] text-white text-[12px] font-medium px-3 py-0.5 rounded">
                  SALE
                </div>
              )}

              {/* SKU 信息 */}
              <div className="text-[12px] text-[#1677ff] cursor-pointer flex items-center gap-1">
                <span>共{record.skuCount}个SKU</span>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="#1677ff">
                  <path d="M5 2L8 6H2L5 2Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // 3. 商品分组列
    {
      title: '商品分组',
      dataIndex: 'groups',
      key: 'groups',
      width: 150,
      render: (groups: string[]) => (
        <div className="text-[12px]">
          {groups.map((group, index) => (
            <div key={index} className="text-[#262626]">
              {group}
            </div>
          ))}
          <div className="text-[#1677ff] text-[11px] cursor-pointer mt-1">
            更多分组 <DownOutlined className="text-[9px]" />
          </div>
        </div>
      ),
    },

    // 4. 价格列
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 160,
      render: (price: ProductData['price']) => (
        <div className="text-[12px]">
          <div className="flex items-center gap-1 mb-1">
            <span>{price.amount}</span>
            <EditOutlined className="text-[#8c8c8c] cursor-pointer hover:text-[#1677ff] text-[11px]" />
          </div>
          <div className="text-[11px] text-[#1677ff] cursor-pointer">
            区域零售价 <DownOutlined className="text-[9px]" />
          </div>
        </div>
      ),
    },

    // 5. 库存列
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      width: 80,
      render: (stock: number) => (
        <div className="flex items-center gap-1">
          <span className="text-[12px]">{stock}</span>
          <EditOutlined className="text-[#8c8c8c] cursor-pointer hover:text-[#1677ff] text-[11px]" />
        </div>
      ),
    },

    // 6. 优化建议列
    {
      title: '优化建议',
      dataIndex: 'optimization',
      key: 'optimization',
      width: 180,
      render: (opt: ProductData['optimization']) => (
        <div className="text-[11px]">
          <div className="text-[#ff4d4f] mb-1">{opt.status}</div>
          <div className="flex items-center gap-1 text-[#ff4d4f] cursor-pointer mb-1">
            <span className="w-1 h-1 bg-[#ff4d4f] rounded-full" />
            <span>{opt.tasks}项优化任务</span>
            <span>›</span>
          </div>
          {opt.warnings?.map((warning, index) => (
            <div key={index} className="text-[#fa8c16]">
              {warning}
            </div>
          ))}
        </div>
      ),
    },

    // 7. 近三十日销量列
    {
      title: (
        <span className="flex items-center gap-1">
          近三十日销量 <QuestionCircleOutlined className="text-[#8c8c8c] text-xs" />
        </span>
      ),
      dataIndex: 'sales30d',
      key: 'sales30d',
      width: 100,
      render: (sales: number | null) => (
        <span className="text-[12px]">{sales !== null ? sales : '--'}</span>
      ),
    },

    // 8. 近三十日曝光列
    {
      title: '近三十日曝光',
      dataIndex: 'views30d',
      key: 'views30d',
      width: 140,
      render: (views: number, record) => {
        const chartData = record.chartData
        const maxValue = Math.max(...chartData)
        const width = 120
        const height = 40
        const padding = 4

        // 计算折线的点
        const points = chartData.map((value, index) => {
          const x = (index / (chartData.length - 1)) * (width - padding * 2) + padding
          const y = height - padding - ((value / maxValue) * (height - padding * 2))
          return `${x},${y}`
        }).join(' ')

        return (
          <div>
            <div className="text-[12px] mb-1">{views}</div>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
              <polyline
                points={points}
                fill="none"
                stroke="#1677ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )
      },
    },

    // 9. 近三十日转化率列
    {
      title: '近三十日转化率',
      dataIndex: 'conversion30d',
      key: 'conversion30d',
      width: 100,
      render: (conversion: string) => <span className="text-[12px]">{conversion}</span>,
    },

    // 10. 近30日支付金额列
    {
      title: '近30日支付金额',
      dataIndex: 'paymentAmount30d',
      key: 'paymentAmount30d',
      width: 120,
      render: (amount: number) => <span className="text-[12px]">{amount}</span>,
    },

    // 11. 近30日访客数列
    {
      title: '近30日访客数',
      dataIndex: 'visitors30d',
      key: 'visitors30d',
      width: 140,
      render: (visitors: number, record) => {
        const chartData = record.visitorsChartData
        const maxValue = Math.max(...chartData)
        const width = 120
        const height = 40
        const padding = 4

        const points = chartData.map((value, index) => {
          const x = (index / (chartData.length - 1)) * (width - padding * 2) + padding
          const y = height - padding - ((value / maxValue) * (height - padding * 2))
          return `${x},${y}`
        }).join(' ')

        return (
          <div>
            <div className="text-[12px] mb-1">{visitors}</div>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
              <polyline
                points={points}
                fill="none"
                stroke="#1677ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )
      },
    },

    // 12. 近30日支付买家数列
    {
      title: '近30日支付买家数',
      dataIndex: 'payingBuyers30d',
      key: 'payingBuyers30d',
      width: 130,
      render: (buyers: number) => <span className="text-[12px]">{buyers}</span>,
    },

    // 13. 近30日客单价列
    {
      title: '近30日客单价',
      dataIndex: 'avgOrderValue30d',
      key: 'avgOrderValue30d',
      width: 110,
      render: (value: number) => <span className="text-[12px]">{value}</span>,
    },

    // 14. 日销运费模板列
    {
      title: '日销运费模板',
      dataIndex: 'shippingTemplate',
      key: 'shippingTemplate',
      width: 150,
      render: (template: ProductData['shippingTemplate']) => (
        <div className="text-[12px]">
          <div className="text-[#262626]">{template.line1}</div>
          <div className="text-[#262626]">{template.line2}</div>
        </div>
      ),
    },

    // 11. 编辑时间列
    {
      title: '编辑时间',
      dataIndex: 'editTime',
      key: 'editTime',
      width: 180,
      render: (time: ProductData['editTime']) => (
        <div className="text-[11px]">
          <div className="text-[#262626] mb-1">编辑：{time.edited}</div>
          <div className="text-[#262626]">创建：{time.created}</div>
        </div>
      ),
    },

    // 12. 操作列
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: () => (
        <Space size={8}>
          <a className="text-[#1677ff] text-[12px]">编辑</a>
          <Dropdown
            menu={{
              items: [
                { key: 'view', label: '查看' },
                { key: 'delete', label: '删除' },
              ],
            }}
          >
            <a className="text-[#1677ff] text-[12px]">
              更多 <DownOutlined className="text-[10px]" />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ]

  // 根据配置过滤可见的列
  const visibleColumnKeys = new Set(
    columnConfig.filter(col => col.visible).map(col => col.key)
  )
  const columns = allColumns.filter(col => {
    if (col.key === 'checkbox') return true // 复选框列始终显示
    return visibleColumnKeys.has(col.key as string)
  })

  return (
    <>
      {/* 表格顶部操作栏 */}
      <div className="bg-white mb-4 px-4 py-3 flex items-center justify-between border border-gray-200 rounded-lg shadow-md">
        {/* 左侧操作 */}
        <Space size={12}>
          <span className="text-sm text-[#8c8c8c]">已选 0</span>
          <Button>下架</Button>
          <Dropdown menu={{ items: [{ key: 'excel', label: '导出为 Excel' }] }}>
            <Button>
              导出 <DownOutlined />
            </Button>
          </Dropdown>
          <Dropdown menu={{ items: [{ key: 'batch', label: '批量编辑' }] }}>
            <Button>
              更多 <DownOutlined />
            </Button>
          </Dropdown>
        </Space>

        {/* 右侧操作 */}
        <Space size={12}>
          <Button style={{ width: 200 }}>
            排序方式 <DownOutlined />
          </Button>
          <Popover
            content={columnSettingContent}
            trigger="click"
            open={columnSettingVisible}
            onOpenChange={setColumnSettingVisible}
            placement="bottomRight"
          >
            <Button icon={<SettingOutlined />} />
          </Popover>
        </Space>
      </div>

      {/* 表格主体 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
        <Table
          columns={columns}
          dataSource={mockData}
          pagination={false}
          size="middle"
          className="product-table"
          scroll={{ x: 1800 }}
          style={{
            '--table-header-bg': '#FAFAFA',
            '--table-border-color': '#E5E7EB',
          } as React.CSSProperties}
        />

        <style jsx global>{`
          .product-table .ant-table-thead > tr > th {
            background-color: #F0F0F0 !important;
            color: #262626;
            font-weight: 500;
            font-size: 13px;
            padding: 10px 12px;
            border-bottom: 1px solid #E5E7EB;
            white-space: nowrap;
          }

          .product-table .ant-table-tbody > tr > td {
            padding: 8px 12px;
            border-bottom: 1px solid #F0F0F0;
            font-size: 13px;
          }

          .product-table .ant-table-tbody > tr:hover > td {
            background-color: #FAFAFA;
          }

          .product-table .ant-table {
            border: none;
          }

          .product-table .ant-table-container {
            border: none;
          }
        `}</style>
      </div>
    </>
  )
}
