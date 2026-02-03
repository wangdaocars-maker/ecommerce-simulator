'use client'

import { useState } from 'react'
import ProductTable from './ProductTable'
import {
  Button,
  Tabs,
  Alert,
  Select,
  Input,
  Space,
  Badge,
  Dropdown,
  Progress,
} from 'antd'
import {
  DownOutlined,
  QuestionCircleOutlined,
  AppstoreOutlined,
  MedicineBoxOutlined,
  WarningOutlined,
  FileImageOutlined,
  ColumnWidthOutlined,
  GroupOutlined,
  SafetyCertificateOutlined,
  ReadOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import type { MenuProps, TabsProps } from 'antd'

export default function ProductsClient() {
  const [activeTab, setActiveTab] = useState('selling')
  const [filterType, setFilterType] = useState('all')

  // 批量上传下拉菜单
  const batchUploadMenu: MenuProps = {
    items: [
      { key: 'excel', label: '批量导入（Excel）' },
      { key: 'csv', label: '批量导入（CSV）' },
      { key: 'template', label: '下载模板' },
    ],
  }

  // 状态标签页配置
  const tabItems: TabsProps['items'] = [
    { key: 'selling', label: '正在销售 (376)' },
    { key: 'draft', label: '草稿箱 (0/500)' },
    { key: 'reviewing', label: '审核中 (0)' },
    { key: 'rejected', label: '审核不通过 (83)' },
    { key: 'offline', label: '已下架 (246)' },
  ]

  return (
    <div className="bg-[#F9FAFB] h-full overflow-auto">
        {/* 顶部标题栏 */}
        <div className="bg-white h-16 px-6 flex items-center justify-between border-b border-gray-200 shadow-sm">
          <h1 className="text-xl font-semibold text-[#262626]">商品管理</h1>

          <div className="flex items-center gap-4">
            {/* 当前层级信息 */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#8c8c8c]">当前层级:</span>
              <Progress
                percent={12}
                strokeColor="#1677ff"
                showInfo={false}
                style={{ width: 60 }}
              />
              <span className="text-sm text-[#262626]">
                总发品上限: <span className="font-medium">368/3000</span>
              </span>
              <QuestionCircleOutlined className="text-[#8c8c8c] cursor-pointer" />
            </div>

            {/* 批量上传 */}
            <Dropdown menu={batchUploadMenu}>
              <Button>
                批量上传 <DownOutlined />
              </Button>
            </Dropdown>

            {/* 发布商品 */}
            <Button type="primary" onClick={() => (window.location.href = '/products/create')}>
              发布商品
            </Button>
          </div>
        </div>

        {/* 功能工具栏 */}
        <div className="bg-white h-14 px-6 flex items-center justify-between border-b border-gray-100 shadow-sm">
          <Space size={32}>
            <div className="flex items-center gap-2 cursor-pointer hover:text-[#1677ff] transition-colors">
              <AppstoreOutlined className="text-lg text-[#1677ff]" />
              <span className="text-sm">常用入口</span>
            </div>

            <Badge count={33} offset={[8, -2]}>
              <div className="flex items-center gap-2 cursor-pointer hover:text-[#1677ff] transition-colors">
                <MedicineBoxOutlined className="text-lg text-[#1677ff]" />
                <span className="text-sm">商品诊断</span>
              </div>
            </Badge>

            <div className="flex items-center gap-2 cursor-pointer hover:text-[#1677ff] transition-colors">
              <WarningOutlined className="text-lg text-[#1677ff]" />
              <span className="text-sm">缺货预警</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer hover:text-[#1677ff] transition-colors">
              <FileImageOutlined className="text-lg text-[#1677ff]" />
              <span className="text-sm">素材中心</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer hover:text-[#1677ff] transition-colors">
              <ColumnWidthOutlined className="text-lg text-[#1677ff]" />
              <span className="text-sm">尺码模板</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer hover:text-[#1677ff] transition-colors">
              <GroupOutlined className="text-lg text-[#1677ff]" />
              <span className="text-sm">商品分组</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer hover:text-[#1677ff] transition-colors">
              <SafetyCertificateOutlined className="text-lg text-[#1677ff]" />
              <span className="text-sm">商品资质</span>
            </div>

            <div className="flex items-center gap-2 cursor-pointer hover:text-[#1677ff] transition-colors">
              <ReadOutlined className="text-lg text-[#1677ff]" />
              <span className="text-sm">商品知识库</span>
            </div>
          </Space>

          <Button type="link">展开</Button>
        </div>

        {/* 状态标签页和筛选区容器 */}
        <div className="mx-6 mt-4 bg-white rounded-lg shadow-md overflow-hidden">
          {/* 状态标签页 */}
          <div className="px-6">
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
          </div>

          {/* 提示信息 */}
          <div className="px-6 pb-4">
            <Alert
              description={
                <span>
                  您有<span className="text-[#ff4d4f] font-semibold">368</span>
                  个商品存在异常，请及时在下列"全部待优化任务"中筛选优化，避免影响商品转化
                </span>
              }
              type="info"
              showIcon
              closable
            />
          </div>

          {/* 筛选条件区 */}
          <div className="px-6 pb-6 space-y-3">
          {/* 第一行：快速筛选标签 */}
          <Space size={8}>
            <Button
              type={filterType === 'all' ? 'primary' : 'default'}
              onClick={() => setFilterType('all')}
              style={filterType === 'all' ? { background: '#e6f4ff', borderColor: '#1677ff', color: '#1677ff' } : {}}
            >
              全部
            </Button>
            <Button
              type={filterType === 'soldout' ? 'primary' : 'default'}
              onClick={() => setFilterType('soldout')}
            >
              售罄
            </Button>
            <Button
              type={filterType === 'presale' ? 'primary' : 'default'}
              onClick={() => setFilterType('presale')}
            >
              预售
            </Button>
            <Button
              type={filterType === 'wholesale' ? 'primary' : 'default'}
              onClick={() => setFilterType('wholesale')}
            >
              店铺批发商品
            </Button>
            <Button
              type={filterType === 'flash' ? 'primary' : 'default'}
              onClick={() => setFilterType('flash')}
            >
              可报名新品闪电推
            </Button>
          </Space>

          {/* 第二行：下拉筛选器 */}
          <div className="grid grid-cols-6 gap-2">
            <Select
              placeholder="重要商品任务"
              style={{ width: '100%' }}
              options={[
                {
                  label: (
                    <span>
                      全部待优化任务: <span className="text-[#ff4d4f]">368</span>
                    </span>
                  ),
                  value: 'all',
                },
              ]}
            />
            <Select placeholder="商品分组" style={{ width: '100%' }} />
            <Select placeholder="请选择类目" style={{ width: '100%' }} />
            <Select placeholder="区域定价" style={{ width: '100%' }} />
            <Select placeholder="日销运费模板" style={{ width: '100%' }} />
            <Select placeholder="商品责任人" style={{ width: '100%' }} />
          </div>

          <div className="grid grid-cols-6 gap-2">
            <Select placeholder="商品品牌" style={{ width: '100%' }} />
            <Select placeholder="欧盟责任人" style={{ width: '100%' }} />
            <Select placeholder="土耳其责任人" style={{ width: '100%' }} />
            <Select placeholder="制造商" style={{ width: '100%' }} />
            <Select placeholder="商机商品来源" style={{ width: '100%' }} />
            <div /> {/* 空白占位 */}
          </div>

          {/* 第三行：商品ID搜索 */}
          <div className="flex items-center gap-2">
            <Select
              defaultValue="productId"
              style={{ width: 120 }}
              options={[
                { value: 'productId', label: '商品ID' },
                { value: 'title', label: '商品标题' },
                { value: 'sku', label: 'SKU' },
              ]}
            />
            <Input placeholder="请输入完整的商品ID" style={{ flex: 1 }} />
            <Button type="primary" icon={<SearchOutlined />}>
              查询
            </Button>
            <Button>重置</Button>
          </div>
        </div>
      </div>

      {/* 商品列表表格 */}
      <div className="mx-6 mt-4 mb-6">
        <ProductTable />
      </div>
    </div>
  )
}
