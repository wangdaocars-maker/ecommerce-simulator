# 速卖通商品管理系统 - 培训模拟器

## 项目简介

这是一个 1:1 复刻速卖通商品管理和发布功能的本地模拟器，用于培训客户进行商品上货操作。

## 技术栈

- **前端**: Next.js 15 (App Router) + TypeScript + Ant Design 6
- **后端**: Next.js API Routes + NextAuth.js
- **数据库**: SQLite + Prisma ORM
- **样式**: TailwindCSS
- **认证**: NextAuth.js v5 (Credentials Provider)

## 已完成功能

### ✅ 阶段 0：基础环境搭建

1. **项目初始化**
   - Next.js 15 + TypeScript 项目搭建
   - 依赖安装（Ant Design, Prisma, NextAuth, bcryptjs 等）
   - TailwindCSS 配置（禁用 preflight 避免与 Ant Design 冲突）

2. **数据库设置**
   - Prisma 7 配置（SQLite + Better-SQLite3 Adapter）
   - 数据模型定义：
     - `User` 表：用户信息（username, password, name, email, role）
     - `Product` 表：商品信息（title, price, stock, images, description 等）
     - `Category` 表：商品类目（支持多级分类）
   - 数据库迁移和初始化
   - Seed 脚本创建测试账号和示例商品

3. **用户认证系统**
   - NextAuth.js v5 配置（Credentials Provider）
   - 密码加密（bcrypt，salt rounds = 10）
   - JWT Session 管理
   - 中间件路由保护（未登录自动跳转登录页）
   - 登录页面（含表单验证、错误提示）
   - 注册页面（含表单验证、用户名重复检查）
   - 注册 API（POST /api/auth/register）

### ✅ 阶段 1：基础布局

1. **公共头部组件（Header）**
   - 1:1 复刻速卖通后台头部样式
   - 左侧：跨境卖家中心 Logo + 店铺信息下拉
   - 右侧：购物车图标、通知铃铛、用户头像下拉菜单
   - 用户下拉菜单：个人信息、账号设置、退出登录
   - 响应式布局，固定顶部，带阴影效果
   - 完整的交互反馈（hover 效果、点击事件）

2. **主布局组件（MainLayout）**
   - 集成 Header 和 Sidebar 组件
   - SessionProvider 包装，支持客户端 session 访问
   - 灰色背景主内容区域

3. **侧边栏组件（Sidebar）**
   - 1:1 复刻速卖通后台侧边栏样式
   - 12个主菜单项：首页、商品、交易、物流、店铺、营销、推广、B2B2C中心、资金、账号及认证、生意参谋、体检
   - 商品菜单可展开/收起，包含7个子菜单项
   - 子菜单：商品发布、商品管理、新品闪电推、商品招标、货盘运营、AI素材工具、商品质量分
   - 红点徽章显示（商品、推广、资金、AI素材工具）
   - 当前页面高亮显示（蓝色文字 + 浅蓝背景）
   - 其他菜单项显示为禁用状态（仅用于培训演示）

### ✅ 阶段 2：商品管理页面（部分完成）

1. **商品列表页面头部**
   - 页面标题"商品管理"
   - 当前层级进度条 + 发品上限统计（368/3000）
   - 批量上传下拉按钮（Excel/CSV导入、模板下载）
   - 发布商品主操作按钮

2. **功能工具栏**
   - 8个功能入口：常用入口、商品诊断、缺货预警、素材中心、尺码模板、商品分组、商品资质、商品知识库
   - 商品诊断带红色徽章（33）
   - 展开/收起按钮

3. **状态标签页**
   - 5个状态：正在销售(376)、草稿箱(0/500)、审核中(0)、审核不通过(83)、已下架(246)
   - 当前选中状态高亮显示

4. **异常提示信息**
   - 蓝色背景提示框
   - 显示异常商品数量（红色数字368）
   - 可关闭

5. **筛选条件区域**
   - 第一行：5个快速筛选标签（全部、售罄、预售、店铺批发商品、可报名新品闪电推）
   - 第二行：11个下拉筛选器（重要商品任务、商品分组、类目、定价、运费模板、责任人、品牌等）
   - 第三行：商品ID/标题/SKU搜索 + 查询/重置按钮

## 测试账号

- **学生账号**: `student1` / `123456`
- **教师账号**: `teacher` / `teacher123`
- **管理员账号**: `admin` / `admin123`

## 项目结构

