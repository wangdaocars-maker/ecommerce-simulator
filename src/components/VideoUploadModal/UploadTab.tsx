'use client'

import { Upload, Input, Button, message, Progress } from 'antd'
import { InboxOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState, useRef } from 'react'
import type { UploadProps, UploadFile } from 'antd'

const { Dragger } = Upload

interface UploadTabProps {
  onUploadSuccess: (video: { url: string; name: string; cover: string; duration: number }) => void
  onConfirm?: () => void
  onCancel?: () => void
}

export default function UploadTab({ onUploadSuccess, onConfirm, onCancel }: UploadTabProps) {
  const [videoFile, setVideoFile] = useState<UploadFile | null>(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoName, setVideoName] = useState('')
  const [videoCover, setVideoCover] = useState('')
  const [coverFile, setCoverFile] = useState<UploadFile | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 获取视频时长
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src)
        resolve(Math.floor(video.duration))
      }
      video.onerror = () => {
        reject(new Error('无法读取视频元数据'))
      }
      video.src = URL.createObjectURL(file)
    })
  }

  // 上传文件到服务器
  const uploadFile = async (file: File, folder: string = '未分组视频'): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

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
      message.error('网络错误')
      return null
    }
  }

  const videoUploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    maxCount: 1,
    accept: '.mp4,.wmv,.avi,.mpg,.flv,.mov,.3gp',
    fileList: videoFile ? [videoFile] : [],
    beforeUpload: async (file) => {
      // 1. 检查文件格式
      const validFormats = ['mp4', 'wmv', 'avi', 'mpg', 'flv', 'mov', '3gp']
      const isValidFormat = validFormats.some(format =>
        file.name.toLowerCase().endsWith(`.${format}`)
      )
      if (!isValidFormat) {
        message.error(`文件格式不支持！仅支持 ${validFormats.join(', ')} 格式`)
        return Upload.LIST_IGNORE
      }

      // 2. 检查文件大小（500MB）
      const isValidSize = file.size / 1024 / 1024 < 500
      if (!isValidSize) {
        message.error('文件大小超出限制！最大 500MB')
        return Upload.LIST_IGNORE
      }

      // 3. 检查视频时长
      try {
        const duration = await getVideoDuration(file)
        if (duration > 180) {
          message.error('视频时长超出限制！最长 180 秒')
          return Upload.LIST_IGNORE
        }
        setVideoDuration(duration)
        setVideoName(file.name.replace(/\.[^/.]+$/, '')) // 去掉扩展名作为默认名称
      } catch {
        message.error('无法读取视频信息')
        return Upload.LIST_IGNORE
      }

      return false // 手动上传
    },
    onChange(info) {
      const { fileList } = info
      if (fileList.length > 0) {
        setVideoFile(fileList[0])
      } else {
        setVideoFile(null)
        setVideoDuration(0)
        setVideoName('')
      }
    },
    onRemove() {
      setVideoFile(null)
      setVideoDuration(0)
      setVideoName('')
    }
  }

  const coverUploadProps: UploadProps = {
    name: 'file',
    accept: '.jpg,.jpeg,.png',
    showUploadList: false,
    beforeUpload: async (file) => {
      // 检查文件格式
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('请上传图片文件')
        return Upload.LIST_IGNORE
      }

      // 检查大小（5MB）
      if (file.size / 1024 / 1024 > 5) {
        message.error('封面图片不能超过 5MB')
        return Upload.LIST_IGNORE
      }

      return false
    },
    onChange(info) {
      const { fileList } = info
      if (fileList.length > 0) {
        setCoverFile(fileList[0])
        // 预览封面
        if (fileList[0].originFileObj) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setVideoCover(e.target?.result as string)
          }
          reader.readAsDataURL(fileList[0].originFileObj)
        }
      }
    }
  }

  // 确认上传
  const handleConfirmUpload = async () => {
    if (!videoFile?.originFileObj) {
      message.warning('请先选择视频文件')
      return
    }
    if (!videoName.trim()) {
      message.warning('请输入视频名称')
      return
    }
    if (!coverFile?.originFileObj) {
      message.warning('请上传视频封面')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // 1. 上传封面
      setUploadProgress(10)
      const coverUrl = await uploadFile(coverFile.originFileObj, '视频封面')
      if (!coverUrl) {
        setUploading(false)
        return
      }

      // 2. 上传视频
      setUploadProgress(30)
      const url = await uploadFile(videoFile.originFileObj, '未分组视频')
      if (!url) {
        setUploading(false)
        return
      }

      setUploadProgress(100)

      // 3. 回调成功
      message.success('视频上传成功')
      onUploadSuccess({
        url,
        name: videoName.trim(),
        cover: coverUrl,
        duration: videoDuration
      })

      // 清空状态
      setVideoFile(null)
      setCoverFile(null)
      setVideoName('')
      setVideoCover('')
      setVideoDuration(0)
      setUploadProgress(0)
      onConfirm?.()
    } catch {
      message.error('上传失败')
    } finally {
      setUploading(false)
    }
  }

  // 删除封面
  const handleRemoveCover = () => {
    setCoverFile(null)
    setVideoCover('')
  }

  const canSubmit = videoFile && videoName.trim() && coverFile

  return (
    <div style={{ padding: '24px' }}>
      {/* 视频文件 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
          <span style={{ fontSize: 14, color: '#262626' }}>视频文件：</span>
        </div>
        <Dragger {...videoUploadProps} style={{ marginBottom: 12 }}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: '#8C8C8C', fontSize: 48 }} />
          </p>
          <p style={{ fontSize: 14, color: '#262626', marginBottom: 8 }}>
            点击此处或者将文件拖至此处
          </p>
          <p style={{ fontSize: 12, color: '#8C8C8C', margin: 0, lineHeight: '20px' }}>
            视频时长不超过 180s,不超过 500MB，支持 mp4,wmv,avi,mpg,flv,mov,3gp 格式，建议视频比例 16:9和1:1；
            <br />
            建议最小分辨率≥720p
          </p>
        </Dragger>
        {videoFile && videoDuration > 0 && (
          <div style={{ fontSize: 12, color: '#52c41a', marginTop: 8 }}>
            ✓ 视频时长: {Math.floor(videoDuration / 60)}分{videoDuration % 60}秒
          </div>
        )}
      </div>

      {/* 视频名称 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
          <span style={{ fontSize: 14, color: '#262626' }}>视频名称：</span>
        </div>
        <Input
          placeholder="请输入视频名称"
          value={videoName}
          onChange={(e) => setVideoName(e.target.value)}
          size="large"
          maxLength={100}
          showCount
        />
      </div>

      {/* 视频封面 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
          <span style={{ fontSize: 14, color: '#262626' }}>视频封面：</span>
        </div>
        {videoCover ? (
          <div style={{ position: 'relative', width: 140, height: 140 }}>
            <img
              src={videoCover}
              alt="封面预览"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 4
              }}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={handleRemoveCover}
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                backgroundColor: 'rgba(255,255,255,0.8)'
              }}
            />
          </div>
        ) : (
          <Upload {...coverUploadProps}>
            <div
              style={{
                width: 140,
                height: 140,
                border: '1px dashed #d9d9d9',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <PlusOutlined style={{ fontSize: 24, color: '#8C8C8C' }} />
              <div style={{ marginTop: 8, fontSize: 14, color: '#595959' }}>
                上传图片
              </div>
            </div>
          </Upload>
        )}
      </div>

      {/* 上传进度 */}
      {uploading && (
        <div style={{ marginBottom: 24 }}>
          <Progress percent={uploadProgress} status="active" />
        </div>
      )}

      {/* 底部按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button type="link" style={{ padding: 0 }}>
          去媒体中心管理视频
        </Button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="default" onClick={onCancel}>取消</Button>
          <Button
            type="primary"
            disabled={!canSubmit}
            loading={uploading}
            onClick={handleConfirmUpload}
          >
            确定
          </Button>
        </div>
      </div>

      {/* 隐藏的 video 元素用于获取时长 */}
      <video ref={videoRef} style={{ display: 'none' }} />
    </div>
  )
}
