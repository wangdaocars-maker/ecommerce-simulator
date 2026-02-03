'use client'

import { Upload, Select, Button } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'

const { Dragger } = Upload

interface UploadTabProps {
  maxCount: number
  sizeLimit: number
  minDimensions: { width: number; height: number }
  acceptFormats: string[]
  defaultFolder: string
  onUploadSuccess: (urls: string[]) => void
}

export default function UploadTab({
  maxCount,
  sizeLimit,
  minDimensions,
  acceptFormats,
  defaultFolder,
  onUploadSuccess
}: UploadTabProps) {
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: maxCount > 1,
    maxCount: maxCount,
    accept: acceptFormats.map(f => `.${f}`).join(','),
    // TODO: 实现上传功能
    // action: '/api/media/upload',
    beforeUpload: (file) => {
      // TODO: 实现文件校验
      // 1. 检查文件格式
      const isValidFormat = acceptFormats.some(format =>
        file.type === `image/${format}` || file.name.toLowerCase().endsWith(`.${format}`)
      )
      if (!isValidFormat) {
        console.error(`文件格式不支持！仅支持 ${acceptFormats.join(', ')} 格式`)
        return false
      }

      // 2. 检查文件大小
      const isValidSize = file.size / 1024 / 1024 < sizeLimit
      if (!isValidSize) {
        console.error(`文件大小超出限制！最大 ${sizeLimit}MB`)
        return false
      }

      // TODO: 3. 检查图片尺寸（需要异步加载图片）
      // 需要创建 Image 对象，onload 后检查 width 和 height

      return false // 暂时阻止实际上传
    },
    onChange(info) {
      // TODO: 实现上传状态处理
      const { status } = info.file
      if (status === 'done') {
        console.log(`${info.file.name} 上传成功`)
        // onUploadSuccess([info.file.response.url])
      } else if (status === 'error') {
        console.error(`${info.file.name} 上传失败`)
      }
    },
    onDrop(e) {
      console.log('拖拽文件:', e.dataTransfer.files)
    }
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* 上传到 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, color: '#262626', marginBottom: 12, fontWeight: 500 }}>
          上传到
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Select
            defaultValue={defaultFolder}
            style={{ width: 300 }}
            size="middle"
            // TODO: 实现文件夹列表获取
            // options={folderOptions}
            options={[
              { label: '商品发布', value: '商品发布' },
              { label: '店铺资料', value: '店铺资料' },
              { label: '未分组图片', value: '未分组' }
            ]}
          />
          <Button
            type="link"
            style={{ padding: 0 }}
            // TODO: 实现创建新文件夹
            onClick={() => console.log('创建新文件夹')}
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
        <Button
          type="link"
          style={{ padding: 0 }}
          // TODO: 实现跳转到媒体中心
          onClick={() => console.log('前往媒体中心')}
        >
          前往媒体中心
        </Button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="default"
            disabled
            // TODO: 根据是否有上传文件来控制禁用状态
          >
            确认上传
          </Button>
          <Button type="default">取消</Button>
        </div>
      </div>
    </div>
  )
}
