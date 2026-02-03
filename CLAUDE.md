# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 1:1 复刻速卖通商品管理后台的本地培训模拟器，用于培训客户进行商品上货操作。系统实现了多用户数据隔离，每个用户只能看到和操作自己发布的商品。

## 开发命令

```bash
# 开发服务器（自动检测可用端口）
npm run dev

# 生产构建
npm run build
npm start

# 代码检查
npm run lint

# 数据库操作
npx prisma migrate dev        # 创建迁移并应用
npx prisma generate          # 生成 Prisma Client
npm run db:seed              # 初始化测试数据
npx prisma studio            # 打开数据库管理界面
```

## 核心架构

### 认证与会话管理

- 使用 **NextAuth.js v5** + Credentials Provider
- 密码使用 **bcrypt** 加密（salt rounds = 10）
- Session 采用 **JWT 模式**（无需数据库存储）
- `src/middleware.ts` 保护所有路由，未登录自动跳转 `/login`
- Session 包含：`user.id`, `user.name`, `user.role`

### 数据隔离机制

**关键原则**：所有商品查询必须自动过滤当前用户

```typescript
// ✅ 正确示例
const products = await prisma.product.findMany({
  where: {
    userId: session.user.id,  // 必须加这个条件
    status: 'published'
  }
})

// ❌ 错误示例 - 会泄露其他用户数据
const products = await prisma.product.findMany({
  where: { status: 'published' }
})
```

编辑/删除操作前必须验证所有权：
```typescript
const product = await prisma.product.findUnique({
  where: { id: productId }
})
if (product.userId !== session.user.id) {
  return new Response('Forbidden', { status: 403 })
}
```

### Prisma 7 特殊配置

本项目使用 Prisma 7（与 Prisma 5 有重大差异）：

1. **数据库连接配置在 `prisma.config.ts`**：
```typescript
import { PrismaClient } from './src/generated/prisma'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'

const db = new Database('./prisma/dev.db')
const adapter = new PrismaBetterSqlite3(db)
export const prisma = new PrismaClient({ adapter })
```

2. **Client 输出目录**：`src/generated/prisma`（不是 `node_modules/.prisma/client`）
3. **必须使用 Driver Adapter**：本项目使用 `@prisma/adapter-better-sqlite3`

### UI 复刻规范

**关键原则**：1:1 像素级还原速卖通后台

1. **颜色规范**：
   - 主蓝色：`#1677ff`
   - 背景灰：`#F9FAFB`（主内容区）、`#fafafa`（侧边栏）
   - 表头灰：`#F0F0F0`
   - 文字：`#262626`（主文字）、`#8c8c8c`（辅助文字）
   - 危险红：`#ff4d4f`

2. **组件库**：使用 **Ant Design 6** + TailwindCSS
   - Ant Design 提供交互组件（Table, Button, Dropdown 等）
   - TailwindCSS 用于布局和间距
   - `tailwind.config.ts` 中禁用 preflight 避免样式冲突

3. **布局结构**：
   - `MainLayout`：SessionProvider + Ant Design Layout
   - 固定顶部 Header（64px 高）
   - 左侧 Sidebar（200px 宽，固定）
   - 右侧 Content（灰色背景，无默认 padding）

### 商品表格架构（ProductTable.tsx）

**核心功能**：
- **16列数据**：商品、分组、价格、库存、优化建议、销量、曝光、转化率、支付金额、访客数、买家数、客单价、运费模板、编辑时间、操作
- **固定列**：商品列固定左侧，操作列固定右侧，中间列可横向滚动
- **折线图**：使用 SVG `<polyline>` 绘制（近三十日曝光、近30日访客数）
- **列显示控制**：通过 Popover 面板勾选控制列显示/隐藏（商品列和操作列固定不可隐藏）
- **复制ID功能**：点击复制按钮，成功后显示绿色对号2秒

**状态管理**：
```typescript
const [copiedId, setCopiedId] = useState<string | null>(null)  // 复制状态
const [columnConfig, setColumnConfig] = useState<ColumnConfig[]>(...)  // 列配置
const [columnSettingVisible, setColumnSettingVisible] = useState(false)  // 面板显示
```

**关键实现**：
- 使用 `fixed: 'left'` 和 `fixed: 'right'` 固定列
- 使用 `scroll={{ x: 1800 }}` 启用横向滚动
- 折线图通过计算坐标点生成 SVG path
- 列过滤通过 `columns.filter(col => visibleColumnKeys.has(col.key))` 实现

### 文件上传规范（待实现）

图片存储路径：`public/uploads/products/{userId}/{productId}/`
- 文件名：`timestamp_randomString.ext`
- 支持格式：jpg, png, webp
- 单张限制：5MB
- 数量限制：最多8张

## 测试账号

- **学生**：`student1` / `123456`
- **教师**：`teacher` / `teacher123`
- **管理员**：`admin` / `admin123`

## 设计原则

1. **截图驱动开发**：先拿到速卖通后台截图，详细分析布局、颜色、字体、间距后再实现
2. **像素级还原**：细节到颜色值、边框、圆角、阴影都要匹配
3. **用户数据隔离**：任何查询/修改操作都必须加 `userId` 过滤
4. **密码安全**：永不明文存储，使用 bcrypt 加密
5. **类型安全**：充分利用 TypeScript，避免 any 类型

## 常见陷阱

1. **忘记用户过滤**：商品查询必须加 `where: { userId: session.user.id }`
2. **Prisma 7 导入错误**：必须从 `@/generated/prisma` 导入，不是 `@prisma/client`
3. **布局嵌套问题**：MainLayout 已经包含 Layout 组件，页面内不要再嵌套
4. **Ant Design 样式冲突**：使用 `corePlugins: { preflight: false }` 禁用 Tailwind 重置
5. **固定列滚动问题**：必须同时设置 `fixed` 属性和 `scroll.x` 才能生效
