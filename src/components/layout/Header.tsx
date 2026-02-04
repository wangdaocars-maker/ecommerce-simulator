'use client'

import { Avatar, Dropdown, Space } from 'antd'
import {
  ShoppingOutlined,
  BellOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { MenuProps } from 'antd'

export default function Header() {
  const { data: session } = useSession()
  const router = useRouter()

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      onClick: () => {
        // TODO: 跳转到个人信息页
      },
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '账号设置',
      onClick: () => {
        // TODO: 跳转到设置页
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: async () => {
        await signOut({ redirect: false })
        router.push('/login')
      },
    },
  ]

  // 店铺下拉菜单（模拟器中只显示当前用户信息）
  const shopMenuItems: MenuProps['items'] = [
    {
      key: 'current',
      label: (
        <div>
          <div style={{ fontWeight: 600 }}>{session?.user?.name || '未命名店铺'}</div>
          <div style={{ fontSize: 12, color: '#8c8c8c' }}>
            角色: {session?.user?.role === 'admin' ? '管理员' : session?.user?.role === 'teacher' ? '教师' : '学员'}
          </div>
        </div>
      ),
      disabled: true,
    },
  ]

  // 获取用户头像字母（取名字首字母）
  const getAvatarLetter = () => {
    const name = session?.user?.name
    if (!name) return 'U'
    return name.charAt(0).toUpperCase()
  }

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* 左侧：Logo + 店铺信息 */}
        <div className="flex items-center gap-4">
          {/* 跨境卖家中心 Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/')}
          >
            <div className="w-8 h-8 bg-[#1677ff] rounded flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                <path d="M2 17L12 22L22 17" opacity="0.6" />
                <path d="M2 12L12 17L22 12" opacity="0.8" />
              </svg>
            </div>
            <span className="text-base font-semibold text-[#262626]">
              跨境卖家中心
            </span>
          </div>

          {/* 分隔符 */}
          <div className="h-6 w-px bg-[#d9d9d9]" />

          {/* 店铺信息下拉 */}
          <Dropdown menu={{ items: shopMenuItems }} trigger={['click']}>
            <div className="flex items-center gap-2 cursor-pointer hover:text-[#1677ff] transition-colors">
              <div className="flex items-center gap-1">
                {/* AliExpress Logo 模拟 */}
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2L15 9L22 10L17 15L18 22L12 18L6 22L7 15L2 10L9 9L12 2Z" />
                  </svg>
                </div>
                <span className="text-sm font-medium">AliExpress</span>
              </div>
              <span className="text-sm text-[#262626] max-w-[200px] truncate">
                {session?.user?.name || '未命名店铺'} 的店铺
              </span>
              <DownOutlined className="text-xs text-[#8c8c8c]" />
            </div>
          </Dropdown>
        </div>

        {/* 右侧：工具栏 */}
        <Space size={24}>
          {/* 购物车图标 */}
          <ShoppingOutlined
            className="text-xl text-[#1677ff] cursor-pointer hover:text-[#0958d9] transition-colors"
            onClick={() => {
              // TODO: 跳转到购物车页面（模拟器可能不需要）
            }}
          />

          {/* 通知铃铛 */}
          <BellOutlined
            className="text-xl text-[#1677ff] cursor-pointer hover:text-[#0958d9] transition-colors"
            onClick={() => {
              // TODO: 打开通知抽屉
            }}
          />

          {/* 用户头像下拉菜单 */}
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
            <div className="cursor-pointer">
              <Avatar
                style={{ backgroundColor: '#ff4d4f', verticalAlign: 'middle' }}
                size={32}
              >
                {getAvatarLetter()}
              </Avatar>
            </div>
          </Dropdown>
        </Space>
      </div>
    </header>
  )
}
