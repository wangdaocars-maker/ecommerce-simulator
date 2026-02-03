'use client'

import { useState } from 'react'
import { DatePicker, Input, Checkbox, Pagination, Select, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const { RangePicker } = DatePicker

interface ImageFile {
  id: string
  url: string
  name: string
  width: number
  height: number
  format: string
  folder: string
}

interface SelectTabProps {
  maxCount: number
  selectedImages: string[]
  onSelectChange: (images: string[]) => void
}

// TODO: 从后端API获取图片数据
// Mock 数据用于展示样式
const mockImages: ImageFile[] = [
  {
    id: '1',
    url: '/marketing-example-1-1.jpg',
    name: 'DXM202512301234567890',
    width: 800,
    height: 800,
    format: 'JPG',
    folder: '商品发布'
  },
  {
    id: '2',
    url: '/marketing-example-3-4.jpg',
    name: 'DXM202512301234567891',
    width: 800,
    height: 800,
    format: 'JPG',
    folder: '商品发布'
  },
  {
    id: '3',
    url: '/marketing-example-1-1.jpg',
    name: 'DXM202512301234567892',
    width: 800,
    height: 800,
    format: 'JPG',
    folder: '商品发布'
  },
  {
    id: '4',
    url: '/marketing-example-3-4.jpg',
    name: 'DXM202512301234567893',
    width: 800,
    height: 800,
    format: 'JPG',
    folder: '商品发布'
  },
  {
    id: '5',
    url: '/marketing-example-1-1.jpg',
    name: 'DXM202512301234567894',
    width: 800,
    height: 800,
    format: 'JPG',
    folder: '商品发布'
  },
  {
    id: '6',
    url: '/marketing-example-3-4.jpg',
    name: 'DXM202512301234567895',
    width: 800,
    height: 800,
    format: 'JPG',
    folder: '商品发布'
  }
]

export default function SelectTab({
  maxCount,
  selectedImages,
  onSelectChange
}: SelectTabProps) {
  const [currentFolder, setCurrentFolder] = useState('全部图片')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(24)

  const folders = [
    { name: '全部图片', count: 3317 },
    { name: '未分组图片', count: 125 },
    { name: '商品发布', count: 2890 },
    { name: '店铺资料', count: 302 }
  ]

  const handleImageSelect = (imageId: string, checked: boolean) => {
    // TODO: 实现图片选择逻辑
    if (checked) {
      if (selectedImages.length >= maxCount) {
        console.warn(`最多只能选择 ${maxCount} 张图片`)
        return
      }
      onSelectChange([...selectedImages, imageId])
    } else {
      onSelectChange(selectedImages.filter(id => id !== imageId))
    }
  }

  return (
    <div style={{ display: 'flex', height: 600 }}>
      {/* 左侧分类 */}
      <div
        style={{
          width: 200,
          borderRight: '1px solid #F0F0F0',
          padding: '16px 0'
        }}
      >
        {folders.map((folder) => (
          <div
            key={folder.name}
            onClick={() => setCurrentFolder(folder.name)}
            style={{
              padding: '8px 24px',
              cursor: 'pointer',
              backgroundColor: currentFolder === folder.name ? '#E6F7FF' : 'transparent',
              color: currentFolder === folder.name ? '#1677FF' : '#262626',
              fontSize: 14,
              whiteSpace: 'nowrap'
            }}
          >
            {folder.name}
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
            // TODO: 实现日期筛选
            onChange={(dates) => console.log('日期范围:', dates)}
          />
          <Input
            placeholder="在当前文件夹搜索图..."
            suffix={<SearchOutlined />}
            style={{ width: 300 }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            // TODO: 实现搜索功能
            onPressEnter={() => console.log('搜索:', searchKeyword)}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gap: 16
            }}
          >
            {mockImages.map((image) => (
              <div
                key={image.id}
                style={{
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                {/* 复选框 */}
                <Checkbox
                  checked={selectedImages.includes(image.id)}
                  onChange={(e) => handleImageSelect(image.id, e.target.checked)}
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
                    border: selectedImages.includes(image.id)
                      ? '2px solid #1677FF'
                      : '1px solid #E8E8E8',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
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
                      borderRadius: 2
                    }}
                  >
                    {image.format}
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
                    {image.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#8C8C8C' }}>
                    {image.width} * {image.height}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            共计 <span style={{ color: '#1677FF' }}>3317</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={3317}
              showSizeChanger={false}
              onChange={(page) => {
                setCurrentPage(page)
                // TODO: 加载对应页数据
                console.log('切换到第', page, '页')
              }}
            />

            <Select
              value={pageSize}
              onChange={(value) => {
                setPageSize(value)
                setCurrentPage(1)
                // TODO: 重新加载数据
                console.log('每页显示', value, '条')
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
              max={139}
              // TODO: 实现跳转功能
              onPressEnter={(e) => {
                const page = parseInt((e.target as HTMLInputElement).value)
                if (page >= 1 && page <= 139) {
                  setCurrentPage(page)
                  console.log('跳转到第', page, '页')
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
          <Button
            type="link"
            style={{ padding: 0 }}
            // TODO: 实现跳转到媒体中心
            onClick={() => console.log('前往媒体中心')}
          >
            前往媒体中心
          </Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="default">确定</Button>
            <Button type="default">取消</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
