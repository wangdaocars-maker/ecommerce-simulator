# VideoUploadModal 视频上传弹窗组件

这是一个公共的视频上传弹窗组件，用于所有需要上传视频的场景。

## 功能特性

- ✅ 两个标签页：本地上传 / 媒体中心
- ✅ 支持拖拽上传视频
- ✅ 支持点击上传视频
- ✅ 视频名称输入
- ✅ 视频封面上传
- ✅ 文件格式、大小、时长校验
- ✅ 视频库管理（分类）
- ✅ 视频搜索和筛选
- ⏳ 待实现功能详见 `types.ts`

## 使用方法

```tsx
import VideoUploadModal from '@/components/VideoUploadModal'
import { useState } from 'react'

function YourComponent() {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <button onClick={() => setModalVisible(true)}>
        上传视频
      </button>

      <VideoUploadModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(video) => {
          console.log('选中的视频:', video)
          // 处理选中的视频
        }}
      />
    </>
  )
}
```

## Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| visible | boolean | - | 是否显示弹窗 |
| onClose | () => void | - | 关闭弹窗回调 |
| onConfirm | (video) => void | - | 确认选择回调，返回视频信息对象 |

## 视频信息对象

```typescript
{
  url: string        // 视频URL
  name: string       // 视频名称
  cover: string      // 封面URL
  duration: number   // 时长（秒）
}
```

## 文件结构

```
VideoUploadModal/
├── index.tsx           # 主组件（Modal + Tabs）
├── UploadTab.tsx       # 本地上传标签页
├── MediaTab.tsx        # 媒体中心标签页
├── types.ts            # 类型定义和待实现功能列表
└── README.md           # 使用文档
```

## 视频要求

- **格式**：mp4, wmv, avi, mpg, flv, mov, 3gp
- **大小**：不超过 500MB
- **时长**：不超过 180秒
- **比例**：建议 16:9 或 1:1
- **分辨率**：建议 ≥720p

## 当前状态

✅ **已完成**：前端UI样式完整实现
⏳ **进行中**：功能实现（所有TODO标注的地方）
📋 **待开发**：后端API接口

## 待实现功能清单

详见 `types.ts` 文件底部的详细功能列表和API需求。
