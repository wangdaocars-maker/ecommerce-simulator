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
  highlight?: boolean
}

type MenuItem = {
  key: string
  icon: React.ReactNode
  label: string
  path?: string
  dot?: boolean
  badge?: 'NEW'
  noArrow?: boolean
  defaultOpen?: boolean
  children?: SubItem[]
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
    defaultOpen: true,
    children: [
      { label: '我的备货单', path: '#' },
      { label: '商品条码管理', path: '#' },
      { label: '司机/地址管理', path: '#' },
      { label: '头程钜惠', path: '#', highlight: true },
      { label: '头程物流', path: '#' },
      { label: '备货计划', path: '#' },
      { label: '立即查价', path: '#' },
      { label: '头程服务商列表', path: '#' },
    ],
  },
  {
    key: 'inventory',
    icon: <DatabaseOutlined />,
    label: '库存管理',
    defaultOpen: true,
    children: [
      { label: '库存回退设置', path: '#' },
      { label: '保税仓退货管理', path: '#' },
    ],
  },
  {
    key: 'products',
    icon: <AppstoreOutlined />,
    label: '商品管理',
    defaultOpen: true,
    children: [
      { label: '商品列表', path: '/temu/products' },
      { label: '新建商品', path: '#' },
      { label: '上新生命周期管理', path: '#' },
      { label: '机会商品', path: '#' },
      { label: '保税商品管理', path: '#' },
      { label: '商品价格申报', path: '#' },
      { label: '图片/视频更新任务', path: '#' },
      { label: '商品说明书制作...', path: '#' },
      { label: '样品管理', path: '#' },
      { label: '尺码表模板', path: '#' },
      { label: '模特信息模版', path: '#' },
      { label: '拍摄退样管理', path: '#' },
      { label: '建议零售价合规...', path: '#' },
      { label: '高潜爆款计划', path: '#' },
      { label: '全球Best Seller款', path: '#' },
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
const NEW_BADGE_STYLE: React.CSSProperties = {
  backgroundColor: '#FFD700',
  color: '#000',
  fontSize: 10,
  fontWeight: 700,
  padding: '1px 4px',
  borderRadius: 3,
  lineHeight: '14px',
  flexShrink: 0,
}
const DOT_STYLE: React.CSSProperties = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: '#ff4d4f',
  flexShrink: 0,
}

export default function TemuSidebar() {
  const pathname = usePathname()

  const initOpen = menuData.reduce<Record<string, boolean>>((acc, item) => {
    if (item.children) acc[item.key] = item.defaultOpen ?? false
    return acc
  }, {})

  const [openKeys, setOpenKeys] = useState<Record<string, boolean>>(initOpen)
  const [collapsed, setCollapsed] = useState(false)

  const toggleKey = (key: string) => {
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

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
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#666',
            fontSize: 16,
            padding: 8,
          }}
        >
          <MenuFoldOutlined style={{ transform: 'rotate(180deg)' }} />
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
      {/* 可滚动菜单区域 */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
        {menuData.map((item) => {
          const isOpen = openKeys[item.key]
          const hasChildren = !!item.children?.length

          return (
            <div key={item.key}>
              {/* 主菜单项 */}
              {item.path && !hasChildren ? (
                <Link href={item.path} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '10px 16px',
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
                    padding: '10px 16px',
                    cursor: hasChildren ? 'pointer' : 'default',
                    color: '#1a1a1a',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                  onClick={() => hasChildren && toggleKey(item.key)}
                  onMouseEnter={(e) => {
                    if (hasChildren) (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5'
                  }}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontSize: 16, color: '#555' }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.dot && <span style={DOT_STYLE} />}
                  {item.badge === 'NEW' && <span style={NEW_BADGE_STYLE}>NEW</span>}
                  {hasChildren && !item.noArrow && (
                    <span style={{ color: '#999', fontSize: 11 }}>
                      {isOpen ? <UpOutlined /> : <DownOutlined />}
                    </span>
                  )}
                </div>
              )}

              {/* 子菜单（两列布局） */}
              {hasChildren && isOpen && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    padding: '4px 16px 12px 40px',
                    gap: '2px 0',
                  }}
                >
                  {item.children!.map((sub) => {
                    const isActive = pathname === sub.path && sub.path !== '#'
                    return (
                      <div key={sub.label} style={{ width: '50%', padding: '4px 4px 4px 0' }}>
                        {sub.path && sub.path !== '#' ? (
                          <Link href={sub.path} style={{ textDecoration: 'none' }}>
                            <span
                              style={{
                                fontSize: 13,
                                color: isActive ? TEMU_ORANGE : '#555',
                                fontWeight: isActive ? 500 : 400,
                                display: 'block',
                                lineHeight: '18px',
                              }}
                              onMouseEnter={(e) => {
                                if (!isActive) (e.currentTarget as HTMLElement).style.color = '#333'
                              }}
                              onMouseLeave={(e) => {
                                if (!isActive) (e.currentTarget as HTMLElement).style.color = '#555'
                              }}
                            >
                              {sub.label}
                            </span>
                          </Link>
                        ) : (
                          <span
                            style={{
                              fontSize: 13,
                              cursor: 'pointer',
                              display: 'block',
                              lineHeight: '18px',
                              color: sub.highlight ? '#000' : '#555',
                              backgroundColor: sub.highlight ? '#FFD700' : 'transparent',
                              padding: sub.highlight ? '1px 4px' : 0,
                              borderRadius: sub.highlight ? 3 : 0,
                              width: 'fit-content',
                            }}
                            onMouseEnter={(e) => {
                              if (!sub.highlight) (e.currentTarget as HTMLElement).style.color = '#333'
                            }}
                            onMouseLeave={(e) => {
                              if (!sub.highlight) (e.currentTarget as HTMLElement).style.color = '#555'
                            }}
                          >
                            {sub.label}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 底部折叠按钮 */}
      <div
        style={{
          borderTop: '1px solid #f0f0f0',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'flex-end',
          cursor: 'pointer',
          color: '#666',
          fontSize: 14,
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
