'use client'

import { Modal, Tabs } from 'antd'
import { useState } from 'react'
import UploadTab from './UploadTab'
import MediaTab from './MediaTab'
import type { MediaItem } from '@/types/media'

interface VideoUploadModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (video: { url: string; name: string; cover: string; duration: number }) => void
}

export default function VideoUploadModal({
  visible,
  onClose,
  onConfirm
}: VideoUploadModalProps) {
  const [activeTab, setActiveTab] = useState('upload')
  const [selectedVideo, setSelectedVideo] = useState<MediaItem | null>(null)

  const handleConfirm = () => {
    if (selectedVideo) {
      onConfirm({
        url: selectedVideo.url,
        name: selectedVideo.filename,
        cover: '', // 从媒体中心选择的视频暂无封面
        duration: selectedVideo.duration || 0
      })
    }
    onClose()
  }

  const handleCancel = () => {
    setSelectedVideo(null)
    onClose()
  }

  const handleUploadSuccess = (video: { url: string; name: string; cover: string; duration: number }) => {
    onConfirm(video)
  }

  const tabItems = [
    {
      key: 'upload',
      label: '本地上传',
      children: (
        <UploadTab
          onUploadSuccess={handleUploadSuccess}
          onConfirm={onClose}
          onCancel={handleCancel}
        />
      )
    },
    {
      key: 'media',
      label: '媒体中心',
      children: (
        <MediaTab
          selectedVideo={selectedVideo}
          onSelectChange={setSelectedVideo}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )
    }
  ]

  return (
    <Modal
      title="选择视频"
      open={visible}
      onCancel={handleCancel}
      width={1200}
      footer={null}
      centered
      destroyOnHidden
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        style={{ margin: 0 }}
      />
    </Modal>
  )
}
