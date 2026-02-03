'use client'

import { useState } from 'react'
import {
  HomeOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  CarOutlined,
  ShopOutlined,
  TagOutlined,
  GlobalOutlined,
  InboxOutlined,
  DollarOutlined,
  UserOutlined,
  BarChartOutlined,
  SafetyOutlined,
  DownOutlined,
  UpOutlined,
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const [productMenuOpen, setProductMenuOpen] = useState(true)

  // 获取当前选中的菜单项
  const getSelectedKey = () => {
    if (pathname === '/') return 'home'
    if (pathname === '/products') return 'product-list'
    if (pathname === '/products/create') return 'product-create'
    return 'product-list'
  }

  // 商品子菜单项
  const productSubMenus = [
    { key: 'product-create', label: '商品发布', path: '/products/create' },
    { key: 'product-list', label: '商品管理', path: '/products' },
    { key: 'product-flash', label: '新品闪电推' },
    { key: 'product-bid', label: '商品招标' },
    { key: 'product-cargo', label: '货盘运营' },
    { key: 'product-ai', label: 'AI素材工具', badge: true },
    { key: 'product-quality', label: '商品质量分' },
  ]

  // 处理子菜单点击
  const handleSubMenuClick = (item: typeof productSubMenus[0]) => {
    if (item.path) {
      router.push(item.path)
    }
  }

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto border-r border-gray-200">
      {/* 首页 */}
      <div
        className="h-12 flex items-center px-6 cursor-pointer hover:bg-[#f0f0f0] transition-colors"
        onClick={() => router.push('/')}
      >
        <HomeOutlined className="text-xl text-[#262626]" />
        <span className="ml-3 text-[15px] text-[#262626]">首页</span>
      </div>

      {/* 商品（可展开） */}
      <div className="relative">
        <div
          className={`h-12 flex items-center px-6 cursor-pointer transition-colors ${
            productMenuOpen ? 'bg-[#e6f4ff]' : 'hover:bg-[#f0f0f0]'
          }`}
          onClick={() => setProductMenuOpen(!productMenuOpen)}
        >
          <div className="relative">
            <ShoppingOutlined
              className={`text-xl ${productMenuOpen ? 'text-[#1677ff]' : 'text-[#262626]'}`}
            />
            {/* 红点徽章 */}
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#ff4d4f] rounded-full" />
          </div>
          <span
            className={`ml-3 text-[15px] flex-1 ${
              productMenuOpen ? 'text-[#1677ff]' : 'text-[#262626]'
            }`}
          >
            商品
          </span>
          {productMenuOpen ? (
            <UpOutlined className="text-xs text-[#8c8c8c]" />
          ) : (
            <DownOutlined className="text-xs text-[#8c8c8c]" />
          )}
        </div>

        {/* 商品子菜单 */}
        {productMenuOpen && (
          <div className="bg-white">
            {productSubMenus.map((item) => (
              <div
                key={item.key}
                className={`h-10 flex items-center pl-14 pr-6 cursor-pointer transition-colors ${
                  getSelectedKey() === item.key
                    ? 'bg-[#e6f4ff] text-[#1677ff]'
                    : 'text-[#595959] hover:bg-[#f5f5f5]'
                }`}
                onClick={() => handleSubMenuClick(item)}
              >
                <span className="text-[14px] flex-1">{item.label}</span>
                {item.badge && (
                  <span className="w-1.5 h-1.5 bg-[#ff4d4f] rounded-full" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 交易（不可展开，仅展示） */}
      <div className="h-12 flex items-center px-6 cursor-not-allowed opacity-60 hover:bg-[#f0f0f0] transition-colors">
        <FileTextOutlined className="text-xl text-[#262626]" />
        <span className="ml-3 text-[15px] text-[#262626] flex-1">交易</span>
        <DownOutlined className="text-xs text-[#8c8c8c]" />
      </div>

      {/* 物流（不可展开，仅展示） */}
      <div className="h-12 flex items-center px-6 cursor-not-allowed opacity-60 hover:bg-[#f0f0f0] transition-colors">
        <CarOutlined className="text-xl text-[#262626]" />
        <span className="ml-3 text-[15px] text-[#262626] flex-1">物流</span>
        <DownOutlined className="text-xs text-[#8c8c8c]" />
      </div>

      {/* 店铺（不可展开，仅展示） */}
      <div className="h-12 flex items-center px-6 cursor-not-allowed opacity-60 hover:bg-[#f0f0f0] transition-colors">
        <ShopOutlined className="text-xl text-[#262626]" />
        <span className="ml-3 text-[15px] text-[#262626] flex-1">店铺</span>
        <DownOutlined className="text-xs text-[#8c8c8c]" />
      </div>

      {/* 营销（不可展开，仅展示） */}
      <div className="h-12 flex items-center px-6 cursor-not-allowed opacity-60 hover:bg-[#f0f0f0] transition-colors">
        <TagOutlined className="text-xl text-[#262626]" />
        <span className="ml-3 text-[15px] text-[#262626] flex-1">营销</span>
        <DownOutlined className="text-xs text-[#8c8c8c]" />
      </div>

      {/* 推广（不可展开，仅展示） */}
      <div className="h-12 flex items-center px-6 cursor-not-allowed opacity-60 hover:bg-[#f0f0f0] transition-colors">
        <div className="relative">
          <GlobalOutlined className="text-xl text-[#262626]" />
          {/* 红点徽章 */}
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#ff4d4f] rounded-full" />
        </div>
        <span className="ml-3 text-[15px] text-[#262626] flex-1">推广</span>
        <DownOutlined className="text-xs text-[#8c8c8c]" />
      </div>

      {/* B2B2C中心（不可展开，仅展示） */}
      <div className="h-12 flex items-center px-6 cursor-not-allowed opacity-60 hover:bg-[#f0f0f0] transition-colors">
        <InboxOutlined className="text-xl text-[#262626]" />
        <span className="ml-3 text-[15px] text-[#262626] flex-1">B2B2C中心</span>
        <DownOutlined className="text-xs text-[#8c8c8c]" />
      </div>

      {/* 资金（不可展开，仅展示） */}
      <div className="h-12 flex items-center px-6 cursor-not-allowed opacity-60 hover:bg-[#f0f0f0] transition-colors">
        <div className="relative">
          <DollarOutlined className="text-xl text-[#262626]" />
          {/* 红点徽章 */}
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#ff4d4f] rounded-full" />
        </div>
        <span className="ml-3 text-[15px] text-[#262626] flex-1">资金</span>
        <DownOutlined className="text-xs text-[#8c8c8c]" />
      </div>

      {/* 账号及认证（不可展开，仅展示） */}
      <div className="h-12 flex items-center px-6 cursor-not-allowed opacity-60 hover:bg-[#f0f0f0] transition-colors">
        <UserOutlined className="text-xl text-[#262626]" />
        <span className="ml-3 text-[15px] text-[#262626] flex-1">账号及认证</span>
        <DownOutlined className="text-xs text-[#8c8c8c]" />
      </div>

      {/* 生意参谋（不可展开，仅展示） */}
      <div className="h-12 flex items-center px-6 cursor-not-allowed opacity-60 hover:bg-[#f0f0f0] transition-colors">
        <BarChartOutlined className="text-xl text-[#262626]" />
        <span className="ml-3 text-[15px] text-[#262626] flex-1">生意参谋</span>
        <DownOutlined className="text-xs text-[#8c8c8c]" />
      </div>

      {/* 体检（不可展开，仅展示） */}
      <div className="h-12 flex items-center px-6 cursor-not-allowed opacity-60 hover:bg-[#f0f0f0] transition-colors">
        <SafetyOutlined className="text-xl text-[#262626]" />
        <span className="ml-3 text-[15px] text-[#262626] flex-1">体检</span>
        <DownOutlined className="text-xs text-[#8c8c8c]" />
      </div>
    </div>
  )
}
