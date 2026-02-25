'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  HomeOutlined,
  ContainerOutlined,
  DatabaseOutlined,
  AppstoreOutlined,
  PictureOutlined,
  SafetyCertificateOutlined,
  BarChartOutlined,
  TagOutlined,
  ThunderboltOutlined,
  WalletOutlined,
  ShopOutlined,
  StarOutlined,
  CustomerServiceOutlined,
  ShoppingOutlined,
  AuditOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  ApartmentOutlined,
  CarOutlined,
  ToolOutlined,
  GlobalOutlined,
  UpOutlined,
  DownOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'

type SubItem = {
  label: string
  path?: string
  highlight?: boolean  // 黄色标签样式
}

// 每行 [左列, 右列]，右列可以是单项或多项（垂直堆叠）
type SubRow = [SubItem | null, SubItem | SubItem[] | null]

type MenuItem = {
  key: string
  icon: React.ReactNode
  label: string
  path?: string
  dot?: boolean
  badge?: 'NEW'
  noArrow?: boolean
  defaultOpen?: boolean
  children?: SubRow[]
}

const menuData: MenuItem[] = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: '首页',
    path: '/temu',
    noArrow: true,
  },
  {
    key: 'stock',
    icon: <ContainerOutlined />,
    label: '备货管理',
    dot: true,
  },
  {
    key: 'inventory',
    icon: <DatabaseOutlined />,
    label: '库存管理',
  },
  {
    key: 'products',
    icon: <AppstoreOutlined />,
    label: '商品管理',
    defaultOpen: true,
    children: [
      [{ label: '商品列表', path: '/temu/products' }, { label: '新建商品' }],
      [{ label: '上新生命周期管理' }, { label: '机会商品' }],
      [{ label: '保税商品管理' }, { label: '商品价格申报' }],
      [{ label: '图片/视频更新任务' }, { label: '商品说明书制作...' }],
      [{ label: '样品管理' }, { label: '尺码表模板' }],
      [{ label: '模特信息模版' }, { label: '拍摄退样管理' }],
      [{ label: '建议零售价合规...' }, { label: '高潜爆款计划' }],
      [{ label: '全球Best Seller款' }, null],
    ],
  },
  {
    key: 'materials',
    icon: <PictureOutlined />,
    label: '素材管理',
  },
  {
    key: 'quality',
    icon: <SafetyCertificateOutlined />,
    label: '质量管理',
  },
  {
    key: 'data',
    icon: <BarChartOutlined />,
    label: '数据中心',
  },
  {
    key: 'marketing',
    icon: <TagOutlined />,
    label: '店铺营销',
    dot: true,
  },
  {
    key: 'trending',
    icon: <ThunderboltOutlined />,
    label: '爆款跟卖',
    dot: true,
  },
  {
    key: 'finance',
    icon: <WalletOutlined />,
    label: '账户资金',
  },
  {
    key: 'shop',
    icon: <ShopOutlined />,
    label: '店铺管理',
    badge: 'NEW',
  },
  {
    key: 'reviews',
    icon: <StarOutlined />,
    label: '评价管理',
  },
  {
    key: 'customer-service',
    icon: <CustomerServiceOutlined />,
    label: '客服中心',
    badge: 'NEW',
  },
  {
    key: 'service-market',
    icon: <ShoppingOutlined />,
    label: '服务市场',
  },
  {
    key: 'compliance',
    icon: <AuditOutlined />,
    label: '合规服务',
  },
  {
    key: 'promotion',
    icon: <RocketOutlined />,
    label: '商品推广',
    badge: 'NEW',
    noArrow: true,
  },
  {
    key: 'orders',
    icon: <ShoppingCartOutlined />,
    label: '订单管理',
  },
  {
    key: 'warehouse',
    icon: <ApartmentOutlined />,
    label: '合作对接仓',
  },
  {
    key: 'delivery',
    icon: <CarOutlined />,
    label: '配送管理',
  },
  {
    key: 'aftersale',
    icon: <ToolOutlined />,
    label: '售后规则设置',
    noArrow: true,
  },
  {
    key: 'expansion',
    icon: <GlobalOutlined />,
    label: '市场拓展模式',
  },
]

const TEMU_ORANGE = '#FF6A00'

const NEW_BADGE: React.CSSProperties = {
  backgroundColor: '#FFD700',
  color: '#000',
  fontSize: 10,
  fontWeight: 700,
  padding: '1px 4px',
  borderRadius: 3,
  lineHeight: '14px',
  flexShrink: 0,
}

