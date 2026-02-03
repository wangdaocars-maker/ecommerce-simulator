# ImageUploadModal 图片上传弹窗组件

这是一个公共的图片上传弹窗组件，用于所有需要上传图片的场景。

## 功能特性

- ✅ 两个标签页：上传图片 / 选择图片
- ✅ 支持拖拽上传
- ✅ 支持点击上传
- ✅ 文件格式、大小、尺寸校验
- ✅ 图片库管理（文件夹分类）
- ✅ 图片搜索和筛选
- ✅ 分页显示
- ⏳ 待实现功能详见 `types.ts`

## 使用方法

```tsx
import ImageUploadModal from '@/components/ImageUploadModal'
import { useState } from 'react'

function YourComponent() {
  const [modalVisible, setModalVisible] = useState(false)

  return (
    <>
      <button onClick={() => setModalVisible(true)}>
        上传图片
      </button>

      <ImageUploadModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={(images) => {
          console.log('选中的图片:', images)
          // 处理选中的图片
        }}
        maxCount={1}
        sizeLimit={5}
        minDimensions={{ width: 800, height: 800 }}
        acceptFormats={['jpg', 'jpeg', 'png']}
        folder="商品发布"
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
| onConfirm | (images: string[]) => void | - | 确认选择回调，返回图片URL数组 |
| maxCount | number | 1 | 最多选择图片数量 |
| sizeLimit | number | 5 | 文件大小限制（MB） |
| minDimensions | { width, height } | { width: 800, height: 800 } | 最小尺寸要求 |
| acceptFormats | string[] | ['jpg', 'jpeg', 'png'] | 支持的文件格式 |
| folder | string | '商品发布' | 默认上传到的文件夹 |

## 文件结构

```
ImageUploadModal/
├── index.tsx           # 主组件（Modal + Tabs）
├── UploadTab.tsx       # 上传标签页
├── SelectTab.tsx       # 选择标签页
├── types.ts            # 类型定义和待实现功能列表
└── README.md           # 使用文档
```

## 当前状态

✅ **已完成**：前端UI样式完整实现
⏳ **进行中**：功能实现（所有TODO标注的地方）
📋 **待开发**：后端API接口

## 待实现功能清单

详见 `types.ts` 文件底部的详细功能列表和API需求。
