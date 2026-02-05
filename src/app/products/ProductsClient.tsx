'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
  message,
  Modal,
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
} from '@ant-design/icons'
import type { MenuProps, TabsProps } from 'antd'
import type { ProductListItem, ProductStats, ProductStatus } from '@/types/product'

// 排序选项
const SORT_OPTIONS = [
  { value: 'updatedAt_desc', label: '编辑时间（最新）' },
  { value: 'updatedAt_asc', label: '编辑时间（最早）' },
  { value: 'createdAt_desc', label: '创建时间（最新）' },
  { value: 'createdAt_asc', label: '创建时间（最早）' },
  { value: 'sales30d_desc', label: '销量（高到低）' },
  { value: 'sales30d_asc', label: '销量（低到高）' },
  { value: 'views30d_desc', label: '曝光（高到低）' },
  { value: 'views30d_asc', label: '曝光（低到高）' },
  { value: 'conversion30d_desc', label: '转化率（高到低）' },
  { value: 'conversion30d_asc', label: '转化率（低到高）' },
  { value: 'stock_desc', label: '库存（高到低）' },
  { value: 'stock_asc', label: '库存（低到高）' },
  { value: 'price_desc', label: '价格（高到低）' },
  { value: 'price_asc', label: '价格（低到高）' },
]

// 商品分组类型
interface ProductGroupOption {
  id: number
  name: string
  productCount: number
}

