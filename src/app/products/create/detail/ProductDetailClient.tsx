'use client'

import { useState, useEffect } from 'react'
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
  Tabs
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
      <div style={{ padding: '17px 40px' }}>
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
                    <div style={{ minHeight: 200, padding: '24px 0' }}>
                      {/* TODO: 这里将显示所有国家的资质信息 */}
                      <div style={{ color: '#8C8C8C', textAlign: 'center' }}>
                        暂无资质信息
                      </div>
                    </div>
                  )
                },
                {
                  key: 'eu',
                  label: '欧盟资质',
                  children: (
                    <div style={{ minHeight: 200, padding: '24px 0' }}>
                      {/* TODO: 欧盟资质内容 */}
                      <div style={{ color: '#8C8C8C', textAlign: 'center' }}>
                        暂无欧盟资质信息
                      </div>
                    </div>
                  )
                },
                {
                  key: 'uk',
                  label: '英国资质',
                  children: (
                    <div style={{ minHeight: 200, padding: '24px 0' }}>
                      {/* TODO: 英国资质内容 */}
                      <div style={{ color: '#8C8C8C', textAlign: 'center' }}>
                        暂无英国资质信息
                      </div>
                    </div>
                  )
                },
                {
                  key: 'kr',
                  label: '韩国资质',
                  children: (
                    <div style={{ minHeight: 200, padding: '24px 0' }}>
                      {/* TODO: 韩国资质内容 */}
                      <div style={{ color: '#8C8C8C', textAlign: 'center' }}>
                        暂无韩国资质信息
                      </div>
                    </div>
                  )
                },
                {
                  key: 'br',
                  label: '巴西资质',
                  children: (
                    <div style={{ minHeight: 200, padding: '24px 0' }}>
                      {/* TODO: 巴西资质内容 */}
                      <div style={{ color: '#8C8C8C', textAlign: 'center' }}>
                        暂无巴西资质信息
                      </div>
                    </div>
                  )
                },
                {
                  key: 'tr',
                  label: '土耳其资质',
                  children: (
                    <div style={{ minHeight: 200, padding: '24px 0' }}>
                      {/* TODO: 土耳其资质内容 */}
                      <div style={{ color: '#8C8C8C', textAlign: 'center' }}>
                        暂无土耳其资质信息
                      </div>
                    </div>
                  )
                },
                {
                  key: 'mx',
                  label: '墨西哥资质',
                  children: (
                    <div style={{ minHeight: 200, padding: '24px 0' }}>
                      {/* TODO: 墨西哥资质内容 */}
                      <div style={{ color: '#8C8C8C', textAlign: 'center' }}>
                        暂无墨西哥资质信息
                      </div>
                    </div>
                  )
                }
              ]}
            />
          </div>
        </Card>
      </div>

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
    </HeaderOnlyLayout>
  )
}
