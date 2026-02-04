'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Breadcrumb,
  Card,
  Checkbox,
  Select,
  Input,
  Upload,
  Button,
  Tooltip,
  Space,
  message,
  Popover,
  Drawer,
  Alert,
  Tabs,
  Modal
} from 'antd'
import {
  QuestionCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  RightOutlined,
  UpOutlined,
  DownOutlined
} from '@ant-design/icons'
import HeaderOnlyLayout from '@/components/layout/HeaderOnlyLayout'
import ImageUploadModal from '@/components/ImageUploadModal'
import VideoUploadModal from '@/components/VideoUploadModal'

// 国家选项
const countryOptions = [
  { label: '西班牙', value: 'es', language: '西班牙语' },
  { label: '法国', value: 'fr', language: '法语' },
  { label: '巴西', value: 'br', language: '葡萄牙语' },
  { label: '韩国', value: 'kr', language: '韩语' },
  { label: '美国', value: 'us', language: '英语' },
  { label: '中东六国', value: 'me', language: '阿拉伯语', tooltip: '包括沙特、阿联酋等国家' },
  { label: '墨西哥', value: 'mx', language: '西班牙语' },
]

// 图片上传区域标签
const imageLabels = [
  '商品正面图',
  '商品背面图',
  '商品类图图',
  '商品侧面图',
  '商品细节图',
  '商品细节图',
]

// 类目数据（示例数据，实际应该从后端获取）
const categoryData = [
  {
    id: 1,
    name: '玩具',
    children: [
      {
        id: 11,
        name: '减压玩具',
        children: [
          { id: 111, name: '减压魔方' },
          { id: 112, name: '减压陀螺（指尖陀螺）' },
          { id: 113, name: '减压滚轮' },
          { id: 114, name: '捏捏乐' },
        ]
      },
      {
        id: 12,
        name: '非遥控模型（不包含拼搭）',
        children: [
          { id: 121, name: '汽车模型' },
          { id: 122, name: '飞机模型' },
        ]
      },
      {
        id: 13,
        name: '收藏爱好',
        children: [
          { id: 131, name: '手办' },
          { id: 132, name: '盲盒' },
        ]
      },
      {
        id: 14,
        name: '高科技玩具'
      },
      {
        id: 15,
        name: '谷子（二次元为主的IP类周边）'
      },
      {
        id: 16,
        name: '儿童手工制作/创意DIY玩具'
      },
    ]
  },
  {
    id: 2,
    name: '母婴（含儿童服装/童鞋/儿童用品）',
    children: [
      { id: 21, name: '婴儿奶粉' },
      { id: 22, name: '纸尿裤' },
    ]
  },
  {
    id: 3,
    name: '接发与发套'
  },
  {
    id: 4,
    name: '其他特殊类'
  },
]

const MAIN_SECTIONS = [
  { key: 'basic', label: '基本信息' },
  { key: 'price', label: '价格与库存' },
  { key: 'description', label: '详细描述' },
  { key: 'package', label: '包装与物流' },
  { key: 'other', label: '其它设置' },
]