```
电商模拟器/
├── prisma/
│   ├── schema.prisma          # 数据库模型定义
│   ├── seed.ts                # 数据初始化脚本
│   ├── dev.db                 # SQLite 数据库文件
│   └── migrations/            # 数据库迁移文件
├── public/
│   └── uploads/               # 商品图片存储（待实现）
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── [...nextauth]/route.ts  # NextAuth API
│   │   │       └── register/route.ts       # 注册 API
│   │   ├── login/page.tsx                  # 登录页面 ✅
│   │   ├── register/page.tsx               # 注册页面 ✅
│   │   ├── products/
│   │   │   ├── page.tsx                    # 商品列表页（服务端）
│   │   │   └── ProductsClient.tsx          # 商品列表页（客户端）
│   │   ├── layout.tsx                      # 全局布局
│   │   ├── page.tsx                        # 首页（重定向到商品列表）
│   │   └── globals.css                     # 全局样式
│   ├── components/
│   │   └── layout/
│   │       ├── Header.tsx                  # 公共头部组件 ✅
│   │       ├── Sidebar.tsx                 # 侧边栏组件 ✅
│   │       ├── MainLayout.tsx              # 主布局组件 ✅
│   │       └── index.ts                    # 组件导出
│   ├── lib/
│   │   ├── prisma.ts          # Prisma Client 单例
│   │   └── auth.ts            # NextAuth 配置
│   ├── middleware.ts          # 路由保护中间件 ✅
│   └── types/
│       └── next-auth.d.ts     # NextAuth 类型扩展
├── auth.config.ts             # NextAuth 认证配置 ✅
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## 本地运行

### 安装依赖
```bash
npm install
```

### 初始化数据库（如果还没有）
```bash
npx prisma migrate dev
npm run db:seed
```

### 启动开发服务器
```bash
npm run dev
```

访问: http://localhost:3000（如果 3000 被占用，会自动使用其他端口）

## 待实现功能（等待速卖通截图）

### 阶段 1：基础布局 ✅
- [x] 顶部导航栏（用户信息、退出登录）✅
- [x] 侧边菜单（商品菜单可展开，其他菜单仅展示）✅
- [ ] 面包屑导航（可选）
- [x] 主内容区域布局 ✅

### 阶段 2：商品列表页（部分完成）
- [x] 页面顶部（标题、层级信息、发布按钮）✅
- [x] 功能工具栏（8个功能入口）✅
- [x] 状态标签页（5个状态）✅
- [x] 提示信息区（异常商品提醒）✅
- [x] 筛选条件区（快速筛选 + 下拉筛选 + ID搜索）✅
- [ ] 商品列表表格（需要表格截图）
- [ ] 批量操作功能
- [ ] 分页组件

### 阶段 3：商品发布页（需要截图）
- [ ] 商品信息表单
- [ ] 图片上传组件（多图上传、主图设置、预览）
- [ ] 富文本编辑器（商品详情）
- [ ] 类目选择器
- [ ] 表单验证
- [ ] 提交 API

### 阶段 4：商品编辑页
- [ ] 复用发布页组件
- [ ] 数据回填
- [ ] 权限验证（只能编辑自己的商品）
- [ ] 更新 API

### 阶段 5：数据导出功能
- [ ] 导出当前用户的所有商品为 Excel
- [ ] 文件名格式：`商品数据_用户名_日期.xlsx`
- [ ] 包含字段：ID、标题、价格、库存、状态、创建时间

## 数据隔离说明

- 所有商品查询自动过滤 `where: { userId: session.user.id }`
- 每个用户只能看到和操作自己发布的商品
- 编辑/删除操作前会验证商品所有权
- 导出功能只导出当前用户的数据

## 下一步

**需要用户提供速卖通后台截图**，包括：
1. 整体布局（顶部导航 + 侧边栏）
2. 商品列表页
3. 商品发布页

收到截图后会详细分析并进行 1:1 复刻实现。

## 技术说明

### Prisma 7 适配
本项目使用 Prisma 7，相比 Prisma 5 的主要变化：
- 数据库 URL 配置移至 `prisma.config.ts` 和 `.env`
- 需要使用 Driver Adapter（本项目使用 `@prisma/adapter-better-sqlite3`）
- 生成的 Client 输出到 `src/generated/prisma`

### 密码安全
- 使用 bcrypt 加密（salt rounds = 10）
- 密码永不明文存储
- 登录验证使用 `bcrypt.compare()`

### 会话管理
- 使用 JWT Session（无需数据库存储 session）
- Session 包含用户 ID、姓名、角色信息
- 中间件自动验证和保护路由
