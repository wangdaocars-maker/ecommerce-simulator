'use client'

import { useState } from 'react'
import { Input, Checkbox, Select, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface VideoFile {
  id: string
  url: string
  name: string
  cover: string
  duration: number
  size: number
}

interface MediaTabProps {
  selectedVideo: any
  onSelectChange: (video: any) => void
  onConfirm: () => void
  onCancel: () => void
}

// TODO: 从后端API获取视频数据
// Mock 数据用于展示样式
const mockVideos: VideoFile[] = [
  {
    id: '1',
    url: '/videos/mock1.mp4',
    name: '78943d1a-45...',
    cover: '/marketing-example-1-1.jpg',
    duration: 26,
    size: 15.2
  },
  {
    id: '2',
    url: '/videos/mock2.mp4',
    name: '389e4d87-3e...',
    cover: '/marketing-example-3-4.jpg',
    duration: 14,
    size: 8.5
  }
]

export default function MediaTab({
  selectedVideo,
  onSelectChange,
  onConfirm,
  onCancel
}: MediaTabProps) {
  const [currentFolder, setCurrentFolder] = useState('全部视频')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectAll, setSelectAll] = useState(false)

  const folders = [
    { name: '全部视频' },
    { name: '未分组视频' }
  ]

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ display: 'flex', height: 600 }}>
      {/* 左侧分类 */}
      <div
        style={{
          width: 200,
          borderRight: '1px solid #F0F0F0',
          display: 'flex',
          flexDirection: 'column',
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

        {/* 底部搜索 */}
        <div style={{ padding: '16px 24px', marginTop: 'auto' }}>
          <Input
            placeholder="在此文件夹下搜索"
            prefix={<SearchOutlined style={{ color: '#8C8C8C' }} />}
            size="small"
          />
        </div>
      </div>

      {/* 右侧内容 */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* 顶部筛选 */}
        <div
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid #F0F0F0',
            display: 'flex',
            gap: 12,
            alignItems: 'center'
          }}
        >
          <Input
            placeholder="在此文件夹下搜索"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            // TODO: 实现搜索功能
          />
          <Select
            placeholder="文件体积"
            style={{ width: 140 }}
            // TODO: 实现文件体积筛选
            options={[
              { label: '小于10MB', value: '10' },
              { label: '10-50MB', value: '50' },
              { label: '50-100MB', value: '100' },
              { label: '大于100MB', value: '100+' }
            ]}
          />
          <Select
            placeholder="排序方式"
            style={{ width: 140 }}
            // TODO: 实现排序
            options={[
              { label: '上传时间', value: 'time' },
              { label: '文件大小', value: 'size' },
              { label: '文件名称', value: 'name' }
            ]}
          />
          <Select
            placeholder="标签筛选"
            style={{ width: 140 }}
            // TODO: 实现标签筛选
            options={[
              { label: '标签1', value: 'tag1' },
              { label: '标签2', value: 'tag2' }
            ]}
          />
        </div>

        {/* 全选 */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <Checkbox
            checked={selectAll}
            onChange={(e) => setSelectAll(e.target.checked)}
          >
            全选 已选择: {selectedVideo ? 1 : 0}
          </Checkbox>
        </div>

        {/* 视频网格 */}
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
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16
            }}
          >
            {mockVideos.map((video) => (
              <div
                key={video.id}
                style={{
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                {/* 复选框 */}
                <Checkbox
                  checked={selectedVideo?.id === video.id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectChange(video)
                    } else {
                      onSelectChange(null)
                    }
                  }}
                  style={{
                    position: 'absolute',
                    top: 8,
                    left: 8,
                    zIndex: 1
                  }}
                />

                {/* 视频封面 */}
                <div
                  style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    backgroundColor: '#F5F5F5',
                    border: selectedVideo?.id === video.id
                      ? '2px solid #1677FF'
                      : '1px solid #E8E8E8',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  <img
                    src={video.cover}
                    alt={video.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  {/* 时长标签 */}
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
                    {formatDuration(video.duration)}
                  </div>
                </div>

                {/* 文件名和信息 */}
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
                    {video.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#8C8C8C' }}>
                    {formatDuration(video.duration)}
                  </div>
                </div>
              </div>
            ))}
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
            onClick={() => console.log('去媒体中心管理视频')}
          >
            去媒体中心管理视频
          </Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="default" onClick={onCancel}>取消</Button>
            <Button type="primary" onClick={onConfirm}>确定</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
