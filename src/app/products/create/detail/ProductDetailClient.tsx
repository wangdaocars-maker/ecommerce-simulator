'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Breadcrumb,
  Card,
  Checkbox,
  Select,
  Input,
  Button,
  Tooltip,
  Space,
  message,
  Popover,
  Drawer,
  Alert,
  Tabs,
  Modal,
  Spin,
  Tag
} from 'antd'
import {
  QuestionCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  RightOutlined,
  UpOutlined,
  DownOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import HeaderOnlyLayout from '@/components/layout/HeaderOnlyLayout'
import ImageUploadModal from '@/components/ImageUploadModal'
import VideoUploadModal from '@/components/VideoUploadModal'
import { validateProductForm, validateDraftForm } from '@/lib/validation/product'
import { normalizeCategoryResponse } from '@/lib/category-utils'
import { buildProductPayload, resolveImageTargetKey, resolveSubmitImages } from '@/lib/product-submit'
import type { Category } from '@/types/category'

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

const MAIN_SECTIONS = [
  { key: 'basic', label: '基本信息' },
  { key: 'price', label: '价格与库存' },
  { key: 'description', label: '详细描述' },
  { key: 'package', label: '包装与物流' },
  { key: 'other', label: '其它设置' },
]

// 认证选项
const certificationOptions = [
  { label: 'CE认证(CE)', value: 'ce' },
  { label: '圆点(Dot)', value: 'dot' },
  { label: 'EAC(EAC)', value: 'eac' },
  { label: 'EPA(EPA)', value: 'epa' },
  { label: 'FCC(FCC)', value: 'fcc' },
  { label: 'GMP(GMP)', value: 'gmp' },
  { label: 'RoHS认证(RoHS)', value: 'rohs' },
  { label: 'TGA(TGA)', value: 'tga' },
  { label: 'UL认证(UL)', value: 'ul' },
  { label: 'KC(KC)', value: 'kc' },
  { label: 'pse(pse)', value: 'pse' },
  { label: 'WEEE(weee)', value: 'weee' },
  { label: '无(None)', value: 'none' },
]

// 玩具娃娃适合场合选项
const occasionOptions = [
  { label: '圣诞节(Christmas)', value: 'christmas' },
  { label: '复活节(Easter)', value: 'easter' },
  { label: '万圣节(Halloween)', value: 'halloween' },
  { label: '新年(New Year)', value: 'new_year' },
  { label: '情人节(Valentine\'s)', value: 'valentines' },
]

export default function ProductCreateClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryIdFromUrl = searchParams.get('categoryId')
  const [submitting, setSubmitting] = useState(false)
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [language, setLanguage] = useState('zh')
  const [title, setTitle] = useState('')
  const [countryTitles, setCountryTitles] = useState<Record<string, string>>({})
  const [category, setCategory] = useState('')
  const [categoryModalVisible, setCategoryModalVisible] = useState(false)
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<any[]>([])
  const [tempCategoryPath, setTempCategoryPath] = useState<any[]>([])
  const [countryImages, setCountryImages] = useState<Record<string, string[]>>({})
  const [imageUploadModalVisible, setImageUploadModalVisible] = useState(false)
  const [currentUploadTarget, setCurrentUploadTarget] = useState<string>('')
  const [videoUploadModalVisible, setVideoUploadModalVisible] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined)
  const [videoCoverUrl, setVideoCoverUrl] = useState<string | undefined>(undefined)

  // 类目数据
  const [categoryData, setCategoryData] = useState<Category[]>([])
  const [categoryLoading, setCategoryLoading] = useState(false)
  // 自定义属性列表
  const [customAttributes, setCustomAttributes] = useState<Array<{ id: string; name: string; value: string }>>([])
  // 海关监管属性抽屉
  const [customsDrawerVisible, setCustomsDrawerVisible] = useState(false)
  // 资质信息标签页
  const [qualificationTab, setQualificationTab] = useState('all')
  // 资质文件上传
  const [qualificationFiles, setQualificationFiles] = useState<Record<string, string[]>>({})

  // 商品属性相关状态
  const [brand, setBrand] = useState<string | undefined>(undefined)
  const [productTypeAttr, setProductTypeAttr] = useState<string | undefined>(undefined)
  const [originCountry, setOriginCountry] = useState<string | undefined>(undefined)
  const [gender, setGender] = useState<string | undefined>(undefined)
  const [dollType, setDollType] = useState<string | undefined>(undefined)
  const [animeGameName, setAnimeGameName] = useState<string | undefined>(undefined)
  const [remoteControl, setRemoteControl] = useState<string | undefined>(undefined)
  const [stockStatus, setStockStatus] = useState<string | undefined>(undefined)
  const [scaleRatio, setScaleRatio] = useState<string | undefined>(undefined)
  const [seriesAttr, setSeriesAttr] = useState<string | undefined>(undefined)
  const [productAttribute, setProductAttribute] = useState<string | undefined>(undefined)
  const [completionLevel, setCompletionLevel] = useState<string | undefined>(undefined)
  const [materialAttr, setMaterialAttr] = useState<string | undefined>(undefined)

  // 认证弹窗
  const [certificationModalVisible, setCertificationModalVisible] = useState(false)
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([])
  const [certificationSearch, setCertificationSearch] = useState('')

  // 玩具娃娃适合场合弹窗
  const [occasionModalVisible, setOccasionModalVisible] = useState(false)
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([])
  const [occasionSearch, setOccasionSearch] = useState('')

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

  // 详细描述
  const [descriptionLanguage, setDescriptionLanguage] = useState('English')
  const [pcDescription, setPcDescription] = useState('')
  const [selectedAppTemplate, setSelectedAppTemplate] = useState<string | null>(null)

  // 包装与物流
  const [shippingWeight, setShippingWeight] = useState('')
  const [customWeight, setCustomWeight] = useState(false)
  const [packageDimensionLength, setPackageDimensionLength] = useState('')
  const [packageDimensionWidth, setPackageDimensionWidth] = useState('')
  const [packageDimensionHeight, setPackageDimensionHeight] = useState('')
  const [shippingTemplate, setShippingTemplate] = useState('')
  const [serviceTemplate, setServiceTemplate] = useState('新手服务模板')

  // 其它设置
  const [priceIncludesTax, setPriceIncludesTax] = useState('include') // 'exclude' 或 'include'
  const [saleType, setSaleType] = useState('normal') // 'normal' 或 'presale'
  const [productGroup, setProductGroup] = useState<string[]>([]) // 已选中的分组（第三级）
  const [productGroupDropdownOpen, setProductGroupDropdownOpen] = useState(false)
  const [productGroupLevel1, setProductGroupLevel1] = useState<string | null>(null) // 选中的一级
  const [productGroupLevel2, setProductGroupLevel2] = useState<string | null>(null) // 选中的二级
  const [inventoryDeduction, setInventoryDeduction] = useState('payment') // 'order' 或 'payment'
  const [alipaySupported, setAlipaySupported] = useState(true)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [euResponsiblePerson, setEuResponsiblePerson] = useState('')
  const [manufacturer, setManufacturer] = useState('')

  // 主标签页
  const [mainTab, setMainTab] = useState('basic')
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const isProgrammaticScroll = useRef(false)
  const scrollRaf = useRef<number | null>(null)

  const setSectionRef = (key: string) => (node: HTMLDivElement | null) => {
    sectionRefs.current[key] = node
  }

  const scrollToSection = (key: string) => {
    setMainTab(key)
    isProgrammaticScroll.current = true
    const target = sectionRefs.current[key]
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    window.setTimeout(() => {
      isProgrammaticScroll.current = false
    }, 400)
  }

  useEffect(() => {
    setMainTab('basic')
  }, [])

  const updateActiveByScroll = () => {
    const offset = 120
    let active = MAIN_SECTIONS[0]?.key || 'basic'
    MAIN_SECTIONS.forEach(section => {
      const node = sectionRefs.current[section.key]
      if (!node) return
      const top = node.getBoundingClientRect().top
      if (top - offset <= 0) {
        active = section.key
      }
    })
    setMainTab(prev => (prev === active ? prev : active))
  }

  useEffect(() => {
    const onScroll = () => {
      if (isProgrammaticScroll.current) return
      if (scrollRaf.current != null) return
      scrollRaf.current = window.requestAnimationFrame(() => {
        scrollRaf.current = null
        updateActiveByScroll()
      })
    }

    updateActiveByScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollRaf.current != null) {
        window.cancelAnimationFrame(scrollRaf.current)
        scrollRaf.current = null
      }
    }
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

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  // 从 API 获取类目路径（用于刷新页面恢复）
  const fetchCategoryPath = useCallback(async (categoryId: string) => {
    try {
      const res = await fetch(`/api/categories/path?id=${categoryId}`)
      const result = await res.json()
      if (result.success && result.data.path.length > 0) {
        const path = result.data.path as Category[]
        setSelectedCategoryPath(path)
        setTempCategoryPath(path)
        setCategory(path.map((c: Category) => c.name).join(' > '))
        return true
      }
    } catch (error) {
      console.error('获取类目路径失败:', error)
    }
    return false
  }, [])

  // 从 sessionStorage 读取基础信息，或从 URL 恢复类目
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
          // 尝试从 URL 恢复类目
          if (categoryIdFromUrl) {
            fetchCategoryPath(categoryIdFromUrl)
          } else {
            message.warning('未找到基础信息，请返回重新填写')
            setTimeout(() => {
              router.push('/products/create')
            }, 1500)
          }
        }
      } else if (categoryIdFromUrl) {
        // sessionStorage 为空但 URL 有 categoryId，尝试恢复类目
        fetchCategoryPath(categoryIdFromUrl)
      } else {
        message.warning('未找到基础信息，请返回重新填写')
        setTimeout(() => {
          router.push('/products/create')
        }, 1500)
      }
    }
  }, [router, categoryIdFromUrl, fetchCategoryPath])

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
    const images = countryImages[countryCode] || []

    return (
      <div style={{ display: 'flex', gap: 11, marginBottom: 8 }}>
        {imageLabels.map((label, index) => {
          const imageUrl = images[index]
          const hasImage = !!imageUrl

          return (
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

              {/* 上传/显示区域 */}
              <div
                onClick={() => {
                  if (!hasImage) {
                    setCurrentUploadTarget(countryCode)
                    setImageUploadModalVisible(true)
                  }
                }}
                style={{
                  borderLeft: index === 0 && isDefault && !hasImage ? '1px solid #1677FF' : '1px dashed #d9d9d9',
                  borderRight: index === 0 && isDefault && !hasImage ? '1px solid #1677FF' : '1px dashed #d9d9d9',
                  borderBottom: index === 0 && isDefault && !hasImage ? '1px solid #1677FF' : '1px dashed #d9d9d9',
                  borderTop: 'none',
                  borderRadius: '0 0 2px 2px',
                  width: 105,
                  height: 105,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: hasImage ? 'default' : 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {hasImage ? (
                  <>
                    <img
                      src={imageUrl}
                      alt={label}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {/* 删除按钮 */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        const newImages = [...images]
                        newImages.splice(index, 1)
                        setCountryImages(prev => ({
                          ...prev,
                          [countryCode]: newImages
                        }))
                      }}
                      style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: 12,
                      }}
                    >
                      ×
                    </div>
                  </>
                ) : (
                  <>
                    <PlusOutlined style={{
                      fontSize: 17,
                      color: index === 0 && isDefault ? '#1677FF' : '#D9D9D9'
                    }} />
                    <div style={{ marginTop: 6, color: '#8C8C8C', fontSize: 10 }}>
                      添加图片
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // 处理资质文件上传
  const handleQualificationFileUpload = async (key: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', '资质文件')

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.success) {
        setQualificationFiles(prev => ({
          ...prev,
          [key]: [data.data.url] // 每个资质项只保留一张图片
        }))
        message.success('上传成功')
      } else {
        message.error(data.error || '上传失败')
      }
    } catch {
      message.error('上传失败')
    }
  }

  // 渲染资质上传区域
  const renderQualificationUpload = (key: string, label: string, hint?: React.ReactNode) => {
    const files = qualificationFiles[key] || []
    const hasFile = files.length > 0
    const fileInputId = `qualification-file-${key}`

    return (
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ width: 120, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
          <span style={{ color: '#262626' }}>{label}</span>
        </div>
        <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
          {/* 隐藏的文件输入 */}
          <input
            type="file"
            id={fileInputId}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handleQualificationFileUpload(key, file)
                e.target.value = '' // 清空以便重复选择同一文件
              }
            }}
          />

          {/* 未上传时显示按钮 */}
          {!hasFile && (
            <Button
              onClick={() => {
                document.getElementById(fileInputId)?.click()
              }}
            >
              上传本地文件
            </Button>
          )}

          {/* 已上传时显示图片 */}
          {hasFile && (
            <div
              style={{
                position: 'relative',
                width: 104,
                height: 104,
                border: '1px solid #d9d9d9',
                borderRadius: 4,
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              className="qualification-image-container"
            >
              <img
                src={files[0]}
                alt={label}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                className="qualification-delete-overlay"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0'
                }}
                onClick={() => {
                  setQualificationFiles(prev => ({
                    ...prev,
                    [key]: []
                  }))
                }}
              >
                <DeleteOutlined style={{ color: '#fff', fontSize: 24 }} />
              </div>
            </div>
          )}

          {hint && (
            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>{hint}</div>
          )}
        </div>
      </div>
    )
  }

  // 计算提交时的 images 和 mainImage
  const getImagesForSubmit = () => {
    return resolveSubmitImages(countryImages, selectedCountries)
  }

  // 提交商品（发布或保存草稿）
  const handleSubmit = async (asDraft: boolean = false) => {
    setSubmitting(true)

    try {
      // 0. 计算 images 和 mainImage
      const { images, mainImage } = getImagesForSubmit()

      // 1. 验证表单
      const formData = {
        title,
        categoryId: selectedCategoryPath.length > 0 ? selectedCategoryPath[selectedCategoryPath.length - 1].id : undefined,
        price: parseFloat(retailPrice) || 0,
        stock: parseInt(inventory) || 0,
        images,
        description: pcDescription,
        wholesaleEnabled,
        wholesaleMinQuantity: wholesaleMinQuantity ? parseInt(wholesaleMinQuantity) : undefined,
        wholesaleDiscount: wholesaleDiscount ? parseFloat(wholesaleDiscount) : undefined,
      }

      const errors = asDraft ? validateDraftForm(formData) : validateProductForm(formData)
      if (errors.length > 0) {
        message.error(errors[0].message)
        setSubmitting(false)
        return
      }

      // 2. 构建请求数据
      const productData = buildProductPayload({
        title,
        countries: selectedCountries,
        countryTitles,
        countryImages,
        language,
        categoryId: selectedCategoryPath.length > 0 ? selectedCategoryPath[selectedCategoryPath.length - 1].id : null,
        price: parseFloat(retailPrice) || 0,
        stock: parseInt(inventory) || 0,
        sku: skuCode || undefined,
        minUnit,
        salesMethod,
        productValue: productValue ? parseFloat(productValue) : undefined,
        isPresale: isPresale === 'yes',
        productType,
        colorSystem: colorSystem || undefined,
        customColorName: customColorName || undefined,
        selectedSizes,
        plugTypes: selectedPlugTypes,
        shippingLocations: selectedShippingLocations,
        customAttributes,
        wholesaleEnabled,
        wholesaleMinQuantity: wholesaleMinQuantity ? parseInt(wholesaleMinQuantity) : undefined,
        wholesaleDiscount: wholesaleDiscount ? parseFloat(wholesaleDiscount) : undefined,
        selectedRegions,
        regionalPrices,
        priceAdjustMethod,
        regionalPriceAdjustments,
        description: pcDescription,
        descriptionLang: descriptionLanguage,
        appTemplateId: selectedAppTemplate || undefined,
        images,
        mainImage,
        video: videoUrl,
        videoCover: videoCoverUrl,
        weight: weight ? parseFloat(weight) : undefined,
        packageSize: packageLength && packageWidth && packageHeight
          ? { length: parseFloat(packageLength), width: parseFloat(packageWidth), height: parseFloat(packageHeight) }
          : undefined,
        shippingTemplate: shippingTemplate || undefined,
        serviceTemplate: serviceTemplate || undefined,
        customWeight,
        priceIncludesTax,
        saleType,
        inventoryDeduction,
        alipaySupported,
        euResponsiblePerson: euResponsiblePerson || undefined,
        manufacturer: manufacturer || undefined,
        status: asDraft ? 'draft' : 'reviewing',
      })

      // 3. 发送请求
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })

      const result = await res.json()

      if (result.success) {
        message.success(asDraft ? '已保存为草稿' : '商品已提交审核')
        // 清除 sessionStorage
        sessionStorage.removeItem('productBasicInfo')
        router.push('/products')
      } else {
        message.error(result.error || '操作失败')
      }
    } catch (error) {
      console.error('提交失败:', error)
      message.error('网络错误，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <HeaderOnlyLayout>
      {/* 左右分栏容器 */}
      <div style={{ display: 'flex', gap: 24, padding: '17px 40px 0', alignItems: 'flex-start' }}>
        {/* 左侧主内容区 */}
        <div style={{ flex: 1, minWidth: 0 }}>
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
            marginLeft: -17,
            marginRight: -17,
            paddingLeft: 17,
            paddingRight: 17
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
                  style={{ padding: '20px 0 0', scrollMarginTop: 120 }}
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
                  <Spin spinning={categoryLoading}>
                    <div style={{ display: 'flex', borderBottom: '1px solid #E8E8E8', minHeight: 350 }}>
                      {/* 第一列 */}
                      {renderCategoryColumn(categoryData, 0)}

                      {/* 第二列 */}
                      {tempCategoryPath[0]?.children && renderCategoryColumn(tempCategoryPath[0].children, 1)}

                      {/* 第三列 */}
                      {tempCategoryPath[1]?.children && renderCategoryColumn(tempCategoryPath[1].children, 2)}

                      {/* 第四列 */}
                      {tempCategoryPath[2]?.children && renderCategoryColumn(tempCategoryPath[2].children, 3)}
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
                        if (!countryImages['marketing-1-1']?.[0]) {
                          setCurrentUploadTarget('marketing-1-1')
                          setImageUploadModalVisible(true)
                        }
                      }}
                      style={{
                        borderLeft: '1px dashed #d9d9d9',
                        borderRight: '1px dashed #d9d9d9',
                        borderBottom: '1px dashed #d9d9d9',
                        borderTop: 'none',
                        borderRadius: '0 0 2px 2px',
                        width: 138,
                        height: 138,
                        position: 'relative',
                        cursor: countryImages['marketing-1-1']?.[0] ? 'default' : 'pointer',
                        overflow: 'hidden'
                      }}
                    >
                      {countryImages['marketing-1-1']?.[0] ? (
                        <>
                          <img
                            src={countryImages['marketing-1-1'][0]}
                            alt="1:1白底图"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              setCountryImages(prev => {
                                const newImages = { ...prev }
                                delete newImages['marketing-1-1']
                                return newImages
                              })
                            }}
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: 12,
                            }}
                          >
                            ×
                          </div>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
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
                        if (!countryImages['marketing-3-4']?.[0]) {
                          setCurrentUploadTarget('marketing-3-4')
                          setImageUploadModalVisible(true)
                        }
                      }}
                      style={{
                        borderLeft: '1px dashed #d9d9d9',
                        borderRight: '1px dashed #d9d9d9',
                        borderBottom: '1px dashed #d9d9d9',
                        borderTop: 'none',
                        borderRadius: '0 0 2px 2px',
                        width: 160,
                        height: 213,
                        position: 'relative',
                        cursor: countryImages['marketing-3-4']?.[0] ? 'default' : 'pointer',
                        overflow: 'hidden'
                      }}
                    >
                      {countryImages['marketing-3-4']?.[0] ? (
                        <>
                          <img
                            src={countryImages['marketing-3-4'][0]}
                            alt="3:4场景图"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div
                            onClick={(e) => {
                              e.stopPropagation()
                              setCountryImages(prev => {
                                const newImages = { ...prev }
                                delete newImages['marketing-3-4']
                                return newImages
                              })
                            }}
                            style={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              backgroundColor: 'rgba(0,0,0,0.5)',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: 12,
                            }}
                          >
                            ×
                          </div>
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
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
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        <span style={{ color: '#262626' }}>品牌</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={brand}
                          onChange={setBrand}
                          allowClear
                          showSearch
                          options={[
                            { label: 'NONE(NONE)', value: 'none' }
                          ]}
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
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        <span style={{ color: '#262626' }}>产品类型</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={productTypeAttr}
                          onChange={setProductTypeAttr}
                          allowClear
                          showSearch
                          options={[
                            { label: 'Puppets', value: 'puppets' },
                            { label: '搪胶公仔', value: 'vinyl_figure' },
                            { label: '模型', value: 'model' },
                            { label: '打火机/烟盒/烟灰缸', value: 'lighter_cigarette' },
                            { label: '游戏收藏卡', value: 'game_cards' },
                            { label: '礼包/密保', value: 'gift_pack' },
                            { label: '灯牌', value: 'light_sign' }
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第二行：适用年龄 | 高关注化学品 */}
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        <span style={{ color: '#262626' }}>适用年龄</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Button
                          size="middle"
                          // TODO: 实现设置功能
                        >
                          设置
                        </Button>
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        <span style={{ color: '#262626' }}>高关注化学品</span>
                        <Tooltip title="高关注物质(SVHC)是指具有持久性、生物累积性、毒性(PBT)或高持久性、高生物累积性(vPvB)等特性的化学物质">
                          <QuestionCircleOutlined
                            style={{ marginLeft: 4, color: '#8C8C8C', cursor: 'pointer' }}
                          />
                        </Tooltip>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
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
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#ff4d4f' }}>* </span>
                        <span style={{ color: '#262626' }}>产地（国家或地区）</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={originCountry}
                          onChange={setOriginCountry}
                          allowClear
                          showSearch
                          options={[
                            { label: '中国', value: 'CN' },
                            { label: '美国', value: 'US' },
                            { label: '日本', value: 'JP' },
                            { label: '韩国', value: 'KR' },
                            { label: '德国', value: 'DE' },
                            { label: '英国', value: 'GB' },
                            { label: '法国', value: 'FR' },
                            { label: '意大利', value: 'IT' },
                            { label: '西班牙', value: 'ES' },
                            { label: '加拿大', value: 'CA' },
                            { label: '澳大利亚', value: 'AU' },
                            { label: '印度', value: 'IN' },
                            { label: '巴西', value: 'BR' },
                            { label: '俄罗斯', value: 'RU' },
                            { label: '墨西哥', value: 'MX' },
                            { label: '泰国', value: 'TH' },
                            { label: '越南', value: 'VN' },
                            { label: '印度尼西亚', value: 'ID' },
                            { label: '马来西亚', value: 'MY' },
                            { label: '新加坡', value: 'SG' }
                          ]}
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>性别</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={gender}
                          onChange={setGender}
                          allowClear
                          options={[
                            { label: 'Girls', value: 'girls' },
                            { label: '男童', value: 'boys' },
                            { label: '男女通用', value: 'unisex' }
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第四行：警告 | 玩偶类型 */}
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>警告</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Input
                          placeholder="请输入"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          // TODO: 实现警告输入功能
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>玩偶类型</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={dollType}
                          onChange={setDollType}
                          allowClear
                          options={[
                            { label: '模型', value: 'model' },
                            { label: '机器动物', value: 'robot_animal' }
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第五行：尺寸 | 动漫电影游戏名称 */}
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>尺寸</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Input
                          placeholder="请输入"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          // TODO: 实现尺寸输入功能
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>动漫电影游戏名称</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={animeGameName}
                          onChange={setAnimeGameName}
                          allowClear
                          showSearch
                          options={[
                            { label: '冰雪奇缘', value: 'frozen' },
                            { label: '战锤40000', value: 'warhammer_40k' },
                            { label: '曼达洛人', value: 'mandalorian' },
                            { label: 'cinnamoroll', value: 'cinnamoroll' },
                            { label: '复仇者联盟', value: 'avengers' },
                            { label: '刀剑神域', value: 'sword_art_online' },
                            { label: '米老鼠', value: 'mickey_mouse' },
                            { label: '数码宝贝', value: 'digimon' }
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第六行：比例 | 遥控 */}
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>比例</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请输入或从列表选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={scaleRatio}
                          onChange={setScaleRatio}
                          allowClear
                          showSearch
                          options={[
                            { label: '1/60(1/60)', value: '1/60' },
                            { label: '1/100(1/100)', value: '1/100' },
                            { label: '1/144(1/144)', value: '1/144' },
                            { label: '1/200(1/200)', value: '1/200' },
                            { label: '1/72(1/72)', value: '1/72' },
                            { label: '1/48(1/48)', value: '1/48' },
                            { label: '1/55(1/55)', value: '1/55' },
                            { label: '1/65(1/65)', value: '1/65' },
                            { label: '1/12(1/12)', value: '1/12' },
                            { label: '1/170(1/170)', value: '1/170' }
                          ]}
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>遥控</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={remoteControl}
                          onChange={setRemoteControl}
                          allowClear
                          options={[
                            { label: '是(Yes)', value: 'yes' },
                            { label: '否(No)', value: 'no' }
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第七行：认证 | 按动漫来源 */}
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>认证</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Button
                          size="middle"
                          onClick={() => setCertificationModalVisible(true)}
                        >
                          {selectedCertifications.length > 0 ? '修改' : '设置'}
                        </Button>
                        {selectedCertifications.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {selectedCertifications.map(value => {
                              const option = certificationOptions.find(opt => opt.value === value)
                              return (
                                <Tag
                                  key={value}
                                  closable
                                  onClose={() => setSelectedCertifications(prev => prev.filter(v => v !== value))}
                                  style={{ margin: 0 }}
                                >
                                  {option?.label || value}
                                </Tag>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>按动漫来源</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Input
                          placeholder="请输入或从列表选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          // TODO: 实现按动漫来源输入/选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第八行：玩具娃娃适合各种场合 | 状态 */}
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>玩具娃娃适合各种场合</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Button
                          size="middle"
                          onClick={() => setOccasionModalVisible(true)}
                        >
                          {selectedOccasions.length > 0 ? '修改' : '设置'}
                        </Button>
                        {selectedOccasions.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {selectedOccasions.map(value => {
                              const option = occasionOptions.find(opt => opt.value === value)
                              return (
                                <Tag
                                  key={value}
                                  closable
                                  onClose={() => setSelectedOccasions(prev => prev.filter(v => v !== value))}
                                  style={{ margin: 0 }}
                                >
                                  {option?.label || value}
                                </Tag>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>状态</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={stockStatus}
                          onChange={setStockStatus}
                          allowClear
                          options={[
                            { label: '现货/库存', value: 'in_stock' },
                            { label: '预售', value: 'pre_sale' }
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第九行：兵人配件 | 动漫电影游戏人物角色 */}
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>兵人配件</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
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
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>动漫电影游戏人物角色</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Input
                          placeholder="请输入"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          // TODO: 实现动漫电影游戏人物角色输入功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第十行：系列 | 版本 */}
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>系列</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={seriesAttr}
                          onChange={setSeriesAttr}
                          allowClear
                          showSearch
                          options={[
                            { label: '拼装/组装(Assembly/Assembling)', value: 'assembly' },
                            { label: '电动(Battery Operated)', value: 'battery_operated' },
                            { label: '树脂(Resin)', value: 'resin' },
                            { label: '机器人(Robot)', value: 'robot' },
                            { label: 'Puppets(Puppets)', value: 'puppets' },
                            { label: '不倒翁(Tumbler)', value: 'tumbler' },
                            { label: '模型(Model)', value: 'model' },
                            { label: '数码电器家电(Digital Electric Apparatus & Household Apparatus)', value: 'digital_electric' }
                          ]}
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>版本</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Input
                          placeholder="请输入或从列表选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          // TODO: 实现版本输入/选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第十一行：商品属性 | 型号 */}
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>商品属性</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={productAttribute}
                          onChange={setProductAttribute}
                          allowClear
                          showSearch
                          options={[
                            { label: '周边(Peripherals)', value: 'peripherals' },
                            { label: '成品(Finished Goods)', value: 'finished_goods' },
                            { label: '拼装(Assembly)', value: 'assembly' },
                            { label: '主体(Subject)', value: 'subject' },
                            { label: '配件(Accessories)', value: 'accessories' },
                            { label: 'parts(Parts)', value: 'parts' },
                            { label: '机体(Robot Body)', value: 'robot_body' }
                          ]}
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>型号</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Input
                          placeholder="请输入"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          // TODO: 实现型号输入功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第十二行：完成度 | 主题 */}
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>完成度</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={completionLevel}
                          onChange={setCompletionLevel}
                          allowClear
                          options={[
                            { label: '成品(Finished Goods)', value: 'finished' },
                            { label: '半成品(Semi-finished Product)', value: 'semi_finished' }
                          ]}
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>主题</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Input
                          placeholder="请输入或从列表选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          // TODO: 实现主题输入/选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 第十三行：材质 | 是否原盒包装 */}
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>材质</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请输入或从列表选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          value={materialAttr}
                          onChange={setMaterialAttr}
                          allowClear
                          showSearch
                          options={[
                            { label: '棉(COTTON)', value: 'cotton' },
                            { label: '聚酯纤维(POLYESTER)', value: 'polyester' },
                            { label: '丝绸(Silk)', value: 'silk' },
                            { label: '亚克力(Acrylic)', value: 'acrylic' },
                            { label: '拉绒(Fleece)', value: 'fleece' },
                            { label: '无纺(Non-Woven)', value: 'non_woven' },
                            { label: '羊毛(Wool)', value: 'wool' },
                            { label: '亚麻(Linen)', value: 'linen' },
                            { label: '橡胶(Rubber)', value: 'rubber' },
                            { label: '皮革(Leather)', value: 'leather' },
                            { label: 'PVC(PVC)', value: 'pvc' }
                          ]}
                        />
                      </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        <span style={{ color: '#262626' }}>是否原盒包装</span>
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                        <Select
                          placeholder="请选择"
                          style={{ width: '100%', maxWidth: 280 }}
                          size="middle"
                          // TODO: 实现是否原盒包装选择功能
                        />
                      </div>
                    </div>
                  </div>

                  {/* 自定义属性列表 */}
                  {customAttributes.map((attr, index) => (
                    <div key={attr.id} style={{ display: 'flex', gap: 40 }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                        <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
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
                  <div style={{ display: 'flex', gap: 40 }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', minWidth: 0 }}>
                      <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                        {customAttributes.length === 0 && (
                          <span style={{ color: '#262626' }}>添加自定义属性</span>
                        )}
                      </div>
                      <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
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
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#262626' }}>欧盟</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          欧盟通用产品安全法规（General Product Safety Regulation，下称"GPSR"）已于2024年12月13日起开始强制实施，如产品本身具有安全信息/警示语，请及时提供。
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* 产品安全信息/警示语 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 120, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>产品安全信息/警示语</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                            <Input placeholder="请输入" style={{ width: 400 }} />
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                              （选填）如商品具有特殊的安全信息/警示语，请填写。请勿使用特殊符号（如引号、斜杠等），且长度勿超过200字符。
                            </div>
                          </div>
                        </div>
                        {/* 外包装/标签实拍图-欧盟 */}
                        {renderQualificationUpload('eu-label', '外包装/标签实拍图-欧盟', '请上传发往欧盟的商品包装实物图，应包含生产企业信息、欧盟责任人信息和CE标志')}
                        {/* 欧盟CE-DoC */}
                        {renderQualificationUpload('eu-ce-doc', '欧盟CE-DoC', <>请提供产品的符合性声明文件。模版可参考：<a href="https://files.alicdn.com/tpsservice/a529457f9bd1b290089a02a5b62ff924.docx?spm=a1zmmc.index.0.0.232d719dBQZhNx&file=a529457f9bd1b290089a02a5b62ff924.docx" target="_blank" rel="noopener noreferrer" style={{ color: '#1677FF' }}>https://files.alicdn.com/tpsservice/a529457f9bd1b290089a02a5b62ff924.docx?spm=a1zmmc.index.0.0.232d719dBQZhNx&file=a529457f9bd1b290089a02a5b62ff924.docx</a>。</>)}
                        {/* 检测报告 */}
                        {renderQualificationUpload('eu-test-report', '检测报告', '请上传产品的检测报告，满足EN71系列标准要求，带电玩具还另需满足EN 62115标准要求。')}
                        {/* REACH检测报告 */}
                        {renderQualificationUpload('eu-reach-report', 'REACH检测报告', '14岁以下儿童适用的玩具请提供REACH检测报告。')}
                      </div>

                      {/* 英国 - 完整内容 */}
                      <div style={{ marginBottom: 48, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: '#262626' }}>英国</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          根据欧盟/英国法规要求，销往欧盟市场的商品须上传外包装标签图，应标明如下信息：生产企业信息、和CE/UKCA标识（如适用）。商品资质的审核结果查询请访问资质中心【<a href="https://gsp.aliexpress.com/apps/product/qualitycenter?" target="_blank" rel="noopener noreferrer" style={{ color: '#1677FF' }}>https://gsp.aliexpress.com/apps/product/qualitycenter?</a>】
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* 外包装/标签实拍图-英国 */}
                        {renderQualificationUpload('uk-label', '外包装/标签实拍图-英国')}
                      </div>

                      {/* 韩国 - 完整内容 */}
                      <div style={{ marginBottom: 48, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: '#262626' }}>韩国</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          平台加强了售往韩国的儿童玩具、母婴产品、电子电器、小家电、运动户外、安全防护、家居用品、美容健康等品类的商品管控，商家需确保商品符合韩国当地的相关法律法规要求，请商家积极上传KC、CE或3C等该商品的全部认证，以便韩国消费者了解该产品的认证信息。
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* KC认证证书_安全 */}
                        {renderQualificationUpload('kr-kc-cert', 'KC认证证书_安全', '请上传清晰且带KC认证编号的KC认证证书')}
                        {/* KC认证编号（安全） */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 120, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>KC认证编号（安全）</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                            <Input placeholder="请输入" style={{ width: 400 }} />
                            <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>请填写完整的KC认证编号。</div>
                          </div>
                        </div>
                        {/* 外包装/标签实拍图-韩国 */}
                        {renderQualificationUpload('kr-label', '外包装/标签实拍图-韩国', '商品实物包装标签图需含KC标志、产品名称、原产国、制造商/进口商名称和地址信息，儿童用品需要包含适用年龄。')}
                        {/* CE认证 */}
                        {renderQualificationUpload('kr-ce-cert', 'CE认证', '请上传清晰符合法规要求的欧盟CE证书（如无韩国KC证书，请上传此证书）。')}
                        {/* 检测报告 */}
                        {renderQualificationUpload('kr-test-report', '检测报告', '请上传清晰符合法规要求的欧盟CE检测报告（如无韩国KC资质，请上传此报告）。')}
                        {/* 中国3C认证 */}
                        {renderQualificationUpload('kr-3c-cert', '中国3C认证', '相关品类的中国3C认证证书是中国商品出口至相关国家市场的必要资质，同时也是证明商品质量优劣的重要参考。平台相关品类的合规管控会依据该资质，当前平台已开放中国3C认证证书的资质提交入口，请商家积极上传。')}
                      </div>

                      {/* 巴西 - 完整内容 */}
                      <div style={{ marginBottom: 48, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: '#262626' }}>巴西</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          玩具在巴西销售时需要符合巴西INMETRO的相关要求。
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* 巴西INMETRO认证 */}
                        {renderQualificationUpload('br-inmetro-cert', '巴西INMETRO认证', '请上传巴西INMETRO认证证书或官网收录截屏的清晰图片，大小需在3M之内')}
                        {/* 外包装/标签实拍图-巴西 */}
                        {renderQualificationUpload('br-label', '外包装/标签实拍图-巴西', '请上传包含生产企业名称和认证LOGO的清晰图片，大小需在3M之内')}
                      </div>

                      {/* 土耳其 - 完整内容 */}
                      <div style={{ marginBottom: 48, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: '#262626' }}>土耳其</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          请提交商品外包装标签实拍图，至少包括但不限于以下信息：土耳其责任人的名称、电子邮件或电话或网址；制造商和进口商（如适用）的名称、商标、商号和电子邮箱/URL，以及可以联系他们的联络地址或电子邮件地址/URL；清晰可见的商品识别码，如型号、批次/序列号或其他方式；清晰的警告和安全信息（如有，需要包含土耳其语言）。
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* 外包装/标签实拍图-土耳其 */}
                        {renderQualificationUpload('tr-label', '外包装/标签实拍图-土耳其', '请提交商品外包装标签实拍图，至少包括但不限于以下信息：土耳其责任人的名称、电子邮件或电话或网址；制造商和进口商信息等。')}
                      </div>

                      {/* 墨西哥 - 完整内容 */}
                      <div style={{ marginBottom: 24, paddingTop: 24, borderTop: '1px solid #F0F0F0' }}>
                        <h4 style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 16, color: '#262626' }}>墨西哥</h4>
                        <div style={{ marginBottom: 24, color: '#595959', fontSize: 12, lineHeight: '20px' }}>
                          平台拟进一步加强售往墨西哥的电子电器、玩具、医疗器械、保健食品、化妆品等品类的商品合规管控，商家需确保自己提供的商品符合墨西哥当地的相关法律法规要求。
                          <Button type="link" size="small" style={{ padding: 0, marginLeft: 4 }}>详细说明 &gt;&gt;</Button>
                        </div>
                        {/* 墨西哥NOM认证 */}
                        {renderQualificationUpload('mx-nom-cert', '墨西哥NOM认证', '请上传清晰且有效的产品NOM认证证书。')}
                        {/* 外包装/标签实拍图-墨西哥 */}
                        {renderQualificationUpload('mx-label', '外包装/标签实拍图-墨西哥', '商品实物包装标签图需含NOM标志、产品名称、制造商/进口商名称和地址信息、原产国等。')}
                        {/* 墨西哥NOM证书编号 */}
                        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                          <div style={{ width: 100, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                            <span style={{ color: '#262626' }}>墨西哥NOM证书编号</span>
                          </div>
                          <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
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

                      {/* 产品安全信息/警示语 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 120, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>产品安全信息/警示语</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                          <Input placeholder="请输入" style={{ width: 400 }} />
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            （选填）如商品具有特殊的安全信息/警示语，请填写。请勿使用特殊符号（如引号、斜杠等），且长度勿超过200字符。
                          </div>
                        </div>
                      </div>

                      {renderQualificationUpload('eu-label-tab', '外包装/标签实拍图-欧盟', '请上传发往欧盟的商品包装实物图，应包含生产企业信息、欧盟责任人信息和CE标志')}
                      {renderQualificationUpload('eu-ce-doc-tab', '欧盟CE-DoC', <>请提供产品的符合性声明文件。模版可参考：<a href="https://files.alicdn.com/tpsservice/a529457f9bd1b290089a02a5b62ff924.docx?spm=a1zmmc.index.0.0.232d719dBQZhNx&file=a529457f9bd1b290089a02a5b62ff924.docx" target="_blank" rel="noopener noreferrer" style={{ color: '#1677FF' }}>https://files.alicdn.com/tpsservice/a529457f9bd1b290089a02a5b62ff924.docx?spm=a1zmmc.index.0.0.232d719dBQZhNx&file=a529457f9bd1b290089a02a5b62ff924.docx</a>。</>)}
                      {renderQualificationUpload('eu-test-report-tab', '检测报告', '请上传产品的检测报告，满足EN71系列标准要求，带电玩具还另需满足EN 62115标准要求。')}
                      {renderQualificationUpload('eu-reach-report-tab', 'REACH检测报告', '14岁以下儿童适用的玩具请提供REACH检测报告。')}
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

                      {renderQualificationUpload('uk-label-tab', '外包装/标签实拍图-英国')}
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
                      {renderQualificationUpload('kr-kc-cert-tab', 'KC认证证书_安全', '请上传清晰且带KC认证编号的KC认证证书')}

                      {/* KC认证编号（安全） */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 120, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>KC认证编号（安全）</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
                          <Input placeholder="请输入" style={{ width: 400 }} />
                          <div style={{ marginTop: 8, color: '#8C8C8C', fontSize: 12 }}>
                            请填写完整的KC认证编号。
                          </div>
                        </div>
                      </div>

                      {/* 外包装/标签实拍图-韩国 */}
                      {renderQualificationUpload('kr-label-tab', '外包装/标签实拍图-韩国', '商品实物包装标签图需含KC标志、产品名称、原产国、制造商/进口商名称和地址信息，儿童用品需要包含适用年龄。')}

                      {/* CE认证 */}
                      {renderQualificationUpload('kr-ce-cert-tab', 'CE认证', '请上传清晰符合法规要求的欧盟CE证书（如无韩国KC证书，请上传此证书）。')}

                      {/* 检测报告 */}
                      {renderQualificationUpload('kr-test-report-tab', '检测报告', '请上传清晰符合法规要求的欧盟CE检测报告（如无韩国KC资质，请上传此报告）。')}

                      {/* 中国3C认证 */}
                      {renderQualificationUpload('kr-3c-cert-tab', '中国3C认证', '相关品类的中国3C认证证书是中国商品出口至相关国家市场的必要资质，同时也是证明商品质量优劣的重要参考。平台相关品类的合规管控会依据该资质，当前平台已开放中国3C认证证书的资质提交入口，请商家积极上传。')}
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
                      {renderQualificationUpload('br-inmetro-cert-tab', '巴西INMETRO认证', '请上传巴西INMETRO认证证书或官网收录截屏的清晰图片，大小需在3M之内')}

                      {/* 外包装/标签实拍图-巴西 */}
                      {renderQualificationUpload('br-label-tab', '外包装/标签实拍图-巴西', '请上传包含生产企业名称和认证LOGO的清晰图片，大小需在3M之内')}
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
                      {renderQualificationUpload('tr-label-tab', '外包装/标签实拍图-土耳其', '请提交商品外包装标签实拍图，至少包括但不限于以下信息：土耳其责任人的名称、电子邮件或电话或网址；制造商和进口商（如适用）的名称、商标、商号和电子邮箱/URL，以及可以联系他们的联络地址或电子邮件地址/URL；清晰可见的商品识别码，如型号、批次/序列号或其他方式；清晰的警告和安全信息（如有，需要包含土耳其语言）。')}
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
                      {renderQualificationUpload('mx-nom-cert-tab', '墨西哥NOM认证', '请上传清晰且有效的产品NOM认证证书。')}

                      {/* 外包装/标签实拍图-墨西哥 */}
                      {renderQualificationUpload('mx-label-tab', '外包装/标签实拍图-墨西哥', '商品实物包装标签图需含NOM标志、产品名称、制造商/进口商名称和地址信息、原产国等。')}

                      {/* 墨西哥NOM证书编号 */}
                      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start' }}>
                        <div style={{ width: 120, textAlign: 'right', flexShrink: 0, paddingTop: 4 }}>
                          <span style={{ color: '#262626' }}>墨西哥NOM证书编号</span>
                        </div>
                        <div style={{ marginLeft: 12, flex: 1, minWidth: 0 }}>
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
        style={{ padding: '20px 0 0', scrollMarginTop: 120 }}
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
                        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {selectedPlugTypes.map(type => {
                            const labelMap: Record<string, string> = {
                              'usb': 'USB',
                              'battery': '纽扣电池',
                              'eu_plug': 'eu plug',
                              'us_plug': '美规'
                            }
                            return (
                              <Tag
                                key={type}
                                closable
                                onClose={() => setSelectedPlugTypes(selectedPlugTypes.filter(t => t !== type))}
                              >
                                {labelMap[type] || type}
                              </Tag>
                            )
                          })}
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
                        <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {selectedShippingLocations.map(loc => {
                            const labelMap: Record<string, string> = {
                              'jp': '日本(JP)', 'ca': '加拿大(CA)', 'ng': '尼日利亚(NG)', 'za': '南非(ZA)',
                              'cn': '中国大陆', 'cl': '智利(CL)', 'br': '巴西(BR)', 'tr': '土耳其(TR)',
                              'ua': '乌克兰(UA)', 'ae': '阿联酋(AE)', 'il': '以色列(IL)', 'cz': '捷克',
                              'pl': '波兰(PL)', 'us': '美国(US)', 'uk': '英国(UK)', 'de': '德国(DE)',
                              'es': '西班牙(ES)', 'au': '澳大利亚(AU)', 'ru': '俄罗斯(RU)', 'id': '印度尼西亚(ID)',
                              'fr': '法国(FR)', 'it': '意大利(IT)', 'vn': '越南(VN)', 'hu': '匈牙利(HU)',
                              'lv': '拉脱维亚(LV)', 'sa': '沙特阿拉伯(SA)', 'be': '比利时(BE)', 'kr': '韩国(KR)'
                            }
                            return (
                              <Tag
                                key={loc}
                                closable
                                onClose={() => setSelectedShippingLocations(selectedShippingLocations.filter(l => l !== loc))}
                              >
                                {labelMap[loc] || loc}
                              </Tag>
                            )
                          })}
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
                  style={{ padding: '20px 0 0', scrollMarginTop: 120 }}
                >
                  <Card title="详细描述" style={{ marginBottom: 16, border: '1px solid #d9d9d9', borderRadius: 6 }}>
                    <div style={{ marginBottom: 24 }}>
                      {/* 详描语言 */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 8, fontSize: 14, color: '#262626' }}>
                          详描语言
                          <Tooltip title="选择商品详细描述的语言">
                            <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>
                              <svg viewBox="64 64 896 896" focusable="false" width="14" height="14" fill="currentColor">
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                              </svg>
                            </span>
                          </Tooltip>
                        </div>
                        <Select
                          size="small"
                          style={{ width: 320 }}
                          value={descriptionLanguage}
                          onChange={setDescriptionLanguage}
                          options={[
                            { label: '英语(发布语言)', value: 'English' },
                            { label: '中文', value: 'Chinese' },
                            { label: '西班牙语', value: 'Spanish' },
                            { label: '法语', value: 'French' },
                            { label: '德语', value: 'German' },
                            { label: '俄语', value: 'Russian' },
                            { label: '葡萄牙语', value: 'Portuguese' },
                            { label: '日语', value: 'Japanese' },
                            { label: '韩语', value: 'Korean' },
                            { label: '阿拉伯语', value: 'Arabic' }
                          ]}
                        />
                      </div>

                      {/* PC详描编辑 */}
                      <div>
                        <div style={{ marginBottom: 8, fontSize: 14, color: '#262626' }}>
                          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                          PC详描编辑
                          <Tooltip title="编辑商品的详细描述内容">
                            <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>
                              <svg viewBox="64 64 896 896" focusable="false" width="14" height="14" fill="currentColor">
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                              </svg>
                            </span>
                          </Tooltip>
                        </div>

                        {/* 操作按钮区域 */}
                        <div style={{ marginBottom: 12, display: 'flex', gap: 8 }}>
                          <Input
                            size="small"
                            placeholder="导入无线详情描述"
                            style={{ width: 200, color: '#8c8c8c' }}
                            readOnly
                          />
                          <Button size="small">预览</Button>
                          <Button size="small" style={{ color: '#1677ff', borderColor: '#1677ff' }}>
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" style={{ marginRight: 4 }}>
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                            </svg>
                            卖点生成
                          </Button>
                        </div>

                        {/* 富文本编辑器 */}
                        <div style={{ border: '1px solid #d9d9d9', borderRadius: 4 }}>
                          {/* 工具栏第一行 */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px',
                            borderBottom: '1px solid #d9d9d9',
                            background: '#fafafa',
                            gap: 4
                          }}>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="粗体">
                              <strong style={{ fontSize: 16 }}>B</strong>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="斜体">
                              <em style={{ fontSize: 16 }}>I</em>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="下划线">
                              <span style={{ textDecoration: 'underline', fontSize: 16 }}>U</span>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="删除线">
                              <span style={{ textDecoration: 'line-through', fontSize: 16 }}>S</span>
                            </button>
                            <div style={{ width: 1, height: 24, background: '#d9d9d9', margin: '0 4px' }} />
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="字体颜色">
                              <span style={{ color: '#262626', fontSize: 16 }}>A</span>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="背景色">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 2.5L18.5 12H17v6H7v-6H5.5L12 5.5z"/>
                              </svg>
                            </button>
                            <div style={{ width: 1, height: 24, background: '#d9d9d9', margin: '0 4px' }} />
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="左对齐">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M3 3h18v2H3V3zm0 4h12v2H3V7zm0 4h18v2H3v-2zm0 4h12v2H3v-2zm0 4h18v2H3v-2z"/>
                              </svg>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="居中对齐">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M3 3h18v2H3V3zm3 4h12v2H6V7zm-3 4h18v2H3v-2zm3 4h12v2H6v-2zm-3 4h18v2H3v-2z"/>
                              </svg>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="右对齐">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M3 3h18v2H3V3zm6 4h12v2H9V7zm-6 4h18v2H3v-2zm6 4h12v2H9v-2zm-6 4h18v2H3v-2z"/>
                              </svg>
                            </button>
                            <div style={{ width: 1, height: 24, background: '#d9d9d9', margin: '0 4px' }} />
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="有序列表">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"/>
                              </svg>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="无序列表">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"/>
                              </svg>
                            </button>
                            <div style={{ width: 1, height: 24, background: '#d9d9d9', margin: '0 4px' }} />
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="增加缩进">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/>
                              </svg>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="减少缩进">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M3 21h18v-2H3v2zM3 8v8l4-4-4-4zm8 9h10v-2H11v2zM3 3v2h18V3H3zm8 6h10V7H11v2zm0 4h10v-2H11v2z"/>
                              </svg>
                            </button>
                            <div style={{ width: 1, height: 24, background: '#d9d9d9', margin: '0 4px' }} />
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="清除格式">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M6 5v.18L8.82 8h2.4l-.72 1.68 2.1 2.1L14.21 8H20V5H6zm14 14.82L18.18 22 12 15.82 8.82 19H5v-3.18L1.82 12 5 8.82 5.18 9 7 10.82V12h1.82L12 15.18l1.82-1.82L20 19.82z"/>
                              </svg>
                            </button>
                            <div style={{ width: 1, height: 24, background: '#d9d9d9', margin: '0 4px' }} />
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="撤销">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
                              </svg>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="重做">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
                              </svg>
                            </button>
                          </div>

                          {/* 工具栏第二行 */}
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px',
                            borderBottom: '1px solid #d9d9d9',
                            background: '#fafafa',
                            gap: 4
                          }}>
                            <Select size="small" style={{ width: 100 }} defaultValue="normal" options={[
                              { label: '正文', value: 'normal' },
                              { label: '标题1', value: 'h1' },
                              { label: '标题2', value: 'h2' },
                              { label: '标题3', value: 'h3' }
                            ]} />
                            <Select size="small" style={{ width: 120 }} defaultValue="default" options={[
                              { label: '默认字体', value: 'default' },
                              { label: '宋体', value: 'SimSun' },
                              { label: '微软雅黑', value: 'Microsoft YaHei' },
                              { label: 'Arial', value: 'Arial' }
                            ]} />
                            <Select size="small" style={{ width: 100 }} defaultValue="14" options={[
                              { label: '12', value: '12' },
                              { label: '14', value: '14' },
                              { label: '16', value: '16' },
                              { label: '18', value: '18' },
                              { label: '20', value: '20' },
                              { label: '24', value: '24' }
                            ]} />
                            <div style={{ width: 1, height: 24, background: '#d9d9d9', margin: '0 4px' }} />
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="插入链接">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                              </svg>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="复制格式">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                              </svg>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="插入图片">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                              </svg>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }} title="插入视频">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                              </svg>
                              <span style={{ position: 'absolute', top: -4, right: -4, background: '#ff4d4f', color: '#fff', fontSize: 10, padding: '0 4px', borderRadius: 2, fontWeight: 'bold' }}>NEW</span>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="3D展示">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18-.21 0-.41-.06-.57-.18l-7.9-4.44C3.21 17.21 3 16.88 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18.21 0 .41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9z"/>
                              </svg>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="全屏">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
                              </svg>
                            </button>
                            <button style={{ width: 32, height: 32, border: '1px solid #d9d9d9', background: '#fff', borderRadius: 4, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="代码">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                              </svg>
                            </button>
                          </div>

                          {/* 编辑区域 */}
                          <textarea
                            value={pcDescription}
                            onChange={(e) => setPcDescription(e.target.value)}
                            style={{
                              width: '100%',
                              minHeight: 400,
                              padding: 16,
                              border: 'none',
                              outline: 'none',
                              fontSize: 14,
                              lineHeight: 1.6,
                              resize: 'vertical',
                              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
                            }}
                            placeholder="请输入商品详细描述..."
                          />
                        </div>
                      </div>

                      {/* APP详描编辑 */}
                      <div style={{ marginTop: 40 }}>
                        <div style={{ marginBottom: 8, fontSize: 14, color: '#262626' }}>
                          APP详描编辑
                          <Tooltip title="为移动端APP编辑商品详细描述">
                            <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>
                              <svg viewBox="64 64 896 896" focusable="false" width="14" height="14" fill="currentColor">
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                              </svg>
                            </span>
                          </Tooltip>
                        </div>

                        {/* 导入PC详描按钮 */}
                        <div style={{ marginBottom: 24 }}>
                          <Button
                            size="small"
                            style={{
                              background: '#f5f5f5',
                              border: '1px solid #d9d9d9',
                              borderRadius: 4,
                              color: '#8c8c8c',
                              padding: '4px 15px'
                            }}
                          >
                            导入PC详描
                          </Button>
                        </div>

                        {/* 模板选择区域 */}
                        <div style={{ display: 'flex', gap: 24 }}>
                          {/* 空白模板 */}
                          <div
                            onClick={() => setSelectedAppTemplate('blank')}
                            style={{
                              width: 260,
                              border: selectedAppTemplate === 'blank' ? '2px solid #1677ff' : '1px solid #d9d9d9',
                              borderRadius: 8,
                              padding: 24,
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: 300
                            }}
                          >
                            <svg viewBox="0 0 200 200" width="120" height="120" fill="none" style={{ marginBottom: 16 }}>
                              <rect x="40" y="20" width="120" height="160" rx="4" stroke="#d9d9d9" strokeWidth="2" fill="#fafafa"/>
                              <line x1="60" y1="40" x2="140" y2="40" stroke="#d9d9d9" strokeWidth="2"/>
                              <line x1="60" y1="60" x2="140" y2="60" stroke="#d9d9d9" strokeWidth="2"/>
                              <line x1="60" y1="80" x2="100" y2="80" stroke="#d9d9d9" strokeWidth="2"/>
                            </svg>
                            <div style={{ fontSize: 14, color: '#8c8c8c', textAlign: 'center' }}>空白模板</div>
                          </div>

                          {/* 玩具行业详描模板 */}
                          <div
                            onClick={() => setSelectedAppTemplate('toy')}
                            style={{
                              width: 260,
                              border: selectedAppTemplate === 'toy' ? '2px solid #1677ff' : '1px solid #d9d9d9',
                              borderRadius: 8,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              transition: 'all 0.3s',
                              display: 'flex',
                              flexDirection: 'column',
                              minHeight: 300
                            }}
                          >
                            <div style={{ flex: 1, background: '#fff', padding: 16 }}>
                              <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#262626' }}>
                                Item Description
                              </div>
                              <div style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4, color: '#262626' }}>
                                Selling Point
                              </div>
                              <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 12, lineHeight: 1.5 }}>
                                Describe the details of the selling point above, attracting and providing trust to your potential users.
                              </div>
                              <div style={{
                                width: '100%',
                                height: 160,
                                background: '#f0f0f0',
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                              }}>
                                <div style={{
                                  position: 'absolute',
                                  inset: 0,
                                  background: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)',
                                  opacity: 0.3
                                }} />
                                <svg viewBox="0 0 24 24" width="48" height="48" fill="#8c8c8c">
                                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                                </svg>
                              </div>
                            </div>
                            <div style={{
                              padding: '12px 16px',
                              background: '#fafafa',
                              borderTop: '1px solid #d9d9d9',
                              fontSize: 14,
                              color: '#262626',
                              textAlign: 'center',
                              fontWeight: 500
                            }}>
                              玩具行业详描模板
                            </div>
                          </div>

                          {/* 查看更多详描模板 */}
                          <div
                            style={{
                              width: 260,
                              border: '1px solid #d9d9d9',
                              borderRadius: 8,
                              padding: 24,
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              minHeight: 300,
                              transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#1677ff'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = '#d9d9d9'
                            }}
                          >
                            <div style={{
                              fontSize: 18,
                              color: '#1677ff',
                              textAlign: 'center',
                              lineHeight: 1.6,
                              fontWeight: 500
                            }}>
                              查看更<br />多详描<br />模板
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
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
                  style={{ padding: '20px 0 0', scrollMarginTop: 120 }}
                >
                  <Card title="包装与物流" style={{ marginBottom: 16, border: '1px solid #d9d9d9', borderRadius: 6 }}>
                    <div>
                      {/* 发货期 */}
                      <div style={{ marginBottom: 32 }}>
                        <div style={{ marginBottom: 12, fontSize: 14, color: '#262626', fontWeight: 500 }}>
                          发货期
                        </div>
                        <div style={{ fontSize: 14, color: '#262626', lineHeight: 1.6 }}>
                          依据《全球速卖通发货管理规范》原"发货期"属性已经下线。定制商品请完成发布后移步至
                          <a href="#" style={{ color: '#1677ff', textDecoration: 'none' }}>定制管理</a>
                          "页面进行定制周期的编辑。非定制商品统一7天关单。
                        </div>
                      </div>

                      {/* 物流重量 */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 8, fontSize: 14, color: '#262626' }}>
                          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                          物流重量
                          <Tooltip title="填写商品物流重量">
                            <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>
                              <svg viewBox="64 64 896 896" focusable="false" width="14" height="14" fill="currentColor">
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                              </svg>
                            </span>
                          </Tooltip>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Input
                            size="small"
                            value={shippingWeight}
                            onChange={(e) => setShippingWeight(e.target.value)}
                            style={{ width: 200 }}
                            placeholder="请输入"
                          />
                          <span style={{ color: '#8c8c8c', fontSize: 14 }}>公斤/件</span>
                        </div>
                        <div style={{ marginTop: 12 }}>
                          <Checkbox
                            checked={customWeight}
                            onChange={(e) => setCustomWeight(e.target.checked)}
                          >
                            <span style={{ fontSize: 14, color: '#262626' }}>
                              自定义计重
                              <Tooltip title="启用自定义计重方式">
                                <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>
                                  <svg viewBox="64 64 896 896" focusable="false" width="14" height="14" fill="currentColor">
                                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                    <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                                  </svg>
                                </span>
                              </Tooltip>
                            </span>
                          </Checkbox>
                        </div>
                      </div>

                      {/* 物流尺寸 */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 8, fontSize: 14, color: '#262626' }}>
                          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                          物流尺寸
                          <Tooltip title="填写商品物流尺寸">
                            <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>
                              <svg viewBox="64 64 896 896" focusable="false" width="14" height="14" fill="currentColor">
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                              </svg>
                            </span>
                          </Tooltip>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Input
                            size="small"
                            value={packageDimensionLength}
                            onChange={(e) => setPackageDimensionLength(e.target.value)}
                            placeholder="长(cm)"
                            style={{ width: 150 }}
                          />
                          <span style={{ color: '#8c8c8c', fontSize: 16 }}>×</span>
                          <Input
                            size="small"
                            value={packageDimensionWidth}
                            onChange={(e) => setPackageDimensionWidth(e.target.value)}
                            placeholder="宽(cm)"
                            style={{ width: 150 }}
                          />
                          <span style={{ color: '#8c8c8c', fontSize: 16 }}>×</span>
                          <Input
                            size="small"
                            value={packageDimensionHeight}
                            onChange={(e) => setPackageDimensionHeight(e.target.value)}
                            placeholder="高(cm)"
                            style={{ width: 150 }}
                          />
                          <span style={{ color: '#262626', fontSize: 14 }}>
                            每件
                            {(() => {
                              const length = parseFloat(packageDimensionLength) || 0
                              const width = parseFloat(packageDimensionWidth) || 0
                              const height = parseFloat(packageDimensionHeight) || 0
                              const volume = length * width * height
                              return Math.round(volume)
                            })()}
                            cm³
                          </span>
                        </div>
                      </div>

                      {/* 日销运费模版 */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 8, fontSize: 14, color: '#262626' }}>
                          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                          日销运费模版
                          <Tooltip title="选择运费模板">
                            <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>
                              <svg viewBox="64 64 896 896" focusable="false" width="14" height="14" fill="currentColor">
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                              </svg>
                            </span>
                          </Tooltip>
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <Select
                            size="small"
                            value={shippingTemplate}
                            onChange={setShippingTemplate}
                            placeholder="请选择"
                            style={{ width: 400 }}
                            options={[
                              { label: '标准运费模板', value: 'standard' },
                              { label: '包邮运费模板', value: 'free' },
                              { label: '自定义运费模板', value: 'custom' }
                            ]}
                          />
                          <a href="#" style={{ color: '#1677ff', fontSize: 14, textDecoration: 'none' }}>
                            创建日销运费模版
                          </a>
                        </div>
                      </div>

                      {/* 服务模板 */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 8, fontSize: 14, color: '#262626' }}>
                          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                          服务模板
                        </div>
                        <Select
                          size="small"
                          value={serviceTemplate}
                          onChange={setServiceTemplate}
                          style={{ width: 200 }}
                          options={[
                            { label: '新手服务模板', value: '新手服务模板' },
                            { label: '标准服务模板', value: '标准服务模板' },
                            { label: '高级服务模板', value: '高级服务模板' }
                          ]}
                        />

                        {/* 服务模板详情表格 */}
                        <div style={{ marginTop: 16, border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '200px 1fr',
                            background: '#fafafa',
                            borderBottom: '1px solid #d9d9d9'
                          }}>
                            <div style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#262626', borderRight: '1px solid #d9d9d9' }}>
                              服务名称
                            </div>
                            <div style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500, color: '#262626' }}>
                              服务内容
                            </div>
                          </div>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '200px 1fr',
                            background: '#fff'
                          }}>
                            <div style={{ padding: '12px 16px', fontSize: 14, color: '#262626', borderRight: '1px solid #d9d9d9' }}>
                              货不对版服务
                            </div>
                            <div style={{ padding: '12px 16px', fontSize: 14, color: '#262626' }}>
                              如发现商品与描述不符买家可以选择退货或者退款
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
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
                  style={{ padding: '20px 0 0', scrollMarginTop: 120 }}
                >
                  <Card title="其它设置" style={{ marginBottom: 16, border: '1px solid #d9d9d9', borderRadius: 6 }}>
                    <div>
                      {/* 报价是否含关税 */}
                      <div style={{ marginBottom: 32 }}>
                        <div style={{ marginBottom: 12, fontSize: 14, color: '#262626' }}>
                          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                          报价是否含关税
                        </div>
                        <div style={{ marginBottom: 16 }}>
                          <Space>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <input
                                type="radio"
                                value="exclude"
                                checked={priceIncludesTax === 'exclude'}
                                onChange={(e) => setPriceIncludesTax(e.target.value)}
                                style={{ marginRight: 8 }}
                              />
                              <span style={{ fontSize: 14, color: '#262626' }}>不含关税报价</span>
                            </label>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                              <input
                                type="radio"
                                value="include"
                                checked={priceIncludesTax === 'include'}
                                onChange={(e) => setPriceIncludesTax(e.target.value)}
                                style={{ marginRight: 8 }}
                              />
                              <span style={{ fontSize: 14, color: '#262626' }}>含关税报价</span>
                            </label>
                          </Space>
                        </div>
                        {priceIncludesTax === 'include' && (
                          <Alert
                            description={
                              <div style={{ fontSize: 14, lineHeight: 1.6 }}>
                                您的订单的关税申报缴纳和物流履约将由您自行处理并承担相关责任。请前往修改美国区域定价，其中区域定价的价格需为含关税价格。若选择该模式，请确保该商品日销运费模版中已配置自定义线下物流线路确保履约正常。
                                <div style={{ marginTop: 12 }}>
                                  <Button type="primary" size="small">修改美国区域定价</Button>
                                </div>
                              </div>
                            }
                            type="info"
                            showIcon
                            style={{ background: '#e6f4ff', border: '1px solid #91caff' }}
                          />
                        )}
                      </div>

                      {/* 商品类型 */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 12, fontSize: 14, color: '#262626' }}>
                          商品类型
                          <Tooltip title="选择商品类型">
                            <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>
                              <svg viewBox="64 64 896 896" focusable="false" width="14" height="14" fill="currentColor">
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                              </svg>
                            </span>
                          </Tooltip>
                        </div>
                        <Space>
                          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="radio"
                              value="normal"
                              checked={saleType === 'normal'}
                              onChange={(e) => setSaleType(e.target.value)}
                              style={{ marginRight: 8 }}
                            />
                            <span style={{ fontSize: 14, color: '#262626' }}>普通商品</span>
                          </label>
                          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="radio"
                              value="presale"
                              checked={saleType === 'presale'}
                              onChange={(e) => setSaleType(e.target.value)}
                              style={{ marginRight: 8 }}
                            />
                            <span style={{ fontSize: 14, color: '#262626' }}>预售商品</span>
                          </label>
                        </Space>
                      </div>

                      {/* 商品分组 */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 8, fontSize: 14, color: '#262626' }}>
                          商品分组
                          <Tooltip title="选择商品分组">
                            <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>
                              <svg viewBox="64 64 896 896" focusable="false" width="14" height="14" fill="currentColor">
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                              </svg>
                            </span>
                          </Tooltip>
                        </div>
                        {/* 商品分组级联选择器 */}
                        <div style={{ position: 'relative', width: 220 }}>
                          <div
                            style={{
                              border: '1px solid #d9d9d9',
                              borderRadius: 4,
                              padding: '4px 11px',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              background: '#fff',
                              fontSize: 14,
                              minHeight: 32,
                              borderColor: productGroupDropdownOpen ? '#1677ff' : '#d9d9d9'
                            }}
                            onClick={() => setProductGroupDropdownOpen(!productGroupDropdownOpen)}
                          >
                            <span style={{ color: productGroup.length > 0 ? '#262626' : '#bfbfbf' }}>
                              {productGroup.length > 0 ? `已选 ${productGroup.length} 项` : '请选择商品分组'}
                            </span>
                            <span style={{ color: '#8c8c8c', transform: productGroupDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                              <svg viewBox="64 64 896 896" width="12" height="12" fill="currentColor">
                                <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"/>
                              </svg>
                            </span>
                          </div>

                          {/* 下拉面板 */}
                          {productGroupDropdownOpen && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                marginTop: 4,
                                background: '#fff',
                                border: '1px solid #d9d9d9',
                                borderRadius: 4,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                zIndex: 1000,
                                display: 'flex'
                              }}
                            >
                              {/* 第一级 */}
                              <div style={{ width: 150, borderRight: '1px solid #f0f0f0', maxHeight: 300, overflowY: 'auto' }}>
                                {[
                                  { label: 'BR', value: 'BR' },
                                  { label: 'GLOBAL', value: 'GLOBAL' }
                                ].map(item => (
                                  <div
                                    key={item.value}
                                    style={{
                                      padding: '8px 12px',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      background: productGroupLevel1 === item.value ? '#f5f5f5' : 'transparent',
                                      color: '#262626',
                                      fontSize: 14
                                    }}
                                    onClick={() => {
                                      setProductGroupLevel1(item.value)
                                      setProductGroupLevel2(null)
                                    }}
                                  >
                                    <span>{item.label}</span>
                                    <span style={{ color: '#8c8c8c' }}>&gt;</span>
                                  </div>
                                ))}
                              </div>

                              {/* 第二级 */}
                              {productGroupLevel1 && (
                                <div style={{ width: 160, borderRight: '1px solid #f0f0f0', maxHeight: 300, overflowY: 'auto' }}>
                                  {(() => {
                                    const level2Data: Record<string, { label: string; value: string }[]> = {
                                      'BR': [
                                        { label: 'Bandai Gundam', value: 'BR-Gundam' },
                                        { label: 'Bandai Dragon Ball', value: 'BR-DragonBall' },
                                        { label: 'Bandai Kamen Rider', value: 'BR-KamenRider' },
                                        { label: 'Bandai Ultra', value: 'BR-Ultra' },
                                        { label: 'Bandai One Piece', value: 'BR-OnePiece' },
                                        { label: 'Bandai Naruto', value: 'BR-Naruto' }
                                      ],
                                      'GLOBAL': [
                                        { label: 'Global Hot', value: 'GLOBAL-Hot' },
                                        { label: 'Global New', value: 'GLOBAL-New' },
                                        { label: 'Global Promotion', value: 'GLOBAL-Promotion' }
                                      ]
                                    }
                                    return (level2Data[productGroupLevel1] || []).map(item => (
                                      <div
                                        key={item.value}
                                        style={{
                                          padding: '8px 12px',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          alignItems: 'center',
                                          background: productGroupLevel2 === item.value ? '#f5f5f5' : 'transparent',
                                          color: '#262626',
                                          fontSize: 14,
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis'
                                        }}
                                        onClick={() => setProductGroupLevel2(item.value)}
                                      >
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                                        <span style={{ color: '#8c8c8c', marginLeft: 4, flexShrink: 0 }}>&gt;</span>
                                      </div>
                                    ))
                                  })()}
                                </div>
                              )}

                              {/* 第三级（多选） */}
                              {productGroupLevel2 && (
                                <div style={{ width: 140, maxHeight: 300, overflowY: 'auto' }}>
                                  {(() => {
                                    const level3Data: Record<string, { label: string; value: string }[]> = {
                                      'BR-Gundam': [
                                        { label: 'HG 1:144', value: 'HG-144' },
                                        { label: 'RG 1:144', value: 'RG-144' },
                                        { label: 'MG 1:100', value: 'MG-100' },
                                        { label: 'HGUC 1:144', value: 'HGUC-144' },
                                        { label: 'HGCE 1:144', value: 'HGCE-144' },
                                        { label: 'HGGTO 1:144', value: 'HGGTO-144' },
                                        { label: 'PG 1:60', value: 'PG-60' }
                                      ],
                                      'BR-DragonBall': [
                                        { label: 'S.H.Figuarts', value: 'SHF' },
                                        { label: 'Figure-rise', value: 'FigureRise' }
                                      ],
                                      'BR-KamenRider': [
                                        { label: 'S.H.Figuarts', value: 'KR-SHF' },
                                        { label: 'CSM', value: 'CSM' }
                                      ],
                                      'BR-Ultra': [
                                        { label: 'Ultra Act', value: 'UltraAct' },
                                        { label: 'S.H.Figuarts', value: 'Ultra-SHF' }
                                      ],
                                      'BR-OnePiece': [
                                        { label: 'Figuarts ZERO', value: 'FiguartsZERO' },
                                        { label: 'Portrait.Of.Pirates', value: 'POP' }
                                      ],
                                      'BR-Naruto': [
                                        { label: 'S.H.Figuarts', value: 'Naruto-SHF' },
                                        { label: 'G.E.M.', value: 'GEM' }
                                      ],
                                      'GLOBAL-Hot': [
                                        { label: '热销分组1', value: 'Hot-1' },
                                        { label: '热销分组2', value: 'Hot-2' }
                                      ],
                                      'GLOBAL-New': [
                                        { label: '新品分组1', value: 'New-1' },
                                        { label: '新品分组2', value: 'New-2' }
                                      ],
                                      'GLOBAL-Promotion': [
                                        { label: '促销分组1', value: 'Promo-1' },
                                        { label: '促销分组2', value: 'Promo-2' }
                                      ]
                                    }
                                    return (level3Data[productGroupLevel2] || []).map(item => (
                                      <div
                                        key={item.value}
                                        style={{
                                          padding: '8px 12px',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 8,
                                          color: '#262626',
                                          fontSize: 14
                                        }}
                                        onClick={() => {
                                          if (productGroup.includes(item.value)) {
                                            setProductGroup(productGroup.filter(v => v !== item.value))
                                          } else {
                                            setProductGroup([...productGroup, item.value])
                                          }
                                        }}
                                      >
                                        <Checkbox checked={productGroup.includes(item.value)} />
                                        <span>{item.label}</span>
                                      </div>
                                    ))
                                  })()}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* 已选分组显示 */}
                        {productGroup.length > 0 && (
                          <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                            {productGroup.map(g => (
                              <Tag
                                key={g}
                                closable
                                onClose={() => setProductGroup(productGroup.filter(v => v !== g))}
                              >
                                {g}
                              </Tag>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 库存扣减方式 */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 12, fontSize: 14, color: '#262626' }}>
                          库存扣减方式
                          <Tooltip title="选择库存扣减方式">
                            <span style={{ marginLeft: 4, color: '#8c8c8c', cursor: 'help' }}>
                              <svg viewBox="64 64 896 896" focusable="false" width="14" height="14" fill="currentColor">
                                <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                                <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                              </svg>
                            </span>
                          </Tooltip>
                        </div>
                        <Space>
                          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="radio"
                              value="order"
                              checked={inventoryDeduction === 'order'}
                              onChange={(e) => setInventoryDeduction(e.target.value)}
                              style={{ marginRight: 8 }}
                            />
                            <span style={{ fontSize: 14, color: '#262626' }}>下单减库存</span>
                          </label>
                          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <input
                              type="radio"
                              value="payment"
                              checked={inventoryDeduction === 'payment'}
                              onChange={(e) => setInventoryDeduction(e.target.value)}
                              style={{ marginRight: 8 }}
                            />
                            <span style={{ fontSize: 14, color: '#262626' }}>付款减库存</span>
                          </label>
                        </Space>
                      </div>

                      {/* 支付宝 */}
                      <div style={{ marginBottom: 32 }}>
                        <div style={{ marginBottom: 12, fontSize: 14, color: '#262626', fontWeight: 500 }}>
                          支付宝
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Checkbox
                            checked={alipaySupported}
                            onChange={(e) => setAlipaySupported(e.target.checked)}
                          >
                            <span style={{ fontSize: 14, color: '#262626' }}>支持</span>
                          </Checkbox>
                        </div>
                        <div style={{ fontSize: 14, color: '#8c8c8c', lineHeight: 1.6 }}>
                          通过全球速卖通交易平台进行的交易须统一使用规定的收款方式 - 支付宝担保服务。
                        </div>
                      </div>

                      {/* 商品发布条款 */}
                      <div style={{ marginBottom: 32 }}>
                        <div style={{ marginBottom: 12, fontSize: 14, color: '#262626' }}>
                          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
                          商品发布条款
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <Checkbox
                            checked={termsAgreed}
                            onChange={(e) => setTermsAgreed(e.target.checked)}
                          >
                            <span style={{ fontSize: 14, color: '#262626' }}>
                              我已阅读并同意了以下条款以及其他相关规则
                            </span>
                          </Checkbox>
                        </div>
                        <div style={{ fontSize: 14, lineHeight: 2 }}>
                          <div>
                            <a href="#" style={{ color: '#1677ff', textDecoration: 'none' }}>
                              Transaction Services Agreement
                            </a>
                            <span style={{ color: '#8c8c8c' }}> (阿里巴巴中国用户交易服务协议)</span>
                          </div>
                          <div>
                            <a href="#" style={{ color: '#1677ff', textDecoration: 'none' }}>
                              AliPay Payment Services Agreement
                            </a>
                            <span style={{ color: '#8c8c8c' }}> (支付宝付款服务协议)</span>
                          </div>
                          <div>
                            <a href="#" style={{ color: '#1677ff', textDecoration: 'none' }}>
                              速卖通平台放款政策特别约定
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* 关联欧盟责任人 */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 8, fontSize: 14, color: '#262626', fontWeight: 500 }}>
                          关联欧盟责任人
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <Select
                            size="small"
                            value={euResponsiblePerson}
                            onChange={setEuResponsiblePerson}
                            placeholder="请选择"
                            style={{ width: 400 }}
                            options={[
                              { label: '责任人A', value: 'personA' },
                              { label: '责任人B', value: 'personB' }
                            ]}
                          />
                          <a href="#" style={{ color: '#1677ff', fontSize: 14, textDecoration: 'none' }}>
                            欧盟责任人管理
                          </a>
                        </div>
                      </div>

                      {/* 关联制造商 */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ marginBottom: 8, fontSize: 14, color: '#262626', fontWeight: 500 }}>
                          关联制造商
                        </div>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                          <Select
                            size="small"
                            value={manufacturer}
                            onChange={setManufacturer}
                            placeholder="请选择"
                            style={{ width: 400 }}
                            options={[
                              { label: '制造商A', value: 'manufacturerA' },
                              { label: '制造商B', value: 'manufacturerB' }
                            ]}
                          />
                          <a href="#" style={{ color: '#1677ff', fontSize: 14, textDecoration: 'none' }}>
                            制造商管理
                          </a>
                        </div>
                        <div style={{ fontSize: 14, color: '#262626', lineHeight: 1.8 }}>
                          欧盟通用产品安全法规（GPSR）要求，售往欧盟的商品需要关联
                          <span style={{ color: '#ff4d4f', fontWeight: 500 }}>【欧盟责任人】</span>
                          和
                          <span style={{ color: '#ff4d4f', fontWeight: 500 }}>【制造商】</span>
                          信息，同时需要将欧盟责任人和制造商信息展示在商品实物标签中，否则商品将在欧盟市场屏蔽。少数特殊类目不属于管控范围，无需关联。
                          <a href="#" style={{ color: '#1677ff', textDecoration: 'none', marginLeft: 4 }}>
                            点击查看详情
                          </a>
                        </div>
                      </div>

                      {/* GPSR法规遵守说明 */}
                      <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 14, color: '#262626', lineHeight: 2 }}>
                          <div style={{ marginBottom: 8 }}>
                            为遵守《欧洲无障碍法案》("EAA")（指令 (EU) 2019/882），请确保:
                          </div>
                          <div style={{ paddingLeft: 20 }}>
                            <div>- 图片具有描述性替代文本，以帮助视障用户理解您的产品</div>
                            <div>- 产品描述有清晰的文本结构（例如标题、段落或列表），以免影响屏幕阅读器用户的无障碍浏览</div>
                            <div>- 媒体文件符合无障碍标准（带字幕的视频或带标签的 PDF 文件）</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            }
        ]}
      />
        </div>

        {/* 右侧锚点导航 */}
        <div style={{
          width: 280,
          flexShrink: 0,
          position: 'sticky',
          top: 80,
          alignSelf: 'flex-start'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 8,
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: 16, fontWeight: 'bold', color: '#262626', marginBottom: 20 }}>
              0 项商品信息完整度待优化
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { key: 'basic', label: '基本信息' },
                { key: 'price', label: '价格与库存' },
                { key: 'description', label: '详细描述' },
                { key: 'package', label: '包装与物流' },
                { key: 'other', label: '其它设置' }
              ].map(item => (
                <div
                  key={item.key}
                  onClick={() => scrollToSection(item.key)}
                  style={{
                    fontSize: 14,
                    color: mainTab === item.key ? '#262626' : '#595959',
                    cursor: 'pointer',
                    paddingLeft: 12,
                    paddingTop: 8,
                    paddingBottom: 8,
                    borderLeft: mainTab === item.key ? '3px solid #1677ff' : '3px solid transparent',
                    fontWeight: mainTab === item.key ? 500 : 400,
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (mainTab !== item.key) {
                      e.currentTarget.style.color = '#262626'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (mainTab !== item.key) {
                      e.currentTarget.style.color = '#595959'
                    }
                  }}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div style={{
        background: '#fff',
        borderTop: '1px solid #d9d9d9',
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        marginTop: 40
      }}>
        <Button
          type="primary"
          size="large"
          loading={submitting}
          style={{
            minWidth: 200,
            height: 48,
            fontSize: 16,
            fontWeight: 500
          }}
          onClick={() => handleSubmit(false)}
        >
          提交
        </Button>
        <Button
          size="large"
          loading={submitting}
          style={{
            minWidth: 200,
            height: 48,
            fontSize: 16,
            fontWeight: 500,
            borderColor: '#1677ff',
            color: '#1677ff'
          }}
          onClick={() => handleSubmit(true)}
        >
          保存草稿
        </Button>
      </div>

      <style jsx global>{`
        .product-create-sections > .ant-tabs-content-holder > .ant-tabs-content {
          display: block;
        }
        .product-create-sections > .ant-tabs-content-holder > .ant-tabs-content > .ant-tabs-tabpane {
          display: block !important;
          height: auto !important;
        }
      `}</style>

      {/* 图片上传弹窗 */}
      <ImageUploadModal
        visible={imageUploadModalVisible}
        onClose={() => setImageUploadModalVisible(false)}
        onConfirm={(images) => {
          // 根据 currentUploadTarget 保存图片到对应位置
          if (images.length > 0) {
            // 营销图只存储一张图片
            const isMarketingImage = currentUploadTarget.startsWith('marketing-')
            if (isMarketingImage) {
              setCountryImages(prev => ({
                ...prev,
                [currentUploadTarget]: [images[0]]
              }))
            } else {
              // 普通商品图追加到数组
              const targetKey = resolveImageTargetKey(currentUploadTarget, selectedCountries)
              setCountryImages(prev => ({
                ...prev,
                [targetKey]: [...(prev[targetKey] || []), ...images]
              }))
            }
          }
          setImageUploadModalVisible(false)
        }}
        maxCount={6}
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
          setVideoUrl(video.url)
          setVideoCoverUrl(video.cover)
          setVideoUploadModalVisible(false)
        }}
      />

      {/* 认证选择弹窗 */}
      <Modal
        title="请选择"
        open={certificationModalVisible}
        onCancel={() => setCertificationModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setCertificationModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={() => setCertificationModalVisible(false)}>
            确定
          </Button>
        ]}
      >
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="搜索"
              prefix={<SearchOutlined />}
              value={certificationSearch}
              onChange={(e) => setCertificationSearch(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            <Checkbox
              checked={selectedCertifications.length === certificationOptions.length}
              indeterminate={selectedCertifications.length > 0 && selectedCertifications.length < certificationOptions.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedCertifications(certificationOptions.map(opt => opt.value))
                } else {
                  setSelectedCertifications([])
                }
              }}
              style={{ marginBottom: 16 }}
            >
              全选
            </Checkbox>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
              {certificationOptions
                .filter(opt => !certificationSearch || opt.label.toLowerCase().includes(certificationSearch.toLowerCase()))
                .map(opt => (
                  <Checkbox
                    key={opt.value}
                    checked={selectedCertifications.includes(opt.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCertifications(prev => [...prev, opt.value])
                      } else {
                        setSelectedCertifications(prev => prev.filter(v => v !== opt.value))
                      }
                    }}
                  >
                    {opt.label}
                  </Checkbox>
                ))}
            </div>
          </div>
          <div style={{ width: 100, textAlign: 'right', color: '#8C8C8C' }}>
            已选{selectedCertifications.length}
          </div>
        </div>
      </Modal>

      {/* 玩具娃娃适合场合弹窗 */}
      <Modal
        title="请选择"
        open={occasionModalVisible}
        onCancel={() => setOccasionModalVisible(false)}
        width={800}
        footer={[
          <Button key="cancel" onClick={() => setOccasionModalVisible(false)}>
            取消
          </Button>,
          <Button key="confirm" type="primary" onClick={() => setOccasionModalVisible(false)}>
            确定
          </Button>
        ]}
      >
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <Input
              placeholder="搜索"
              prefix={<SearchOutlined />}
              value={occasionSearch}
              onChange={(e) => setOccasionSearch(e.target.value)}
              style={{ marginBottom: 16 }}
            />
            <Checkbox
              checked={selectedOccasions.length === occasionOptions.length}
              indeterminate={selectedOccasions.length > 0 && selectedOccasions.length < occasionOptions.length}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedOccasions(occasionOptions.map(opt => opt.value))
                } else {
                  setSelectedOccasions([])
                }
              }}
              style={{ marginBottom: 16 }}
            >
              全选
            </Checkbox>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px' }}>
              {occasionOptions
                .filter(opt => !occasionSearch || opt.label.toLowerCase().includes(occasionSearch.toLowerCase()))
                .map(opt => (
                  <Checkbox
                    key={opt.value}
                    checked={selectedOccasions.includes(opt.value)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedOccasions(prev => [...prev, opt.value])
                      } else {
                        setSelectedOccasions(prev => prev.filter(v => v !== opt.value))
                      }
                    }}
                  >
                    {opt.label}
                  </Checkbox>
                ))}
            </div>
          </div>
          <div style={{ width: 100, textAlign: 'right', color: '#8C8C8C' }}>
            已选{selectedOccasions.length}
          </div>
        </div>
      </Modal>

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
