'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input, Checkbox, Select, Button, Spin, Empty, Pagination } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { MediaItem, MediaFolder } from '@/types/media'

interface MediaTabProps {
  selectedVideo: MediaItem | null
  onSelectChange: (video: MediaItem | null) => void
  onConfirm: () => void
  onCancel: () => void
}

export default function MediaTab({
  selectedVideo,
  onSelectChange,
  onConfirm,
  onCancel
}: MediaTabProps) {
  const [currentFolder, setCurrentFolder] = useState('全部视频')
  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12
  const [sizeFilter, setSizeFilter] = useState<string | undefined>()
  const [sortBy, setSortBy] = useState<string>('time')

  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [videos, setVideos] = useState<MediaItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // 获取文件夹列表
  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch('/api/media/folders')
      const result = await res.json()
      if (result.success) {
        // 过滤视频相关文件夹，添加全部视频选项
        const videoFolders = result.data.folders.filter(
          (f: MediaFolder) => f.name.includes('视频') || f.name === '未分组'
        )
        const allCount = videoFolders.reduce((sum: number, f: MediaFolder) => sum + f.count, 0)
        setFolders([
          { name: '全部视频', count: allCount },
          ...videoFolders
        ])
      }
    } catch (error) {
      console.error('获取文件夹失败:', error)
    }
  }, [])

  // 获取视频列表
  const fetchVideos = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: 'video',
        page: String(currentPage),
        pageSize: String(pageSize)
      })

      if (currentFolder !== '全部视频') {
        params.set('folder', currentFolder)
      }

      if (searchKeyword.trim()) {
        params.set('search', searchKeyword.trim())
      }

      // 排序
      if (sortBy) {
        params.set('sortBy', sortBy)
      }

      const res = await fetch(`/api/media?${params.toString()}`)
      const result = await res.json()

      if (result.success) {
        let items = result.data.items

        // 前端过滤文件大小（后端暂不支持）
        if (sizeFilter) {
          items = items.filter((item: MediaItem) => {
            const sizeMB = item.size / 1024 / 1024
            switch (sizeFilter) {
              case '10': return sizeMB < 10
              case '50': return sizeMB >= 10 && sizeMB < 50
              case '100': return sizeMB >= 50 && sizeMB < 100
              case '100+': return sizeMB >= 100
              default: return true
            }
          })
        }

        setVideos(items)
        setTotal(result.data.total)
      }
    } catch (error) {
      console.error('获取视频失败:', error)
    } finally {
      setLoading(false)
    }
  }, [currentFolder, currentPage, pageSize, searchKeyword, sortBy, sizeFilter])

  // 初始加载
  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  // 加载视频
  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  // 切换文件夹时重置页码
  const handleFolderChange = (folder: string) => {
    setCurrentFolder(folder)
    setCurrentPage(1)
  }

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1)
    fetchVideos()
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const formatSize = (bytes: number) => {
    const mb = bytes / 1024 / 1024
    if (mb < 1) {
      return `${(bytes / 1024).toFixed(1)} KB`
    }
    return `${mb.toFixed(1)} MB`
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

        {/* 底部搜索 */}
        <div style={{ padding: '16px 24px', marginTop: 'auto' }}>
          <Input
            placeholder="在此文件夹下搜索"
            prefix={<SearchOutlined style={{ color: '#8C8C8C' }} />}
            size="small"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={handleSearch}
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
            placeholder="搜索视频"
            prefix={<SearchOutlined />}
            style={{ width: 240 }}
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Select
            placeholder="文件体积"
            style={{ width: 140 }}
            allowClear
            value={sizeFilter}
            onChange={(value) => {
              setSizeFilter(value)
              setCurrentPage(1)
            }}
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
            value={sortBy}
            onChange={(value) => {
              setSortBy(value)
              setCurrentPage(1)
            }}
            options={[
              { label: '上传时间', value: 'time' },
              { label: '文件大小', value: 'size' },
              { label: '文件名称', value: 'name' }
            ]}
          />
        </div>

        {/* 已选择提示 */}
        <div style={{ padding: '12px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <span style={{ fontSize: 14, color: '#262626' }}>
            已选择: <span style={{ color: '#1677FF' }}>{selectedVideo ? 1 : 0}</span> 个视频
          </span>
        </div>

        {/* 视频网格 */}
        <div
          style={{
            flex: 1,
            padding: 24,
            overflowY: 'auto'
          }}
        >
          <Spin spinning={loading}>
            {videos.length === 0 ? (
              <Empty description="暂无视频" />
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: 16
                }}
              >
                {videos.map((video) => (
                  <div
                    key={video.id}
                    style={{
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      if (selectedVideo?.id === video.id) {
                        onSelectChange(null)
                      } else {
                        onSelectChange(video)
                      }
                    }}
                  >
                    {/* 复选框 */}
                    <Checkbox
                      checked={selectedVideo?.id === video.id}
                      onChange={(e) => {
                        e.stopPropagation()
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
                      {/* 视频缩略图或默认图 */}
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#1a1a1a',
                          color: '#fff'
                        }}
                      >
                        <span style={{ fontSize: 24 }}>▶</span>
                      </div>
                      {/* 时长标签 */}
                      {video.duration && (
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
                      )}
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
                        {video.filename}
                      </div>
                      <div style={{ fontSize: 12, color: '#8C8C8C' }}>
                        {video.duration ? formatDuration(video.duration) : '--'} | {formatSize(video.size)}
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
            padding: '12px 24px',
            borderTop: '1px solid #F0F0F0',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 12
          }}
        >
          <span style={{ fontSize: 14, color: '#8c8c8c' }}>
            共 {total} 个视频
          </span>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger={false}
            onChange={(page) => setCurrentPage(page)}
            size="small"
          />
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
          <Button type="link" style={{ padding: 0 }}>
            去媒体中心管理视频
          </Button>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="default" onClick={onCancel}>取消</Button>
            <Button
              type="primary"
              disabled={!selectedVideo}
              onClick={onConfirm}
            >
              确定
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
