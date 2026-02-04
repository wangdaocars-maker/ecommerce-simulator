'use client'

import { useState, useEffect, useCallback } from 'react'
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
  Spin
} from 'antd'
import {
  QuestionCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  RightOutlined
} from '@ant-design/icons'
import HeaderOnlyLayout from '@/components/layout/HeaderOnlyLayout'
import type { Category } from '@/types/category'
import { normalizeCategoryResponse } from '@/lib/category-utils'

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

export default function ProductCreateClient() {
  const router = useRouter()
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [language, setLanguage] = useState('zh')
  const [title, setTitle] = useState('')
  const [countryTitles, setCountryTitles] = useState<Record<string, string>>({})
  const [category, setCategory] = useState('')
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<Category[]>([])
  const [tempCategoryPath, setTempCategoryPath] = useState<Category[]>([])
  const [countryImages, setCountryImages] = useState<Record<string, string[]>>({})

  // 类目数据状态
  const [categoryData, setCategoryData] = useState<Category[]>([])
  const [categoryLoading, setCategoryLoading] = useState(false)

  // 获取类目数据
  const fetchCategories = useCallback(async () => {
    setCategoryLoading(true)
    try {
      const res = await fetch('/api/categories')
      const result = await res.json()
      if (result.success) {
        setCategoryData(normalizeCategoryResponse(result))
      } else {
        message.error(result.error || '获取类目失败')
      }
    } catch (error) {
      console.error('获取类目失败:', error)
      message.error('网络错误，请稍后重试')
    } finally {
      setCategoryLoading(false)
    }
  }, [])

  // 初始加载类目
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

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
  const handleCategorySelect = (cat: Category, level: number) => {
    const newPath = [...tempCategoryPath.slice(0, level), cat]
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
  const renderCategoryColumn = (data: Category[], level: number) => {
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
              {item.children && item.children.length > 0 && <RightOutlined style={{ fontSize: 10, color: '#8C8C8C' }} />}
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
                  <Spin spinning={categoryLoading}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #E8E8E8', minHeight: 350 }}>
                      {/* 第一列 */}
                      {categoryData.length > 0 && renderCategoryColumn(categoryData, 0)}

                      {/* 第二列 */}
                      {tempCategoryPath[0]?.children && tempCategoryPath[0].children.length > 0 &&
                        renderCategoryColumn(tempCategoryPath[0].children, 1)}

                      {/* 第三列 */}
                      {tempCategoryPath[1]?.children && tempCategoryPath[1].children.length > 0 &&
                        renderCategoryColumn(tempCategoryPath[1].children, 2)}

                      {/* 第四列 */}
                      {tempCategoryPath[2]?.children && tempCategoryPath[2].children.length > 0 &&
                        renderCategoryColumn(tempCategoryPath[2].children, 3)}
                    </div>
                  </Spin>

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
        </Card>
      </div>
    </HeaderOnlyLayout>
  )
}
