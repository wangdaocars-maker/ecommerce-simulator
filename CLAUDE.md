# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

1:1 复刻速卖通商品管理后台的本地培训模拟器，用于培训客户进行商品上货操作。多用户数据隔离，每个用户只能操作自己的商品。

技术栈：Next.js 15 + React 19 + Ant Design 6 + TailwindCSS + Prisma 7 + SQLite + NextAuth.js v5

## 开发命令

```bash
npm run dev                   # 开发服务器
npm run build && npm start    # 生产构建
npm run lint                  # 代码检查

# 测试（vitest）
npm test                      # 运行所有测试
npm run test:watch            # 监视模式
npx vitest run src/lib/product-submit.test.ts  # 运行单个测试文件

# 数据库
npx prisma migrate dev        # 创建迁移并应用
npx prisma generate           # 生成 Prisma Client
npm run db:seed               # 初始化测试数据（tsx prisma/seed.ts）
npx prisma studio             # 打开数据库管理界面
```

## 核心架构

### 认证流程

- **NextAuth.js v5** + Credentials Provider，JWT 模式
- 认证配置：`auth.config.ts`（根目录），auth 实例：`src/lib/auth.ts`
- `src/middleware.ts` 保护所有路由，未登录跳转 `/login`
- 公开路径：`/login`, `/register`, `/shop-register`, `/api/auth`
- Session 包含：`user.id`（string）, `user.name`, `user.role`

### 数据隔离（核心安全约束）

**所有商品查询必须包含 `userId` 条件**，编辑/删除前必须验证所有权：

```typescript
// 查询：必须加 userId
const products = await prisma.product.findMany({
  where: { userId: session.user.id, deletedAt: null }
})

// 修改：先验证所有权
const product = await prisma.product.findUnique({ where: { id: productId } })
if (product.userId !== userId) return Response.json({...}, { status: 403 })
```

### API 约定

- 所有 API 统一返回格式：`{ success: boolean, data?: T, error?: string }`
- `src/lib/api-utils.ts` 提供 `withAuth(handler)` 包装函数，自动处理认证和错误
- `getCurrentUserId()` 返回 `number | null`（从 session 中 parseInt）
- `safeJsonParse<T>(json, defaultValue)` 解析数据库中的 JSON 字符串字段

### Prisma 7 配置（与 Prisma 5 差异大）

- **Client 输出目录**：`src/generated/prisma`，导入用 `@/generated/prisma`，不是 `@prisma/client`
- **Driver Adapter**：使用 `@prisma/adapter-better-sqlite3`，在 `src/lib/prisma.ts` 中初始化
- **迁移配置**：`prisma.config.ts`（根目录），使用 `defineConfig` 定义 schema 路径和 datasource
- **数据库文件**：`prisma/dev.db`（SQLite）
- Product 表大量使用 JSON 字符串字段（`images`, `countries`, `chartData` 等），读取时需 `safeJsonParse`
- 软删除：`deletedAt` 字段，查询时需加 `deletedAt: null`

### 布局结构

- `src/app/layout.tsx`：AntdRegistry + ConfigProvider（zhCN locale）
- `src/components/layout/MainLayout.tsx`：SessionProvider + Header(64px) + Sidebar(200px) + Content
- `src/components/layout/HeaderOnlyLayout.tsx`：仅 Header 的布局（用于发品等全宽页面）
- 页面内不要再嵌套 Layout 组件

### UI 规范（像素级还原速卖通后台）

- 主蓝色 `#1677ff`，背景灰 `#F9FAFB`，侧边栏 `#fafafa`，表头 `#F0F0F0`
- 文字 `#262626`（主）、`#8c8c8c`（辅助），危险红 `#ff4d4f`
- Ant Design 提供交互组件，TailwindCSS 用于布局间距
- `tailwind.config.ts` 中 `corePlugins: { preflight: false }` 禁用样式重置避免冲突

### 关键页面路径

| 路径 | 功能 | 布局 |
|------|------|------|
| `/products` | 商品列表（ProductTable） | MainLayout |
| `/products/create` | 选择类目 | HeaderOnlyLayout |
| `/products/create/detail` | 发品表单（ProductDetailClient） | HeaderOnlyLayout |
| `/products/edit/[id]` | 编辑商品 | HeaderOnlyLayout |
| `/login`, `/register`, `/shop-register` | 认证相关 | 无布局 |

### 媒体文件管理

- 上传 API：`POST /api/media/upload`，存储到 `uploads/products/{userId}/` 目录
- 文件访问：`src/app/uploads/[...path]/route.ts` 动态路由提供文件服务
- 媒体库 API：`/api/media`（列表）、`/api/media/folders`（文件夹）
- 图片/视频选择组件：`src/components/ImageUploadModal/`、`src/components/VideoUploadModal/`

## 测试账号

- 学生：`student1` / `123456`
- 教师：`teacher` / `teacher123`
- 管理员：`admin` / `admin123`

## 常见陷阱

1. **忘记用户过滤**：商品查询必须加 `where: { userId, deletedAt: null }`
2. **Prisma 导入错误**：必须从 `@/generated/prisma` 导入，不是 `@prisma/client`
3. **布局嵌套**：MainLayout 已包含 Layout，页面内不要再嵌套
4. **JSON 字段**：Product 表中 `images`、`countries`、`chartData` 等是 JSON 字符串，读取用 `safeJsonParse`，写入用 `JSON.stringify`
5. **userId 类型**：session 中是 string，数据库中是 int，API 层需要 `parseInt`
6. **next.config.ts**：`sharp` 和 `xlsx` 配置为 `serverExternalPackages`
