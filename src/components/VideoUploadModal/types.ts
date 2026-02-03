/**
 * 视频上传弹窗相关类型定义
 */

export interface VideoFile {
  id: string
  url: string
  name: string
  cover: string
  duration: number
  size: number
  folder: string
  uploadTime: string
}

export interface VideoUploadModalProps {
  visible: boolean
  onClose: () => void
  onConfirm: (video: { url: string; name: string; cover: string; duration: number }) => void
}

/**
 * 待实现的功能列表：
 *
 * 1. 视频上传功能
 *    - [ ] 实现拖拽上传
 *    - [ ] 实现点击上传
 *    - [ ] 文件格式校验（mp4, wmv, avi, mpg, flv, mov, 3gp）
 *    - [ ] 文件大小校验（< 500MB）
 *    - [ ] 视频时长校验（< 180s，需要异步读取视频元数据）
 *    - [ ] 视频比例建议（16:9或1:1）
 *    - [ ] 视频分辨率建议（≥720p）
 *    - [ ] 上传进度显示
 *    - [ ] 上传成功/失败提示
 *
 * 2. 视频封面上传
 *    - [ ] 封面图片上传
 *    - [ ] 图片格式校验（jpg, jpeg, png）
 *    - [ ] 从视频自动截取封面（可选功能）
 *
 * 3. 视频名称
 *    - [ ] 视频名称输入
 *    - [ ] 名称长度限制
 *    - [ ] 名称重复检测
 *
 * 4. 媒体中心功能
 *    - [ ] 获取视频列表 API: GET /api/media/videos?folder=&page=&pageSize=&search=&sizeRange=&sort=&tags=
 *    - [ ] 视频单选功能
 *    - [ ] 视频预览功能
 *    - [ ] 文件体积筛选
 *    - [ ] 排序方式（上传时间、文件大小、文件名称）
 *    - [ ] 标签筛选
 *    - [ ] 关键词搜索
 *    - [ ] 分页加载（如需要）
 *
 * 5. 其他功能
 *    - [ ] 去媒体中心管理视频（跳转到媒体管理页面）
 *    - [ ] 确认选择（返回选中的视频信息）
 *    - [ ] 取消操作（关闭弹窗并清空选择）
 *
 * 6. 后端API需求
 *    - [ ] POST /api/media/upload-video - 上传视频
 *      请求：multipart/form-data (file, name, cover, folder)
 *      响应：{ url: string, id: string, duration: number, size: number }
 *
 *    - [ ] POST /api/media/upload-cover - 上传封面
 *      请求：multipart/form-data (file)
 *      响应：{ url: string }
 *
 *    - [ ] GET /api/media/videos - 获取视频列表
 *      查询参数：folder, page, pageSize, search, sizeRange, sort, tags
 *      响应：{ videos: VideoFile[], total: number }
 *
 * 7. 视频元数据读取
 *    - [ ] 使用 HTML5 Video API 读取视频时长
 *    - [ ] 读取视频分辨率
 *    - [ ] 读取视频比例
 */
