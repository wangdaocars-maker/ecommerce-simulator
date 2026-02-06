# 部署文档

## 服务器信息

- 服务器：腾讯云 Ubuntu
- 域名：ds.shishantech.com
- 项目路径：`/www/wwwroot/ecommerce-simulator`
- 数据库：SQLite（`/www/wwwroot/ecommerce-simulator/dev.db`）

## 部署步骤

### 1. 克隆代码

```bash
cd /www/wwwroot
git clone https://github.com/wangdaocars-maker/ecommerce-simulator.git
cd ecommerce-simulator
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```bash
cat > .env.local << 'EOF'
AUTH_SECRET=your-super-secret-key-at-least-32-characters-long
AUTH_TRUST_HOST=true
AUTH_URL=http://ds.shishantech.com
NEXTAUTH_URL=http://ds.shishantech.com
EOF
```

### 4. 初始化数据库

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 5. 构建项目

```bash
npm run build
```

### 6. 启动服务

```bash
npm start
```

## 遇到的问题及解决方案

### 问题 1：better-sqlite3 模块版本不匹配

**错误信息：**
```
The module '.../better_sqlite3.node' was compiled against a different Node.js version using
NODE_MODULE_VERSION 115. This version of Node.js requires NODE_MODULE_VERSION 137.
```

**原因：**
- 宝塔面板安装了多个 Node.js 版本（Node 20 和 Node 24）
- PM2 默认使用 Node 24 启动进程
- better-sqlite3 是用 Node 20 编译的
- 运行时 Node 版本不一致导致原生模块无法加载

**解决方案：**

1. 检查 PM2 使用的 Node 版本：
```bash
npx pm2 info ecommerce | grep -E "interpreter|node.js version"
```

2. 确保 PM2 使用正确的 Node 版本启动：
```bash
# 删除旧进程
npx pm2 delete ecommerce

# 用指定的 Node 启动
npx pm2 start npm --name ecommerce --interpreter $(which node) -- start
```

3. 如果版本切换后仍报错，重新编译 better-sqlite3：
```bash
npm rebuild better-sqlite3
```

### 问题 2：Module did not self-register

**错误信息：**
```
Module did not self-register: '.../better_sqlite3.node'
```

**原因：**
- better-sqlite3 编译后的二进制文件与当前 Node 版本不兼容

**解决方案：**
```bash
# 删除旧的编译文件
rm -rf node_modules/better-sqlite3

# 重新安装
npm install better-sqlite3

# 重新构建项目
npm run build
```

### 问题 3：NextAuth 认证错误

**错误类型：**
- `UntrustedHost`
- `MissingSecret`

**解决方案：**
在 `.env.local` 中添加：
```
AUTH_SECRET=your-super-secret-key-at-least-32-characters-long
AUTH_TRUST_HOST=true
AUTH_URL=http://ds.shishantech.com
```

### 问题 4：页面更新不生效（.next 构建产物混合）

**症状：**
- 代码已提交并推送到服务器
- `git pull` 成功，源码已更新
- `npm run build` 显示构建成功
- BUILD_ID 显示是最新时间戳
- 但访问网站时页面内容仍是旧版本

**根本原因：**
- `.next` 目录中存在**混合的新旧构建产物**
- 虽然 BUILD_ID 文件是新的，但实际的页面编译产物（HTML、JS chunks）可能是旧的
- 常见触发场景：
  1. **权限问题**：root 用户删除 `.next` 后，www 用户构建时无法创建某些文件
  2. **增量构建失败**：Next.js 增量构建遇到错误后，部分文件未更新
  3. **构建中断**：构建过程被中断，导致部分产物残留

**为什么常规方案无效：**

| 尝试方案 | 为什么没用 |
|---------|-----------|
| 清理 Nginx `proxy_cache` | 缓存只是表象，源头（Next.js 服务）提供的就是旧内容 |
| 重启 Next.js 进程 | 进程读取的 `.next` 目录本身就包含旧文件 |
| 多次 `npm run build` | 增量构建时，部分旧文件不会被覆盖 |
| 清理浏览器缓存 | 无法解决服务端问题 |

**正确的解决方案（5步）：**

```bash
# 1. 彻底停止所有 Next.js 进程
sudo pkill -9 -f next

# 2. 完全删除 .next 构建目录
sudo rm -rf .next

# 3. 全量重新构建（必须用 sudo 确保权限）
sudo npm run build

# 4. 修复生成文件的权限（确保运行用户可访问）
sudo chown -R www:www .next

# 5. 启动服务
npm start
# 或使用 PM2
npx pm2 restart ecommerce
```

**预防措施：**
1. **统一用户**：构建和运行使用同一用户（推荐 www），避免 root 和 www 混用
2. **自动化脚本**：更新代码时使用一键脚本：
   ```bash
   #!/bin/bash
   cd /www/wwwroot/ecommerce-simulator
   git pull
   sudo pkill -9 -f next
   sudo rm -rf .next
   sudo npm run build
   sudo chown -R www:www .next
   npm start
   ```
3. **监控构建日志**：确认构建完全成功，没有权限错误

**关键教训：**
- ✅ Next.js 页面更新不生效 → **直接删除 `.next` 重新构建**，不要尝试增量修复
- ✅ 排查顺序：先检查源头（Next.js 服务本身），再检查中间层（Nginx 缓存）
- ✅ 权限管理：构建和运行必须使用同一用户

## 核心经验

### Node.js 版本一致性

**这是最关键的问题！** 确保以下环节使用同一个 Node 版本：

1. `npm install` 时的 Node 版本
2. `npm run build` 时的 Node 版本
3. `npm start` 或 PM2 运行时的 Node 版本

检查当前 Node 版本：
```bash
node -v
which node
```

### 宝塔面板多 Node 版本问题

宝塔可能在 `/www/server/nodejs/` 下安装多个版本：
```
/www/server/nodejs/v20.20.0/
/www/server/nodejs/v24.13.0/
```

确保 PATH 中优先使用你想要的版本，或者显式指定完整路径。

## 日常维护命令

### 更新代码

**推荐方式（防止 .next 混合问题）：**
```bash
cd /www/wwwroot/ecommerce-simulator
git pull
sudo pkill -9 -f next          # 停止进程
sudo rm -rf .next              # 删除旧构建
sudo npm run build             # 全量重新构建
sudo chown -R www:www .next    # 修复权限
npm start                      # 启动服务
# 或使用 PM2
npx pm2 restart ecommerce
```

**快速方式（仅当确认无权限问题时）：**
```bash
cd /www/wwwroot/ecommerce-simulator
git pull
npm run build
npx pm2 restart ecommerce
```

### 启动/停止服务

**临时运行（调试用）：**
```bash
npm start
```

**后台运行：**
```bash
# 启动
npx pm2 start npm --name ecommerce --interpreter $(which node) -- start

# 停止
npx pm2 stop ecommerce

# 重启
npx pm2 restart ecommerce

# 查看日志
npx pm2 logs ecommerce --lines 50

# 查看状态
npx pm2 status
```

### 数据库操作

```bash
# 查看数据库（图形界面）
npx prisma studio

# 重置数据库
npx prisma db push --force-reset
npm run db:seed
```

## Nginx 配置

配置文件：`/www/server/panel/vhost/nginx/ds.shishantech.com.conf`

```nginx
server {
    listen 80;
    server_name ds.shishantech.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

修改后重载 Nginx：
```bash
nginx -t && nginx -s reload
```

## 测试账号

- 学生：`student1` / `123456`
- 教师：`teacher` / `teacher123`
- 管理员：`admin` / `admin123`
