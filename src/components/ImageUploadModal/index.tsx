'use client'

import { Modal, Tabs } from 'antd'
import { useState } from 'react'
import UploadTab from './UploadTab'
import SelectTab from './SelectTab'

interface ImageUploadModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (images: string[]) => void
  maxCount?: number // 最多选择数量
  sizeLimit?: number // 大小限制（MB）
  minDimensions?: { width: number; height: number } // 最小尺寸
  acceptFormats?: string[] // 支持的格式
  folder?: string // 默认文件夹
}

export default function ImageUploadModal({
  visible,
  onClose,
  onConfirm,
  maxCount = 1,
  sizeLimit = 5,
  minDimensions = { width: 800, height: 800 },
  acceptFormats = ['jpg', 'jpeg', 'png'],
  folder = '商品发布'
}: ImageUploadModalProps) {
  const [activeTab, setActiveTab] = useState('upload')
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  const handleConfirm = () => {
    // TODO: 实现确认逻辑
    onConfirm(selectedImages)
    onClose()
  }

  const handleCancel = () => {
    setSelectedImages([])
    onClose()
  }

  const tabItems = [
    {
      key: 'upload',
      label: '上传图片',
      children: (
        <UploadTab
          maxCount={maxCount}
          sizeLimit={sizeLimit}
          minDimensions={minDimensions}
          acceptFormats={acceptFormats}
          defaultFolder={folder}
          onUploadSuccess={(urls) => setSelectedImages(urls)}
        />
      )
    },
    {
      key: 'select',
      label: '选择图片',
      children: (
        <SelectTab
          maxCount={maxCount}
          selectedImages={selectedImages}
          onSelectChange={setSelectedImages}
        />
      )
    }
  ]

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      width={1200}
      footer={null}
      centered
      destroyOnHidden
      styles={{
        body: { padding: 0 }
      }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ margin: 0 }}
        tabBarStyle={{
          paddingLeft: 24,
          paddingRight: 24,
          marginBottom: 0
        }}
      />
    </Modal>
  )
}
