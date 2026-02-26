'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Input, Button, Checkbox, Pagination, Spin, Upload, message } from 'antd'
import {
  SearchOutlined, ReloadOutlined, UploadOutlined,
  AppstoreOutlined, UnorderedListOutlined, CheckOutlined, CloseOutlined,
} from '@ant-design/icons'
import type { MediaItem, MediaFolder } from '@/types/media'

const BLUE = '#1677ff'

interface TemuMediaModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (urls: string[]) => void
  maxCount?: number
  defaultMediaType?: 'all' | 'image' | 'video'
}

export default function TemuMediaModal({ visible, onClose, onConfirm, maxCount = 10, defaultMediaType = 'image' }: TemuMediaModalProps) {
  const [folder, setFolder] = useState('全部')
  const [search, setSearch] = useState('')
  const [mediaType, setMediaType] = useState<'all' | 'image' | 'video'>(defaultMediaType)
  const [onlyAvail, setOnlyAvail] = useState(true)
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<MediaItem[]>([])
  const [total, setTotal] = useState(0)
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  const PAGE_SIZE = 10

  // 获取文件夹列表
  useEffect(() => {
    if (!visible) return
    fetch('/api/temu/media/folders').then(r => r.json()).then(res => {
      if (res.success) setFolders(res.data.folders)
    }).catch(() => {})
  }, [visible])

  // 获取图片列表
  const fetchItems = useCallback(() => {
    if (!visible) return
    setLoading(true)
    const params = new URLSearchParams({
      type: mediaType === 'all' ? 'image' : mediaType,
      page: String(page),
      pageSize: String(PAGE_SIZE),
      ...(folder !== '全部' && { folder }),
      ...(search && { search }),
    })
    fetch(`/api/temu/media?${params}`).then(r => r.json()).then(res => {
      if (res.success) {
        setItems(res.data.items)
        setTotal(res.data.total)
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [visible, folder, search, mediaType, page])

  useEffect(() => { fetchItems() }, [fetchItems])

  // 重置状态
  useEffect(() => {
    if (!visible) {
      setSelected([]); setSearch(''); setPage(1)
    } else {
      setMediaType(defaultMediaType)
    }
  }, [visible, defaultMediaType])

  const toggleSelect = (url: string) => {
    setSelected(prev => {
      if (prev.includes(url)) return prev.filter(u => u !== url)
      if (prev.length >= maxCount) {
        message.warning(`最多选择 ${maxCount} 张`)
        return prev
      }
      return [...prev, url]
    })
  }

  // 本地上传
  const handleUpload = async (file: File) => {
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder === '全部' ? '未分组' : folder)
    try {
      const res = await fetch('/api/temu/media/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        message.success('上传成功')
        fetchItems()
      } else {
        message.error(data.error || '上传失败')
      }
    } catch {
      message.error('上传失败')
    } finally {
      setUploading(false)
    }
    return false // 阻止 antd 默认上传
  }

  if (!visible) return null

  const folderList = [{ name: '全部', count: total }, ...folders]

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        width: '90vw', maxWidth: 1300, height: '85vh',
        backgroundColor: '#fff', borderRadius: 8,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* 弹窗标题栏 */}
        <div style={{
          padding: '14px 20px', borderBottom: '1px solid #f0f0f0',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 600 }}>素材中心</span>
            <a href="#" style={{ color: BLUE, fontSize: 13 }}>进入素材中心</a>
          </div>
          <CloseOutlined style={{ cursor: 'pointer', color: '#999', fontSize: 16 }} onClick={onClose} />
        </div>

        {/* 主体：左侧目录 + 右侧内容 */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* 左侧目录 */}
          <div style={{ width: 180, borderRight: '1px solid #f0f0f0', overflowY: 'auto', padding: '8px 0', flexShrink: 0 }}>
            {folderList.map(f => (
              <div key={f.name} onClick={() => { setFolder(f.name); setPage(1) }}
                style={{
                  padding: '8px 16px', fontSize: 13, cursor: 'pointer',
                  backgroundColor: folder === f.name ? '#EBF2FF' : 'transparent',
                  color: folder === f.name ? BLUE : '#333',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}
                onMouseEnter={e => { if (folder !== f.name) (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5' }}
                onMouseLeave={e => { if (folder !== f.name) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {f.name === '全部' ? 'All Materials' : f.name}
                </span>
                {f.count > 0 && <span style={{ fontSize: 11, color: '#999' }}>{f.count}</span>}
              </div>
            ))}
          </div>

          {/* 右侧 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* 工具栏 */}
            <div style={{
              padding: '10px 16px', borderBottom: '1px solid #f0f0f0',
              display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flexShrink: 0,
            }}>
              <Input
                prefix={<SearchOutlined style={{ color: '#bbb' }} />}
                placeholder="请输入素材名称"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onPressEnter={() => { setPage(1); fetchItems() }}
                style={{ width: 200 }}
                size="small"
              />
              <Button size="small" icon={<ReloadOutlined />} onClick={fetchItems}>刷新</Button>
              <Upload showUploadList={false} beforeUpload={handleUpload} accept="image/*">
                <Button size="small" icon={<UploadOutlined />} loading={uploading}>本地上传</Button>
              </Upload>
              <Checkbox checked={onlyAvail} onChange={e => setOnlyAvail(e.target.checked)} style={{ fontSize: 13 }}>
                仅展示可用
              </Checkbox>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center' }}>
                {(['all', 'image', 'video'] as const).map(t => (
                  <button key={t} onClick={() => { setMediaType(t); setPage(1) }} style={{
                    padding: '3px 12px', border: `1px solid ${mediaType === t ? BLUE : '#d9d9d9'}`,
                    borderRadius: 4, cursor: 'pointer', fontSize: 13,
                    backgroundColor: mediaType === t ? '#fff' : '#fff',
                    color: mediaType === t ? BLUE : '#666',
                    fontWeight: mediaType === t ? 500 : 400,
                  }}>
                    {t === 'all' ? '全部' : t === 'image' ? '图片' : '视频'}
                  </button>
                ))}
                <AppstoreOutlined style={{ marginLeft: 8, fontSize: 16, color: '#666', cursor: 'pointer' }} />
                <UnorderedListOutlined style={{ fontSize: 16, color: '#bbb', cursor: 'pointer' }} />
              </div>
            </div>

            {/* 图片网格 */}
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                  <Spin />
                </div>
              ) : items.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 200, color: '#999' }}>
                  <UploadOutlined style={{ fontSize: 40, marginBottom: 12 }} />
                  <div>暂无素材，点击"本地上传"添加图片</div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                  {items.map(item => {
                    const isSelected = selected.includes(item.url)
                    return (
                      <div key={item.id} onClick={() => toggleSelect(item.url)} style={{
                        border: `2px solid ${isSelected ? BLUE : '#f0f0f0'}`,
                        borderRadius: 6, overflow: 'hidden', cursor: 'pointer',
                        backgroundColor: '#fafafa', position: 'relative',
                      }}>
                        {/* 选中角标 */}
                        {isSelected && (
                          <div style={{
                            position: 'absolute', top: 6, right: 6,
                            width: 20, height: 20, borderRadius: '50%',
                            backgroundColor: BLUE, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', zIndex: 1,
                          }}>
                            <CheckOutlined style={{ color: '#fff', fontSize: 11 }} />
                          </div>
                        )}
                        {/* 图片 */}
                        <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', backgroundColor: '#f5f5f5' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.url} alt={item.filename}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                        </div>
                        {/* 标题 */}
                        <div style={{ padding: '6px 8px' }}>
                          <div style={{
                            fontSize: 12, color: '#333', marginBottom: 4,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {item.filename.replace(/\.[^.]+$/, '').substring(0, 20)}
                          </div>
                          <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                            <a href="#" onClick={e => e.stopPropagation()} style={{ color: BLUE }}>裁剪</a>
                            <a href="#" onClick={e => e.stopPropagation()} style={{ color: BLUE }}>美化</a>
                            <a href="#" onClick={e => e.stopPropagation()} style={{ color: BLUE }}>翻译</a>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 分页 */}
            {total > 0 && (
              <div style={{ padding: '10px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
                <span style={{ fontSize: 13, color: '#666', marginRight: 12 }}>共有 {total} 条</span>
                <Pagination
                  current={page} total={total} pageSize={PAGE_SIZE}
                  onChange={p => setPage(p)} size="small" showSizeChanger={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* 底部确认栏 */}
        <div style={{
          borderTop: '1px solid #f0f0f0', padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, flexShrink: 0,
        }}>
          <span style={{ fontSize: 13, color: '#999' }}>宽高比例为1:1且宽高均大于800px，大小2M内</span>
          <span style={{ fontSize: 13, color: '#333', fontWeight: 500 }}>
            已选 <span style={{ color: BLUE }}>{selected.length}</span> 个，可选 {maxCount} 个
          </span>
          <Button size="large" style={{ width: 80 }} onClick={onClose}>取消</Button>
          <Button type="primary" size="large" style={{ width: 80 }}
            disabled={selected.length === 0}
            onClick={() => { onConfirm(selected); onClose() }}>
            确认
          </Button>
        </div>

      </div>
    </div>
  )
}
