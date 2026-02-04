export interface MediaItem {
  id: number
  filename: string
  url: string
  type: 'image' | 'video'
  size: number
  width?: number
  height?: number
  duration?: number
  folder: string
  createdAt: string
}

export interface MediaFolder {
  name: string
  count: number
}

export interface MediaListParams {
  folder?: string
  type?: 'image' | 'video'
  page?: number
  pageSize?: number
  search?: string
  startDate?: string
  endDate?: string
}
