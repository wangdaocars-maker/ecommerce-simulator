# 运维操作指南

## 📊 系统概览

- **项目路径**: /www/wwwroot/ecommerce-simulator
- **运行端口**: 3000
- **Nginx 端口**: 80
- **域名**: http://ds.shishantech.com
- **数据库**: SQLite (dev.db)
- **进程管理**: PM2
- **运行用户**: www

---

## 🚀 日常运维

### 查看服务状态
```bash
sudo -u www pm2 list
sudo -u www pm2 info ecommerce-simulator
sudo -u www pm2 monit  # 实时监控
```

### 查看日志
```bash
# PM2 日志（实时）
sudo -u www pm2 logs

# PM2 日志（最近 100 行）
sudo -u www pm2 logs --lines 100

# 监控日志
tail -f /var/log/ecommerce-monitor.log

# 备份日志
tail -f /var/log/ecommerce-backup.log
```

### 重启服务
```bash
# 零停机重启（推荐）
sudo -u www pm2 reload ecommerce-simulator

# 完全重启
sudo -u www pm2 restart ecommerce-simulator

# 停止
sudo -u www pm2 stop ecommerce-simulator

# 启动
sudo -u www pm2 start ecommerce-simulator
```

---

## 🔄 代码更新流程

### 方式一：Git Pull（推荐）
```bash
cd /www/wwwroot/ecommerce-simulator
sudo -u www git pull
sudo -u www npm install
sudo -u www npm run build
sudo -u www pm2 reload ecommerce-simulator
```

### 方式二：手动上传
```bash
# 上传文件后
cd /www/wwwroot/ecommerce-simulator
sudo -u www npm install
sudo -u www npm run build
sudo -u www pm2 reload ecommerce-simulator
```

---

## 💾 数据库管理

### 备份策略
- **自动备份**: 每天凌晨 2:00
- **备份目录**: /backup/ecommerce-simulator/
- **保留时间**: 30 天
- **备份脚本**: /usr/local/bin/backup-ecommerce-db.sh

### 手动备份
```bash
# 立即备份
/usr/local/bin/backup-ecommerce-db.sh

# 查看备份文件
ls -lh /backup/ecommerce-simulator/
```

### 恢复数据库
```bash
# 停止服务
sudo -u www pm2 stop ecommerce-simulator

# 解压备份
gunzip /backup/ecommerce-simulator/dev_db_YYYYMMDD_HHMMSS.db.gz

# 恢复（注意备份当前数据）
cp /www/wwwroot/ecommerce-simulator/dev.db /tmp/dev.db.backup
cp /backup/ecommerce-simulator/dev_db_YYYYMMDD_HHMMSS.db /www/wwwroot/ecommerce-simulator/dev.db

# 启动服务
sudo -u www pm2 start ecommerce-simulator
```

---

## 📝 日志管理

### PM2 日志轮转（自动）
- **最大文件大小**: 10MB
- **保留文件数**: 7 个
- **压缩**: 启用
- **轮转时间**: 每天凌晨 0:00

### 手动清理日志
```bash
# 清空 PM2 日志
sudo -u www pm2 flush

# 清理旧备份
find /backup/ecommerce-simulator/ -name "*.db.gz" -mtime +30 -delete

# 查看日志大小
du -sh /home/www/.pm2/logs/
```

---

## 🔍 服务监控

### 自动监控
- **检查频率**: 每 5 分钟
- **监控项目**: PM2 状态、端口监听、内存使用、HTTP 响应
- **自动恢复**: 服务异常时自动重启
- **监控日志**: /var/log/ecommerce-monitor.log

### 手动检查
```bash
# 运行监控脚本
/usr/local/bin/monitor-ecommerce.sh

# 查看监控日志
tail -20 /var/log/ecommerce-monitor.log

# 检查端口
ss -tln | grep 3000

# 测试 HTTP
curl http://localhost:3000/api/auth/providers
curl http://ds.shishantech.com/api/auth/providers
```

---

## 🛠️ 故障排查

### 服务无响应
```bash
# 1. 查看进程状态
sudo -u www pm2 list

# 2. 查看错误日志
sudo -u www pm2 logs --err --lines 50

# 3. 重启服务
sudo -u www pm2 restart ecommerce-simulator

# 4. 如果还不行，完全重启
sudo -u www pm2 delete ecommerce-simulator
sudo -u www pm2 start ecosystem.config.js
sudo -u www pm2 save
```

### 内存泄漏
```bash
# 查看内存使用
sudo -u www pm2 monit

# 降低内存限制（编辑 ecosystem.config.js）
# max_memory_restart: "400M"

# 重新加载配置
sudo -u www pm2 delete ecommerce-simulator
sudo -u www pm2 start ecosystem.config.js
sudo -u www pm2 save
```

### 数据库锁定
```bash
# 查看是否有其他进程占用
lsof /www/wwwroot/ecommerce-simulator/dev.db

# 如有必要，停止服务后手动解锁
sudo -u www pm2 stop ecommerce-simulator
rm /www/wwwroot/ecommerce-simulator/dev.db-shm
rm /www/wwwroot/ecommerce-simulator/dev.db-wal
sudo -u www pm2 start ecommerce-simulator
```

### Nginx 问题
```bash
# 测试配置
nginx -t

# 重启 Nginx
systemctl restart nginx

# 查看 Nginx 错误日志
tail -50 /www/wwwlogs/ds.shishantech.com.error.log
```

---

## 🔐 安全维护

### SSH 密钥管理
- **服务器密钥**: /home/www/.ssh/ecommerce_simulator
- **公钥**: /home/www/.ssh/ecommerce_simulator.pub
- **GitHub Deploy Key**: 已添加（允许写入）

### 查看公钥
```bash
cat /home/www/.ssh/ecommerce_simulator.pub
```

### 测试 Git 连接
```bash
sudo -u www ssh -T git@github.com
```

---

## 📋 定时任务

```bash
# 查看当前定时任务
crontab -l

# 当前配置：
# - 数据库备份: 每天 2:00
# - 服务监控: 每 5 分钟
```

---

## 🆘 紧急联系

- **技术支持**: [联系信息]
- **GitHub 仓库**: https://github.com/wangdaocars-maker/ecommerce-simulator (私有)
- **服务器**: 拾山-美国-腾讯云 (170.106.172.146)
