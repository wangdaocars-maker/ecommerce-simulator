'use client'

import {
  BookOutlined,
  MessageOutlined,
  FileTextOutlined,
  BellOutlined,
  CustomerServiceOutlined,
  FormOutlined,
  DownOutlined,
  GlobalOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { Badge } from 'antd'

const navItems = [
  { icon: BookOutlined, label: '学习', badge: 0 },
  { icon: MessageOutlined, label: '运营对接', badge: 1 },
  { icon: FileTextOutlined, label: '规则中心', badge: 6 },
  { icon: BellOutlined, label: '消息', badge: 99 },
  { icon: CustomerServiceOutlined, label: '客服', badge: 0 },
  { icon: FormOutlined, label: '反馈', badge: 37 },
]

export default function TemuHeader() {
  return (
    <header
      style={{
        height: 52,
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        gap: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#000', letterSpacing: -0.3 }}>
          Seller Central
        </span>
        <span
          style={{
            fontSize: 10,
            padding: '1px 5px',
            backgroundColor: '#f0f0f0',
            borderRadius: 3,
            color: '#888',
            lineHeight: '16px',
            fontWeight: 400,
          }}
        >
          Beta
        </span>
      </div>

      {/* 分割线 */}
      <div style={{ width: 1, height: 16, backgroundColor: '#e0e0e0', margin: '0 12px', flexShrink: 0 }} />

      {/* 地区选择 */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', flexShrink: 0 }}
      >
        <span style={{ fontSize: 13, color: '#333' }}>全球（除美国,欧区）</span>
        <DownOutlined style={{ fontSize: 10, color: '#666' }} />
      </div>

      {/* 中间图标区 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 14 }}>
        <RightOutlined style={{ color: '#bbb', fontSize: 13 }} />
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <GlobalOutlined style={{ color: '#888', fontSize: 14 }} />
        </div>
      </div>

      {/* 弹性空间 */}
      <div style={{ flex: 1 }} />

      {/* 右侧文字链接 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginRight: 8 }}>
        <a
          href="#"
          style={{ fontSize: 13, color: '#555', textDecoration: 'none' }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#000')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#555')}
        >
          服务市场
        </a>
        <a
          href="#"
          style={{ fontSize: 13, color: '#555', textDecoration: 'none' }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#000')}
          onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#555')}
        >
          履约中心
        </a>
      </div>

      {/* 图标导航 */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px 8px',
                cursor: 'pointer',
                borderRadius: 4,
                minWidth: 46,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
            >
              <Badge count={item.badge} size="small" overflowCount={99}>
                <Icon style={{ fontSize: 18, color: '#555' }} />
              </Badge>
              <span style={{ fontSize: 11, color: '#555', marginTop: 2, whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* 分割线 */}
      <div style={{ width: 1, height: 16, backgroundColor: '#e0e0e0', margin: '0 8px', flexShrink: 0 }} />

      {/* 用户头像 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: 4,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: '#FF6A00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          W
        </div>
        <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>WAYDO</span>
        <DownOutlined style={{ fontSize: 10, color: '#888' }} />
      </div>
    </header>
  )
}
