'use client'

import { Upload, Input, Button } from 'antd'
import { InboxOutlined, PlusOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { UploadProps } from 'antd'

const { Dragger } = Upload

interface UploadTabProps {
  onUploadSuccess: (video: any) => void
}

export default function UploadTab({ onUploadSuccess }: UploadTabProps) {
  const [videoName, setVideoName] = useState('')
  const [videoCover, setVideoCover] = useState('')

  const videoUploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.mp4,.wmv,.avi,.mpg,.flv,.mov,.3gp',
    // TODO: 实现视频上传功能
    // action: '/api/media/upload-video',
    beforeUpload: (file) => {
      // TODO: 实现文件校验
      // 1. 检查文件格式
      const validFormats = ['mp4', 'wmv', 'avi', 'mpg', 'flv', 'mov', '3gp']
      const isValidFormat = validFormats.some(format =>
        file.name.toLowerCase().endsWith(`.${format}`)
      )
      if (!isValidFormat) {
        console.error(`文件格式不支持！仅支持 ${validFormats.join(', ')} 格式`)
        return false
      }

      // 2. 检查文件大小（500MB）
      const isValidSize = file.size / 1024 / 1024 < 500
      if (!isValidSize) {
        console.error('文件大小超出限制！最大 500MB')
        return false
      }

      // TODO: 3. 检查视频时长（需要异步读取视频）
      // 需要创建 video 元素，onloadedmetadata 后检查 duration

      return false // 暂时阻止实际上传
    },
    onChange(info) {
      // TODO: 实现上传状态处理
      const { status } = info.file
      if (status === 'done') {
        console.log(`${info.file.name} 上传成功`)
      } else if (status === 'error') {
        console.error(`${info.file.name} 上传失败`)
      }
    }
  }

  const coverUploadProps: UploadProps = {
    name: 'file',
    accept: '.jpg,.jpeg,.png',
    showUploadList: false,
    // TODO: 实现封面上传
    beforeUpload: (file) => {
      console.log('上传封面:', file.name)
      return false
    }
  }

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
        />
      </div>

      {/* 视频封面 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 12 }}>
          <span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>
          <span style={{ fontSize: 14, color: '#262626' }}>视频封面：</span>
        </div>
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
      </div>

      {/* 底部按钮 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          type="link"
          style={{ padding: 0 }}
          // TODO: 实现跳转到媒体中心
          onClick={() => console.log('去媒体中心管理视频')}
        >
          去媒体中心管理视频
        </Button>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="default">取消</Button>
          <Button
            type="primary"
            disabled
            // TODO: 根据是否填写完整来控制禁用状态
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}
