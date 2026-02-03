/**
 * 图片上传弹窗相关类型定义
 */

export interface ImageFile {
  id: string
  url: string
  name: string
  width: number
  height: number
  size: number
  format: string
  folder: string
  uploadTime: string
}

export interface Folder {
  id: string
  name: string
  count: number
}

export interface ImageUploadModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (images: string[]) => void
  maxCount?: number // 最多选择数量
  sizeLimit?: number // 大小限制（MB）
  minDimensions?: { width: number; height: number } // 最小尺寸
  acceptFormats?: string[] // 支持的格式
  folder?: string // 默认文件夹
}

/**
 * 待实现的功能列表：
 *
 * 1. 文件上传功能
 *    - [ ] 实现拖拽上传
 *    - [ ] 实现点击上传
 *    - [ ] 文件格式校验（jpg, png, jpeg）
 *    - [ ] 文件大小校验（< 5MB）
 *    - [ ] 文件尺寸校验（≥ 800x800，需要异步读取图片）
 *    - [ ] 上传进度显示
 *    - [ ] 上传成功/失败提示
 *
 * 2. 文件夹管理
 *    - [ ] 获取文件夹列表 API: GET /api/media/folders
 *    - [ ] 创建新文件夹 API: POST /api/media/folders/create
 *    - [ ] 文件夹切换功能
 *
 * 3. 图片库功能
 *    - [ ] 获取图片列表 API: GET /api/media/images?folder=&page=&pageSize=&search=&startDate=&endDate=
 *    - [ ] 图片多选功能（受 maxCount 限制）
 *    - [ ] 图片预览功能
 *    - [ ] 日期范围筛选
 *    - [ ] 关键词搜索
 *    - [ ] 分页加载
 *    - [ ] 跳转页码
 *
 * 4. 其他功能
 *    - [ ] 前往媒体中心（跳转到媒体管理页面）
 *    - [ ] 确认选择（返回选中的图片URL数组）
 *    - [ ] 取消操作（关闭弹窗并清空选择）
 *
 * 5. 后端API需求
 *    - [ ] POST /api/media/upload - 上传图片
 *      请求：multipart/form-data (file, folder)
 *      响应：{ url: string, id: string, width: number, height: number }
 *
 *    - [ ] GET /api/media/folders - 获取文件夹列表
 *      响应：{ folders: Array<{ id, name, count }> }
 *
 *    - [ ] POST /api/media/folders/create - 创建文件夹
 *      请求：{ name: string }
 *      响应：{ id: string, name: string }
 *
 *    - [ ] GET /api/media/images - 获取图片列表
 *      查询参数：folder, page, pageSize, search, startDate, endDate
 *      响应：{ images: ImageFile[], total: number }
 */
