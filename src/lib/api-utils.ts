import { auth } from '@/lib/auth'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

/**
 * 包装需要认证的 API 处理函数
 * 自动处理认证检查和错误捕获
 */
export async function withAuth<T>(
  handler: (userId: number) => Promise<T>
): Promise<Response> {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json(
      { success: false, error: '请先登录' },
      { status: 401 }
    )
  }

  try {
    const result = await handler(parseInt(session.user.id))
    return Response.json({ success: true, data: result })
  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '服务器错误'
      },
      { status: 500 }
    )
  }
}

/**
 * 获取当前用户 ID（从 session）
 * 如果未登录返回 null
 */
export async function getCurrentUserId(): Promise<number | null> {
  const session = await auth()
  if (!session?.user?.id) {
    return null
  }
  return parseInt(session.user.id)
}

/**
 * 格式化价格显示
 */
export function formatPrice(price: number, currency: string = 'CNY'): string {
  return `${currency} ${price.toFixed(2)}`
}

/**
 * 格式化转化率
 */
export function formatConversion(rate: number): string {
  return `${(rate * 100).toFixed(2)}%`
}

/**
 * 格式化日期时间
 */
export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

/**
 * 安全解析 JSON 字段
 */
export function safeJsonParse<T>(json: string | null | undefined, defaultValue: T): T {
  if (!json) return defaultValue
  try {
    return JSON.parse(json) as T
  } catch {
    return defaultValue
  }
}