export default function ProductsClient() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ProductStatus | 'selling'>('selling')
  const [filterType, setFilterType] = useState('all')
  const [searchType, setSearchType] = useState('productId')
  const [searchValue, setSearchValue] = useState('')

  // 分页状态
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [total, setTotal] = useState(0)

  // 排序状态
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // 筛选器状态
  const [selectedGroupId, setSelectedGroupId] = useState<number | undefined>(undefined)
  const [groups, setGroups] = useState<ProductGroupOption[]>([])

  // 数据状态
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<ProductStats | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])

  // 获取统计数据
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/products/stats')
      const result = await res.json()
      if (result.success) {
        setStats(result.data)
      }
    } catch (error) {
      console.error('获取统计数据失败:', error)
    }
  }, [])

  // 获取商品分组列表
  const fetchGroups = useCallback(async () => {
    try {
      const res = await fetch('/api/products/groups')
      const result = await res.json()
      if (result.success) {
        setGroups(result.data)
      }
    } catch (error) {
      console.error('获取商品分组失败:', error)
    }
  }, [])

  // 获取商品列表
  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      // 分页
      params.set('page', String(page))
      params.set('pageSize', String(pageSize))

      // 排序
      params.set('sortBy', sortBy)
      params.set('sortOrder', sortOrder)

      // 状态筛选
      if (activeTab === 'selling') {
        params.set('status', 'published')
      } else {
        params.set('status', activeTab)
      }

      // 筛选类型
      if (filterType !== 'all') {
        params.set('filterType', filterType)
      }

      // 分组筛选
      if (selectedGroupId) {
        params.set('groupId', String(selectedGroupId))
      }

      // 搜索
      if (searchValue.trim()) {
        params.set('search', searchValue.trim())
        params.set('searchType', searchType)
      }

      const res = await fetch(`/api/products?${params.toString()}`)
      const result = await res.json()

      if (result.success) {
        setProducts(result.data.items)
        setTotal(result.data.total)
      } else {
        message.error(result.error || '获取商品列表失败')
      }
    } catch (error) {
      console.error('获取商品列表失败:', error)
      message.error('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }, [activeTab, filterType, searchValue, searchType, page, pageSize, sortBy, sortOrder, selectedGroupId])

  // 初始加载
  useEffect(() => {
    fetchStats()
    fetchGroups()
    fetchProducts()
  }, [fetchStats, fetchGroups, fetchProducts])

  // Tab 切换时重置分页并重新加载
  useEffect(() => {
    setSelectedRowKeys([])
    setPage(1)
  }, [activeTab, filterType, selectedGroupId, sortBy, sortOrder])

  // 编辑商品
  const handleEdit = (id: string) => {
    router.push(`/products/edit/${id}`)
  }

  // 删除商品
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该商品吗？删除后可在回收站恢复。',
      okText: '确认删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
          const result = await res.json()
          if (result.success) {
            message.success('删除成功')
            fetchProducts()
            fetchStats()
          } else {
            message.error(result.error || '删除失败')
          }
        } catch {
          message.error('网络错误')
        }
      },
    })
  }

  // 批量下架
  const handleBatchOffline = async () => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: '批量下架',
      content: `确定要下架选中的 ${selectedRowKeys.length} 个商品吗？`,
      okText: '确认下架',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await fetch('/api/products/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'offline',
              ids: selectedRowKeys.map(k => parseInt(k)),
            }),
          })
          const result = await res.json()
          if (result.success) {
            message.success(`成功下架 ${result.data.affectedCount} 个商品`)
            setSelectedRowKeys([])
            fetchProducts()
            fetchStats()
          } else {
            message.error(result.error || '操作失败')
          }
        } catch {
          message.error('网络错误')
        }
      },
    })
  }

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: '批量删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个商品吗？删除后可在回收站恢复。`,
      okText: '确认删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          const res = await fetch('/api/products/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'delete',
              ids: selectedRowKeys.map(k => parseInt(k)),
            }),
          })
          const result = await res.json()
          if (result.success) {
            message.success(`成功删除 ${result.data.affectedCount} 个商品`)
            setSelectedRowKeys([])
            fetchProducts()
            fetchStats()
          } else {
            message.error(result.error || '操作失败')
          }
        } catch {
          message.error('网络错误')
        }
      },
    })
  }

  // 搜索
  const handleSearch = () => {
    setPage(1)
    fetchProducts()
  }

  // 重置搜索
  const handleReset = () => {
    setSearchValue('')
    setSearchType('productId')
    setFilterType('all')
    setSelectedGroupId(undefined)
    setSortBy('updatedAt')
    setSortOrder('desc')
    setPage(1)
  }

  // 排序变化
  const handleSortChange = (value: string) => {
    const [field, order] = value.split('_')
    setSortBy(field)
    setSortOrder(order as 'asc' | 'desc')
  }

  // 分页变化
  const handlePageChange = (newPage: number, newPageSize: number) => {
    setPage(newPage)
    setPageSize(newPageSize)
  }

  // 上架商品
  const handlePublish = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })
      const result = await res.json()
      if (result.success) {
        message.success('上架成功')
        fetchProducts()
        fetchStats()
      } else {
        message.error(result.error || '上架失败')
      }
    } catch {
      message.error('网络错误')
    }
  }

  // 批量上架
  const handleBatchPublish = async () => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: '批量上架',
      content: `确定要上架选中的 ${selectedRowKeys.length} 个商品吗？`,
      okText: '确认上架',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await fetch('/api/products/batch', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'online',
              ids: selectedRowKeys.map(k => parseInt(k)),
            }),
          })
          const result = await res.json()
          if (result.success) {
            message.success(`成功上架 ${result.data.affectedCount} 个商品`)
            setSelectedRowKeys([])
            fetchProducts()
            fetchStats()
          } else {
            message.error(result.error || '操作失败')
          }
        } catch {
          message.error('网络错误')
        }
      },
    })
  }

  // 导出商品
  const handleExport = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要导出的商品')
      return
    }

    try {
      const res = await fetch('/api/products/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'export',
          ids: selectedRowKeys.map(k => parseInt(k)),
        }),
      })

      if (res.ok) {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `商品导出_${new Date().toISOString().slice(0, 10)}.xlsx`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        message.success('导出成功')
      } else {
        const result = await res.json()
        message.error(result.error || '导出失败')
      }
    } catch {
      message.error('网络错误')
    }
  }

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
    { key: 'selling', label: `正在销售 (${stats?.selling || 0})` },
    { key: 'draft', label: `草稿箱 (${stats?.draft || 0}/${stats?.draftLimit || 500})` },
    { key: 'reviewing', label: `审核中 (${stats?.reviewing || 0})` },
    { key: 'rejected', label: `审核不通过 (${stats?.rejected || 0})` },
    { key: 'offline', label: `已下架 (${stats?.offline || 0})` },
  ]

  // 计算进度百分比
  const progressPercent = stats ? Math.round((stats.total / stats.limit) * 100) : 0

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
              percent={progressPercent}
              strokeColor="#1677ff"
              showInfo={false}
              style={{ width: 60 }}
            />
            <span className="text-sm text-[#262626]">
              总发品上限: <span className="font-medium">{stats?.total || 0}/{stats?.limit || 3000}</span>
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
          <Button type="primary" onClick={() => router.push('/products/create')}>
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

          <Badge count={stats?.abnormal || 0} offset={[8, -2]}>
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
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as ProductStatus | 'selling')}
            items={tabItems}
          />
        </div>

        {/* 提示信息 */}
        {stats && stats.abnormal > 0 && (
          <div className="px-6 pb-4">
            <Alert
              description={
                <span>
                  您有<span className="text-[#ff4d4f] font-semibold">{stats.abnormal}</span>
                  个商品存在异常，请及时在下列"全部待优化任务"中筛选优化，避免影响商品转化
                </span>
              }
              type="info"
              showIcon
              closable
            />
          </div>
        )}

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
              allowClear
              options={[
                {
                  label: (
                    <span>
                      全部待优化任务: <span className="text-[#ff4d4f]">{stats?.abnormal || 0}</span>
                    </span>
                  ),
                  value: 'all',
                },
              ]}
            />
            <Select
              placeholder="商品分组"
              style={{ width: '100%' }}
              allowClear
              value={selectedGroupId}
              onChange={(value) => setSelectedGroupId(value)}
              options={groups.map(g => ({
                label: `${g.name} (${g.productCount})`,
                value: g.id,
              }))}
            />
            <Select placeholder="请选择类目" style={{ width: '100%' }} allowClear />
            <Select placeholder="区域定价" style={{ width: '100%' }} allowClear />
            <Select placeholder="日销运费模板" style={{ width: '100%' }} allowClear />
            <Select placeholder="商品责任人" style={{ width: '100%' }} allowClear />
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
              value={searchType}
              onChange={setSearchType}
              style={{ width: 120 }}
              options={[
                { value: 'productId', label: '商品ID' },
                { value: 'title', label: '商品标题' },
                { value: 'sku', label: 'SKU' },
              ]}
            />
            <Input
              placeholder={
                searchType === 'productId'
                  ? '请输入完整的商品ID'
                  : searchType === 'title'
                  ? '请输入商品标题关键词'
                  : '请输入SKU编码'
              }
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onPressEnter={handleSearch}
              style={{ flex: 1 }}
            />
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              查询
            </Button>
            <Button onClick={handleReset}>重置</Button>
          </div>
        </div>
      </div>

      {/* 商品列表表格 */}
      <div className="mx-6 mt-4 mb-6">
        <ProductTable
          data={products}
          loading={loading}
          selectedRowKeys={selectedRowKeys}
          onSelectChange={setSelectedRowKeys}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onBatchOffline={handleBatchOffline}
          onBatchDelete={handleBatchDelete}
          onExport={handleExport}
          // 分页
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={handlePageChange}
          // 排序
          sortValue={`${sortBy}_${sortOrder}`}
          sortOptions={SORT_OPTIONS}
          onSortChange={handleSortChange}
          // 上架
          activeTab={activeTab}
          onPublish={handlePublish}
          onBatchPublish={handleBatchPublish}
        />
      </div>
    </div>
  )
}