const DOT: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: '#ff4d4f',
  flexShrink: 0,
}

function SubLink({ item, pathname }: { item: SubItem; pathname: string }) {
  const isActive = !!item.path && item.path !== '#' && pathname === item.path

  if (item.highlight) {
    return (
      <span
        style={{
          display: 'inline-block',
          fontSize: 11,
          color: '#000',
          backgroundColor: '#FFD700',
          padding: '1px 4px',
          borderRadius: 3,
          fontWeight: 500,
          cursor: 'pointer',
          lineHeight: '17px',
          whiteSpace: 'nowrap',
        }}
      >
        {item.label}
      </span>
    )
  }

  const textStyle: React.CSSProperties = {
    fontSize: 12,
    color: isActive ? TEMU_ORANGE : '#555',
    fontWeight: isActive ? 500 : 400,
    display: 'block',
    lineHeight: '18px',
    cursor: 'pointer',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }

  if (item.path && item.path !== '#') {
    return (
      <Link href={item.path} style={textStyle}>
        {item.label}
      </Link>
    )
  }

  return <span style={textStyle}>{item.label}</span>
}

export default function TemuSidebar() {
  const pathname = usePathname()

  const initOpen = menuData.reduce<Record<string, boolean>>((acc, item) => {
    if (item.children) acc[item.key] = item.defaultOpen ?? false
    return acc
  }, {})

  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>(initOpen)
  const [collapsed, setCollapsed] = useState(false)

  const toggle = (key: string) => setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }))

  if (collapsed) {
    return (
      <div
        style={{
          width: 48,
          backgroundColor: '#fff',
          borderRight: '1px solid #f0f0f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 16,
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setCollapsed(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 16, padding: 8 }}
        >
          <MenuFoldOutlined style={{ transform: 'scaleX(-1)' }} />
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        width: 220,
        backgroundColor: '#fff',
        borderRight: '1px solid #f0f0f0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100%',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
        {menuData.map((item) => {
          const isOpen = openKeys[item.key]
          const hasChildren = !!item.children?.length

          return (
            <div key={item.key}>
              {/* 主菜单行 */}
              {item.path && !hasChildren ? (
                <Link href={item.path} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 16px',
                      cursor: 'pointer',
                      color: pathname === item.path ? TEMU_ORANGE : '#1a1a1a',
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                  >
                    <span style={{ fontSize: 16 }}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                  </div>
                </Link>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '9px 16px',
                    cursor: hasChildren ? 'pointer' : 'default',
                    color: '#1a1a1a',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                  onClick={() => hasChildren && toggle(item.key)}
                  onMouseEnter={(e) => { if (hasChildren) (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5' }}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontSize: 16, color: '#555' }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.dot && <span style={DOT} />}
                  {item.badge === 'NEW' && <span style={NEW_BADGE}>NEW</span>}
                  {hasChildren && !item.noArrow && (
                    <span style={{ color: '#bbb', fontSize: 10 }}>
                      {isOpen ? <UpOutlined /> : <DownOutlined />}
                    </span>
                  )}
                </div>
              )}

              {/* 子菜单：严格两列 Grid */}
              {hasChildren && isOpen && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    padding: '4px 12px 12px 40px',
                    rowGap: 2,
                  }}
                >
                  {item.children!.map((row, rowIdx) => {
                    const [left, right] = row
                    return (
                      <>
                        {/* 左列 */}
                        <div key={`l-${rowIdx}`} style={{ padding: '3px 4px 3px 0' }}>
                          {left && <SubLink item={left} pathname={pathname} />}
                        </div>
                        {/* 右列（支持多项垂直堆叠） */}
                        <div key={`r-${rowIdx}`} style={{ padding: '3px 0' }}>
                          {Array.isArray(right)
                            ? right.map((r) => <SubLink key={r.label} item={r} pathname={pathname} />)
                            : right && <SubLink item={right} pathname={pathname} />}
                        </div>
                      </>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 折叠按钮 */}
      <div
        style={{
          borderTop: '1px solid #f0f0f0',
          padding: '10px 16px',
          display: 'flex',
          justifyContent: 'flex-end',
          cursor: 'pointer',
          color: '#999',
        }}
        onClick={() => setCollapsed(true)}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
      >
        <MenuFoldOutlined />
      </div>
    </div>
  )
}