export default function ProductCreateClient() {
  const router = useRouter()
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [language, setLanguage] = useState('zh')
  const [title, setTitle] = useState('')
  const [countryTitles, setCountryTitles] = useState<Record<string, string>>({})
  const [category, setCategory] = useState('')
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<any[]>([])
  const [tempCategoryPath, setTempCategoryPath] = useState<any[]>([])
  const [countryImages, setCountryImages] = useState<Record<string, any[]>>({})
  const [imageUploadModalVisible, setImageUploadModalVisible] = useState(false)
  const [currentUploadTarget, setCurrentUploadTarget] = useState<string>('')
  const [videoUploadModalVisible, setVideoUploadModalVisible] = useState(false)
  // 自定义属性列表
  const [customAttributes, setCustomAttributes] = useState<Array<{ id: string; name: string; value: string }>>([])
  // 海关监管属性抽屉
  const [customsDrawerVisible, setCustomsDrawerVisible] = useState(false)
  // 资质信息标签页
  const [qualificationTab, setQualificationTab] = useState('all')

  // 价格与库存相关状态
  const [minUnit, setMinUnit] = useState('piece')
  const [salesMethod, setSalesMethod] = useState('piece')
  const [colorSystem, setColorSystem] = useState('')
  const [customColorName, setCustomColorName] = useState('')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])

  // 插头类型和发货地
  const [plugTypeModalVisible, setPlugTypeModalVisible] = useState(false)
  const [selectedPlugTypes, setSelectedPlugTypes] = useState<string[]>([])
  const [shippingLocationModalVisible, setShippingLocationModalVisible] = useState(false)
  const [selectedShippingLocations, setSelectedShippingLocations] = useState<string[]>([])
  const [plugTypeSearch, setPlugTypeSearch] = useState('')
  const [shippingLocationSearch, setShippingLocationSearch] = useState('')

  // 价格库存表格
  const [retailPrice, setRetailPrice] = useState('')
  const [productValue, setProductValue] = useState('')
  const [inventory, setInventory] = useState('')
  const [isPresale, setIsPresale] = useState('')
  const [weight, setWeight] = useState('')
  const [packageLength, setPackageLength] = useState('')
  const [packageWidth, setPackageWidth] = useState('')
  const [packageHeight, setPackageHeight] = useState('')
  const [productType, setProductType] = useState('normal')
  const [skuCode, setSkuCode] = useState('')

  // 区域零售价
  const [regionalPriceModalVisible, setRegionalPriceModalVisible] = useState(false)
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [regionalPriceSearch, setRegionalPriceSearch] = useState('')
  const [priceAdjustMethod, setPriceAdjustMethod] = useState('direct') // direct, ratio, amount
  const [regionalPrices, setRegionalPrices] = useState<Record<string, string>>({})
  const [regionalPriceAdjustments, setRegionalPriceAdjustments] = useState<Record<string, { operator: string; value: string }>>({})
  const [regionalPriceVisible, setRegionalPriceVisible] = useState(false)

  // 批发价
  const [wholesaleEnabled, setWholesaleEnabled] = useState(false)
  const [wholesaleMinQuantity, setWholesaleMinQuantity] = useState('')
  const [wholesaleDiscount, setWholesaleDiscount] = useState('')

  // 主标签页
  const [mainTab, setMainTab] = useState('basic')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const setSectionRef = (key: string) => (node: HTMLDivElement | null) => {
    sectionRefs.current[key] = node
  }

  const scrollToSection = (key: string) => {
    setMainTab(key)
    const target = sectionRefs.current[key]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    setMainTab('basic')
  }, [])

  // 添加自定义属性
  const handleAddCustomAttribute = () => {
    const newAttr = {
      id: Date.now().toString(),
      name: '',
      value: ''
    }
    setCustomAttributes([...customAttributes, newAttr])
  }

  // 删除自定义属性
  const handleDeleteCustomAttribute = (id: string) => {
    setCustomAttributes(customAttributes.filter(attr => attr.id !== id))
  }

  // 上移自定义属性
  const handleMoveUpCustomAttribute = (index: number) => {
    if (index === 0) return
    const newAttrs = [...customAttributes]
    ;[newAttrs[index - 1], newAttrs[index]] = [newAttrs[index], newAttrs[index - 1]]
    setCustomAttributes(newAttrs)
  }

  // 下移自定义属性
  const handleMoveDownCustomAttribute = (index: number) => {
    if (index === customAttributes.length - 1) return
    const newAttrs = [...customAttributes]
    ;[newAttrs[index], newAttrs[index + 1]] = [newAttrs[index + 1], newAttrs[index]]
    setCustomAttributes(newAttrs)
  }

  // 更新自定义属性
  const handleUpdateCustomAttribute = (id: string, field: 'name' | 'value', newValue: string) => {
    setCustomAttributes(customAttributes.map(attr =>
      attr.id === id ? { ...attr, [field]: newValue } : attr
    ))
  }

  // 从 sessionStorage 读取基础信息
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('productBasicInfo')
      if (saved) {
        try {
          const basicInfo = JSON.parse(saved)
          setSelectedCountries(basicInfo.selectedCountries || [])
          setLanguage(basicInfo.language || 'zh')
          setTitle(basicInfo.title || '')
          setCountryTitles(basicInfo.countryTitles || {})
          setCategory(basicInfo.categoryText || '')
          setSelectedCategoryPath(basicInfo.categoryPath || [])
          setTempCategoryPath(basicInfo.categoryPath || [])
          setCountryImages(basicInfo.countryImages || {})
        } catch (error) {
          console.error('读取基础信息失败:', error)
          message.warning('未找到基础信息，请返回重新填写')
          setTimeout(() => {
            router.push('/products/create')
          }, 1500)
        }
      } else {
        message.warning('未找到基础信息，请返回重新填写')
        setTimeout(() => {
          router.push('/products/create')
        }, 1500)
      }
    }
  }, [router])

  const handleCountryChange = (checkedValues: string[]) => {
    setSelectedCountries(checkedValues)

    // 如果取消勾选了某个国家，删除其图片数据
    const newCountryImages = { ...countryImages }
    const newCountryTitles = { ...countryTitles }
    Object.keys(newCountryImages).forEach(country => {
      if (!checkedValues.includes(country)) {
        delete newCountryImages[country]
        delete newCountryTitles[country]
      }
    })
    setCountryImages(newCountryImages)
    setCountryTitles(newCountryTitles)

    // 初始化新选中国家的图片数据和标题
    checkedValues.forEach(country => {
      if (!newCountryImages[country]) {
        newCountryImages[country] = []
      }
      if (!newCountryTitles[country]) {
        newCountryTitles[country] = ''
      }
    })
  }

  // 处理类目选择
  const handleCategorySelect = (category: any, level: number) => {
    const newPath = [...tempCategoryPath.slice(0, level), category]
    setTempCategoryPath(newPath)
  }

  // 确认类目选择并跳转到详细编辑页面
  const handleCategoryConfirm = () => {
    if (tempCategoryPath.length === 0) {
      message.warning('请选择类目')
      return
    }

    setSelectedCategoryPath(tempCategoryPath)
    const categoryText = tempCategoryPath.map(c => c.name).join(' > ')
    setCategory(categoryText)

    // 保存基础信息到 sessionStorage
    const basicInfo = {
      selectedCountries,
      language,
      title,
      countryTitles,
      categoryPath: tempCategoryPath,
      categoryText,
      countryImages,
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('productBasicInfo', JSON.stringify(basicInfo))
    }

    // 获取最后一级类目ID
    const lastCategory = tempCategoryPath[tempCategoryPath.length - 1]

    // 跳转到详细编辑页面
    message.success('类目已选择，正在跳转到详细编辑页面...')
    setTimeout(() => {
      router.push(`/products/create/detail?categoryId=${lastCategory.id}`)
    }, 500)
  }

  // 清空类目选择
  const handleCategoryClear = () => {
    setTempCategoryPath([])
  }

  // 渲染类目列
  const renderCategoryColumn = (data: any[], level: number) => {
    return (
      <div style={{
        flex: 1,
        borderRight: level < 3 ? '1px solid #E8E8E8' : 'none',
        padding: '12px',
        minWidth: 250
      }}>
        <Input
          placeholder="名称/拼音首字母"
          size="small"
          suffix={<SearchOutlined style={{ color: '#8C8C8C' }} />}
          style={{ marginBottom: 12 }}
        />
        <div style={{ maxHeight: 300, overflowY: 'auto' }}>
          {data.map(item => (
            <div
              key={item.id}
              onClick={() => handleCategorySelect(item, level)}
              style={{
                padding: '8px 12px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: tempCategoryPath[level]?.id === item.id ? '#E6F7FF' : 'transparent',
                borderRadius: 4,
                marginBottom: 4
              }}
            >
              <span style={{ fontSize: 12 }}>{item.name}</span>
              {item.children && <RightOutlined style={{ fontSize: 10, color: '#8C8C8C' }} />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 渲染图片上传区域
  const renderImageUploadArea = (countryCode: string) => {
    const isDefault = countryCode === 'default'
    return (
      <div style={{ display: 'flex', gap: 11, marginBottom: 8 }}>
        {imageLabels.map((label, index) => (
          <div key={index} style={{ width: 105 }}>
            {/* 图片标签 */}
            <div style={{
              backgroundColor: '#595959',
              color: '#fff',
              padding: '3px 6px',
              textAlign: 'center',
              fontSize: 10,
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
            }}>
              {label}
            </div>

            {/* 上传区域 */}
            <Upload
              listType="picture-card"
              showUploadList={false}
              style={{ width: '100%' }}
            >
              <div style={{
                border: index === 0 && isDefault ? '1px solid #1677FF' : '1px dashed #d9d9d9',
                borderTop: 'none',
                borderRadius: '0 0 2px 2px',
                width: 105,
                height: 105,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}>
                <PlusOutlined style={{
                  fontSize: 17,
                  color: index === 0 && isDefault ? '#1677FF' : '#D9D9D9'
                }} />
                <div style={{ marginTop: 6, color: '#8C8C8C', fontSize: 10 }}>
                  添加图片
                </div>
              </div>
            </Upload>
          </div>
        ))}
      </div>
    )
  }

  return (
    <HeaderOnlyLayout>
      <div style={{ padding: '17px 40px 0' }}>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { title: '商品管理' },
            { title: '发布商品' },
          ]}
          style={{ marginBottom: 11, fontSize: 10, color: '#8C8C8C' }}
        />

        {/* 页面标题 */}
        <h1 style={{
          fontSize: 17,
          fontWeight: 'bold',
          color: '#000',
          marginBottom: 17
        }}>
          发布商品
        </h1>
      </div>

      {/* 主标签导航 */}
      <Tabs
        activeKey={mainTab}
        onChange={scrollToSection}
        renderTabBar={(props, DefaultTabBar) => (
          <div style={{
            position: 'sticky',
            top: 64,
            zIndex: 100,
            backgroundColor: '#F5F5F5',
            paddingLeft: 40,
            paddingRight: 40
          }}>
            <DefaultTabBar {...props} />
          </div>
        )}
        style={{
          marginBottom: 0,
          backgroundColor: 'transparent'
        }}
        className="product-create-sections"
        size="large"
        items={[
            {
              key: 'basic',
              label: '基本信息',
              forceRender: true,
              children: (
                <div
                  ref={setSectionRef('basic')}
                  id="section-basic"
                  data-section="basic"
                  style={{ padding: '20px 40px 0', scrollMarginTop: 120 }}
                >
                  {/* 国家选择卡片 */}
                  <Card
          variant="borderless"
          style={{ marginBottom: 20, fontSize: 12 }}
        >
          <div style={{ marginBottom: 11, color: '#262626' }}>
            为以下国家进行标题、商品图片、详情描述等内容的差异化设置：
          </div>
          <Checkbox.Group
            value={selectedCountries}
            onChange={handleCountryChange}
            style={{ width: '100%' }}
          >
            <Space size={17}>
              {countryOptions.map(option => (
                <Checkbox key={option.value} value={option.value}>
                  {option.label}
                  {option.tooltip && (
                    <Tooltip title={option.tooltip}>
                      <QuestionCircleOutlined
                        style={{ marginLeft: 4, color: '#8C8C8C' }}
                      />
                    </Tooltip>
                  )}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </Card>

        {/* 基本信息卡片 */}
        <Card
          variant="borderless"
          title={<span style={{ fontSize: 11, fontWeight: 'bold' }}>基本信息</span>}
          style={{ fontSize: 12 }}
        >
          {/* 发布语言 */}
          <div style={{ marginBottom: 17, display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: 120, paddingTop: 4 }}>
              <span style={{ color: '#ff4d4f' }}>* </span>
              <span style={{ color: '#262626' }}>发布语言</span>
              <Tooltip title="选择商品发布的语言">
                <QuestionCircleOutlined
                  style={{ marginLeft: 4, color: '#8C8C8C' }}
                />
              </Tooltip>
            </div>
            <div>
              <Select
                value={language}
                onChange={setLanguage}
                style={{ width: 410 }}
                size="small"
                options={[
                  { label: '英文', value: 'en' },
                  { label: '中文', value: 'zh' },
                  { label: '西班牙文', value: 'es' },
                  { label: '法文', value: 'fr' },
                ]}
              />
            </div>
          </div>

          {/* 商品图片 */}
          <div style={{ marginBottom: 17, display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: 120, paddingTop: 4 }}>
              <span style={{ color: '#ff4d4f' }}>* </span>
              <span style={{ color: '#262626' }}>商品图片</span>
              <Tooltip title="上传商品图片">
                <QuestionCircleOutlined
                  style={{ marginLeft: 4, color: '#8C8C8C' }}
                />
              </Tooltip>
            </div>

            <div>
              {renderImageUploadArea('default')}
              <Button
                type="primary"
                ghost
                size="small"
                style={{ marginBottom: 6 }}
              >
                AI 图片翻译
              </Button>
              <div style={{ color: '#8C8C8C', fontSize: 10 }}>
                图片横批比例支持1:1（像素&gt;=800*800）或3:4（像素&gt;=750*1000），支持jpg、jpeg、png格式；
              </div>
            </div>
          </div>

          {/* 分国家上传提示 */}
          {selectedCountries.length > 0 && (
            <div style={{ marginBottom: 17, display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ width: 120 }}></div>
              <div style={{ color: '#8C8C8C', fontSize: 10 }}>
                支持分国家上传商品图片，如未上传，则在前台默认展示通用商品图片。
              </div>
            </div>
          )}

          {/* 每个国家作为独立字段行 */}
          {selectedCountries.map((countryCode) => {
            const country = countryOptions.find(c => c.value === countryCode)
            return (
              <div
                key={countryCode}
                style={{
                  marginBottom: 17,
                  display: 'flex',
                  alignItems: 'flex-start',
                  backgroundColor: '#FAFAFA',
                  padding: '12px',
                  borderRadius: 4,
                  marginLeft: -12,
                  marginRight: -12,
                  paddingLeft: 12,
                  paddingRight: 12
                }}
              >
                {/* 国家名称（和"商品图片"标签对齐） */}
                <div style={{
                  width: 120,
                  paddingTop: 4,
                  color: '#262626',
                  fontSize: 12,
                  flexShrink: 0
                }}>
                  {country?.label || countryCode}
                </div>

                {/* 图片上传区域 + 复制按钮 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  {renderImageUploadArea(countryCode)}

                  {/* 复制按钮 */}
                  <div style={{ flexShrink: 0, paddingTop: 40 }}>
                    <Button
                      type="link"
                      size="small"
                      onClick={() => {
                        const sourceImages = countryImages[countryCode] || []
                        const newCountryImages = { ...countryImages }
                        selectedCountries.forEach(c => {
                          if (c !== countryCode) {
                            newCountryImages[c] = [...sourceImages]
                          }
                        })
                        setCountryImages(newCountryImages)
                        message.success(`已复制 ${country?.label} 的商品图片到其他国家`)
                      }}
                    >
                      复制商品图片
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* 商品标题 */}
          <div style={{ marginBottom: 17, display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: 120, paddingTop: 4 }}>
              <span style={{ color: '#ff4d4f' }}>* </span>
              <span style={{ color: '#262626' }}>商品标题</span>
              <Tooltip title="填写商品标题">
                <QuestionCircleOutlined
                  style={{ marginLeft: 4, color: '#8C8C8C' }}
                />
              </Tooltip>
            </div>

            <div style={{ width: 685 }}>
              {/* 默认标题 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: selectedCountries.length > 0 ? 12 : 0 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Input
                    placeholder="请输入标题"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={128}
                    size="small"
                    style={{ paddingRight: 80 }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8C8C8C',
                    fontSize: 10,
                  }}>
                    {title.length}/128
                  </div>
                </div>
                <Button type="link" size="small" style={{ flexShrink: 0 }}>
                  翻译
                </Button>
              </div>

              {/* 分国家标题 */}
              {selectedCountries.length > 0 && (
                <div style={{
                  backgroundColor: '#FAFAFA',
                  padding: '12px 16px',
                  borderRadius: 4,
                  marginBottom: 8
                }}>
                  {selectedCountries.map((countryCode) => {
                    const country = countryOptions.find(c => c.value === countryCode)
                    return (
                      <div key={countryCode} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 80, color: '#262626', fontSize: 12, textAlign: 'right' }}>
                          {country?.language}:
                        </div>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <Input
                            placeholder="请输入标题"
                            value={countryTitles[countryCode] || ''}
                            onChange={e => setCountryTitles({ ...countryTitles, [countryCode]: e.target.value })}
                            maxLength={218}
                            size="small"
                            style={{ paddingRight: 80 }}
                          />
                          <div style={{
                            position: 'absolute',
                            right: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#8C8C8C',
                            fontSize: 10,
                          }}>
                            {(countryTitles[countryCode] || '').length}/218
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  <Button
                    type="link"
                    size="small"
                    style={{ padding: 0, marginLeft: 88 }}
                  >
                    翻译 <span style={{ marginLeft: 4 }}>▼</span>
                  </Button>
                </div>
              )}

              <Button
                type="primary"
                ghost
                size="small"
                style={{ marginTop: 6 }}
              >
                AI 标题生成
              </Button>
            </div>
          </div>

          {/* 类目 */}
          <div style={{ marginBottom: 17, display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: 120, paddingTop: 4 }}>
              <span style={{ color: '#ff4d4f' }}>* </span>
              <span style={{ color: '#262626' }}>类目</span>
            </div>

            <div style={{ width: 685, position: 'relative' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Input
                  placeholder="可输入商品名称关键词，平台已有商品ID或商品链接搜索类目"
                  value={category}
                  onClick={() => setCategoryModalVisible(!categoryModalVisible)}
                  readOnly
                  suffix={<SearchOutlined style={{ color: '#8C8C8C' }} />}
                  size="small"
                  style={{ flex: 1, cursor: 'pointer' }}
                />
                <Button type="link" size="small" style={{ flexShrink: 0 }}>
                  最近使用
                </Button>
              </div>

              <Button
                type="primary"
                ghost
                size="small"
                style={{ marginTop: 6, marginBottom: categoryModalVisible ? 12 : 0 }}
              >
                AI 类目查询
              </Button>

              {/* 类目选择面板 */}
              {categoryModalVisible && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#fff',
                  border: '1px solid #D9D9D9',
                  borderRadius: 4,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  marginTop: 4
                }}>
                  {/* 类目列展示区域 */}
                  <div style={{ display: 'flex', borderBottom: '1px solid #E8E8E8' }}>
                    {/* 第一列 */}
                    {renderCategoryColumn(categoryData, 0)}

                    {/* 第二列 */}
                    {tempCategoryPath[0]?.children && renderCategoryColumn(tempCategoryPath[0].children, 1)}

                    {/* 第三列 */}
                    {tempCategoryPath[1]?.children && renderCategoryColumn(tempCategoryPath[1].children, 2)}

                    {/* 第四列 */}
                    {tempCategoryPath[2]?.children && renderCategoryColumn(tempCategoryPath[2].children, 3)}
                  </div>

                  {/* 当前选择路径 */}
                  <div style={{ padding: '12px 16px', color: '#262626', fontSize: 12 }}>
                    您当前的选择是：
                    {tempCategoryPath.length > 0 ? (
                      <span style={{ color: '#1677FF' }}>
                        {tempCategoryPath.map(c => c.name).join(' > ')}
                      </span>
                    ) : (
                      <span style={{ color: '#8C8C8C' }}>未选择</span>
                    )}
                  </div>

                  {/* 底部按钮 */}
                  <div style={{
                    padding: '12px 16px',
                    borderTop: '1px solid #E8E8E8',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button type="primary" size="small" onClick={handleCategoryConfirm}>
                        确定
                      </Button>
                      <Button size="small" onClick={() => setCategoryModalVisible(false)}>
                        取消
                      </Button>
                      <Button size="small" onClick={handleCategoryClear}>
                        清空
                      </Button>
                    </div>

                    <div style={{ fontSize: 11 }}>
                      <a href="#" style={{ color: '#1677FF', marginRight: 12 }}>
                        <span style={{ fontSize: 16, marginRight: 4 }}>●</span>
                        如何选择类目教程
                      </a>
                      <a href="#" style={{ color: '#1677FF' }}>
                        <span style={{ fontSize: 16, marginRight: 4 }}>●</span>
                        点此申请店铺类目权限
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 营销图 */}
          <div style={{ marginBottom: 17, display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: 120, paddingTop: 4 }}>
              <span style={{ color: '#262626' }}>营销图</span>
            </div>

            <div>
              <div style={{ color: '#8C8C8C', fontSize: 10, marginBottom: 12 }}>
                在营销导购场景，优质的商品图片（1:1白底图、3:4场景图）对导购转化有正向效果。
              </div>

              {/* 图片上传区域 */}
              <div style={{ display: 'flex', gap: 17, marginBottom: 12, alignItems: 'flex-end' }}>
                {/* 1:1白底图 */}
                <Popover
                  content={
                    <div style={{ width: 400 }}>
                      <div style={{ textAlign: 'center', marginBottom: 16 }}>
                        <img
                          src="/marketing-example-1-1.jpg"
                          alt="示例图片"
                          style={{ width: 240, height: 240, objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ fontSize: 12, color: '#262626', lineHeight: '20px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>规范要求：</div>
                        <div style={{ marginBottom: 6 }}>
                          1、图片格式只能为jpg、jpeg、png，且大小不超过5MB；
                        </div>
                        <div style={{ marginBottom: 6 }}>
                          2、图片宽高比例必须为1:1，像素不能低于 800x800（建议 1000x1000）；
                        </div>
                        <div style={{ marginBottom: 6 }}>
                          3、上传图片的背景要求必须为纯白色或透明；
                        </div>
                        <div>
                          4、不允许出现logo水印、边框以及促销牛皮癣等信息；
                        </div>
                      </div>
                    </div>
                  }
                  trigger="hover"
                  placement="right"
                >
                  <div>
                    <div style={{
                      backgroundColor: '#595959',
                      color: '#fff',
                      padding: '3px 8px',
                      textAlign: 'center',
                      fontSize: 10,
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                      width: 138
                    }}>
                      1:1白底图
                    </div>
                    <div
                      onClick={() => {
                        setCurrentUploadTarget('marketing-1-1')
                        setImageUploadModalVisible(true)
                      }}
                      style={{
                        border: '1px dashed #d9d9d9',
                        borderTop: 'none',
                        borderRadius: '0 0 2px 2px',
                        width: 138,
                        height: 138,
                        position: 'relative',
                        cursor: 'pointer',
                        overflow: 'hidden'
                      }}
                    >
                      {/* 背景图片 */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'url(/marketing-example-1-1.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.4
                      }} />

                      {/* 半透明遮罩 */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)'
                      }} />

                      {/* 内容层 */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingBottom: 24,
                        zIndex: 1
                      }}>
                        <PlusOutlined style={{ fontSize: 24, color: '#1677FF' }} />
                        <div style={{ marginTop: 8, color: '#595959', fontSize: 11 }}>
                          添加图片
                        </div>
                      </div>
                    </div>
                  </div>
                </Popover>

                {/* 3:4场景图 */}
                <Popover
                  content={
                    <div style={{ width: 400 }}>
                      <div style={{ textAlign: 'center', marginBottom: 16 }}>
                        <img
                          src="/marketing-example-3-4.jpg"
                          alt="示例图片"
                          style={{ width: 180, height: 240, objectFit: 'contain' }}
                        />
                      </div>
                      <div style={{ fontSize: 12, color: '#262626', lineHeight: '20px' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>规范要求：</div>
                        <div style={{ marginBottom: 6 }}>
                          1、图片格式只能为jpg、jpeg、png，且大小不超过5MB；
                        </div>
                        <div style={{ marginBottom: 6 }}>
                          2、宽高比例必须为3:4，像素要求不能低于 750x1000；
                        </div>
                        <div>
                          3、不允许出现水印、任何形式的边框以及促销牛皮癣等信息；
                        </div>
                      </div>
                    </div>
                  }
                  trigger="hover"
                  placement="right"
                >
                  <div>
                    <div style={{
                      backgroundColor: '#595959',
                      color: '#fff',
                      padding: '3px 8px',
                      textAlign: 'center',
                      fontSize: 10,
                      borderTopLeftRadius: 2,
                      borderTopRightRadius: 2,
                      width: 160
                    }}>
                      3:4场景图
                    </div>
                    <div
                      onClick={() => {
                        setCurrentUploadTarget('marketing-3-4')
                        setImageUploadModalVisible(true)
                      }}
                      style={{
                        border: '1px dashed #d9d9d9',
                        borderTop: 'none',
                        borderRadius: '0 0 2px 2px',
                        width: 160,
                        height: 213,
                        position: 'relative',
                        cursor: 'pointer',
                        overflow: 'hidden'
                      }}
                    >
                      {/* 背景图片 */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'url(/marketing-example-3-4.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: 0.4
                      }} />

                      {/* 半透明遮罩 */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.5)'
                      }} />

                      {/* 内容层 */}
                      <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingBottom: 32,
                        zIndex: 1
                      }}>
                        <PlusOutlined style={{ fontSize: 24, color: '#1677FF' }} />
                        <div style={{ marginTop: 8, color: '#595959', fontSize: 11 }}>
                          添加图片
                        </div>
                      </div>
                    </div>
                  </div>
                </Popover>
              </div>

              <Button
                type="primary"
                ghost
                size="small"
              >
                Ai 图片优化
              </Button>
            </div>
          </div>

          {/* 商品视频 */}
          <div style={{ marginBottom: 17, display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: 120, paddingTop: 4 }}>
              <span style={{ color: '#262626' }}>商品视频</span>
            </div>

            <div>
              <Button
                type="primary"
                ghost
                size="middle"
                icon={<span style={{ marginRight: 4 }}>↑</span>}
                style={{ marginBottom: 12 }}
                onClick={() => setVideoUploadModalVisible(true)}
              >
                上传视频
              </Button>
              <div style={{ color: '#8C8C8C', fontSize: 10 }}>
                建议视频比例为 1:1或者16:9，视频时长在30秒内，视频大小在2GB 内。
              </div>
            </div>
          </div>

          {/* 商品属性 */}
          <div style={{ marginBottom: 17, display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: 120, paddingTop: 4 }}>
              <span style={{ color: '#ff4d4f' }}>* </span>
              <span style={{ color: '#262626' }}>商品属性</span>
              <Tooltip title="填写商品的详细属性信息">
                <QuestionCircleOutlined
                  style={{ marginLeft: 4, color: '#8C8C8C', cursor: 'pointer' }}
                />
              </Tooltip>
            </div>

            <div style={{ flex: 1 }}>
              <div
                style={{
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #E8E8E8',
                  borderRadius: 4,
                  padding: '24px'
                }}
              >
                {/* 两列表单布局 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* 第一行：品牌 | 产品类型 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        <span style={{ color: '#262626' }}>品牌</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现品牌选择功能
                        />
                        <div style={{ marginTop: 8 }}>
                          <span style={{ color: '#8C8C8C', fontSize: 12 }}>找不到品牌？ </span>
                          <Button
                            type="link"
                            size="small"
                            style={{ padding: 0, height: 'auto', fontSize: 12 }}
                            // TODO: 实现申请品牌功能
                          >
                            申请品牌
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        <span style={{ color: '#262626' }}>产品类型</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现产品类型选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第二行：适用年龄 | 高关注化学品 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        <span style={{ color: '#262626' }}>适用年龄</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Button
                          size="middle"
                          // TODO: 实现设置功能
                        >
                          设置
                        </Button>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        <span style={{ color: '#262626' }}>高关注化学品</span>
                        <Tooltip title="高关注物质(SVHC)是指具有持久性、生物累积性、毒性(PBT)或高持久性、高生物累积性(vPvB)等特性的化学物质">
                          <QuestionCircleOutlined
                            style={{ marginLeft: 4, color: '#8C8C8C', cursor: 'pointer' }}
                          />
                        </Tooltip>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Button
                          size="middle"
                          // TODO: 实现设置功能
                        >
                          设置
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 第三行：产地 | 性别 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        <span style={{ color: '#262626' }}>产地（国家或地区）</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现产地选择功能
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>性别</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现性别选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第四行：警告 | 玩偶类型 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>警告</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Input
                          placeholder="请输入"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现警告输入功能
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>玩偶类型</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现玩偶类型选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第五行：尺寸 | 动漫电影游戏名称 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>尺寸</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Input
                          placeholder="请输入"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现尺寸输入功能
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>动漫电影游戏名称</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现动漫电影游戏名称选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第六行：比例 | 遥控 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>比例</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Input
                          placeholder="请输入或从列表选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现比例输入/选择功能
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>遥控</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现遥控选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第七行：认证 | 按动漫来源 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>认证</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Button
                          size="middle"
                          // TODO: 实现设置功能
                        >
                          设置
                        </Button>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>按动漫来源</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Input
                          placeholder="请输入或从列表选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现按动漫来源输入/选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第八行：玩具娃娃适合各种场合 | 状态 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>玩具娃娃适合各种场合</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Button
                          size="middle"
                          // TODO: 实现设置功能
                        >
                          设置
                        </Button>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>状态</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现状态选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第九行：兵人配件 | 动漫电影游戏人物角色 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>兵人配件</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Checkbox.Group
                          style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                          // TODO: 实现兵人配件选择功能
                        >
                          <Checkbox value="soldier-f">兵人成品(Soldier F</Checkbox>
                          <Checkbox value="soldier">兵人套装(SOLDIER</Checkbox>
                          <Checkbox value="soldier-p">兵人散件(Soldier P</Checkbox>
                        </Checkbox.Group>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>动漫电影游戏人物角色</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Input
                          placeholder="请输入"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现动漫电影游戏人物角色输入功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第十行：系列 | 版本 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>系列</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现系列选择功能
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>版本</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Input
                          placeholder="请输入或从列表选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现版本输入/选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第十一行：商品属性 | 型号 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>商品属性</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现商品属性选择功能
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>型号</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Input
                          placeholder="请输入"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现型号输入功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第十二行：完成度 | 主题 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>完成度</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现完成度选择功能
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>主题</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Input
                          placeholder="请输入或从列表选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现主题输入/选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第十三行：材质 | 是否原盒包装 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>材质</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Input
                          placeholder="请输入或从列表选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现材质输入/选择功能
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 180, textAlign: 'right', paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>是否原盒包装</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: 280 }}
                          size="middle"
                          // TODO: 实现是否原盒包装选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 自定义属性列表 */}
                  {customAttributes.map((attr, index) => (
                    <div key={attr.id} style={{ display: 'flex', gap: 100 }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>添加自定义属性</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1, display: 'flex', alignItems: 'center', gap: 16 }}>
                          <Input
                            placeholder="属性名 - 例如：Color"
                            style={{ width: 400 }}
                            size="middle"
                            value={attr.name}
                            onChange={(e) => handleUpdateCustomAttribute(attr.id, 'name', e.target.value)}
                          />
                          <Input
                            placeholder="属性值 - 例如：Red"
                            style={{ width: 400 }}
                            size="middle"
                            value={attr.value}
                            onChange={(e) => handleUpdateCustomAttribute(attr.id, 'value', e.target.value)}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <Button
                              type="text"
                              size="small"
                              icon={<UpOutlined />}
                              disabled={index === 0}
                              onClick={() => handleMoveUpCustomAttribute(index)}
                              style={{ padding: 4 }}
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={<DownOutlined />}
                              disabled={index === customAttributes.length - 1}
                              onClick={() => handleMoveDownCustomAttribute(index)}
                              style={{ padding: 4 }}
                            />
                            <Button
                              type="link"
                              size="small"
                              onClick={() => handleDeleteCustomAttribute(attr.id)}
                              style={{ padding: 0 }}
                            >
                              删除
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div style={{ flex: 1 }}></div>
                    </div>
                  ))}

                  {/* 添加自定义属性按钮 */}
                  <div style={{ display: 'flex', gap: 100 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                        {customAttributes.length === 0 && (
                          <span style={{ color: '#262626' }}>添加自定义属性</span>
                        )}
                      </div>
                      <div style={{ marginLeft: 12, flex: 1 }}>
                        <Button
                          icon={<PlusOutlined />}
                          size="middle"
                          onClick={handleAddCustomAttribute}
                        >
                          添加自定义属性
                        </Button>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 海关监管属性 */}
        <Card
          variant="borderless"
          title={<span style={{ fontSize: 11, fontWeight: 'bold' }}>海关监管属性</span>}
          style={{ fontSize: 12, marginTop: 17 }}
        >
          <div style={{ marginBottom: 17, display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ width: 120, paddingTop: 4 }}>
              <span style={{ color: '#ff4d4f' }}>* </span>
              <span style={{ color: '#262626' }}>海关监管属性</span>
              <Tooltip title="请填写符合海关要求的商品属性信息">
                <QuestionCircleOutlined
                  style={{ marginLeft: 4, color: '#8C8C8C', cursor: 'pointer' }}
                />
              </Tooltip>
            </div>

            <div>
              <Button
                size="middle"
                onClick={() => setCustomsDrawerVisible(true)}
              >
                去设置
              </Button>
            </div>
          </div>
        </Card>

        {/* 资质信息 */}
        <Card
          variant="borderless"
          title={<span style={{ fontSize: 11, fontWeight: 'bold' }}>资质信息</span>}
          style={{ fontSize: 12, marginTop: 17 }}
        >
          <div style={{ marginBottom: 17 }}>
            {/* 提示信息 */}
            <div
              style={{
                backgroundColor: '#FFF7E6',
                border: '1px solid #FFD591',
                borderRadius: 4,
                padding: '12px 16px',
                marginBottom: 17,
                color: '#D46B08',
                fontSize: 12
              }}
            >
              如果您在以下国家/地区售卖商品，请提交该国家/地区要求的商品资质，否则商品可能无法在该国家/地区展示
            </div>

            {/* 国家/地区标签页 */}
            <Tabs
              activeKey={qualificationTab}
              onChange={setQualificationTab}
              items={[
                {
                  key: 'all',
                  label: '全部资质',
                  children: (
                    <div style={{ padding: '24px 0', maxWidth: 840 }}>
                      {/* 欧盟 - 完整内容 */}
                      <div style={{ marginBottom: 48 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: '#262626' }}>欧盟</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          销往欧盟的儿童玩具产品应满足玩具安全法规Toy safety Directive 2009/48/EU，无线电玩具还需满足无线指令Directive 2014/53/EU带要求，所有带电玩具满足RoHS指令Directive 2011/65/EU的相关要求，并向平台提供符合性声明文件及其他产品合规文件。
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* 检测报告 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>检测报告</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>请上传产品的检测报告。</div>
                          </div>
                        </div>
                        {/* 产品安全信息/警示语 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>产品安全信息/警示语</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Input.TextArea placeholder="请输入" rows={3} style={{ width: 600 }} />
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              （选填）如商品具有特殊的安全信息/警示语，请填写。请勿使用特殊符号（如引号、斜杠等），且长度勿超过200字符。
                            </div>
                          </div>
                        </div>
                        {/* REACH检测报告 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>REACH检测报告</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>请提交商品的REACH检测报告。</div>
                          </div>
                        </div>
                        {/* 欧盟CE-DoC */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>欧盟CE-DoC</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              请提供产品的符合性声明文件。模版可参考：<br />
                              <a href="https://files.alicdn.com/tpsservice/a529457f9bd1b290089a02a5b62ff924.docx?spm=a1zmmc.index.0.0.232d719dBQZhNx&file=a529457f9bd1b290089a02a5b62ff924.docx" target="_blank" rel="noopener noreferrer" style={{ color: '#1677FF' }}>
                                https://files.alicdn.com/tpsservice/a529457f9bd1b290089a02a5b62ff924.docx?spm=a1zmmc.index.0.0.232d719dBQZhNx&file=a529457f9bd1b290089a02a5b62ff924.docx
                              </a>。
                            </div>
                          </div>
                        </div>
                        {/* 外包装/标签实拍图-欧盟 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>外包装/标签实拍图-欧盟</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              请上传发往欧盟的商品包装实物图，应包含生产企业信息、欧盟责任人信息和CE标志
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 英国 - 完整内容 */}
                      <div style={{ marginBottom: 48, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: '#262626' }}>英国</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          根据欧盟/英国法规要求，销往欧盟市场的商品须上传外包装标签图，应标明如下信息：生产企业信息、和CE/UKCA标识（如适用）。商品资质的审核结果查询请访问资质中心【<a href="https://gsp.aliexpress.com/apps/product/qualitycenter?" target="_blank" rel="noopener noreferrer" style={{ color: '#1677FF' }}>https://gsp.aliexpress.com/apps/product/qualitycenter?</a>】
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* 外包装/标签实拍图-英国 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>外包装/标签实拍图-英国</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          </div>
                        </div>
                      </div>

                      {/* 韩国 - 完整内容 */}
                      <div style={{ marginBottom: 48, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: '#262626' }}>韩国</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          平台加强了售往韩国的儿童玩具、母婴产品、电子电器、小家电、运动户外、安全防护、家居用品、美容健康等品类的商品管控，商家需确保商品符合韩国当地的相关法律法规要求，请商家积极上传KC、CE或3C等该商品的全部认证，以便韩国消费者了解该产品的认证信息。
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* KC认证证书_安全 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>KC认证证书_安全</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>请上传清晰且带KC认证编号的KC认证证书</div>
                          </div>
                        </div>
                        {/* KC认证编号（安全） */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>KC认证编号（安全）</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Input placeholder="请输入" style={{ width: 400 }} />
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>请填写完整的KC认证编号。</div>
                          </div>
                        </div>
                        {/* 外包装/标签实拍图-韩国 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>外包装/标签实拍图-韩国</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              商品实物包装标签图需含KC标志、产品名称、原产国、制造商/进口商名称和地址信息，儿童用品需要包含适用年龄。
                            </div>
                          </div>
                        </div>
                        {/* CE认证 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>CE认证</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              请上传清晰符合法规要求的欧盟CE证书（如无韩国KC证书，请上传此证书）。
                            </div>
                          </div>
                        </div>
                        {/* 检测报告 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>检测报告</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              请上传清晰符合法规要求的欧盟CE检测报告（如无韩国KC资质，请上传此报告）。
                            </div>
                          </div>
                        </div>
                        {/* 中国3C认证 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>中国3C认证</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              相关品类的中国3C认证书是中国商品出口至相关国家市场的必要资质，同时也是证明商品质量优劣的重要参考。平台相关品类的合规管控会依据该资质，当前平台已开放中国3C认证证书的资质提交入口，请商家积极上传。
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 巴西 - 完整内容 */}
                      <div style={{ marginBottom: 48, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: '#262626' }}>巴西</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          玩具在巴西销售时需要符合巴西INMETRO的相关要求。
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* 巴西INMETRO认证 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>巴西INMETRO认证</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              请上传巴西INMETRO认证证书或官网收录截屏的清晰图片，大小需在3M之内
                            </div>
                          </div>
                        </div>
                        {/* 外包装/标签实拍图-巴西 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>外包装/标签实拍图-巴西</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              请上传包含生产企业名称和认证LOGO的清晰图片，大小需在3M之内
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 土耳其 - 完整内容 */}
                      <div style={{ marginBottom: 48, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: '#262626' }}>土耳其</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          请提交商品外包装标签实拍图，至少包括但不限于以下信息：土耳其责任人的名称、电子邮件或电话或网址；制造商和进口商（如适用）的名称、商标、商号和电子邮箱/URL，以及可以联系他们的联络地址或电子邮件地址/URL；清晰可见的商品识别码，如型号、批次/序列号或其他方式；清晰的警告和安全信息（如有，需要包含土耳其语言）。
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* 外包装/标签实拍图-土耳其 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>外包装/标签实拍图-土耳其</span>
                            <Tooltip title="查看土代标签模版样例">
                              <QuestionCircleOutlined style={{ marginLeft: 4, color: '#8C8C8C', cursor: 'pointer' }} />
                            </Tooltip>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              请提交商品外包装标签实拍图，至少包括但不限于以下信息：土耳其责任人的名称、电子邮件或电话或网址；制造商和进口商（如适用）的名称、商标、商号和电子邮箱/URL，以及可以联系他们的联络地址或电子邮件地址/URL；清晰可见的商品识别码，如型号、批次/序列号或其他方式；清晰的警告和安全信息（如有，需要包含土耳其语言）。点击"上传本地文件"左侧的问号可查看土代标签模版样例。
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 墨西哥 - 完整内容 */}
                      <div style={{ marginBottom: 24, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: '#262626' }}>墨西哥</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          平台拟进一步加强售往墨西哥的电子电器、玩具、医疗器械、保健食品、化妆品等品类的商品合规管控，商家需确保自己提供的商品符合墨西哥当地的相关法律法规要求。
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* 墨西哥NOM认证 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>墨西哥NOM认证</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>请上传清晰且有效的产品NOM认证证书。</div>
                          </div>
                        </div>
                        {/* 外包装/标签实拍图-墨西哥 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>外包装/标签实拍图-墨西哥</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Button icon={<PlusOutlined />}>上传本地文件</Button>
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              商品实物包装标签图需含NOM标志、产品名称、制造商/进口商名称和地址信息、原产国等。
                            </div>
                          </div>
                        </div>
                        {/* 墨西哥NOM证书编号 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>墨西哥NOM证书编号</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1 }}>
                            <Input placeholder="请输入" style={{ width: 400 }} />
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>请填写正确的NOM证书编号。</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'eu',
                  label: '欧盟资质',
                  children: (
                    <div style={{ padding: '24px 0', maxWidth: 840 }}>
                      {/* 欧盟说明 */}
                      <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                        销往欧盟的儿童玩具产品应满足玩具安全法规Toy safety Directive 2009/48/EU，无线电玩具还需满足无线指令Directive 2014/53/EU带要求，所有带电玩具满足RoHS指令Directive 2011/65/EU的相关要求，并向平台提供符合性声明文件及其他产品合规文件。
                        <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>
                          详细说明 &gt;&gt;
                        </Button>
                      </div>

                      {/* 检测报告 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>检测报告</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请上传产品的检测报告。
                          </div>
                        </div>
                      </div>

                      {/* 产品安全信息/警示语 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>产品安全信息/警示语</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Input.TextArea
                            placeholder="请输入"
                            rows={3}
                            style={{ width: 600 }}
                          />
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            （选填）如商品具有特殊的安全信息/警示语，请填写。请勿使用特殊符号（如引号、斜杠等），且长度勿超过200字符。
                          </div>
                        </div>
                      </div>

                      {/* REACH检测报告 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>REACH检测报告</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请提交商品的REACH检测报告。
                          </div>
                        </div>
                      </div>

                      {/* 欧盟CE-DoC */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>欧盟CE-DoC</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请提供产品的符合性声明文件。模版可参考：<br />
                            <a
                              href="https://files.alicdn.com/tpsservice/a529457f9bd1b290089a02a5b62ff924.docx?spm=a1zmmc.index.0.0.232d719dBQZhNx&file=a529457f9bd1b290089a02a5b62ff924.docx"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#1677FF' }}
                            >
                              https://files.alicdn.com/tpsservice/a529457f9bd1b290089a02a5b62ff924.docx?spm=a1zmmc.index.0.0.232d719dBQZhNx&file=a529457f9bd1b290089a02a5b62ff924.docx
                            </a>。
                          </div>
                        </div>
                      </div>

                      {/* 外包装/标签实拍图-欧盟 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>外包装/标签实拍图-欧盟</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请上传发往欧盟的商品包装实物图，应包含生产企业信息、欧盟责任人信息和CE标志
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'uk',
                  label: '英国资质',
                  children: (
                    <div style={{ padding: '24px 0', maxWidth: 840 }}>
                      {/* 英国说明 */}
                      <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                        根据欧盟/英国法规要求，销往欧盟市场的商品须上传外包装标签图，应标明如下信息：生产企业信息、和CE/UKCA标识（如适用）。商品资质的审核结果查询请访问资质中心【<a href="https://gsp.aliexpress.com/apps/product/qualitycenter?" target="_blank" rel="noopener noreferrer" style={{ color: '#1677FF' }}>https://gsp.aliexpress.com/apps/product/qualitycenter?</a>】
                        <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>
                          详细说明 &gt;&gt;
                        </Button>
                      </div>

                      {/* 外包装/标签实拍图-英国 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>外包装/标签实拍图-英国</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'kr',
                  label: '韩国资质',
                  children: (
                    <div style={{ padding: '24px 0', maxWidth: 840 }}>
                      {/* 韩国说明 */}
                      <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                        平台加强了售往韩国的儿童玩具、母婴产品、电子电器、小家电、运动户外、安全防护、家居用品、美容健康等品类的商品管控，商家需确保商品符合韩国当地的相关法律法规要求，请商家积极上传KC、CE或3C等该商品的全部认证，以便韩国消费者了解该产品的认证信息。
                        <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>
                          详细说明 &gt;&gt;
                        </Button>
                      </div>

                      {/* KC认证证书_安全 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>KC认证证书_安全</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请上传清晰且带KC认证编号的KC认证证书
                          </div>
                        </div>
                      </div>

                      {/* KC认证编号（安全） */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>KC认证编号（安全）</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Input placeholder="请输入" style={{ width: 400 }} />
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请填写完整的KC认证编号。
                          </div>
                        </div>
                      </div>

                      {/* 外包装/标签实拍图-韩国 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>外包装/标签实拍图-韩国</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            商品实物包装标签图需含KC标志、产品名称、原产国、制造商/进口商名称和地址信息，儿童用品需要包含适用年龄。
                          </div>
                        </div>
                      </div>

                      {/* CE认证 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>CE认证</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请上传清晰符合法规要求的欧盟CE证书（如无韩国KC证书，请上传此证书）。
                          </div>
                        </div>
                      </div>

                      {/* 检测报告 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>检测报告</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请上传清晰符合法规要求的欧盟CE检测报告（如无韩国KC资质，请上传此报告）。
                          </div>
                        </div>
                      </div>

                      {/* 中国3C认证 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>中国3C认证</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            相关品类的中国3C认证书是中国商品出口至相关国家市场的必要资质，同时也是证明商品质量优劣的重要参考。平台相关品类的合规管控会依据该资质，当前平台已开放中国3C认证证书的资质提交入口，请商家积极上传。
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'br',
                  label: '巴西资质',
                  children: (
                    <div style={{ padding: '24px 0', maxWidth: 840 }}>
                      {/* 巴西说明 */}
                      <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                        玩具在巴西销售时需要符合巴西INMETRO的相关要求。
                        <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>
                          详细说明 &gt;&gt;
                        </Button>
                      </div>

                      {/* 巴西INMETRO认证 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>巴西INMETRO认证</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请上传巴西INMETRO认证证书或官网收录截屏的清晰图片，大小需在3M之内
                          </div>
                        </div>
                      </div>

                      {/* 外包装/标签实拍图-巴西 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>外包装/标签实拍图-巴西</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请上传包含生产企业名称和认证LOGO的清晰图片，大小需在3M之内
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'tr',
                  label: '土耳其资质',
                  children: (
                    <div style={{ padding: '24px 0', maxWidth: 840 }}>
                      {/* 土耳其说明 */}
                      <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                        请提交商品外包装标签实拍图，至少包括但不限于以下信息：土耳其责任人的名称、电子邮件或电话或网址；制造商和进口商（如适用）的名称、商标、商号和电子邮箱/URL，以及可以联系他们的联络地址或电子邮件地址/URL；清晰可见的商品识别码，如型号、批次/序列号或其他方式；清晰的警告和安全信息（如有，需要包含土耳其语言）。
                        <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>
                          详细说明 &gt;&gt;
                        </Button>
                      </div>

                      {/* 外包装/标签实拍图-土耳其 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>外包装/标签实拍图-土耳其</span>
                          <Tooltip title="查看土代标签模版样例">
                            <QuestionCircleOutlined
                              style={{ marginLeft: 4, color: '#8C8C8C', cursor: 'pointer' }}
                            />
                          </Tooltip>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请提交商品外包装标签实拍图，至少包括但不限于以下信息：土耳其责任人的名称、电子邮件或电话或网址；制造商和进口商（如适用）的名称、商标、商号和电子邮箱/URL，以及可以联系他们的联络地址或电子邮件地址/URL；清晰可见的商品识别码，如型号、批次/序列号或其他方式；清晰的警告和安全信息（如有，需要包含土耳其语言）。点击"上传本地文件"左侧的问号可查看土代标签模版样例。
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'mx',
                  label: '墨西哥资质',
                  children: (
                    <div style={{ padding: '24px 0', maxWidth: 840 }}>
                      {/* 墨西哥说明 */}
                      <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                        平台拟进一步加强售往墨西哥的电子电器、玩具、医疗器械、保健食品、化妆品等品类的商品合规管控，商家需确保自己提供的商品符合墨西哥当地的相关法律法规要求。
                        <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>
                          详细说明 &gt;&gt;
                        </Button>
                      </div>

                      {/* 墨西哥NOM认证 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>墨西哥NOM认证</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请上传清晰且有效的产品NOM认证证书。
                          </div>
                        </div>
                      </div>

                      {/* 外包装/标签实拍图-墨西哥 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>外包装/标签实拍图-墨西哥</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Button icon={<PlusOutlined />}>上传本地文件</Button>
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            商品实物包装标签图需含NOM标志、产品名称、制造商/进口商名称和地址信息、原产国等。
                          </div>
                        </div>
                      </div>

                      {/* 墨西哥NOM证书编号 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 200, textAlign: 'right', paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>墨西哥NOM证书编号</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1 }}>
                          <Input placeholder="请输入" style={{ width: 400 }} />
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请填写正确的NOM证书编号。
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </Card>
                </div>
              )
            },
            {
              key: 'price',
              label: '价格与库存',
              forceRender: true,
              children: (
                <div
                  ref={setSectionRef('price')}
                  id="section-price"
                  data-section="price"
                  style={{ padding: '20px 40px 0', scrollMarginTop: 120 }}
                >
                  <Card
                    variant="borderless"
                    title={<span style={{ fontSize: 11, fontWeight: 'bold' }}>价格与库存</span>}
                    style={{ fontSize: 12 }}
                  >
                    {/* 最小计量单元 */}
                    <div style={{ marginBottom: 17 }}>
                      <div style={{ fontSize: 13, fontWeight: 'bold', color: '#262626', marginBottom: 12 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        最小计量单元
                      </div>
                      <Select
                        size="small"
                        style={{ width: 410 }}
                        value={minUnit}
                        onChange={setMinUnit}
                        options={[
                          { label: '件/个 (piece/pieces)', value: 'piece' },
                          { label: '套 (set/sets)', value: 'set' },
                          { label: '包 (pack/packs)', value: 'pack' },
                          { label: '盒 (box/boxes)', value: 'box' },
                          { label: '袋 (bag/bags)', value: 'bag' },
                          { label: '桶 (barrel/barrels)', value: 'barrel' },
                          { label: '蒲式耳 (bushel/bushels)', value: 'bushel' },
                          { label: '箱 (carton)', value: 'carton' },
                          { label: '厘米 (centimeter)', value: 'centimeter' },
                          { label: '组合 (combo)', value: 'combo' },
                          { label: '立方米 (cubic meter)', value: 'cubic_meter' },
                          { label: '打 (dozen)', value: 'dozen' },
                          { label: '英尺 (feet)', value: 'feet' },
                          { label: '加仑 (gallon)', value: 'gallon' },
                          { label: '克 (gram)', value: 'gram' },
                          { label: '英寸 (inch)', value: 'inch' },
                          { label: '千克 (kilogram)', value: 'kilogram' },
                          { label: '千升 (kiloliter)', value: 'kiloliter' },
                        ]}
                      />
                    </div>

                    {/* 销售方式 */}
                    <div style={{ marginBottom: 17 }}>
                      <div style={{ fontSize: 13, fontWeight: 'bold', color: '#262626', marginBottom: 12 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        销售方式
                      </div>
                      <Select
                        size="small"
                        style={{ width: 410 }}
                        value={salesMethod}
                        onChange={setSalesMethod}
                        options={[
                          { label: '按 件 出售', value: 'piece' },
                          { label: '打包出售（价格按照包计算）', value: 'pack' },
                        ]}
                      />
                    </div>

                    {/* 颜色 */}
                    <div style={{ marginBottom: 17 }}>
                      <div style={{ fontSize: 13, fontWeight: 'bold', color: '#262626', marginBottom: 12 }}>
                        颜色
                      </div>
                      <div style={{ display: 'flex', gap: 11 }}>
                        <Select
                          size="small"
                          style={{ width: 310 }}
                          placeholder="选择主色系"
                          value={colorSystem}
                          onChange={setColorSystem}
                          options={[
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(255, 255, 255)', border: '1px solid #d9d9d9', display: 'inline-block' }} />白色</span>, value: 'white' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(0, 0, 0)', display: 'inline-block' }} />黑色</span>, value: 'black' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(0, 112, 0)', display: 'inline-block' }} />green</span>, value: 'green' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(255, 0, 0)', display: 'inline-block' }} />红色</span>, value: 'red' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(153, 153, 153)', display: 'inline-block' }} />灰</span>, value: 'gray' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(0, 128, 255)', display: 'inline-block' }} />蓝色</span>, value: 'blue' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(255, 255, 0)', display: 'inline-block' }} />黄色</span>, value: 'yellow' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(255, 192, 203)', display: 'inline-block' }} />粉色</span>, value: 'pink' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(128, 0, 128)', display: 'inline-block' }} />紫色</span>, value: 'purple' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(204, 204, 204)', display: 'inline-block' }} />银色</span>, value: 'silver' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(255, 215, 0)', display: 'inline-block' }} />金</span>, value: 'gold' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(141, 100, 104)', display: 'inline-block' }} />赤褐色</span>, value: 'maroon' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(255, 165, 0)', display: 'inline-block' }} />橙色</span>, value: 'orange' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><img src="http://is.alicdn.com/wimg/seller/single/bg_post_color_block.gif" style={{ width: 10, height: 10 }} alt="" />透明色</span>, value: 'transparent' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><img src="http://is.alicdn.com/wimg/seller/single/bg_post_color_block.gif" style={{ width: 10, height: 10 }} alt="" />彩色</span>, value: 'colorful' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(144, 0, 32)', display: 'inline-block' }} />酒红色</span>, value: 'wine_red' },
                            { label: '紫罗兰', value: 'violet' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(255, 255, 224)', display: 'inline-block' }} />鹅黄色</span>, value: 'light_yellow' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(30, 221, 255)', display: 'inline-block' }} />天蓝</span>, value: 'sky_blue' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(189, 183, 107)', display: 'inline-block' }} />深卡其色</span>, value: 'dark_khaki' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(123, 63, 0)', display: 'inline-block' }} />巧克力色</span>, value: 'chocolate' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(142, 69, 133)', display: 'inline-block' }} />李子</span>, value: 'plum' },
                            { label: '深灰', value: 'dark_gray' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(144, 238, 144)', display: 'inline-block' }} />浅绿色</span>, value: 'light_green' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(0, 0, 139)', display: 'inline-block' }} />深蓝色</span>, value: 'dark_blue' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(211, 211, 211)', display: 'inline-block' }} />浅灰色</span>, value: 'light_gray' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(124, 140, 48)', display: 'inline-block' }} />军绿色</span>, value: 'army_green' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><img src="http://is.alicdn.com/wimg/seller/single/bg_post_color_block.gif" style={{ width: 10, height: 10 }} alt="" />多色</span>, value: 'multi' },
                            { label: '卡其色', value: 'khaki' },
                            { label: 'PEACOCK BLUE', value: 'peacock_blue' },
                            { label: 'APRICOT', value: 'apricot' },
                            { label: '柠檬黄', value: 'lemon_yellow' },
                            { label: 'MAROON', value: 'maroon_en' },
                            { label: '颜色', value: 'color' },
                            { label: '荧光绿色', value: 'fluorescent_green' },
                            { label: '荧光黄', value: 'fluorescent_yellow' },
                            { label: '海军蓝色', value: 'navy_blue' },
                            { label: '藕色', value: 'lotus_root' },
                            { label: '西瓜红色', value: 'watermelon_red' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(213, 180, 137)', display: 'inline-block' }} />香槟色</span>, value: 'champagne' },
                            { label: <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, background: 'rgb(181, 134, 84)', display: 'inline-block' }} />CAMEL</span>, value: 'camel' },
                          ]}
                        />
                        <Input
                          size="small"
                          style={{ width: 275 }}
                          placeholder="自定义名称"
                          value={customColorName}
                          onChange={(e) => setCustomColorName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* 大小 */}
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 'bold', color: '#262626', marginBottom: 12 }}>
                        大小
                      </div>
                      <Checkbox.Group
                        value={selectedSizes}
                        onChange={setSelectedSizes}
                        style={{ width: '100%' }}
                      >
                          {/* 第一行 */}
                          <div style={{ display: 'flex', gap: 11, marginBottom: 11 }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="12cm">12厘米</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="40cm_plus">40厘米以上</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="14cm">14厘米</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="8cm">8厘米</Checkbox>
                            </div>
                          </div>

                          {/* 第二行 */}
                          <div style={{ display: 'flex', gap: 11, marginBottom: 11 }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="10cm">10厘米</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="25cm">25厘米</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="40cm_exact">40cm</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="18cm">18厘米</Checkbox>
                            </div>
                          </div>

                          {/* 第三行 */}
                          <div style={{ display: 'flex', gap: 11, marginBottom: 11 }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="8cm_minus">8厘米以下</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="3inch">3英寸</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="6inch">6英寸</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="12inch">12英寸</Checkbox>
                            </div>
                          </div>

                          {/* 第四行 */}
                          <div style={{ display: 'flex', gap: 11, marginBottom: 11 }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="one_size">One Size</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="small">小号</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="medium">中号</Checkbox>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="large">大号</Checkbox>
                            </div>
                          </div>

                          {/* 第五行 */}
                          <div style={{ display: 'flex', gap: 11 }}>
                            <div style={{ display: 'flex', alignItems: 'center', width: 295 }}>
                              <Checkbox value="other">其它</Checkbox>
                            </div>
                          </div>
                      </Checkbox.Group>
                    </div>

                    {/* 插头类型 */}
                    <div style={{ marginTop: 17 }}>
                      <div style={{ fontSize: 13, fontWeight: 'bold', color: '#262626', marginBottom: 12 }}>
                        插头类型
                      </div>
                      <Button
                        size="small"
                        style={{ width: 100 }}
                        onClick={() => setPlugTypeModalVisible(true)}
                      >
                        设置
                      </Button>
                      {selectedPlugTypes.length > 0 && (
                        <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                          已选 {selectedPlugTypes.length} 项
                        </div>
                      )}
                    </div>

                    {/* 发货地 */}
                    <div style={{ marginTop: 17 }}>
                      <div style={{ fontSize: 13, fontWeight: 'bold', color: '#262626', marginBottom: 12 }}>
                        发货地
                      </div>
                      <Button
                        size="small"
                        style={{ width: 100 }}
                        onClick={() => setShippingLocationModalVisible(true)}
                      >
                        设置
                      </Button>
                      {selectedShippingLocations.length > 0 && (
                        <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                          已选 {selectedShippingLocations.length} 项
                        </div>
                      )}
                    </div>

                    {/* 价格库存表格 */}
                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
                      {/* 提示信息和批量填充 */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'center' }}>
                        <div style={{ fontSize: 12, color: '#262626' }}>
                          请参考<a href="#" style={{ color: '#1677ff' }}>重量和尺寸测量规范示例</a>准确测量和填写重量和包装尺寸。
                        </div>
                        <Button size="small" style={{ fontSize: 12 }}>批量填充</Button>
                      </div>

                      {/* 表格 */}
                      <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
                        {/* 表头 */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '120px 120px 120px 120px 100px 280px 120px 120px',
                          background: '#fafafa',
                          borderBottom: '1px solid #d9d9d9',
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}>
                          <div style={{ padding: '12px 8px', borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                            零售价(CNY)
                          </div>
                          <div style={{ padding: '12px 8px', borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            货值(CNY)
                            <Tooltip title="帮助信息">
                              <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>ⓘ</span>
                            </Tooltip>
                          </div>
                          <div style={{ padding: '12px 8px', borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                            商家仓库存
                          </div>
                          <div style={{ padding: '12px 8px', borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                            是否预销
                            <Tooltip title="帮助信息">
                              <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>ⓘ</span>
                            </Tooltip>
                          </div>
                          <div style={{ padding: '12px 8px', borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                            重量 (kg)
                            <Tooltip title="帮助信息">
                              <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>ⓘ</span>
                            </Tooltip>
                          </div>
                          <div style={{ padding: '12px 8px', borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                            包装尺寸 (cm)
                            <Tooltip title="帮助信息">
                              <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>ⓘ</span>
                            </Tooltip>
                          </div>
                          <div style={{ padding: '12px 8px', borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            特殊商品类型
                            <Tooltip title="帮助信息">
                              <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>ⓘ</span>
                            </Tooltip>
                          </div>
                          <div style={{ padding: '12px 8px', display: 'flex', alignItems: 'center' }}>
                            SKU编码
                          </div>
                        </div>

                        {/* 输入行 */}
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: '120px 120px 120px 120px 100px 280px 120px 120px',
                          fontSize: 12,
                          minHeight: 40
                        }}>
                          <div style={{ padding: 8, borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <Input
                              size="small"
                              value={retailPrice}
                              onChange={(e) => setRetailPrice(e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div style={{ padding: 8, borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <Input
                              size="small"
                              value={productValue}
                              onChange={(e) => setProductValue(e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div style={{ padding: 8, borderRight: '1px solid #d9d9d9', position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Input
                              size="small"
                              value={inventory}
                              onChange={(e) => setInventory(e.target.value)}
                              style={{ width: '100%', borderColor: '#ff4d4f' }}
                            />
                            <div style={{
                              position: 'absolute',
                              bottom: -18,
                              left: 8,
                              color: '#ff4d4f',
                              fontSize: 11,
                              whiteSpace: 'nowrap'
                            }}>
                              必填项
                            </div>
                          </div>
                          <div style={{ padding: 8, borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <Select
                              size="small"
                              placeholder="是否预销"
                              value={isPresale}
                              onChange={setIsPresale}
                              style={{ width: '100%' }}
                              options={[
                                { label: '是', value: 'yes' },
                                { label: '否', value: 'no' },
                              ]}
                            />
                          </div>
                          <div style={{ padding: 8, borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <Input
                              size="small"
                              placeholder="重量"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                              style={{ width: '100%' }}
                            />
                          </div>
                          <div style={{ padding: 8, borderRight: '1px solid #d9d9d9', display: 'flex', gap: 4, alignItems: 'center', position: 'relative' }}>
                            <Input
                              size="small"
                              placeholder="长"
                              value={packageLength}
                              onChange={(e) => setPackageLength(e.target.value)}
                              style={{ width: 70, borderColor: '#ff4d4f' }}
                            />
                            <span>×</span>
                            <Input
                              size="small"
                              placeholder="宽"
                              value={packageWidth}
                              onChange={(e) => setPackageWidth(e.target.value)}
                              style={{ width: 70, borderColor: '#ff4d4f' }}
                            />
                            <span>×</span>
                            <Input
                              size="small"
                              placeholder="高"
                              value={packageHeight}
                              onChange={(e) => setPackageHeight(e.target.value)}
                              style={{ width: 70, borderColor: '#ff4d4f' }}
                            />
                            <div style={{
                              position: 'absolute',
                              bottom: -18,
                              left: 8,
                              color: '#ff4d4f',
                              fontSize: 11,
                              whiteSpace: 'nowrap'
                            }}>
                              长必填、宽必填、高必填
                            </div>
                          </div>
                          <div style={{ padding: 8, borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center' }}>
                            <Select
                              size="small"
                              placeholder="普货"
                              value={productType}
                              onChange={setProductType}
                              style={{ width: '100%' }}
                              options={[
                                { label: '普货', value: 'normal' },
                                { label: '特殊商品', value: 'special' },
                              ]}
                            />
                          </div>
                          <div style={{ padding: 8, position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Input
                              size="small"
                              value={skuCode}
                              onChange={(e) => setSkuCode(e.target.value)}
                              maxLength={50}
                              style={{ width: '100%' }}
                            />
                            <div style={{
                              position: 'absolute',
                              bottom: -18,
                              right: 8,
                              color: '#8c8c8c',
                              fontSize: 11,
                              whiteSpace: 'nowrap'
                            }}>
                              {skuCode.length}/50
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 区域零售价 */}
                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
                      <div style={{ fontSize: 13, fontWeight: 'bold', color: '#262626', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        区域零售价
                        <Tooltip title="为不同国家/地区设置不同的零售价">
                          <span style={{ color: '#8c8c8c', cursor: 'help', fontSize: 14 }}>ⓘ</span>
                        </Tooltip>
                      </div>

                      <Select
                        size="small"
                        placeholder="请选择"
                        style={{ width: '100%' }}
                        value={selectedRegions.length > 0 ? '已选择' : undefined}
                        onClick={() => setRegionalPriceModalVisible(true)}
                        open={false}
                      />

                      {selectedRegions.length > 0 && (
                        <div style={{ marginTop: 16 }}>
                          {/* 调价方式 */}
                          <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 13, fontWeight: 'bold', color: '#262626', marginBottom: 12 }}>
                              调价方式
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Select
                                size="small"
                                style={{ width: 400 }}
                                value={priceAdjustMethod}
                                onChange={setPriceAdjustMethod}
                                options={[
                                  { label: '直接报价', value: 'direct' },
                                  { label: '调整比例', value: 'ratio' },
                                  { label: '调整金额', value: 'amount' },
                                ]}
                              />
                              <Button size="small">批量填充</Button>
                            </div>
                          </div>

                          {/* 价格表格 */}
                          <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, overflowX: 'auto' }}>
                            <div style={{ display: 'flex', minWidth: 'max-content' }}>
                              {selectedRegions.map((region) => {
                                const regionNames: Record<string, string> = {
                                  'ru': '俄罗斯', 'es': '西班牙', 'fr': '法国', 'br': '巴西', 'us': '美国', 'kr': '韩国',
                                  'sa': '沙特阿拉伯', 'il': '以色列', 'mx': '墨西哥', 'cl': '智利', 'ua': '乌克兰', 'pl': '波兰',
                                  'by': '白俄罗斯', 'de': '德国', 'uk': '英国', 'nl': '荷兰', 'it': '意大利', 'jp': '日本',
                                  'au': '澳大利亚', 'ca': '加拿大', 'id': '印度尼西亚', 'my': '马来西亚', 'ph': '菲律宾',
                                  'vn': '越南', 'sg': '新加坡', 'th': '泰国', 'ae': '阿联酋', 'tr': '土耳其', 'pt': '葡萄牙',
                                  'be': '比利时', 'co': '哥伦比亚', 'ma': '摩洛哥', 'ch': '瑞士', 'cz': '捷克共和国',
                                  'nz': '新西兰', 'lt': '立陶宛', 'lv': '拉脱维亚', 'sk': '斯洛伐克共和国', 'no': '挪威',
                                  'hu': '匈牙利', 'bg': '保加利亚', 'ee': '爱沙尼亚', 'ro': '罗马尼亚', 'pk': '巴基斯坦',
                                  'hr': '克罗地亚', 'ng': '尼日利亚', 'ie': '爱尔兰', 'at': '奥地利', 'gr': '希腊',
                                  'si': '斯洛文尼亚', 'mt': '马耳他', 'fi': '芬兰', 'dk': '丹麦', 'lu': '卢森堡',
                                  'lk': '斯里兰卡'
                                }

                                return (
                                  <div
                                    key={region}
                                    style={{
                                      width: 220,
                                      borderRight: '1px solid #d9d9d9',
                                      flexShrink: 0
                                    }}
                                  >
                                    {/* 表头 */}
                                    <div style={{
                                      padding: '12px 8px',
                                      background: '#fafafa',
                                      borderBottom: '1px solid #d9d9d9',
                                      fontSize: 12,
                                      fontWeight: 'bold',
                                      textAlign: 'center'
                                    }}>
                                      {regionNames[region] || region} 零售价(CNY)
                                    </div>

                                    {/* 输入区域 */}
                                    <div style={{ padding: 8 }}>
                                      {priceAdjustMethod === 'direct' && (
                                        <Input
                                          size="small"
                                          value={regionalPrices[region] || ''}
                                          onChange={(e) => setRegionalPrices({ ...regionalPrices, [region]: e.target.value })}
                                          style={{ width: '100%' }}
                                        />
                                      )}

                                      {priceAdjustMethod === 'ratio' && (
                                        <div>
                                          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 8 }}>
                                            <Select
                                              size="small"
                                              style={{ width: 50 }}
                                              value={regionalPriceAdjustments[region]?.operator || '+'}
                                              onChange={(value) => {
                                                setRegionalPriceAdjustments({
                                                  ...regionalPriceAdjustments,
                                                  [region]: { ...regionalPriceAdjustments[region], operator: value }
                                                })
                                              }}
                                              options={[
                                                { label: '+', value: '+' },
                                                { label: '-', value: '-' },
                                              ]}
                                            />
                                            <Input
                                              size="small"
                                              style={{ flex: 1 }}
                                              value={regionalPriceAdjustments[region]?.value || ''}
                                              onChange={(e) => {
                                                setRegionalPriceAdjustments({
                                                  ...regionalPriceAdjustments,
                                                  [region]: { operator: regionalPriceAdjustments[region]?.operator || '+', value: e.target.value }
                                                })
                                              }}
                                            />
                                            <span>%</span>
                                          </div>
                                          <div style={{ textAlign: 'center', color: '#8c8c8c', fontSize: 12 }}>
                                            0.00
                                          </div>
                                        </div>
                                      )}

                                      {priceAdjustMethod === 'amount' && (
                                        <div>
                                          <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 8 }}>
                                            <Select
                                              size="small"
                                              style={{ width: 50 }}
                                              value={regionalPriceAdjustments[region]?.operator || '+'}
                                              onChange={(value) => {
                                                setRegionalPriceAdjustments({
                                                  ...regionalPriceAdjustments,
                                                  [region]: { ...regionalPriceAdjustments[region], operator: value }
                                                })
                                              }}
                                              options={[
                                                { label: '+', value: '+' },
                                                { label: '-', value: '-' },
                                              ]}
                                            />
                                            <Input
                                              size="small"
                                              style={{ flex: 1 }}
                                              value={regionalPriceAdjustments[region]?.value || ''}
                                              onChange={(e) => {
                                                setRegionalPriceAdjustments({
                                                  ...regionalPriceAdjustments,
                                                  [region]: { operator: regionalPriceAdjustments[region]?.operator || '+', value: e.target.value }
                                                })
                                              }}
                                            />
                                          </div>
                                          <div style={{ textAlign: 'center', color: '#8c8c8c', fontSize: 12 }}>
                                            0.00
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 批发价 */}
                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
                      <div style={{ fontSize: 13, fontWeight: 'bold', color: '#262626', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        批发价
                        <Tooltip title="设置起批量和批发折扣">
                          <span style={{ color: '#8c8c8c', cursor: 'help', fontSize: 14 }}>ⓘ</span>
                        </Tooltip>
                      </div>

                      <Checkbox
                        checked={wholesaleEnabled}
                        onChange={(e) => setWholesaleEnabled(e.target.checked)}
                      >
                        支持
                      </Checkbox>

                      {wholesaleEnabled && (
                        <div style={{ marginTop: 16 }}>
                          {/* 批发设置说明 */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontSize: 12 }}>
                            <span>支持  设置起批量为</span>
                            <Input
                              size="small"
                              style={{ width: 120 }}
                              value={wholesaleMinQuantity}
                              onChange={(e) => setWholesaleMinQuantity(e.target.value)}
                            />
                            <span>件，批发价会在零售价基础上减免</span>
                            <Input
                              size="small"
                              style={{ width: 80 }}
                              value={wholesaleDiscount}
                              onChange={(e) => setWholesaleDiscount(e.target.value)}
                            />
                            <span>%off，即{wholesaleDiscount ? (100 - parseFloat(wholesaleDiscount || '0')) / 10 : 9.90} 折。</span>
                          </div>

                          {/* 批发价表格 */}
                          <div style={{ border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }}>
                            {/* 表头 */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '360px 360px 360px',
                              background: '#F0F0F0',
                              borderBottom: '1px solid #d9d9d9',
                              fontSize: 12,
                              fontWeight: 'bold',
                              color: '#262626'
                            }}>
                              <div style={{ padding: '12px 16px', borderRight: '1px solid #d9d9d9' }}>
                                零售价
                              </div>
                              <div style={{ padding: '12px 16px', borderRight: '1px solid #d9d9d9' }}>
                                起批量(件)
                              </div>
                              <div style={{ padding: '12px 16px' }}>
                                批发价
                              </div>
                            </div>

                            {/* 内容行 */}
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: '360px 360px 360px',
                              fontSize: 12,
                              background: '#fff'
                            }}>
                              <div style={{ padding: '16px', borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', minHeight: 52 }}>
                                {/* 零售价会自动显示 */}
                              </div>
                              <div style={{ padding: '16px', borderRight: '1px solid #d9d9d9', display: 'flex', alignItems: 'center', minHeight: 52 }}>
                                {/* 起批量会自动显示 */}
                              </div>
                              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', minHeight: 52 }}>
                                <span style={{ color: '#262626' }}>0.00</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              )
            },
            {
              key: 'description',
              label: '详细描述',
              forceRender: true,
              children: (
                <div
                  ref={setSectionRef('description')}
                  id="section-description"
                  data-section="description"
                  style={{ padding: '20px 40px 0', scrollMarginTop: 120, textAlign: 'center', color: '#8C8C8C' }}
                >
                  详细描述模块开发中...
                </div>
              )
            },
            {
              key: 'package',
              label: '包装与物流',
              forceRender: true,
              children: (
                <div
                  ref={setSectionRef('package')}
                  id="section-package"
                  data-section="package"
                  style={{ padding: '20px 40px 0', scrollMarginTop: 120, textAlign: 'center', color: '#8C8C8C' }}
                >
                  包装与物流模块开发中...
                </div>
              )
            },
            {
              key: 'other',
              label: '其它设置',
              forceRender: true,
              children: (
                <div
                  ref={setSectionRef('other')}
                  id="section-other"
                  data-section="other"
                  style={{ padding: '20px 40px 0', scrollMarginTop: 120, textAlign: 'center', color: '#8C8C8C' }}
                >
                  其它设置模块开发中...
                </div>
              )
            }
        ]}
      />

      <style jsx global>{`
        .product-create-sections .ant-tabs-content {
          display: block;
        }
        .product-create-sections .ant-tabs-tabpane {
          display: block !important;
          height: auto !important;
        }
      `}</style>

      {/* 图片上传弹窗 */}
      <ImageUploadModal
        visible={imageUploadModalVisible}
        onClose={() => setImageUploadModalVisible(false)}
        onConfirm={(images) => {
          // TODO: 根据 currentUploadTarget 保存图片到对应位置
          console.log('选中的图片:', images)
          console.log('上传目标:', currentUploadTarget)
          setImageUploadModalVisible(false)
        }}
        maxCount={1}
        sizeLimit={5}
        minDimensions={{ width: 800, height: 800 }}
        acceptFormats={['jpg', 'jpeg', 'png']}
        folder="商品发布"
      />

      {/* 视频上传弹窗 */}
      <VideoUploadModal
        visible={videoUploadModalVisible}
        onClose={() => setVideoUploadModalVisible(false)}
        onConfirm={(video) => {
          // TODO: 保存视频信息
          console.log('选中的视频:', video)
          setVideoUploadModalVisible(false)
        }}
      />

      {/* 海关监管属性抽屉 */}
      <Drawer
        title="海关监管属性"
        placement="right"
        open={customsDrawerVisible}
        onClose={() => setCustomsDrawerVisible(false)}
        size="large"
        styles={{ body: { paddingTop: 24 } }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={() => setCustomsDrawerVisible(false)}
              style={{ marginRight: 8 }}
            >
              取消
            </Button>
            <Button
              type="primary"
              onClick={() => {
                // TODO: 保存海关监管属性
                setCustomsDrawerVisible(false)
              }}
            >
              确定
            </Button>
          </div>
        }
      >
        {/* 提示信息 */}
        <Alert
          description="您的商品将基于您填写的海关监管属性（请参考美国海关监管属性规范）进行美国海关进口申报，因此 请务必如实填写，否则您将承担因此导致的清关失败后果及相关责任。"
          type="info"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />

        {/* TODO: 添加海关监管属性表单内容 */}
        <div style={{ minHeight: 400 }}>
          {/* 这里将添加海关监管属性的表单字段 */}
        </div>
      </Drawer>

      {/* 插头类型选择Modal */}
      <Modal
        title="请选择"
        open={plugTypeModalVisible}
        onCancel={() => setPlugTypeModalVisible(false)}
        width={1200}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Button onClick={() => setPlugTypeModalVisible(false)}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                setPlugTypeModalVisible(false)
              }}
            >
              确定
            </Button>
          </div>
        }
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <Input
                placeholder="搜索"
                prefix={<span>🔍</span>}
                style={{ width: 500 }}
                value={plugTypeSearch}
                onChange={(e) => setPlugTypeSearch(e.target.value)}
              />
              <Checkbox
                checked={selectedPlugTypes.length === 4}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedPlugTypes(['usb', 'battery', 'eu_plug', 'us_plug'])
                  } else {
                    setSelectedPlugTypes([])
                  }
                }}
              >
                全选
              </Checkbox>
            </div>
            <div style={{ color: '#8C8C8C' }}>已选{selectedPlugTypes.length}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 20px' }}>
            <Checkbox
              checked={selectedPlugTypes.includes('usb')}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedPlugTypes([...selectedPlugTypes, 'usb'])
                } else {
                  setSelectedPlugTypes(selectedPlugTypes.filter(t => t !== 'usb'))
                }
              }}
            >
              USB
            </Checkbox>
            <Checkbox
              checked={selectedPlugTypes.includes('battery')}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedPlugTypes([...selectedPlugTypes, 'battery'])
                } else {
                  setSelectedPlugTypes(selectedPlugTypes.filter(t => t !== 'battery'))
                }
              }}
            >
              纽扣电池
            </Checkbox>
            <Checkbox
              checked={selectedPlugTypes.includes('eu_plug')}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedPlugTypes([...selectedPlugTypes, 'eu_plug'])
                } else {
                  setSelectedPlugTypes(selectedPlugTypes.filter(t => t !== 'eu_plug'))
                }
              }}
            >
              eu plug
            </Checkbox>
            <Checkbox
              checked={selectedPlugTypes.includes('us_plug')}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedPlugTypes([...selectedPlugTypes, 'us_plug'])
                } else {
                  setSelectedPlugTypes(selectedPlugTypes.filter(t => t !== 'us_plug'))
                }
              }}
            >
              美规
            </Checkbox>
          </div>
        </div>
      </Modal>

      {/* 发货地选择Modal */}
      <Modal
        title="请选择"
        open={shippingLocationModalVisible}
        onCancel={() => setShippingLocationModalVisible(false)}
        width={1200}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Button onClick={() => setShippingLocationModalVisible(false)}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                setShippingLocationModalVisible(false)
              }}
            >
              确定
            </Button>
          </div>
        }
      >
        <div style={{ padding: '20px 0' }}>
          {/* 提示信息 */}
          <Alert
            description={
              <span>
                中国大陆发货地不可和非中国大陆发货地同时勾选，具体可点击《
                <a href="#" style={{ color: '#1677ff' }}>全球速卖通商品发货地属性变更规则</a>
                》
              </span>
            }
            type="info"
            showIcon
            closable
            style={{ marginBottom: 20 }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <Input
                placeholder="搜索"
                prefix={<span>🔍</span>}
                style={{ width: 400 }}
                value={shippingLocationSearch}
                onChange={(e) => setShippingLocationSearch(e.target.value)}
              />
              <Checkbox
                checked={selectedShippingLocations.length === 28}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedShippingLocations([
                      'jp', 'ca', 'ng', 'za', 'cn', 'cl', 'br', 'tr',
                      'ua', 'ae', 'il', 'cz', 'pl', 'us', 'uk', 'de',
                      'es', 'au', 'ru', 'id', 'fr', 'it', 'vn', 'hu',
                      'lv', 'sa', 'be', 'kr'
                    ])
                  } else {
                    setSelectedShippingLocations([])
                  }
                }}
              >
                全选
              </Checkbox>
            </div>
            <div style={{ color: '#8C8C8C' }}>已选{selectedShippingLocations.length}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 20px' }}>
            {[
              { label: '日本(JP)', value: 'jp' },
              { label: '加拿大(CA)', value: 'ca' },
              { label: '尼日利亚(NG)', value: 'ng' },
              { label: '南非(ZA)', value: 'za' },
              { label: '中国大陆', value: 'cn' },
              { label: '智利(CL)', value: 'cl' },
              { label: '巴西(BR)', value: 'br' },
              { label: '土耳其(TR)', value: 'tr' },
              { label: '乌克兰(UA)', value: 'ua' },
              { label: '阿联酋(AE)', value: 'ae' },
              { label: '以色列(IL)', value: 'il' },
              { label: '捷克', value: 'cz' },
              { label: '波兰(PL)', value: 'pl' },
              { label: '美国(US)', value: 'us' },
              { label: '英国(UK)', value: 'uk' },
              { label: '德国(DE)', value: 'de' },
              { label: '西班牙(ES)', value: 'es' },
              { label: '澳大利亚(AU)', value: 'au' },
              { label: '俄罗斯(RU)', value: 'ru' },
              { label: '印度尼西亚(ID)', value: 'id' },
              { label: '法国(FR)', value: 'fr' },
              { label: '意大利(IT)', value: 'it' },
              { label: '越南(VN)', value: 'vn' },
              { label: '匈牙利(HU)', value: 'hu' },
              { label: '拉脱维亚(LV)', value: 'lv' },
              { label: '沙特阿拉伯(SA)', value: 'sa' },
              { label: '比利时(BE)', value: 'be' },
              { label: '韩国(KR)', value: 'kr' },
            ].map((country) => (
              <Checkbox
                key={country.value}
                checked={selectedShippingLocations.includes(country.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedShippingLocations([...selectedShippingLocations, country.value])
                  } else {
                    setSelectedShippingLocations(selectedShippingLocations.filter(l => l !== country.value))
                  }
                }}
              >
                {country.label}
              </Checkbox>
            ))}
          </div>
        </div>
      </Modal>

      {/* 区域零售价选择Modal */}
      <Modal
        title="请选择"
        open={regionalPriceModalVisible}
        onCancel={() => setRegionalPriceModalVisible(false)}
        width={900}
        footer={
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
            <Button onClick={() => setRegionalPriceModalVisible(false)}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                setRegionalPriceModalVisible(false)
              }}
            >
              确定
            </Button>
          </div>
        }
      >
        <div style={{ padding: '20px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              <Input
                placeholder="搜索"
                prefix={<span>🔍</span>}
                style={{ width: 400 }}
                value={regionalPriceSearch}
                onChange={(e) => setRegionalPriceSearch(e.target.value)}
              />
              <Checkbox
                checked={selectedRegions.length === 48}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRegions([
                      'ru', 'es', 'fr', 'br', 'us', 'kr', 'sa', 'il', 'mx', 'cl', 'ua', 'pl',
                      'by', 'de', 'uk', 'nl', 'it', 'jp', 'au', 'ca', 'id', 'my', 'ph', 'vn',
                      'sg', 'th', 'ae', 'tr', 'pt', 'be', 'co', 'ma', 'ch', 'cz', 'nz', 'lt',
                      'lv', 'sk', 'no', 'hu', 'bg', 'ee', 'ro', 'pk', 'hr', 'ng', 'ie', 'at',
                      'gr', 'si', 'mt', 'fi', 'dk', 'lu', 'lk'
                    ])
                  } else {
                    setSelectedRegions([])
                  }
                }}
              >
                全选
              </Checkbox>
            </div>
            <div style={{ color: '#8C8C8C' }}>已选{selectedRegions.length}</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px 20px' }}>
            {[
              { label: '俄罗斯', value: 'ru' },
              { label: '西班牙', value: 'es' },
              { label: '法国', value: 'fr' },
              { label: '巴西', value: 'br' },
              { label: '美国', value: 'us' },
              { label: '韩国', value: 'kr' },
              { label: '沙特阿拉伯', value: 'sa' },
              { label: '以色列', value: 'il' },
              { label: '墨西哥', value: 'mx' },
              { label: '智利', value: 'cl' },
              { label: '乌克兰', value: 'ua' },
              { label: '波兰', value: 'pl' },
              { label: '白俄罗斯', value: 'by' },
              { label: '德国', value: 'de' },
              { label: '英国', value: 'uk' },
              { label: '荷兰', value: 'nl' },
              { label: '意大利', value: 'it' },
              { label: '日本', value: 'jp' },
              { label: '澳大利亚', value: 'au' },
              { label: '加拿大', value: 'ca' },
              { label: '印度尼西亚', value: 'id' },
              { label: '马来西亚', value: 'my' },
              { label: '菲律宾', value: 'ph' },
              { label: '越南', value: 'vn' },
              { label: '新加坡', value: 'sg' },
              { label: '泰国', value: 'th' },
              { label: '阿联酋', value: 'ae' },
              { label: '土耳其', value: 'tr' },
              { label: '葡萄牙', value: 'pt' },
              { label: '比利时', value: 'be' },
              { label: '哥伦比亚', value: 'co' },
              { label: '摩洛哥', value: 'ma' },
              { label: '瑞士', value: 'ch' },
              { label: '捷克共和国', value: 'cz' },
              { label: '新西兰', value: 'nz' },
              { label: '立陶宛', value: 'lt' },
              { label: '拉脱维亚', value: 'lv' },
              { label: '斯洛伐克共和国', value: 'sk' },
              { label: '挪威', value: 'no' },
              { label: '匈牙利', value: 'hu' },
              { label: '保加利亚', value: 'bg' },
              { label: '爱沙尼亚', value: 'ee' },
              { label: '罗马尼亚', value: 'ro' },
              { label: '巴基斯坦', value: 'pk' },
              { label: '克罗地亚', value: 'hr' },
              { label: '尼日利亚', value: 'ng' },
              { label: '爱尔兰', value: 'ie' },
              { label: '奥地利', value: 'at' },
              { label: '希腊', value: 'gr' },
              { label: '斯洛文尼亚', value: 'si' },
              { label: '马耳他', value: 'mt' },
              { label: '芬兰', value: 'fi' },
              { label: '丹麦', value: 'dk' },
              { label: '卢森堡', value: 'lu' },
              { label: '斯里兰卡', value: 'lk' },
            ].map((country) => (
              <Checkbox
                key={country.value}
                checked={selectedRegions.includes(country.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRegions([...selectedRegions, country.value])
                  } else {
                    setSelectedRegions(selectedRegions.filter(r => r !== country.value))
                  }
                }}
              >
                {country.label}
              </Checkbox>
            ))}
          </div>
        </div>
      </Modal>
    </HeaderOnlyLayout>
  )
}
