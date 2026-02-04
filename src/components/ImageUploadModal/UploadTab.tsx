'use client'

import { useState, useEffect } from 'react'
import { Upload, Select, Button, message, Modal, Input } from 'antd'
import { InboxOutlined, PlusOutlined } from '@ant-design/icons'
import type { UploadProps, UploadFile } from 'antd'

const { Dragger } = Upload

interface UploadTabProps {
  maxCount: number
  sizeLimit: number
  minDimensions: { width: number; height: number }
  acceptFormats: string[]
  defaultFolder: string
  onUploadSuccess: (urls: string[]) => void
  onConfirm?: () => void
  onCancel?: () => void
}

interface FolderOption {
  name: string
  count: number
}

export default function UploadTab({
  maxCount,
  sizeLimit,
  minDimensions,
  acceptFormats,
  defaultFolder,
  onUploadSuccess,
  onConfirm,
  onCancel
}: UploadTabProps) {
  const [selectedFolder, setSelectedFolder] = useState(defaultFolder)
  const [folders, setFolders] = useState<FolderOption[]>([])
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [newFolderModalVisible, setNewFolderModalVisible] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  // 获取文件夹列表
  useEffect(() => {
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    try {
      const res = await fetch('/api/media/folders')
      const result = await res.json()
      if (result.success) {
        setFolders(result.data.folders)
      }
    } catch (error) {
      console.error('获取文件夹失败:', error)
    }
  }

  // 创建新文件夹
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      message.error('请输入文件夹名称')
      return
    }

    try {
      const res = await fetch('/api/media/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName.trim() })
      })
      const result = await res.json()
      if (result.success) {
        message.success('文件夹创建成功')
        setFolders([...folders, result.data.folder])
        setSelectedFolder(newFolderName.trim())
        setNewFolderModalVisible(false)
        setNewFolderName('')
      } else {
        message.error(result.error || '创建失败')
      }
    } catch {
      message.error('网络错误')
    }
  }

  // 检查图片尺寸
  const checkImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        URL.revokeObjectURL(img.src)
        if (img.width < minDimensions.width || img.height < minDimensions.height) {
          message.error(`图片尺寸不足，最小要求 ${minDimensions.width}x${minDimensions.height}`)
          resolve(false)
        } else {
          resolve(true)
        }
      }
      img.onerror = () => {
        resolve(false)
      }
      img.src = URL.createObjectURL(file)
    })
  }

  // 上传单个文件
  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', selectedFolder)

    try {
      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData
      })
      const result = await res.json()
      if (result.success) {
        return result.data.url
      } else {
        message.error(result.error || '上传失败')
        return null
      }
    } catch {
      message.error('上传失败')
      return null
    }
  }

  // 确认上传
  const handleConfirmUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请先选择要上传的图片')
      return
    }

    setUploading(true)
    const urls: string[] = []

    for (const file of fileList) {
      if (file.originFileObj) {
        const url = await uploadFile(file.originFileObj)
        if (url) {
          urls.push(url)
        }
      }
    }

    setUploading(false)

    if (urls.length > 0) {
      message.success(`成功上传 ${urls.length} 张图片`)
      setUploadedUrls(urls)
      onUploadSuccess(urls)
      setFileList([])
      onConfirm?.()
    }
  }

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: maxCount > 1,
    maxCount: maxCount,
    accept: acceptFormats.map(f => `.${f}`).join(','),
    fileList,
    beforeUpload: async (file) => {
      // 1. 检查文件格式
      const isValidFormat = acceptFormats.some(format =>
        file.type === `image/${format}` || file.name.toLowerCase().endsWith(`.${format}`)
      )
      if (!isValidFormat) {
        message.error(`文件格式不支持！仅支持 ${acceptFormats.join(', ')} 格式`)
        return Upload.LIST_IGNORE
      }

      // 2. 检查文件大小
      const isValidSize = file.size / 1024 / 1024 < sizeLimit
      if (!isValidSize) {
        message.error(`文件大小超出限制！最大 ${sizeLimit}MB`)
        return Upload.LIST_IGNORE
      }

      // 3. 检查图片尺寸
      const isValidDimensions = await checkImageDimensions(file)
      if (!isValidDimensions) {
        return Upload.LIST_IGNORE
      }

      return false // 手动上传，不自动上传
    },
    onChange(info) {
      setFileList(info.fileList)
    },
    onRemove(file) {
      setFileList(prev => prev.filter(f => f.uid !== file.uid))
    },
    onDrop(e) {
      console.log('拖拽文件:', e.dataTransfer.files)
    }
  }

  const folderOptions = folders.map(f => ({
    label: `${f.name} (${f.count})`,
    value: f.name
  }))

  return (
    <div style={{ padding: '24px' }}>
      {/* 上传到 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, color: '#262626', marginBottom: 12, fontWeight: 500 }}>
          上传到
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Select
            value={selectedFolder}
            onChange={setSelectedFolder}
            style={{ width: 300 }}
            size="middle"
            options={folderOptions}
            placeholder="选择文件夹"
          />
          <Button
            type="link"
            icon={<PlusOutlined />}
            style={{ padding: 0 }}
            onClick={() => setNewFolderModalVisible(true)}
          >
            创建新文件夹
          </Button>
        </div>
      </div>

      {/* 上传区域 */}
      <Dragger {...uploadProps} style={{ marginBottom: 24 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined style={{ color: '#1677FF', fontSize: 48 }} />
        </p>
        <p style={{ fontSize: 14, color: '#262626', marginBottom: 8 }}>
          点击此处或者将文件拖至此处
        </p>
        <p style={{ fontSize: 12, color: '#8C8C8C', margin: 0 }}>
          仅支持 {acceptFormats.join(', ')} 格式，大小必须小于 {sizeLimit}.0 MB, 尺寸不低于{' '}
          {minDimensions.width}x{minDimensions.height}
        </p>
        <p style={{ fontSize: 12, color: '#8C8C8C', margin: 0 }}>
          支持图片批量上传，最多支持 {maxCount} 张图片
        </p>
      </Dragger>

      {/* 底部按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button type="link" style={{ padding: 0 }}>
          前往媒体中心
        </Button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="primary"
            loading={uploading}
            disabled={fileList.length === 0}
            onClick={handleConfirmUpload}
          >
            确认上传 {fileList.length > 0 && `(${fileList.length})`}
          </Button>
          <Button onClick={onCancel}>取消</Button>
        </div>
      </div>

      {/* 创建文件夹弹窗 */}
      <Modal
        title="创建新文件夹"
        open={newFolderModalVisible}
        onOk={handleCreateFolder}
        onCancel={() => {
          setNewFolderModalVisible(false)
          setNewFolderName('')
        }}
        okText="创建"
        cancelText="取消"
      >
        <Input
          placeholder="请输入文件夹名称"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          onPressEnter={handleCreateFolder}
        />
      </Modal>
    </div>
  )
}
