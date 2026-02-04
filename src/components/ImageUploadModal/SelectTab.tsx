'use client'

import { useState, useEffect, useCallback } from 'react'
import { DatePicker, Input, Checkbox, Pagination, Select, Button, Spin, Empty } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { MediaItem, MediaFolder } from '@/types/media'

const { RangePicker } = DatePicker

interface SelectTabProps {
  maxCount: number
  selectedImages: string[]
  onSelectChange: (images: string[]) => void
  onConfirm?: () => void
  onCancel?: () => void
}

export default function SelectTab({
  maxCount,
  selectedImages,
  onSelectChange,
  onConfirm,
  onCancel
}: SelectTabProps) {
  const [currentFolder, setCurrentFolder] = useState('全部')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(24)
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)

  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [images, setImages] = useState<MediaItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // 获取文件夹列表
  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch('/api/media/folders')
      const result = await res.json()
      if (result.success) {
        // 添加"全部"选项
        const allCount = result.data.folders.reduce((sum: number, f: MediaFolder) => sum + f.count, 0)
        setFolders([{ name: '全部', count: allCount }, ...result.data.folders])
      }
    } catch (error) {
      console.error('获取文件夹失败:', error)
    }
  }, [])

  // 获取图片列表
  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: 'image',
        page: String(currentPage),
        pageSize: String(pageSize)
      })

      if (currentFolder !== '全部') {
        params.set('folder', currentFolder)
      }

      if (searchKeyword.trim()) {
        params.set('search', searchKeyword.trim())
      }

      if (dateRange) {
        params.set('startDate', dateRange[0])
        params.set('endDate', dateRange[1])
      }

      const res = await fetch(`/api/media?${params.toString()}`)
      const result = await res.json()

      if (result.success) {
        setImages(result.data.items)
        setTotal(result.data.total)
      }
    } catch (error) {
      console.error('获取图片失败:', error)
    } finally {
      setLoading(false)
    }
  }, [currentFolder, currentPage, pageSize, searchKeyword, dateRange])

  // 初始加载
  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  // 加载图片
  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  // 切换文件夹时重置页码
  const handleFolderChange = (folder: string) => {
    setCurrentFolder(folder)
    setCurrentPage(1)
  }

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1)
    fetchImages()
  }

  // 图片选择
  const handleImageSelect = (imageUrl: string, checked: boolean) => {
    if (checked) {
      if (selectedImages.length >= maxCount) {
        return
      }
      onSelectChange([...selectedImages, imageUrl])
    } else {
      onSelectChange(selectedImages.filter(url => url !== imageUrl))
    }
  }

  // 计算总页数
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div style={{ display: 'flex', height: 600 }}>
      {/* 左侧分类 */}
      <div
        style={{
          width: 200,
          borderRight: '1px solid #F0F0F0',
          padding: '16px 0',
          overflowY: 'auto'
        }}
      >
        {folders.map((folder) => (
          <div
            key={folder.name}
            onClick={() => handleFolderChange(folder.name)}
            style={{
              padding: '8px 24px',
              cursor: 'pointer',
              backgroundColor: currentFolder === folder.name ? '#E6F7FF' : 'transparent',
              color: currentFolder === folder.name ? '#1677FF' : '#262626',
              fontSize: 14,
              whiteSpace: 'nowrap',
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <span>{folder.name}</span>
            <span style={{ color: '#8c8c8c' }}>{folder.count}</span>
          </div>
        ))}
      </div>

      {/* 右侧内容 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 顶部筛选 */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #F0F0F0',
            display: 'flex',
            gap: 12
          }}
        >
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            style={{ width: 300 }}
            onChange={(dates, dateStrings) => {
              if (dates) {
                setDateRange([dateStrings[0], dateStrings[1]])
              } else {
                setDateRange(null)
              }
              setCurrentPage(1)
            }}
          />
          <Input
            placeholder="在当前文件夹搜索图..."
            suffix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={handleSearch}
          />
        </div>

        {/* 图片网格 */}
        <div
          style={{
            flex: 1,
            padding: 24,
            overflowY: 'auto'
          }}
        >
          <Spin spinning={loading}>
            {images.length === 0 ? (
              <Empty description="暂无图片" />
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 16
                }}
              >
                {images.map((image) => (
                  <div
                    key={image.id}
                    style={{
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      const isSelected = selectedImages.includes(image.url)
                      handleImageSelect(image.url, !isSelected)
                    }}
                  >
                    {/* 复选框 */}
                    <Checkbox
                      checked={selectedImages.includes(image.url)}
                      disabled={!selectedImages.includes(image.url) && selectedImages.length >= maxCount}
                      onChange={(e) => {
                        e.stopPropagation()
                        handleImageSelect(image.url, e.target.checked)
                      }}
                      style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        zIndex: 1
                      }}
                    />

                    {/* 图片 */}
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        backgroundColor: '#F5F5F5',
                        border: selectedImages.includes(image.url)
                          ? '2px solid #1677FF'
                          : '1px solid #E8E8E8',
                        borderRadius: 4,
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      <img
                        src={image.url}
                        alt={image.filename}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1zaXplPSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iIGZpbGw9IiM4YzhjOGMiPuWKoOi9veWksei0pTwvdGV4dD48L3N2Zz4='
                        }}
                      />
                      {/* 格式标签 */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 8,
                          right: 8,
                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                          color: '#fff',
                          padding: '2px 6px',
                          fontSize: 10,
                          borderRadius: 2,
                          textTransform: 'uppercase'
                        }}
                      >
                        {image.filename.split('.').pop()}
                      </div>
                    </div>

                    {/* 文件名和尺寸 */}
                    <div style={{ marginTop: 8 }}>
                      <div
                        style={{
                          fontSize: 12,
                          color: '#262626',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {image.filename}
                      </div>
                      <div style={{ fontSize: 12, color: '#8C8C8C' }}>
                        {image.width && image.height ? `${image.width} * ${image.height}` : '--'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Spin>
        </div>

        {/* 分页 */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #F0F0F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: 14, color: '#262626' }}>
            共计 <span style={{ color: '#1677FF' }}>{total}</span> 张
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(page)}
            />

            <Select
              value={pageSize}
              onChange={(value) => {
                setPageSize(value)
                setCurrentPage(1)
              }}
              style={{ width: 120 }}
              options={[
                { label: '24 条/页', value: 24 },
                { label: '48 条/页', value: 48 },
                { label: '96 条/页', value: 96 }
              ]}
            />

            <span style={{ fontSize: 14, color: '#262626' }}>跳至</span>
            <Input
              type="number"
              style={{ width: 60 }}
              min={1}
              max={totalPages}
              onPressEnter={(e) => {
                const page = parseInt((e.target as HTMLInputElement).value)
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page)
                }
              }}
            />
            <span style={{ fontSize: 14, color: '#262626' }}>页</span>
          </div>
        </div>

        {/* 底部按钮 */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #F0F0F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ fontSize: 14, color: '#262626' }}>
            已选择 <span style={{ color: '#1677FF' }}>{selectedImages.length}</span> / {maxCount} 张
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              disabled={selectedImages.length === 0}
              onClick={onConfirm}
            >
              确定
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
