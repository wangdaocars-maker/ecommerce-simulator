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
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Badge, Dropdown, message } from 'antd'
import type { MenuProps } from 'antd'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const navItems = [
  { icon: BookOutlined, label: '学习', badge: 0 },
  { icon: MessageOutlined, label: '运营对接', badge: 1 },
  { icon: FileTextOutlined, label: '规则中心', badge: 6 },
  { icon: BellOutlined, label: '消息', badge: 99 },
  { icon: CustomerServiceOutlined, label: '客服', badge: 0 },
  { icon: FormOutlined, label: '反馈', badge: 37 },
]

export default function TemuHeader() {
  const { data: session } = useSession()
  const router = useRouter()

  const userName = session?.user?.name || 'WAYDO'
  const avatarLetter = userName.charAt(0).toUpperCase()
  const roleLabel =
    session?.user?.role === 'admin' ? '管理员' :
    session?.user?.role === 'teacher' ? '教师' : '学员'

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'info',
      disabled: true,
      label: (
        <div>
          <div style={{ fontWeight: 600 }}>{userName}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>角色：{roleLabel}</div>
        </div>
      ),
    },
    { type: 'divider' },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账号设置',
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: async () => {
        const hide = message.loading('正在退出...', 0)
        try {
          await signOut({ redirect: false })
          hide()
          message.success('已退出登录')
          router.push('/login')
          router.refresh()
        } catch {
          hide()
          message.error('退出失败，请重试')
        }
      },
    },
  ]

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
      {/* Logo — 点击跳转商品列表 */}
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, cursor: 'pointer' }}
        onClick={() => router.push('/temu/products')}
      >
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', flexShrink: 0 }}>
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
        {['服务市场', '履约中心'].map(text => (
          <a
            key={text}
            href="#"
            style={{ fontSize: 13, color: '#555', textDecoration: 'none' }}
            onMouseEnter={e => ((e.target as HTMLElement).style.color = '#000')}
            onMouseLeave={e => ((e.target as HTMLElement).style.color = '#555')}
          >
            {text}
          </a>
        ))}
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
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
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

      {/* 用户下拉菜单 */}
      <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
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
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5')}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.backgroundColor = 'transparent')}
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
            {avatarLetter}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>{userName}</span>
          <DownOutlined style={{ fontSize: 10, color: '#888' }} />
        </div>
      </Dropdown>
    </header>
  )
}
